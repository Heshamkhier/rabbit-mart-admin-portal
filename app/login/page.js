"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden md:flex flex-col justify-between w-[42%] p-10 text-white relative overflow-hidden"
        style={{ background: "var(--rm-green)" }}
      >
        <img
          src="/brand/wordmark.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none"
        />
        <div className="relative flex items-center gap-2 font-black text-lg">
          <img src="/brand/round-mark.png" alt="" className="w-9 h-9 rounded-full" />
          RABBIT MART
        </div>
        <div className="relative">
          <p className="text-3xl font-black leading-tight mb-3" style={{ color: "var(--rm-lime)" }}>
            Good people.
            <br />
            Good work.
          </p>
          <p className="text-sm text-white/70 max-w-xs">Hiring admin — jobs, branches, interviews and applicants in one place.</p>
        </div>
        <img src="/brand/mascot-racer.png" alt="" className="relative w-40 self-end opacity-95" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <form action={formAction} className="card w-full max-w-sm">
          <div className="mb-6 text-center md:hidden">
            <div className="inline-flex items-center gap-2 font-black text-lg" style={{ color: "var(--rm-green)" }}>
              <img src="/brand/round-mark.png" alt="" className="w-7 h-7 rounded-full" />
              RABBIT MART
            </div>
          </div>
          <div className="mb-6 text-center">
            <p className="font-black text-xl" style={{ color: "var(--rm-green)" }}>
              Sign in
            </p>
            <p className="text-sm text-slate-500 mt-1">Hiring Admin Portal</p>
          </div>

          <div className="mb-4">
            <label className="label">Username</label>
            <input className="input" name="username" required autoComplete="username" />
          </div>
          <div className="mb-4">
            <label className="label">Password</label>
            <input className="input" type="password" name="password" required autoComplete="current-password" />
          </div>

          {state?.error && <p className="text-sm text-red-600 mb-3">{state.error}</p>}

          <button className="btn btn-primary w-full justify-center" disabled={pending}>
            {pending ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-[11px] text-slate-400 mt-4 text-center">
            Build 2 standalone demo — default login: admin / RabbitAdmin!2026
          </p>
        </form>
      </div>
    </div>
  );
}
