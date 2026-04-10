-- Remove RLS policies from member_cv_profiles table if it exists
DO $$ BEGIN
  IF to_regclass('member_cv_profiles') IS NOT NULL THEN
    ALTER TABLE member_cv_profiles DISABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Add is_admin column to students_details table if it doesn't exist
DO $$ BEGIN
  IF to_regclass('students_details') IS NOT NULL THEN
    ALTER TABLE students_details ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
    ALTER TABLE students_details ALTER COLUMN department DROP NOT NULL;
  END IF;
END $$;
