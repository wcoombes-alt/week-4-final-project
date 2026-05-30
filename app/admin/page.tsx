import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { LeadsExportButton } from "@/components/leads-export-button";
import { getDb } from "@/db";
import { calculations, leads } from "@/db/schema";
import { centsToDollars, formatCurrency } from "@/lib/calculator";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  if (!process.env.DATABASE_URL) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <AdminShell title="Admin Leads" subtitle="Database setup needed">
          <p className="rounded-3xl border border-amber-200 bg-amber-50 p-6 font-semibold leading-7 text-amber-950 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
            Add the required environment values and run the database migration
            before viewing leads.
          </p>
        </AdminShell>
      </main>
    );
  }

  const db = getDb();
  const rows = await db
    .select({
      id: leads.id,
      email: leads.email,
      name: leads.name,
      capturedAt: leads.capturedAt,
      dreamFloor: calculations.dreamFloor,
      targetSavingsGoal: calculations.targetSavingsGoal,
      projectedExitDate: calculations.projectedExitDate,
    })
    .from(leads)
    .leftJoin(calculations, eq(leads.calculationId, calculations.id))
    .where(eq(leads.userId, session.user.id))
    .orderBy(desc(leads.capturedAt));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <AdminShell
        title="Admin Leads"
        subtitle={`${rows.length} captured ${rows.length === 1 ? "lead" : "leads"}`}
        action={rows.length ? <LeadsExportButton /> : null}
      >
        {rows.length ? (
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-xl shadow-amber-900/10 dark:border-white/10 dark:bg-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950">
                  <tr>
                    <th className="px-5 py-4 font-black">Email</th>
                    <th className="px-5 py-4 font-black">Name</th>
                    <th className="px-5 py-4 font-black">Dream Floor</th>
                    <th className="px-5 py-4 font-black">Savings Goal</th>
                    <th className="px-5 py-4 font-black">Exit Date</th>
                    <th className="px-5 py-4 font-black">Captured</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {rows.map((row) => (
                    <tr key={row.id} className="text-slate-700 dark:text-slate-200">
                      <td className="px-5 py-4 font-black text-slate-950 dark:text-white">
                        {row.email}
                      </td>
                      <td className="px-5 py-4">{row.name || "Not provided"}</td>
                      <td className="px-5 py-4">
                        {formatCurrency(centsToDollars(row.dreamFloor))}
                      </td>
                      <td className="px-5 py-4">
                        {formatCurrency(centsToDollars(row.targetSavingsGoal))}
                      </td>
                      <td className="px-5 py-4">
                        {row.projectedExitDate?.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }) ?? "Not calculated"}
                      </td>
                      <td className="px-5 py-4">
                        {row.capturedAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 text-center shadow-xl shadow-amber-900/10 dark:border-white/10 dark:bg-white/10">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
              No leads captured yet
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-semibold leading-7 text-slate-600 dark:text-slate-300">
              Run through the calculator while signed in, unlock the blueprint,
              and the first lead will appear here.
            </p>
            <Link
              href="/calculator"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-cyan-400 px-6 font-black text-white"
            >
              Open calculator
            </Link>
          </div>
        )}
      </AdminShell>
    </main>
  );
}

function AdminShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-rose-600 dark:text-cyan-200">
            Owner-only
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 font-semibold text-slate-600 dark:text-slate-300">
            {subtitle}
          </p>
        </div>
        {action}
      </div>
      {children}
    </>
  );
}
