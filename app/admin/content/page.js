import { getDb } from "@/lib/db";
import { updateSiteContent } from "@/app/actions";

export default async function ContentPage() {
  const db = await getDb();
  const sc = db.data.siteContent;

  return (
    <div>
      <h1 className="text-2xl font-black mb-1">Site Content Editor</h1>
      <p className="text-sm text-slate-500 mb-6">
        Edit copy and messaging across the applicant portal without touching code.
      </p>

      <form action={updateSiteContent} className="card space-y-5 max-w-xl">
        <div>
          <label className="label">Marquee banner text</label>
          <input className="input" name="marqueeText" defaultValue={sc.brand.marqueeText} dir="rtl" />
        </div>
        <div>
          <label className="label">Apply button label</label>
          <input className="input" name="applyButton" defaultValue={sc.copy.applyButton} dir="rtl" />
        </div>
        <div>
          <label className="label">Confirmation screen closing line</label>
          <input className="input" name="confirmClose" defaultValue={sc.copy.confirmClose} dir="rtl" />
        </div>
        <div>
          <label className="label">WhatsApp Business profile message (your own custom text)</label>
          <textarea
            className="input"
            rows={4}
            name="customProfileMessage"
            defaultValue={sc.whatsapp.customProfileMessage}
            dir="rtl"
            placeholder="اكتب هنا رسالة البروفايل اللي عايز تظهر..."
          />
          <p className="text-[11px] text-slate-400 mt-1">
            This is written directly by you — nothing is auto-pulled from the WhatsApp Business app.
          </p>
        </div>
        <button className="btn btn-primary">Save content</button>
      </form>
    </div>
  );
}
