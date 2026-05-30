"use client";

import { Download } from "lucide-react";

export function LeadsExportButton() {
  return (
    <a
      href="/admin/export"
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-black text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 dark:bg-cyan-300 dark:text-slate-950"
    >
      <Download size={17} />
      Export CSV
    </a>
  );
}
