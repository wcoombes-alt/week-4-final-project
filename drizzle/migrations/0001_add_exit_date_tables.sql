CREATE TABLE IF NOT EXISTS "calculation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"housing" integer DEFAULT 0 NOT NULL,
	"transportation" integer DEFAULT 0 NOT NULL,
	"food" integer DEFAULT 0 NOT NULL,
	"insurance" integer DEFAULT 0 NOT NULL,
	"shopping" integer DEFAULT 0 NOT NULL,
	"giving" integer DEFAULT 0 NOT NULL,
	"future_you" integer DEFAULT 0 NOT NULL,
	"family" integer DEFAULT 0 NOT NULL,
	"subscriptions" integer DEFAULT 0 NOT NULL,
	"growth" integer DEFAULT 0 NOT NULL,
	"debt" integer DEFAULT 0 NOT NULL,
	"other" integer DEFAULT 0 NOT NULL,
	"total_current" integer DEFAULT 0 NOT NULL,
	"dream_floor" integer DEFAULT 0 NOT NULL,
	"runway_months" integer DEFAULT 3 NOT NULL,
	"monthly_savings" integer DEFAULT 0 NOT NULL,
	"target_savings_goal" integer DEFAULT 0 NOT NULL,
	"projected_exit_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lead" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"calculation_id" uuid,
	"user_id" text,
	"captured_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calculation" ADD CONSTRAINT "calculation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lead" ADD CONSTRAINT "lead_calculation_id_calculation_id_fk" FOREIGN KEY ("calculation_id") REFERENCES "public"."calculation"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lead" ADD CONSTRAINT "lead_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
