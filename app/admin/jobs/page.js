import Link from "next/link";
import { getDb } from "@/lib/db";
import { deleteJob } from "@/app/actions";

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
      </p>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Salary</th>
              <th>Where</th>
              <th>Status</th>
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
                  <span className={`badge ${j.status === "live" ? "badge-on" : "badge-off"}`}>{j.status}</span>
                </td>
                <td className="flex gap-3 items-center">
                  <Link href={`/admin/jobs/${j.id}`} className="text-sm font-bold" style={{ color: "#0B3D2E" }}>
                    Edit →
                  </Link>
                  <form action={deleteJob}>
                    <input type="hidden" name="id" value={j.id} />
                    <button className="text-xs text-red-600 font-semibold">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="text-sm text-slate-400 py-6 text-center">
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
