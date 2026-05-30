"use client";

import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

export function SignInButton() {
  return (
    <button
      onClick={() => signIn("google", { redirectTo: "/calculator" })}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950 dark:shadow-cyan-400/20"
    >
      <LogIn size={17} />
      Sign in
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/" })}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-300/80 bg-white/70 px-4 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
    >
      <LogOut size={17} />
      Sign out
    </button>
  );
}
