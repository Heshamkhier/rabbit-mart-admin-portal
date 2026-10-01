"use client";

import { useState } from "react";

// One-click copy of a job's public link.
export default function CopyLink({ url, label = "Copy link", compact = false }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API blocked (e.g. non-HTTPS): fall back to a hidden textarea.
      const t = document.createElement("textarea");
      t.value = url;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`btn ${copied ? "btn-lime" : "btn-outline"}`}
      style={compact ? { padding: "4px 10px", fontSize: 12 } : undefined}
      title={url}
    >
      {copied ? "✓ Copied" : label}
    </button>
  );
}
