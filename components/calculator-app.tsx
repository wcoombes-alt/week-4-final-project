"use client";

import clsx from "clsx";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Mail,
  Printer,
  RotateCcw,
  Scissors,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { FormEvent, ReactNode } from "react";
import { captureLead, saveCalculation } from "@/app/actions";
import {
  calculateSnapshot,
  categories,
  cleanMoneyInput,
  formatCurrency,
  initialCalculation,
  type CalculationSnapshot,
  type CalculationState,
} from "@/lib/calculator";

const steps = ["Current Reality", "Dream Floor", "Reality Check", "Exit Date"];

type Props = {
  initial?: Partial<CalculationState> & { id?: string };
  signedIn: boolean;
};

export function CalculatorApp({ initial, signedIn }: Props) {
  const [step, setStep] = useState(0);
  const [calculationId, setCalculationId] = useState(initial?.id);
  const [state, setState] = useState<CalculationState>({
    ...initialCalculation,
    ...initial,
  });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const snapshot = useMemo(() => calculateSnapshot(state), [state]);

  useEffect(() => {
    const saved = window.localStorage.getItem("exit-date-calculation");

    if (!initial?.id && saved) {
      try {
        setState({ ...initialCalculation, ...JSON.parse(saved) });
      } catch {
        window.localStorage.removeItem("exit-date-calculation");
      }
    }
  }, [initial?.id]);

  useEffect(() => {
    window.localStorage.setItem("exit-date-calculation", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    window.localStorage.setItem(
      "exit-date-blueprint",
      JSON.stringify({ ...snapshot, id: calculationId }),
    );
  }, [snapshot, calculationId]);

  function updateField(key: keyof CalculationState, value: number) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function continueStep() {
    if (step === 1 && state.monthlySavings === initialCalculation.monthlySavings) {
      setState((current) => ({
        ...current,
        monthlySavings: Math.max(100, snapshot.gap || current.monthlySavings),
      }));
    }

    if (step === 3) {
      return;
    }

    startTransition(async () => {
      if (signedIn && step >= 1) {
        const result = await saveCalculation({ ...state, id: calculationId });

        if (result.ok) {
          setCalculationId(result.id);
        }
      }
      setStep((current) => Math.min(current + 1, 3));
    });
  }

  function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      const result = await captureLead({
        email,
        name,
        calculation: { ...state, id: calculationId },
      });

      if (result.ok) {
        setCalculationId(result.id);
        setUnlocked(true);
        setMessage("Your blueprint is unlocked. It is ready to download or print.");
      } else {
        setMessage(result.message ?? "Something went wrong. Please try again.");
      }
    });
  }

  function reset() {
    setState(initialCalculation);
    setCalculationId(undefined);
    setUnlocked(false);
    setEmail("");
    setName("");
    setStep(0);
    window.localStorage.removeItem("exit-date-calculation");
    window.localStorage.removeItem("exit-date-blueprint");
  }

  function downloadBlueprint() {
    const html = blueprintHtml(snapshot);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "exit-date-blueprint.html";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-rose-600 dark:text-cyan-200">
            Step {step + 1} of 4
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            {steps[step]}
          </h1>
        </div>
        <button
          onClick={reset}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white/75 px-4 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white"
        >
          <RotateCcw size={17} />
          Start over
        </button>
      </div>

      <div className="mb-8 grid grid-cols-4 gap-2">
        {steps.map((label, index) => (
          <button
            key={label}
            onClick={() => setStep(index)}
            className={clsx(
              "h-3 rounded-full transition",
              index <= step
                ? "bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400"
                : "bg-slate-200 dark:bg-white/10",
            )}
            aria-label={label}
          />
        ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          {step === 0 && <RealityStep state={state} updateField={updateField} />}
          {step === 1 && <DreamFloorStep state={state} snapshot={snapshot} updateField={updateField} />}
          {step === 2 && <RealityCheckStep />}
          {step === 3 && (
            <ResultsStep
              state={state}
              snapshot={snapshot}
              email={email}
              name={name}
              unlocked={unlocked}
              message={message}
              isPending={isPending}
              updateField={updateField}
              setEmail={setEmail}
              setName={setName}
              submitLead={submitLead}
              downloadBlueprint={downloadBlueprint}
            />
          )}
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <SnapshotPanel snapshot={snapshot} />
        </aside>
      </section>

      <div className="no-print mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          disabled={step === 0}
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/75 px-5 font-black text-slate-800 transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:bg-white/10 dark:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button
          disabled={step === 3 || isPending}
          onClick={continueStep}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-cyan-400 px-6 font-black text-white shadow-xl shadow-rose-500/20 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </main>
  );
}

function RealityStep({
  state,
  updateField,
}: {
  state: CalculationState;
  updateField: (key: keyof CalculationState, value: number) => void;
}) {
  return (
    <div className="space-y-6">
      <IntroPanel
        icon={<Sparkles />}
        title="Before we change anything, we have to see where we are."
        body="Grab your last bank statement and do a quick estimate of your monthly costs. Close enough is better than not started."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <MoneyField
            key={category.key}
            label={category.label}
            hint={category.hint}
            value={state[category.key]}
            onChange={(value) => updateField(category.key, value)}
          />
        ))}
      </div>
    </div>
  );
}

