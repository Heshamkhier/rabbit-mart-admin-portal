// Shared by /admin/jobs/new and /admin/jobs/[id] — every field a job posting
// can have, including the eligibility toggles and branch/location choice that
// let this cover any role, not just محضّر طلبات (Picker). action is the
// server action to submit to (createJob or updateJob).
export default function JobForm({ job, allBranches, action, submitLabel }) {
  const j = job || {
    title: "",
    titleEn: "",
    status: "draft",
    employmentType: "دوام كامل",
    salaryDisplay: "",
    salaryBase: 0,
    salaryBonus: 0,
    salaryAllowanceMax: 0,
    description: "",
    responsibilities: [],
    requirements: [],
    benefits: [],
    documentsAfterHire: [],
    interviewWindow: { days: "كل يوم ما عدا الجمعة", start: "11:00", end: "17:00" },
    branchIds: [],
    location: "",
    ageMin: null,
    ageMax: null,
    requireGraduate: false,
    requireMilitaryStatus: false,
  };

  return (
    <form action={action} className="card space-y-4 max-w-2xl">
      {job && <input type="hidden" name="id" value={job.id} />}

      {!job && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Job id (unique, e.g. job_picker_2026)</label>
            <input className="input" name="id" required />
          </div>
          <div>
            <label className="label">Link slug (used in the candidate portal URL)</label>
            <input className="input" name="slug" placeholder="e.g. picker-rabbit-mart" />
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Title (Arabic — shown to candidates)</label>
          <input className="input" name="title" defaultValue={j.title} dir="rtl" required />
        </div>
        <div>
          <label className="label">Title (English — internal reference / slug)</label>
          <input className="input" name="titleEn" defaultValue={j.titleEn} placeholder="e.g. Warehouse Coordinator" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Status</label>
          <select className="input" name="status" defaultValue={j.status}>
            <option value="live">Live</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div>
          <label className="label">Employment type</label>
          <input className="input" name="employmentType" defaultValue={j.employmentType} dir="rtl" />
        </div>
      </div>

      <div>
        <label className="label">Salary display (shown as-is to candidates)</label>
        <input className="input" name="salaryDisplay" defaultValue={j.salaryDisplay} dir="rtl" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="label">Base salary (EGP)</label>
          <input className="input" type="number" name="salaryBase" defaultValue={j.salaryBase} />
        </div>
        <div>
          <label className="label">Bonus (EGP)</label>
          <input className="input" type="number" name="salaryBonus" defaultValue={j.salaryBonus} />
        </div>
        <div>
          <label className="label">Max allowance (EGP)</label>
          <input className="input" type="number" name="salaryAllowanceMax" defaultValue={j.salaryAllowanceMax} />
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input" rows={3} name="description" defaultValue={j.description} dir="rtl" />
      </div>

      <div>
        <label className="label">Responsibilities (one per line)</label>
        <textarea className="input" rows={4} name="responsibilities" defaultValue={j.responsibilities.join("\n")} dir="rtl" />
      </div>

      <div>
        <label className="label">Requirements (one per line — shown to candidates as text)</label>
        <textarea className="input" rows={4} name="requirements" defaultValue={j.requirements.join("\n")} dir="rtl" />
      </div>

      <div>
        <label className="label">Benefits (one per line)</label>
        <textarea className="input" rows={4} name="benefits" defaultValue={j.benefits.join("\n")} dir="rtl" />
      </div>

      <div>
        <label className="label">Documents required after hire (one per line)</label>
        <textarea className="input" rows={3} name="documentsAfterHire" defaultValue={j.documentsAfterHire.join("\n")} dir="rtl" />
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h3 className="font-bold text-sm mb-1">Eligibility gates (enforced on the application form)</h3>
        <p className="text-xs text-slate-500 mb-3">
          Leave age blank for no age gate. Leave the checkboxes off and the portal won&apos;t ask that question
          at all — this is what lets a non-Picker job skip the graduate/military questions entirely.
        </p>
        <div className="grid gap-4 md:grid-cols-2 mb-3">
          <div>
            <label className="label">Minimum age (blank = none)</label>
            <input className="input" type="number" name="ageMin" defaultValue={j.ageMin ?? ""} />
          </div>
          <div>
            <label className="label">Maximum age (blank = none)</label>
            <input className="input" type="number" name="ageMax" defaultValue={j.ageMax ?? ""} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm mb-2">
          <input type="checkbox" name="requireGraduate" defaultChecked={j.requireGraduate} />
          Require graduate / education status
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="requireMilitaryStatus" defaultChecked={j.requireMilitaryStatus} />
          Require military service status
        </label>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h3 className="font-bold text-sm mb-1">Interview scheduling</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="label">Days</label>
            <input className="input" name="interviewDays" defaultValue={j.interviewWindow?.days} dir="rtl" />
          </div>
          <div>
            <label className="label">Start</label>
            <input className="input" name="interviewStart" defaultValue={j.interviewWindow?.start} />
          </div>
          <div>
            <label className="label">End</label>
            <input className="input" name="interviewEnd" defaultValue={j.interviewWindow?.end} />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h3 className="font-bold text-sm mb-1">Where this job is offered</h3>
        <p className="text-xs text-slate-500 mb-3">
          Tick one or more branches for a branch-based role (candidates pick a branch, get a
          branch-specific confirmation). Leave every branch unticked and set a plain location instead
          for a role that isn&apos;t tied to a store branch — e.g. an HQ/office position.
        </p>
        <div>
          <label className="label">Location (used only when no branches are ticked below)</label>
          <input className="input" name="location" defaultValue={j.location} dir="rtl" placeholder="e.g. المركز الرئيسي — القاهرة الجديدة" />
        </div>
        <div className="grid gap-2 md:grid-cols-2 mt-3">
          {allBranches.map((b) => (
            <label key={b.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="branchIds" value={b.id} defaultChecked={j.branchIds?.includes(b.id)} />
              {b.name} <span className="text-slate-400">({b.area})</span>
            </label>
          ))}
        </div>
      </div>

      <button className="btn btn-primary">{submitLabel}</button>
    </form>
  );
}
