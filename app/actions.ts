"use server";

import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { calculations, leads } from "@/db/schema";
import {
  categories,
  centsToDollars,
  dollarsToCents,
  projectedDateFromValues,
} from "@/lib/calculator";
import {
  calculationInputSchema,
  leadInputSchema,
  type CalculationInput,
} from "@/lib/validation";

export type SaveCalculationResult =
  | { ok: true; id: string }
  | { ok: false; message: string };

function toCalculationValues(input: CalculationInput) {
  const values = Object.fromEntries(
    categories.map((category) => [category.key, dollarsToCents(input[category.key])]),
  ) as Record<(typeof categories)[number]["key"], number>;
  const totalCurrent = Object.values(values).reduce((sum, value) => sum + value, 0);
  const dreamFloor = dollarsToCents(input.dreamFloor);
  const monthlySavings = dollarsToCents(input.monthlySavings);
  const runwayMonths = input.runwayMonths;
  const targetSavingsGoal = dreamFloor * runwayMonths;

  return {
    values,
    totalCurrent,
    dreamFloor,
    monthlySavings,
    runwayMonths,
    targetSavingsGoal,
    projectedExitDate: projectedDateFromValues(
      centsToDollars(targetSavingsGoal),
      centsToDollars(monthlySavings),
    ),
  };
}

export async function saveCalculation(rawInput: unknown): Promise<SaveCalculationResult> {
  const parsed = calculationInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return { ok: false, message: "Please check the numbers and try again." };
  }

  const db = getDb();
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const values = toCalculationValues(parsed.data);

  if (parsed.data.id && userId) {
    const [updated] = await db
      .update(calculations)
      .set({
        ...values.values,
        userId,
        totalCurrent: values.totalCurrent,
        dreamFloor: values.dreamFloor,
        runwayMonths: values.runwayMonths,
        monthlySavings: values.monthlySavings,
        targetSavingsGoal: values.targetSavingsGoal,
        projectedExitDate: values.projectedExitDate,
        updatedAt: new Date(),
      })
      .where(eq(calculations.id, parsed.data.id))
      .returning({ id: calculations.id });

    if (updated) {
      return { ok: true, id: updated.id };
    }
  }

  const [created] = await db
    .insert(calculations)
    .values({
      ...values.values,
      userId,
      totalCurrent: values.totalCurrent,
      dreamFloor: values.dreamFloor,
      runwayMonths: values.runwayMonths,
      monthlySavings: values.monthlySavings,
      targetSavingsGoal: values.targetSavingsGoal,
      projectedExitDate: values.projectedExitDate,
    })
    .returning({ id: calculations.id });

  return { ok: true, id: created.id };
}

export async function captureLead(rawInput: unknown) {
  const parsed = leadInputSchema.safeParse(rawInput);

  if (!parsed.success) {
    return { ok: false, message: "Enter a valid email address to unlock your blueprint." };
  }

  const calculationResult = await saveCalculation(parsed.data.calculation);

  if (!calculationResult.ok) {
    return calculationResult;
  }

  const db = getDb();
  const session = await auth();

  await db.insert(leads).values({
    email: parsed.data.email,
    name: parsed.data.name || null,
    calculationId: calculationResult.id,
    userId: session?.user?.id ?? null,
  });

  return { ok: true, id: calculationResult.id };
}
