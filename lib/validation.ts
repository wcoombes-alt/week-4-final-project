import { z } from "zod";
import { categories, type CategoryKey } from "./calculator";

const amountSchema = z.coerce.number().min(0).max(10_000_000).default(0);
const categoryAmountShape = Object.fromEntries(
  categories.map((category) => [category.key, amountSchema]),
) as Record<CategoryKey, typeof amountSchema>;

export const calculationInputSchema = z.object({
  id: z.string().uuid().optional(),
  ...categoryAmountShape,
  dreamFloor: amountSchema,
  runwayMonths: z.coerce.number().int().min(1).max(24).default(3),
  monthlySavings: amountSchema,
});

export const leadInputSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  calculation: calculationInputSchema,
});

export type CalculationInput = z.infer<typeof calculationInputSchema>;
