import { getDb } from "@/lib/db";
import { updateApplicantStatus } from "@/app/actions";
import StatusSelect from "./StatusSelect";

export default async function ApplicantsPage() {
  const db = await getDb();
  const applicants = [...db.data.applicants].reverse();

  return (
    <div>
      <h1 className="text-2xl font-black mb-1">Applicants</h1>
      <p className="text-sm text-slate-500 mb-6">
        Synced live from Build 1&apos;s applications (this build&apos;s local file — becomes the real Applicants sheet
        tab after Connect).
      </p>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone / WhatsApp</th>
              <th>Branch</th>
              <th>Interview</th>
              <th>Source</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applicants.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-slate-400 py-6">
                  No applicants yet — submit a test application on the Applicant Portal to see it appear here.
                </td>
              </tr>
            )}
            {applicants.map((a) => (
              <tr key={a.id}>
                <td className="font-semibold">
                  <span className="name-cell">
                    <span className="avatar-circle">{(a.name || "?").trim().charAt(0).toUpperCase()}</span>
                    {a.name}
                  </span>
                </td>
                <td>
                  {a.phone}
                  {a.whatsapp && a.whatsapp !== a.phone && <div className="text-xs text-slate-400">WA: {a.whatsapp}</div>}
                </td>
                <td>{a.branchName || a.branchId}</td>
                <td>
                  {a.day} — {a.time}
                </td>
                <td>{a.source || "form"}</td>
                <td>
                  <StatusSelect applicantId={a.id} current={a.status} action={updateApplicantStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
