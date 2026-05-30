DO $$ BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'account'
      AND column_name = 'providerAccountId'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'account'
      AND column_name = 'provider_account_id'
  ) THEN
    ALTER TABLE "account" DROP CONSTRAINT IF EXISTS "account_provider_providerAccountId_pk";
    ALTER TABLE "account" RENAME COLUMN "providerAccountId" TO "provider_account_id";
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'account_provider_provider_account_id_pk'
  ) THEN
    ALTER TABLE "account"
      ADD CONSTRAINT "account_provider_provider_account_id_pk"
      PRIMARY KEY ("provider", "provider_account_id");
  END IF;
END $$;
