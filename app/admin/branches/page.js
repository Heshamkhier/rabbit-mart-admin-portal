import { getDb } from "@/lib/db";
import { toggleBranchActive, toggleBranchFemaleHiring } from "@/app/actions";
import ActionForm from "@/app/admin/ui/ActionForm";

export default async function BranchesPage() {
  const db = await getDb();
  const branches = db.data.branches;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-black">Branches</h1>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        The Active switch controls whether a branch is offered to applicants for interviews — on the application form,
        the AI agent&apos;s suggestions, and the interview calendar. Flip it off and it disappears everywhere instantly.
        Female hiring is a click-to-toggle note shown to candidates on the branch card — flip it off for a branch
        that isn&apos;t taking female applicants right now.
      </p>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Branch</th>
              <th>Area</th>
              <th>Manager</th>
              <th>Total salary</th>
              <th>Active for interviews?</th>
              <th>Female hiring</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr key={b.id}>
                <td className="font-semibold">
                  {b.name}
                  {b.flag && <div className="text-[11px] text-amber-700 mt-1">⚠️ {b.flag}</div>}
                </td>
                <td>{b.area}</td>
                <td>
                  {b.manager}
                  <div className="text-xs text-slate-400">{b.phone}</div>
                </td>
                <td>{b.totalSalary.toLocaleString()} EGP</td>
                <td>
                  <ActionForm action={toggleBranchActive.bind(null, b.id)} pendingText="Updating…">
                    <button
                      type="submit"
                      className={`badge ${b.active ? "badge-on" : "badge-off"}`}
                      style={{ cursor: "pointer", border: "none" }}
                    >
                      <span className="rm-spinner rm-btn-spinner" />
                      <span className="rm-btn-label">{b.active ? "● Active" : "○ Inactive"}</span>
                    </button>
                  </ActionForm>
                </td>
                <td>
                  <ActionForm action={toggleBranchFemaleHiring.bind(null, b.id)} pendingText="Updating…">
                    <button
                      type="submit"
                      className={`badge ${b.femaleHiring ? "badge-on" : "badge-off"}`}
                      style={{ cursor: "pointer", border: "none" }}
                      title="Click to toggle whether this branch is hiring female applicants"
                    >
                      <span className="rm-spinner rm-btn-spinner" />
                      <span className="rm-btn-label">{b.femaleHiring ? "● hiring women" : "○ not hiring women"}</span>
                    </button>
                  </ActionForm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
