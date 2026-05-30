"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-label="Open navigation"
        onClick={() => setOpen((current) => !current)}
        className="grid h-11 w-11 place-items-center rounded-full border border-slate-300/70 bg-white/70 text-slate-900 dark:border-white/15 dark:bg-white/10 dark:text-white"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open ? (
        <div className="absolute left-4 right-4 top-16 rounded-3xl border border-white/70 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-slate-950">
          <Link
            href="/calculator"
            onClick={() => setOpen(false)}
            className="block rounded-2xl px-4 py-3 font-black text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
          >
            Calculator
          </Link>
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="block rounded-2xl px-4 py-3 font-black text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
          >
            Leads
          </Link>
        </div>
      ) : null}
    </div>
  );
}
