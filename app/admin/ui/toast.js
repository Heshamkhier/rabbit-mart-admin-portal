"use client";

// Tiny toast store. The <Toaster/> lives in the admin layout, which stays
// mounted across page navigations - so a "Job created" message survives the
// redirect back to the Jobs list.
let seq = 0;
const listeners = new Set();
let toasts = [];

function emit() {
  for (const l of listeners) l(toasts);
}
function upsert(t) {
  toasts = [...toasts.filter((x) => x.id !== t.id), t];
  emit();
}
function dismissLater(id, ms) {
  setTimeout(() => {
    toasts = toasts.filter((x) => x.id !== id);
    emit();
  }, ms);
}

export const toast = {
  loading(text) {
    const id = ++seq;
    upsert({ id, kind: "loading", text });
    return id;
  },
  success(id, text) {
    upsert({ id, kind: "success", text });
    dismissLater(id, 3500);
  },
  error(id, text) {
    upsert({ id, kind: "error", text });
    dismissLater(id, 9000);
  },
  subscribe(fn) {
    listeners.add(fn);
    fn(toasts);
    return () => listeners.delete(fn);
  },
};
