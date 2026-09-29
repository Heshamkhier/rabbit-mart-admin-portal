"use client";

const STATUSES = ["applied", "interview_scheduled", "attended", "hired", "rejected"];

export default function StatusSelect({ applicantId, current, action }) {
  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={applicantId} />
      <select
        className="input"
        style={{ padding: "4px 8px", fontSize: 12 }}
        name="status"
        defaultValue={current || "applied"}
        onChange={(e) => e.currentTarget.form.requestSubmit()}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace("_", " ")}
          </option>
        ))}
      </select>
    </form>
  );
}
