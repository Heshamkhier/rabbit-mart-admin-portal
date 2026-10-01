import { getDb } from "@/lib/db";
import { updateJob } from "@/app/actions";
import { idFromParam } from "@/lib/ids";
import { notFound } from "next/navigation";
import JobForm from "../JobForm";

export default async function EditJobPage({ params }) {
  const id = idFromParam((await params).id);
  const db = await getDb();
  const job = db.data.jobs.find((j) => j.id === id);
  if (!job) notFound();

  return (
    <div>
      <h1 className="text-2xl font-black mb-1">Edit job</h1>
      <p className="text-sm text-slate-500 mb-6">Changes save straight to this build&apos;s data store.</p>
      <JobForm job={job} allBranches={db.data.branches} action={updateJob} submitLabel="Save changes" />
    </div>
  );
}
