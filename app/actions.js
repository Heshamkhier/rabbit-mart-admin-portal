"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, logChange } from "@/lib/db";
import { login, logout, getCurrentUser } from "@/lib/auth";

export async function loginAction(prevState, formData) {
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString();
  const result = await login(username, password);
  if (!result.ok) return { error: result.error };
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// ---------- Branches ----------
export async function toggleBranchActive(branchId) {
  const user = await requireUser();
  const db = await getDb();
  const b = db.data.branches.find((x) => x.id === branchId);
  if (!b) return;
  b.active = !b.active;
  await db.write();
  await logChange(user.username, "branch", "toggle_active", `${b.name} → ${b.active ? "active" : "inactive"}`);
  revalidatePath("/admin/branches");
  revalidatePath("/admin");
}

export async function updateBranch(formData) {
  const user = await requireUser();
  const db = await getDb();
  const id = formData.get("id");
  const b = db.data.branches.find((x) => x.id === id);
  if (!b) return;
  b.name = formData.get("name");
  b.area = formData.get("area");
  b.manager = formData.get("manager");
  b.phone = formData.get("phone");
  b.allowance = Number(formData.get("allowance") || 0);
  b.totalSalary = Number(formData.get("totalSalary") || 0);
  b.address = formData.get("address");
  b.mapLink = formData.get("mapLink");
  await db.write();
  await logChange(user.username, "branch", "update", b.name);
  revalidatePath("/admin/branches");
}

// ---------- Jobs ----------

function slugify(title, fallback) {
  const base = String(title || fallback)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9؀-ۿ]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || fallback;
}

function linesToList(v) {
  return (v || "").split("\n").map((s) => s.trim()).filter(Boolean);
}

// Shared by createJob/updateJob — reads every field the job form can submit,
// including the per-job eligibility toggles (ageMin/ageMax/requireGraduate/
// requireMilitaryStatus) and branchIds/location that let a posting be
// anything from a branch-based role like Picker to an HQ role with no
// branches at all. Blank optional fields intentionally become null/[] rather
// than empty strings so JobClient on the candidate side can cleanly skip
// whichever questions don't apply.
function readJobFields(formData) {
  const ageMinRaw = formData.get("ageMin");
  const ageMaxRaw = formData.get("ageMax");
  return {
    title: formData.get("title"),
    titleEn: formData.get("titleEn") || "",
    status: formData.get("status"),
    employmentType: formData.get("employmentType") || "دوام كامل",
    salaryDisplay: formData.get("salaryDisplay"),
    salaryBase: Number(formData.get("salaryBase") || 0),
    salaryBonus: Number(formData.get("salaryBonus") || 0),
    salaryAllowanceMax: Number(formData.get("salaryAllowanceMax") || 0),
    description: formData.get("description"),
    responsibilities: linesToList(formData.get("responsibilities")),
    requirements: linesToList(formData.get("requirements")),
    benefits: linesToList(formData.get("benefits")),
    documentsAfterHire: linesToList(formData.get("documentsAfterHire")),
    interviewWindow: {
      days: formData.get("interviewDays") || "كل يوم ما عدا الجمعة",
      start: formData.get("interviewStart") || "11:00",
      end: formData.get("interviewEnd") || "17:00",
    },
    branchIds: formData.getAll("branchIds"),
    location: formData.get("location") || "",
    ageMin: ageMinRaw ? Number(ageMinRaw) : null,
    ageMax: ageMaxRaw ? Number(ageMaxRaw) : null,
    requireGraduate: formData.get("requireGraduate") === "on",
    requireMilitaryStatus: formData.get("requireMilitaryStatus") === "on",
  };
}

export async function createJob(formData) {
  const user = await requireUser();
  const db = await getDb();
  const fields = readJobFields(formData);
  const id = `job_${Date.now()}`;
  const slug = slugify(fields.titleEn || fields.title, id);
  const job = { id, slug, ...fields };
  db.data.jobs.push(job);
  await db.write();
  await logChange(user.username, "job", "create", job.title);
  revalidatePath("/admin/jobs");
  redirect(`/admin/jobs/${id}`);
}

export async function updateJob(formData) {
  const user = await requireUser();
  const db = await getDb();
  const id = formData.get("id");
  const j = db.data.jobs.find((x) => x.id === id);
  if (!j) return;
  Object.assign(j, readJobFields(formData));
  await db.write();
  await logChange(user.username, "job", "update", j.title);
  revalidatePath("/admin/jobs");
  revalidatePath(`/admin/jobs/${id}`);
}

export async function deleteJob(formData) {
  const user = await requireUser();
  const db = await getDb();
  const id = formData.get("id");
  const j = db.data.jobs.find((x) => x.id === id);
  db.data.jobs = db.data.jobs.filter((x) => x.id !== id);
  await db.write();
  await logChange(user.username, "job", "delete", j?.title || id);
  revalidatePath("/admin/jobs");
}

// ---------- Interview slot template ----------
export async function updateSlotTemplate(formData) {
  const user = await requireUser();
  const db = await getDb();
  db.data.interviewSlots.defaultTemplate = {
    ...db.data.interviewSlots.defaultTemplate,
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    dayClosed: formData.get("dayClosed"),
    capacityPerSlot: Number(formData.get("capacityPerSlot") || 1),
  };
  await db.write();
  await logChange(user.username, "interview_slots", "update", "default template");
  revalidatePath("/admin/slots");
}

// ---------- Applicants ----------
export async function updateApplicantStatus(formData) {
  const user = await requireUser();
  const db = await getDb();
  const id = formData.get("id");
  const status = formData.get("status");
  const a = db.data.applicants.find((x) => x.id === id);
  if (!a) return;
  a.status = status;
  await db.write();
  await logChange(user.username, "applicant", "status_change", `${a.name} → ${status}`);
  revalidatePath("/admin/applicants");
}

// ---------- Site content ----------
export async function updateSiteContent(formData) {
  const user = await requireUser();
  const db = await getDb();
  db.data.siteContent.brand.marqueeText = formData.get("marqueeText");
  db.data.siteContent.copy.applyButton = formData.get("applyButton");
  db.data.siteContent.copy.confirmClose = formData.get("confirmClose");
  db.data.siteContent.whatsapp.customProfileMessage = formData.get("customProfileMessage");
  await db.write();
  await logChange(user.username, "site_content", "update", "content editor");
  revalidatePath("/admin/content");
}
