"use client";

import { Download, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency, type CalculationSnapshot } from "@/lib/calculator";

export function BlueprintView() {
  const [snapshot, setSnapshot] = useState<CalculationSnapshot | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem("exit-date-blueprint");
    if (raw) {
      setSnapshot(JSON.parse(raw));
    }
  }, []);

  if (!snapshot) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-xl dark:border-white/10 dark:bg-white/10">
          <h1 className="text-3xl font-black text-slate-950 dark:text-white">
            No blueprint yet
          </h1>
          <p className="mt-3 font-semibold text-slate-600 dark:text-slate-300">
            Finish the calculator and unlock your blueprint to see it here.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="print-panel rounded-[2rem] border border-white/70 bg-white p-8 text-slate-950 shadow-2xl shadow-amber-900/10 dark:border-white/10 dark:bg-slate-950 dark:text-white">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-rose-600 dark:text-cyan-200">
          Thank you
        </p>
        <h1 className="mt-3 text-5xl font-black tracking-tight">
          Your Exit Date is {snapshot.projectedExitDate}
        </h1>
        <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-slate-600 dark:text-slate-300">
          This is the compact version of your personalized blueprint. Print it,
          download it, and keep the first month visible.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Current monthly spending" value={formatCurrency(snapshot.totalCurrent)} />
          <Metric label="Dream Floor" value={formatCurrency(snapshot.dreamFloor)} />
          <Metric label="Gap" value={formatCurrency(snapshot.gap)} />
          <Metric label="Target savings" value={formatCurrency(snapshot.targetSavingsGoal)} />
        </div>
        <h2 className="mt-8 text-2xl font-black">Your first 30 days</h2>
        <ol className="mt-4 grid gap-3 text-sm font-bold leading-6 sm:grid-cols-3">
          <li className="rounded-2xl bg-amber-50 p-4 dark:bg-white/10">
            1. Cancel three unused subscriptions and redirect the amount.
          </li>
          <li className="rounded-2xl bg-rose-50 p-4 dark:bg-white/10">
            2. Replace one stress-driven purchase with a free alternative.
          </li>
          <li className="rounded-2xl bg-cyan-50 p-4 dark:bg-white/10">
            3. Find the first month of runway this week.
          </li>
        </ol>
        <p className="mt-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          Estimate only. This is not financial advice.
        </p>
      </section>
      <div className="no-print mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => window.print()}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-slate-950 px-5 font-black text-white dark:bg-cyan-300 dark:text-slate-950"
        >
          <Printer size={18} />
          Print
        </button>
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "exit-date-blueprint.json";
            link.click();
            URL.revokeObjectURL(url);
          }}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 font-black text-slate-950 dark:border-white/15 dark:bg-white/10 dark:text-white"
        >
          <Download size={18} />
          Download data
        </button>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
