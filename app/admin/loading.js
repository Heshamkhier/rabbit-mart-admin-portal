// Shown instantly while an admin page loads its data from the Google Sheet,
// so a click never looks like nothing happened.
export default function Loading() {
  return (
    <div className="flex items-center gap-3 text-slate-500" style={{ padding: "40px 0" }}>
      <span className="rm-spinner" style={{ width: 20, height: 20, color: "#0B3D2E" }} />
      <span className="text-sm font-semibold">Loading…</span>
    </div>
  );
}
