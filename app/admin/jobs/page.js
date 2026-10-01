import Link from "next/link";
import { getDb } from "@/lib/db";
import { deleteJob, toggleJobStatus, toggleJobRequireGraduate } from "@/app/actions";
import { idToPath } from "@/lib/ids";
import { jobLink } from "@/lib/links";
import ActionForm from "@/app/admin/ui/ActionForm";

export default async function JobsPage() {
  const db = await getDb();
  const jobs = db.data.jobs;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-black">Jobs</h1>
        <Link href="/admin/jobs/new" className="btn btn-primary">
          + New job
        </Link>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Create, edit, and publish job postings — any role, not just محضّر طلبات (Picker). Each job
        can have its own eligibility rules and either an attached branch list or a plain location.
        Click the status badge to switch a job live or back to draft — a draft job&apos;s link shows
        &ldquo;not available&rdquo; on the applicant portal instantly.
      </p>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Salary</th>
              <th>Where</th>
              <th>Status</th>
              <th>Eligibility</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <td className="font-semibold">
                  {j.title}
                  {j.titleEn && <div className="text-xs text-slate-400">{j.titleEn}</div>}
                </td>
                <td>{j.salaryDisplay}</td>
                <td>{j.branchIds?.length ? `${j.branchIds.length} branch(es)` : j.location || "—"}</td>
                <td>
                  <ActionForm action={toggleJobStatus.bind(null, j.id)} pendingText="Updating…">
                    <button
                      type="submit"
                      className={`badge ${j.status === "live" ? "badge-on" : "badge-off"}`}
                      style={{ cursor: "pointer", border: "none" }}
                      title="Click to toggle live / draft"
                    >
                      <span className="rm-spinner rm-btn-spinner" />
                      <span className="rm-btn-label">{j.status === "live" ? "● live" : "○ draft"}</span>
                    </button>
                  </ActionForm>
                </td>
                <td>
                  <ActionForm action={toggleJobRequireGraduate.bind(null, j.id)} pendingText="Updating…">
                    <button
                      type="submit"
                      className={`badge ${j.requireGraduate ? "badge-off" : "badge-on"}`}
                      style={{ cursor: "pointer", border: "none" }}
                      title="Click to toggle whether students (not yet graduated) can apply"
                    >
                      <span className="rm-spinner rm-btn-spinner" />
                      <span className="rm-btn-label">{j.requireGraduate ? "🎓 graduates only" : "● students ok"}</span>
                    </button>
                  </ActionForm>
                </td>
                <td className="flex gap-3 items-center">
                  <Link href={`/admin/jobs/${idToPath(j.id)}`} className="text-sm font-bold" style={{ color: "#0B3D2E" }}>
                    Edit →
                  </Link>
                  {j.slug && (
                    <a
                      href={jobLink(j)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold"
                      style={{ color: "var(--rm-orange, #ff512f)" }}
                    >
                      View post ↗
                    </a>
                  )}
                  <ActionForm action={deleteJob} pendingText="Deleting…" confirm={`Delete "${j.title}"? This can't be undone.`}>
                    <input type="hidden" name="id" value={j.id} />
                    <button className="text-xs text-red-600 font-semibold" style={{ display: "inline-flex", alignItems: "center" }}>
                      <span className="rm-spinner rm-btn-spinner" />
                      <span className="rm-btn-label">Delete</span>
                    </button>
                  </ActionForm>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={6} className="text-sm text-slate-400 py-6 text-center">
                  No jobs yet — click “+ New job” to post one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
