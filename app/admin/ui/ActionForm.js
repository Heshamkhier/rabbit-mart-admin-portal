"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "./toast";

// Wraps every admin form:
// - shows a "Saving…" toast and a spinner on the submit button while it works
// - on success: "Saved"-style confirmation (and optional redirect)
// - on failure: the error message, and the form is left EXACTLY as typed -
// we handle the submit ourselves, so nothing resets or navigates away.
export default function ActionForm({ action, children, pendingText = "Saving…", confirm, className, style }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(e) {
    e.preventDefault();
    if (pending) return;
    if (confirm && !window.confirm(confirm)) return;
    const formData = new FormData(e.currentTarget);
    const id = toast.loading(pendingText);
    startTransition(async () => {
      let res;
      try {
        res = await action(formData);
      } catch {
        res = { ok: false, error: "Couldn't reach the server — check your connection. Nothing was lost; try again." };
      }
      if (!res || res.ok === false) {
        toast.error(id, res?.error || "That didn't save. Please try again.");
        return;
      }
      toast.success(id, res.message || "Saved");
      if (res.redirectTo) {
        router.push(res.redirectTo);
        // The destination may be in the browser's page cache from an earlier
        // visit (e.g. the Jobs list still showing a job we just deleted), so
        // re-fetch it once we've arrived.
        setTimeout(() => router.refresh(), 0);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className={className} style={style} aria-busy={pending} data-pending={pending ? "" : undefined}>
      {children}
    </form>
  );
}
