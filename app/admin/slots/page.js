import { getDb } from "@/lib/db";
import { updateSlotTemplate } from "@/app/actions";

const DAYS = [
  { v: "sat", l: "Saturday" },
  { v: "sun", l: "Sunday" },
  { v: "mon", l: "Monday" },
  { v: "tue", l: "Tuesday" },
  { v: "wed", l: "Wednesday" },
  { v: "thu", l: "Thursday" },
  { v: "fri", l: "Friday" },
];

export default async function SlotsPage() {
  const db = await getDb();
  const t = db.data.interviewSlots.defaultTemplate;

  return (
    <div>
      <h1 className="text-2xl font-black mb-1">Interview Slots</h1>
      <p className="text-sm text-slate-500 mb-6">
        Default interview window applied across active branches. Feeds both the applicant form and the AI agent.
      </p>

      <form action={updateSlotTemplate} className="card space-y-4 max-w-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Start time</label>
            <input className="input" type="time" name="startTime" defaultValue={t.startTime} />
          </div>
          <div>
            <label className="label">End time</label>
            <input className="input" type="time" name="endTime" defaultValue={t.endTime} />
          </div>
        </div>
        <div>
          <label className="label">Closed day</label>
          <select className="input" name="dayClosed" defaultValue={t.dayClosed}>
            {DAYS.map((d) => (
              <option key={d.v} value={d.v}>
                {d.l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Capacity per slot</label>
          <input className="input" type="number" min="1" name="capacityPerSlot" defaultValue={t.capacityPerSlot} />
        </div>
        <button className="btn btn-primary">Save template</button>
      </form>
    </div>
  );
}
