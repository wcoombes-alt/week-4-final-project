import { addMonths, format } from "date-fns";

export const categories = [
  {
    key: "housing",
    label: "Housing",
    hint: "Rent/Mortgage, Utilities",
  },
  {
    key: "transportation",
    label: "Transportation",
    hint: "Car, Gas, Insurance, Uber",
  },
  {
    key: "food",
    label: "Food",
    hint: "Groceries, Dining Out, Coffee",
  },
  {
    key: "insurance",
    label: "Insurance",
    hint: "Health, Life",
  },
  {
    key: "shopping",
    label: "Shopping",
    hint: "Clothes, Shoes, Tech",
  },
  {
    key: "giving",
    label: "Giving",
    hint: "Charity, Church, Causes",
  },
  {
    key: "futureYou",
    label: "Future You",
    hint: "401k, IRA, General Savings",
  },
  {
    key: "family",
    label: "Family",
    hint: "Helping others",
  },
  {
    key: "subscriptions",
    label: "Subscriptions",
    hint: "Phone, Netflix, Apps",
  },
  {
    key: "growth",
    label: "Growth",
    hint: "Courses, Books, Coaching",
  },
  {
    key: "debt",
    label: "Debt",
    hint: "Student loans, Credit cards",
  },
  {
    key: "other",
    label: "Other",
    hint: "Everything else",
  },
] as const;

export type CategoryKey = (typeof categories)[number]["key"];

export type CategoryAmounts = Record<CategoryKey, number>;

export type CalculationState = CategoryAmounts & {
  dreamFloor: number;
  runwayMonths: number;
  monthlySavings: number;
};

export type CalculationSnapshot = CalculationState & {
  id?: string;
  totalCurrent: number;
  gap: number;
  targetSavingsGoal: number;
  projectedExitDate: string;
};

export const emptyAmounts: CategoryAmounts = {
  housing: 0,
  transportation: 0,
  food: 0,
  insurance: 0,
  shopping: 0,
  giving: 0,
  futureYou: 0,
  family: 0,
  subscriptions: 0,
  growth: 0,
  debt: 0,
  other: 0,
};

export const initialCalculation: CalculationState = {
  ...emptyAmounts,
  dreamFloor: 0,
  runwayMonths: 3,
  monthlySavings: 500,
};

export function dollarsToCents(value: number) {
  return Math.max(0, Math.round((Number.isFinite(value) ? value : 0) * 100));
}

export function centsToDollars(value: number | null | undefined) {
  return Math.round((value ?? 0) / 100);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function cleanMoneyInput(value: string) {
  const clean = value.replace(/[^\d.]/g, "");
  const parts = clean.split(".");

  if (parts.length <= 1) {
    return clean;
  }

  return `${parts[0]}.${parts.slice(1).join("").slice(0, 2)}`;
}

export function calculateSnapshot(state: CalculationState): CalculationSnapshot {
  const totalCurrent = categories.reduce(
    (sum, category) => sum + (state[category.key] || 0),
    0,
  );
  const dreamFloor = Math.max(0, state.dreamFloor || 0);
  const runwayMonths = Math.max(1, state.runwayMonths || 1);
  const monthlySavings = Math.max(0, state.monthlySavings || 0);
  const gap = Math.max(0, totalCurrent - dreamFloor);
  const targetSavingsGoal = dreamFloor * runwayMonths;
  const monthsToExit =
    monthlySavings > 0 ? Math.max(1, Math.ceil(targetSavingsGoal / monthlySavings)) : 0;
  const projectedExitDate =
    monthsToExit > 0 ? addMonths(new Date(), monthsToExit) : addMonths(new Date(), 999);

  return {
    ...state,
    totalCurrent,
    gap,
    targetSavingsGoal,
    projectedExitDate: format(projectedExitDate, "MMMM d, yyyy"),
  };
}

export function projectedDateFromValues(targetSavingsGoal: number, monthlySavings: number) {
  if (monthlySavings <= 0) {
    return null;
  }

  return addMonths(new Date(), Math.max(1, Math.ceil(targetSavingsGoal / monthlySavings)));
}
