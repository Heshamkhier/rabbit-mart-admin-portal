import path from "path";
import fs from "fs";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import bcrypt from "bcryptjs";
import { sheetsConfigured, readTab, overwriteTab } from "./sheets.js";
import { jobFromRow, jobToRow, branchFromRow, branchToRow, faqFromRow, faqToRow, applicationToRow } from "./sheets-mappers.js";

// Data layer — Connect phase. jobs/branches/faq/applicants are the 4
// collections that live in the real Sheet; interviewSlots/siteContent/
// users/sessions/changeLog stay local (portal config + admin auth, not
// hiring data — never were part of the Sheet schema).
//
// When GOOGLE_SERVICE_ACCOUNT_EMAIL/KEY are set: every getDb() call
// refreshes those 4 collections from the Sheet (throttled — see
// HYDRATE_INTERVAL_MS), and every db.write() pushes them back. lowdb still
// writes data/db.json underneath as a local cache/fallback, so nothing
// breaks if the Sheets API has a bad moment.
//
// Not configured (default): behaves exactly like the standalone build —
// pure local JSON, nothing changes for you.

const dbPath = path.join(process.cwd(), "data", "db.json");
const seedDir = path.join(process.cwd(), "data");

function loadSeedJson(name, fallback) {
  const p = path.join(seedDir, name);
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

const defaultData = {
  jobs: loadSeedJson("jobs.json", []),
  branches: loadSeedJson("branches.json", []),
  interviewSlots: loadSeedJson("interview_slots.json", {}),
  faq: loadSeedJson("faq.json", []),
  siteContent: loadSeedJson("site_content.json", {}),
  applicants: [],
  users: [
    {
      id: "u1",
      username: "admin",
      // default password: RabbitAdmin!2026 — change this after first login (see Admin → Settings note)
      passwordHash: bcrypt.hashSync("RabbitAdmin!2026", 8),
      role: "owner",
    },
  ],
  sessions: [],
  changeLog: [],
};

let dbInstance = null;
let lastHydrateAt = 0;
const HYDRATE_INTERVAL_MS = 15_000; // don't hit Sheets more than every 15s

async function hydrateFromSheets(db) {
  const now = Date.now();
  if (now - lastHydrateAt < HYDRATE_INTERVAL_MS) return;
  const [jobsTab, branchesTab, faqTab, applicantsTab] = await Promise.all([
    readTab("Jobs"),
    readTab("Branches"),
    readTab("FAQ_KnowledgeBase"),
    readTab("Applicants"),
  ]);
  db.data.jobs = jobsTab.rows.map(jobFromRow);
  db.data.branches = branchesTab.rows.map(branchFromRow);
  db.data.faq = faqTab.rows.map(faqFromRow);
  db.data.applicants = applicantsTab.rows;
  lastHydrateAt = now;
}

async function syncToSheets(data) {
  await Promise.all([
    overwriteTab("Jobs", data.jobs.map(jobToRow)),
    overwriteTab("Branches", data.branches.map(branchToRow)),
    overwriteTab("FAQ_KnowledgeBase", data.faq.map(faqToRow)),
    overwriteTab("Applicants", data.applicants.map(applicationToRow)),
  ]);
  lastHydrateAt = Date.now(); // what we just wrote is already current
}

function wrapWrite(db) {
  const originalWrite = db.write.bind(db);
  db.write = async () => {
    await originalWrite();
    if (sheetsConfigured()) {
      await syncToSheets(db.data);
    }
  };
}

export async function getDb() {
  if (!dbInstance) {
    const adapter = new JSONFile(dbPath);
    const db = new Low(adapter, defaultData);
    await db.read();
    if (!db.data) {
      db.data = defaultData;
      await db.write();
    }
    dbInstance = db;
    wrapWrite(dbInstance);
  } else {
    await dbInstance.read();
  }

  if (sheetsConfigured()) {
    await hydrateFromSheets(dbInstance);
  }

  return dbInstance;
}

export async function logChange(actor, entity, action, detail) {
  const db = await getDb();
  db.data.changeLog.unshift({
    id: `log_${Date.now()}`,
    actor,
    entity,
    action,
    detail,
    at: new Date().toISOString(),
  });
  db.data.changeLog = db.data.changeLog.slice(0, 200);
  await db.write();
}
