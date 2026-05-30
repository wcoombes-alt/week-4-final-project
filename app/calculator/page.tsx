import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { CalculatorApp } from "@/components/calculator-app";
import { getDb } from "@/db";
import { calculations } from "@/db/schema";
import { centsToDollars, type CalculationState } from "@/lib/calculator";

export const dynamic = "force-dynamic";

export default async function CalculatorPage() {
  const session = await auth();
  let initial: (Partial<CalculationState> & { id?: string }) | undefined;

  if (session?.user?.id && process.env.DATABASE_URL) {
    const db = getDb();
    const [saved] = await db
      .select()
      .from(calculations)
      .where(eq(calculations.userId, session.user.id))
      .orderBy(desc(calculations.updatedAt))
      .limit(1);

    if (saved) {
      initial = {
        id: saved.id,
        housing: centsToDollars(saved.housing),
        transportation: centsToDollars(saved.transportation),
        food: centsToDollars(saved.food),
        insurance: centsToDollars(saved.insurance),
        shopping: centsToDollars(saved.shopping),
        giving: centsToDollars(saved.giving),
        futureYou: centsToDollars(saved.futureYou),
        family: centsToDollars(saved.family),
        subscriptions: centsToDollars(saved.subscriptions),
        growth: centsToDollars(saved.growth),
        debt: centsToDollars(saved.debt),
        other: centsToDollars(saved.other),
        dreamFloor: centsToDollars(saved.dreamFloor),
        runwayMonths: saved.runwayMonths,
        monthlySavings: centsToDollars(saved.monthlySavings),
      };
    }
  }

  return <CalculatorApp initial={initial} signedIn={Boolean(session?.user?.id)} />;
}
