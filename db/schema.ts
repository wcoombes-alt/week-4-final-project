import type { AdapterAccountType } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compositePk: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const calculations = pgTable("calculation", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  housing: integer("housing").notNull().default(0),
  transportation: integer("transportation").notNull().default(0),
  food: integer("food").notNull().default(0),
  insurance: integer("insurance").notNull().default(0),
  shopping: integer("shopping").notNull().default(0),
  giving: integer("giving").notNull().default(0),
  futureYou: integer("future_you").notNull().default(0),
  family: integer("family").notNull().default(0),
  subscriptions: integer("subscriptions").notNull().default(0),
  growth: integer("growth").notNull().default(0),
  debt: integer("debt").notNull().default(0),
  other: integer("other").notNull().default(0),
  totalCurrent: integer("total_current").notNull().default(0),
  dreamFloor: integer("dream_floor").notNull().default(0),
  runwayMonths: integer("runway_months").notNull().default(3),
  monthlySavings: integer("monthly_savings").notNull().default(0),
  targetSavingsGoal: integer("target_savings_goal").notNull().default(0),
  projectedExitDate: timestamp("projected_exit_date", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const leads = pgTable("lead", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  calculationId: uuid("calculation_id").references(() => calculations.id, {
    onDelete: "set null",
  }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  capturedAt: timestamp("captured_at", { mode: "date" }).notNull().defaultNow(),
});

export const calculationsRelations = relations(calculations, ({ one, many }) => ({
  user: one(users, {
    fields: [calculations.userId],
    references: [users.id],
  }),
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  calculation: one(calculations, {
    fields: [leads.calculationId],
    references: [calculations.id],
  }),
  user: one(users, {
    fields: [leads.userId],
    references: [users.id],
  }),
}));
