import { getDb } from "@/lib/db";
import { createJob } from "@/app/actions";
import JobForm from "../JobForm";

export default async function NewJobPage() {
  const db = await getDb();

  return (
    <div>
      <h1 className="text-2xl font-black mb-1">New job</h1>
      <p className="text-sm text-slate-500 mb-6">
        Post any role — not just محضّر طلبات (Picker). Set only the eligibility gates that actually
        apply, and either attach branches or set a plain location.
      </p>
      <JobForm allBranches={db.data.branches} action={createJob} submitLabel="Create job" />
    </div>
  );
}