function DreamFloorStep({
  state,
  snapshot,
  updateField,
}: {
  state: CalculationState;
  snapshot: CalculationSnapshot;
  updateField: (key: keyof CalculationState, value: number) => void;
}) {
  const higher = state.dreamFloor > snapshot.totalCurrent;

  return (
    <div className="space-y-6">
      <IntroPanel
        icon={<Target />}
        title="What is the minimum you need to be happy and safe?"
        body="If you were pursuing your dream, what fluff could you temporarily pause? Trim the number without making it miserable."
      />
      <MoneyField
        label="Essential Monthly Spending"
        hint="Your Achieve My Dream amount"
        value={state.dreamFloor}
        onChange={(value) => updateField("dreamFloor", value)}
        large
      />
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm dark:border-cyan-300/25 dark:bg-cyan-300/10">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700 dark:text-cyan-100">
          The gap
        </p>
        <p className="mt-2 text-4xl font-black text-slate-950 dark:text-white">
          {formatCurrency(snapshot.gap)}
        </p>
        <p className="mt-3 text-base font-semibold leading-7 text-slate-700 dark:text-slate-200">
          {higher
            ? "Your Dream Floor is currently higher than your spending. That can happen, but take one more pass at what could be paused temporarily."
            : "Does that number feel smaller than you expected? That is the gap between you and your new life."}
        </p>
      </div>
    </div>
  );
}

function RealityCheckStep() {
  return (
    <div className="space-y-6">
      <IntroPanel
        icon={<ShieldCheck />}
        title="You are not jumping into a void. You are entering a transition."
        body="The biggest limiting belief is being out of money forever. These benchmarks make the fear smaller and more practical."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <BenchmarkCard
          title="If you want another job"
          detail="A professional job search often lands in a roughly 3 to 6 month transition window."
          source="Source: U.S. Bureau of Labor Statistics, Table A-12."
        />
        <BenchmarkCard
          title="If you want to work for yourself"
          detail="Independent-professional reports suggest many people reach essential-expense coverage within their first several months, though the exact timing varies by business and should be re-verified against the latest MBO Partners State of Independence report."
          source="Source: MBO Partners, State of Independence."
        />
      </div>
      <Disclaimer />
    </div>
  );
}

