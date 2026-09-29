import { getDb } from "@/lib/db";

const KPI_ICONS = {
  jobs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  branches: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 21s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  applicants: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c1-3.8 3.6-6 6.5-6s5.5 2.2 6.5 6" />
    </svg>
  ),
  faq: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.9.4-1.4 1-1.4 1.9" />
      <path d="M12 17h.01" />
    </svg>
  ),
};

export default async function Dashboard() {
  const db = await getDb();
  const { jobs, branches, applicants, faq, changeLog } = db.data;

  const activeBranches = branches.filter((b) => b.active).length;
  const liveJobs = jobs.filter((j) => j.status === "live").length;

  const stats = [
    { label: "Live jobs", value: liveJobs, icon: "jobs" },
    { label: "Active branches", value: `${activeBranches} / ${branches.length}`, icon: "branches" },
    { label: "Applicants (all time)", value: applicants.length, icon: "applicants" },
    { label: "FAQ entries", value: faq.length, icon: "faq" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black mb-1" style={{ color: "var(--rm-green)" }}>
        Dashboard
      </h1>
      <p className="text-sm text-slate-500 mb-6">Good morning — here&apos;s what&apos;s happening across the hiring pipeline.</p>

      <div className="kpi-grid">
        {stats.map((s) => (
          <div className="kpi-card" key={s.label}>
            <div className="kpi-icon">{KPI_ICONS[s.icon]}</div>
            <div className="kpi-value">{s.value}</div>
            <div className="kpi-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ position: "relative", overflow: "hidden" }}>
        <h2 className="font-bold mb-3 text-sm" style={{ color: "var(--rm-green)" }}>
          Recent changes
        </h2>
        {changeLog.length === 0 && <p className="text-sm text-slate-400">No changes logged yet — try toggling a branch.</p>}
        <ul className="text-sm space-y-2">
          {changeLog.slice(0, 10).map((c) => (
            <li key={c.id} className="flex justify-between border-b border-slate-100 pb-2 last:border-0">
              <span>
                <b>{c.actor}</b> {c.action.replace("_", " ")} <span className="text-slate-500">{c.entity}</span> — {c.detail}
              </span>
              <span className="text-slate-400 text-xs">{new Date(c.at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <img
          src="/brand/mascot-hero.png"
          alt=""
          style={{
            position: "absolute",
            right: -8,
            bottom: -18,
            width: 96,
            opacity: 0.08,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
