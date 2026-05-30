CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "calculation" (
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
CREATE TABLE "lead" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"calculation_id" uuid,
	"user_id" text,
	"captured_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculation" ADD CONSTRAINT "calculation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead" ADD CONSTRAINT "lead_calculation_id_calculation_id_fk" FOREIGN KEY ("calculation_id") REFERENCES "public"."calculation"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead" ADD CONSTRAINT "lead_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;