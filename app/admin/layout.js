import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions";
import AdminNav from "./AdminNav";

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/brand/round-mark.png" alt="" />
          <div>
            <div className="admin-brand-name">RABBIT MART</div>
            <div className="admin-brand-sub">Hiring · Admin</div>
          </div>
        </div>

        <AdminNav />

        <div className="admin-sidebar-mascot">
          <img src="/brand/mascot-hero.png" alt="" />
        </div>

        <div className="admin-sidebar-footer">
          <p className="label" style={{ color: "rgba(255,255,255,.55)", marginBottom: 6 }}>
            {user.username}
          </p>
          <form action={logoutAction}>
            <button className="text-xs font-bold" style={{ color: "var(--rm-lime)" }}>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <span className="admin-header-title">Recruitment workspace</span>
          <span className="admin-user-chip">
            <span className="admin-user-dot" />
            {user.username}
          </span>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