function ResultsStep({
  state,
  snapshot,
  email,
  name,
  unlocked,
  message,
  isPending,
  updateField,
  setEmail,
  setName,
  submitLead,
  downloadBlueprint,
}: {
  state: CalculationState;
  snapshot: CalculationSnapshot;
  email: string;
  name: string;
  unlocked: boolean;
  message: string;
  isPending: boolean;
  updateField: (key: keyof CalculationState, value: number) => void;
  setEmail: (value: string) => void;
  setName: (value: string) => void;
  submitLead: (event: FormEvent<HTMLFormElement>) => void;
  downloadBlueprint: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20 dark:border dark:border-cyan-300/20 dark:bg-white/10 dark:shadow-cyan-500/10">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
          Your Exit Date
        </p>
        <p className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">
          {snapshot.projectedExitDate}
        </p>
        <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-slate-200">
          You do not need a million dollars. You need a plan, a specific number,
          and the courage to save the first 30 days of your freedom.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/10">
          <span className="text-sm font-black uppercase tracking-[0.18em] text-slate-500 dark:text-cyan-100/70">
            Runway months
          </span>
          <span className="mt-2 block text-4xl font-black text-slate-950 dark:text-white">
            {state.runwayMonths}
          </span>
          <input
            className="mt-4 w-full accent-rose-500"
            type="range"
            min="1"
            max="6"
            value={state.runwayMonths}
            onChange={(event) => updateField("runwayMonths", Number(event.target.value))}
          />
        </label>
        <MoneyField
          label="Monthly Exit Fund Savings"
          hint="Adjust what you can set aside each month"
          value={state.monthlySavings}
          onChange={(value) => updateField("monthlySavings", value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard
          title="Subscription Scythe"
          time="10 mins"
          body="Cancel three unused subscriptions and redirect that exact dollar amount into The Exit Fund."
          icon={<Scissors />}
        />
        <ActionCard
          title="Status Symbol Swap"
          time="30 days"
          body="Identify one stress-driven purchase and replace it with a free alternative for a month."
          icon={<Sparkles />}
        />
        <ActionCard
          title="1-Month Milestone"
          time="This week"
          body="Find the first month of runway with one practical move: sell one item, skip convenience meals, or redirect a small windfall."
          icon={<Check />}
        />
      </div>

      <form
        onSubmit={submitLead}
        className="rounded-[2rem] border border-rose-200 bg-white/85 p-6 shadow-xl shadow-rose-500/10 dark:border-cyan-300/25 dark:bg-white/10 dark:shadow-cyan-500/10"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-cyan-400 text-white">
            <Mail />
          </span>
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
              Unlock your personalized blueprint
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-200">
              Enter your email to save the calculation and download the summary.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1.4fr_auto]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 font-semibold text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-200 dark:border-white/10 dark:bg-slate-950/50 dark:text-white dark:focus:border-cyan-300 dark:focus:ring-cyan-300/15"
          />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            type="email"
            required
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 font-semibold text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-200 dark:border-white/10 dark:bg-slate-950/50 dark:text-white dark:focus:border-cyan-300 dark:focus:ring-cyan-300/15"
          />
          <button
            disabled={isPending}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 font-black text-white transition hover:-translate-y-0.5 disabled:opacity-50 dark:bg-cyan-300 dark:text-slate-950"
          >
            {isPending ? "Saving..." : "Unlock"}
          </button>
        </div>
        {message ? (
          <p className="mt-3 text-sm font-bold text-slate-700 dark:text-cyan-100">{message}</p>
        ) : null}
        {unlocked ? (
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={downloadBlueprint}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-cyan-400 px-5 font-black text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5"
            >
              <Download size={18} />
              Download
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 font-black text-slate-900 transition hover:-translate-y-0.5 dark:border-white/15 dark:bg-white/10 dark:text-white"
            >
              <Printer size={18} />
              Print
            </button>
          </div>
        ) : null}
      </form>

      {unlocked ? <Blueprint snapshot={snapshot} /> : null}
      <Disclaimer />
    </div>
  );
}

function MoneyField({
  label,
  hint,
  value,
  onChange,
  large,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (value: number) => void;
  large?: boolean;
}) {
  const displayValue = value ? String(value) : "";

  return (
    <label
      className={clsx(
        "block rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm transition focus-within:-translate-y-0.5 focus-within:border-rose-300 focus-within:shadow-xl focus-within:shadow-rose-500/10 dark:border-white/10 dark:bg-white/10 dark:focus-within:border-cyan-300/60",
        large && "max-w-2xl",
      )}
    >
      <span className="block text-sm font-black uppercase tracking-[0.18em] text-slate-500 dark:text-cyan-100/70">
        {label}
      </span>
      <span className="mt-1 block text-sm font-semibold text-slate-500 dark:text-slate-300">
        {hint}
      </span>
      <span className="mt-4 flex items-center gap-2">
        <span className="text-2xl font-black text-slate-400">$</span>
        <input
          inputMode="decimal"
          value={displayValue}
          placeholder="0"
          onChange={(event) => onChange(Number(cleanMoneyInput(event.target.value) || 0))}
          className={clsx(
            "w-full bg-transparent font-black text-slate-950 outline-none placeholder:text-slate-300 dark:text-white dark:placeholder:text-white/25",
            large ? "text-5xl" : "text-3xl",
          )}
        />
      </span>
    </label>
  );
}

function SnapshotPanel({ snapshot }: { snapshot: CalculationSnapshot }) {
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl shadow-amber-900/10 dark:border-cyan-300/20 dark:bg-slate-950/70 dark:shadow-cyan-500/10">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-600 dark:text-cyan-200">
        Live math
      </p>
      <dl className="mt-5 space-y-5">
        <Metric label="Current monthly spending" value={formatCurrency(snapshot.totalCurrent)} />
        <Metric label="Dream Floor" value={formatCurrency(snapshot.dreamFloor)} />
        <Metric label="Gap" value={formatCurrency(snapshot.gap)} />
        <Metric label="Target savings" value={formatCurrency(snapshot.targetSavingsGoal)} />
        <Metric label="Projected Exit Date" value={snapshot.projectedExitDate} />
      </dl>
      <p className="mt-5 rounded-2xl bg-amber-100 px-4 py-3 text-xs font-bold leading-5 text-amber-900 dark:bg-cyan-300/10 dark:text-cyan-100">
        Estimate only. This is not financial, legal, tax, or investment advice.
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{value}</dd>
    </div>
  );
}

