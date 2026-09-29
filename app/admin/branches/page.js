import { getDb } from "@/lib/db";
import { toggleBranchActive } from "@/app/actions";

export default async function BranchesPage() {
  const db = await getDb();
  const branches = db.data.branches;

  return (
    <div>
      <h1 className="text-2xl font-black mb-1">Branches</h1>
      <p className="text-sm text-slate-500 mb-6">
        The Active switch controls whether a branch is offered to applicants for interviews — on the application form,
        the AI agent&apos;s suggestions, and the interview calendar. Flip it off and it disappears everywhere instantly.
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
                  <form action={toggleBranchActive.bind(null, b.id)}>
                    <button
                      type="submit"
                      className={`badge ${b.active ? "badge-on" : "badge-off"}`}
                      style={{ cursor: "pointer", border: "none" }}
                    >
                      {b.active ? "● Active" : "○ Inactive"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
