import { ArrowRight, CalendarDays, Gauge, MailCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-rose-600 dark:text-cyan-200">
              Financial freedom calculator
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-tight text-slate-950 dark:text-white sm:text-7xl">
              Your Exit Date is closer than it appears.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-650 text-slate-700 dark:text-slate-200">
              Turn the vague fear of leaving a steady paycheck into a specific
              savings target, a calendar date, and the first 30 days of action.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/calculator"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-cyan-400 px-7 text-base font-black text-white shadow-2xl shadow-rose-500/25 transition hover:-translate-y-1"
              >
                Find my Exit Date
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/admin"
                className="inline-flex h-14 items-center justify-center rounded-full border border-slate-300 bg-white/75 px-7 text-base font-black text-slate-900 transition hover:-translate-y-1 hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white"
              >
                View leads
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-2xl shadow-amber-900/10 backdrop-blur dark:border-cyan-300/20 dark:bg-white/10 dark:shadow-cyan-500/10">
            <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl dark:bg-slate-950/80">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                Projected Exit Date
              </p>
              <p className="mt-3 text-4xl font-black">October 30, 2026</p>
              <div className="mt-5 h-3 rounded-full bg-white/10">
                <div className="h-3 w-2/3 rounded-full bg-gradient-to-r from-amber-400 to-cyan-300" />
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <PreviewMetric icon={<Gauge />} label="Dream Floor" value="$4,200/mo" />
              <PreviewMetric icon={<CalendarDays />} label="Runway" value="4 months" />
              <PreviewMetric icon={<ShieldCheck />} label="Target" value="$16,800" />
              <PreviewMetric icon={<MailCheck />} label="Blueprint" value="Unlocked" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {[
            ["1", "Audit current spending", "Estimate the monthly categories that matter."],
            ["2", "Set your Dream Floor", "Separate essentials from temporary fluff."],
            ["3", "Reality-check the fear", "See practical transition benchmarks."],
            ["4", "Save the first month", "Get a date, a goal, and easy wins."],
          ].map(([number, title, body]) => (
            <article
              key={title}
              className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/10"
            >
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 font-black text-white dark:from-cyan-300 dark:to-fuchsia-400 dark:text-slate-950">
                {number}
              </span>
              <h2 className="mt-4 text-xl font-black text-slate-950 dark:text-white">
                {title}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
                {body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function PreviewMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/75">
      <div className="flex items-center gap-2 text-rose-600 dark:text-cyan-200">
        {icon}
        <span className="text-xs font-black uppercase tracking-[0.14em]">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
