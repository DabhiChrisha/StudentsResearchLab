-- Remove the obsolete JoinUs.branch column from the join_us table.
DO $$ BEGIN
  IF to_regclass('join_us') IS NOT NULL THEN
    ALTER TABLE join_us DROP COLUMN IF EXISTS branch;
  END IF;
END $$;
