// Public link to a job's page on the candidate portal - the link to paste into
// a social-media job ad. It opens that one job only; the portal's home page
// no longer lists every vacancy.
//
// Override with APPLICANT_PORTAL_URL if the candidate portal ever moves to a
// custom domain (e.g. https://jobs.rabbitmart.com).
export const APPLICANT_PORTAL_URL = (
  process.env.APPLICANT_PORTAL_URL || "https://rabbit-mart-applicant-portal.vercel.app"
).replace(/\/+$/, "");

// Channel tags appended as ?src=... so each application records where the
// candidate came from (shown and filterable on the Applicants page).
export const SHARE_CHANNELS = [
  { src: "facebook", label: "Facebook" },
  { src: "instagram", label: "Instagram" },
  { src: "whatsapp", label: "WhatsApp" },
  { src: "linkedin", label: "LinkedIn" },
  { src: "tiktok", label: "TikTok" },
];

export function jobLink(job, src) {
  const url = `${APPLICANT_PORTAL_URL}/jobs/${encodeURIComponent(job.slug)}`;
  return src ? `${url}?src=${encodeURIComponent(src)}` : url;
}
