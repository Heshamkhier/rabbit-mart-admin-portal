"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Small inline icon set — kept dependency-free (no icon package in this
// project) so each nav item gets a simple, legible glyph matching the
// reference's icon + label rows.
const ICONS = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  jobs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  ),
  branches: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  slots: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  ),
  applicants: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c1-3.8 3.6-6 6.5-6s5.5 2.2 6.5 6" />
      <circle cx="17.5" cy="8.5" r="2.4" />
      <path d="M15.7 12.4c2.4.4 4.2 2.3 5 6.1" />
    </svg>
  ),
  content: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20V6a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <path d="M14 4v6h6" />
    </svg>
  ),
};

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/jobs", label: "Jobs", icon: "jobs" },
  { href: "/admin/branches", label: "Branches", icon: "branches" },
  { href: "/admin/slots", label: "Interview Slots", icon: "slots" },
  { href: "/admin/applicants", label: "Applicants", icon: "applicants" },
  { href: "/admin/content", label: "Site Content Editor", icon: "content" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav">
      {NAV.map((n) => {
        const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
        return (
          <Link key={n.href} href={n.href} className={`admin-nav-item${active ? " active" : ""}`}>
            {ICONS[n.icon]}
            <span className="label">{n.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
