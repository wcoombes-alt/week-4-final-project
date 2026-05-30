import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { calculations, leads } from "@/db/schema";
import { centsToDollars } from "@/lib/calculator";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const db = getDb();
  const rows = await db
    .select({
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

  const header = [
    "email",
    "name",
    "dream_floor",
    "target_savings_goal",
    "projected_exit_date",
    "captured_at",
  ];
  const body = rows.map((row) =>
    [
      row.email,
      row.name ?? "",
      centsToDollars(row.dreamFloor),
      centsToDollars(row.targetSavingsGoal),
      row.projectedExitDate?.toISOString().slice(0, 10) ?? "",
      row.capturedAt.toISOString(),
    ]
      .map(csvCell)
      .join(","),
  );

  return new NextResponse([header.join(","), ...body].join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="exit-date-leads.csv"',
    },
  });
}

function csvCell(value: string | number) {
  const text = String(value);
  return `"${text.replaceAll('"', '""')}"`;
}
