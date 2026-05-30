"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span className="h-11 w-11 rounded-full border border-slate-300/70 bg-white/60 dark:border-white/15 dark:bg-white/10" />
    );
  }

  const dark = resolvedTheme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      title="Toggle theme"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="grid h-11 w-11 place-items-center rounded-full border border-slate-300/70 bg-white/80 text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-cyan-300/25 dark:bg-white/10 dark:text-cyan-100"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
