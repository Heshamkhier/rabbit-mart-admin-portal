import { jobLink, SHARE_CHANNELS } from "@/lib/links";
import CopyLink from "./CopyLink";

// The "post this job" box on the job's edit page: its public link plus
// per-channel versions that tag each application with its source.
export default function ShareLinks({ job }) {
  const url = jobLink(job);
  const live = job.status === "live";
  return (
    <div className="card mb-4" style={{ maxWidth: 720, borderColor: live ? "#cfe8a0" : "#f3d9a4" }}>
      <h2 className="font-bold mb-1">Link for your job ad</h2>
      <p className="text-sm text-slate-500 mb-3">
        This link opens <b>only this job</b> — candidates don&apos;t see your other vacancies.
        {!live && (
          <span style={{ color: "#8a6300" }}> This job is a Draft, so the link shows &ldquo;not available&rdquo; until you set it to Live.</span>
        )}
      </p>
      <div className="flex gap-2 items-center mb-3">
        <input className="input" readOnly value={url} style={{ direction: "ltr" }} />
        <CopyLink url={url} />
        <a className="btn btn-outline" href={url} target="_blank" rel="noopener noreferrer">
          Open ↗
        </a>
      </div>
      <p className="text-xs text-slate-500 mb-2">
        Posting on a specific platform? Use its link so each applicant is tagged with where they came from (you can
        filter by it on the Applicants page):
      </p>
      <div className="flex gap-2 flex-wrap">
        {SHARE_CHANNELS.map((c) => (
          <CopyLink key={c.src} url={jobLink(job, c.src)} label={`Copy ${c.label} link`} compact />
        ))}
      </div>
    </div>
  );
}
