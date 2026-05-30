import Link from "next/link";
import { auth } from "@/auth";
import { SignInButton, SignOutButton } from "./auth-controls";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";

export async function Header() {
  const session = await auth();

  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 via-rose-500 to-cyan-400 font-black text-white shadow-lg shadow-rose-500/20">
            ED
          </span>
          <span>
            <span className="block text-base font-black tracking-tight text-slate-950 dark:text-white">
              Exit Date
            </span>
            <span className="hidden text-xs font-semibold text-slate-500 dark:text-cyan-100/70 sm:block">
              Trapped to prepared
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/calculator"
            className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-white hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Calculator
          </Link>
          <Link
            href="/admin"
            className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-white hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Leads
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <MobileMenu />
          <ThemeToggle />
          {session?.user ? <SignOutButton /> : <SignInButton />}
        </div>
      </div>
    </header>
  );
}
