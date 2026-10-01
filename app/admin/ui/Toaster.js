"use client";

import { useEffect, useState } from "react";
import { toast } from "./toast";

const STYLE = {
  loading: { background: "#0B3D2E", color: "#fff" },
  success: { background: "#D6FF3D", color: "#0B3D2E" },
  error: { background: "#fde8e8", color: "#9b1c1c", border: "1px solid #f5c2c2" },
};
const ICON = { loading: null, success: "✓", error: "⚠" };

export default function Toaster() {
  const [items, setItems] = useState([]);
  useEffect(() => toast.subscribe(setItems), []);
  return (
    <div
      aria-live="polite"
      style={{ position: "fixed", top: 16, right: 16, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8, maxWidth: 420 }}
    >
      {items.map((t) => (
        <div
          key={t.id}
          role={t.kind === "error" ? "alert" : "status"}
          data-toast={t.kind}
          style={{
            ...STYLE[t.kind],
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          {t.kind === "loading" ? <span className="rm-spinner" /> : <span>{ICON[t.kind]}</span>}
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
