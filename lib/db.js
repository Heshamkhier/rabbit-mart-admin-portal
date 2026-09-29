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
// writes db.json underneath as a local cache/fallback, so nothing
// breaks if the Sheets API has a bad moment.
//
// Not configured (default): behaves exactly like the standalone build —
// pure local JSON, nothing changes for you.
//
// Where that local db.json actually lives: on a serverless host (Vercel and
// friends) everything under the deployed project — including process.cwd()
// — is a read-only bundle; only /tmp is writable. Writing db.json next to
// the source (as a bare local-dev build does) throws EROFS there the first
// time anything logs in or edits data — every server action that calls
// db.write() fails outright. So the writable copy goes to /tmp on a
// serverless host and next to the source for local dev, while the
// read-only seed JSON (jobs.json, branches.json, ...) always reads from the
// checked-in data/ dir either way. /tmp is wiped on cold start, so on
// serverless this is still just a demo-grade fallback — sessions/local
// edits can reset when a new instance spins up — but it works instead of
// crashing, and real jobs/branches/faq/applicants data is never at risk
// once Sheets is configured, since those 4 collections load from the Sheet
// on every request regardless of what's in the local cache.
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const seedDir = path.join(process.cwd(), "data");
const dbDir = isServerless ? path.join("/tmp", "rabbit-mart-admin-portal-data") : seedDir;
if (isServerless) fs.mkdirSync(dbDir, { recursive: true });
const dbPath = path.join(dbDir, "db.json");

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