function IntroPanel({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[2rem] bg-gradient-to-br from-white to-amber-50 p-6 shadow-xl shadow-amber-900/10 dark:border dark:border-white/10 dark:from-white/10 dark:to-cyan-300/10 dark:shadow-cyan-500/10">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 via-rose-500 to-cyan-400 text-white">
        {icon}
      </div>
      <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-slate-600 dark:text-slate-200">
        {body}
      </p>
    </div>
  );
}

function BenchmarkCard({
  title,
  detail,
  source,
}: {
  title: string;
  detail: string;
  source: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-white/10 dark:bg-white/10">
      <h3 className="text-xl font-black text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-3 text-base font-semibold leading-7 text-slate-600 dark:text-slate-200">
        {detail}
      </p>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-rose-600 dark:text-cyan-200">
        {source}
      </p>
    </article>
  );
}

function ActionCard({
  title,
  time,
  body,
  icon,
}: {
  title: string;
  time: string;
  body: string;
  icon: ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/10 dark:border-white/10 dark:bg-white/10">
      <div className="flex items-center justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-white dark:from-cyan-300 dark:to-fuchsia-400 dark:text-slate-950">
          {icon}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-cyan-100">
          {time}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-200">
        {body}
      </p>
    </article>
  );
}

function Blueprint({ snapshot }: { snapshot: CalculationSnapshot }) {
  return (
    <section className="print-panel rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-950 shadow-xl dark:border-white/10 dark:bg-slate-950 dark:text-white">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-600 dark:text-cyan-200">
        Personalized blueprint
      </p>
      <h2 className="mt-2 text-3xl font-black">Your first 30 days of freedom</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Monthly audit total" value={formatCurrency(snapshot.totalCurrent)} />
        <Metric label="Dream Floor" value={formatCurrency(snapshot.dreamFloor)} />
        <Metric label="Runway goal" value={formatCurrency(snapshot.targetSavingsGoal)} />
        <Metric label="Exit Date" value={snapshot.projectedExitDate} />
      </div>
      <ol className="mt-6 grid gap-3 text-sm font-bold leading-6 sm:grid-cols-3">
        <li>1. Cancel three subscriptions and redirect the savings.</li>
        <li>2. Swap one stress purchase for a free alternative.</li>
        <li>3. Find the first month of runway this week.</li>
      </ol>
      <p className="mt-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
        Estimate only. This blueprint is not financial advice.
      </p>
    </section>
  );
}

function Disclaimer() {
  return (
    <p className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-xs font-bold leading-5 text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
      This calculator provides estimates for planning conversations only. It is not
      financial, legal, tax, or investment advice.
    </p>
  );
}

function blueprintHtml(snapshot: CalculationSnapshot) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Exit Date Blueprint</title>
    <style>
      body { font-family: Arial, sans-serif; color: #172033; padding: 40px; line-height: 1.5; }
      h1 { font-size: 40px; margin-bottom: 8px; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin: 28px 0; }
      .box { border: 1px solid #d8dee8; border-radius: 16px; padding: 18px; }
      .label { font-size: 12px; text-transform: uppercase; letter-spacing: .12em; color: #e11d48; font-weight: 800; }
      .value { font-size: 28px; font-weight: 900; margin-top: 4px; }
    </style>
  </head>
  <body>
    <p class="label">Exit Date Blueprint</p>
    <h1>Your Exit Date is ${snapshot.projectedExitDate}</h1>
    <p>You do not need a million dollars. You need a plan, a specific number, and the first 30 days of freedom funded.</p>
    <div class="grid">
      <div class="box"><div class="label">Monthly audit total</div><div class="value">${formatCurrency(snapshot.totalCurrent)}</div></div>
      <div class="box"><div class="label">Dream Floor</div><div class="value">${formatCurrency(snapshot.dreamFloor)}</div></div>
      <div class="box"><div class="label">Gap</div><div class="value">${formatCurrency(snapshot.gap)}</div></div>
      <div class="box"><div class="label">Target savings goal</div><div class="value">${formatCurrency(snapshot.targetSavingsGoal)}</div></div>
    </div>
    <h2>30-Day Action Plan</h2>
    <ol>
      <li>The Subscription Scythe: cancel three unused subscriptions and redirect that exact dollar amount.</li>
      <li>The Status Symbol Swap: replace one stress-driven purchase with a free alternative for 30 days.</li>
      <li>The 1-Month Milestone: find the first month's worth this week.</li>
    </ol>
    <p><strong>Estimate only. This is not financial advice.</strong></p>
  </body>
</html>`;
}
