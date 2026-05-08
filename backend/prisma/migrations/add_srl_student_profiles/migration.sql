-- Migration: add_srl_student_profiles
-- Creates a dedicated, normalized table for SRL student extended profile data.
-- Previously this data was crammed as a JSON blob into member_cv_profiles.projects.
-- SAFE: only adds a new table. Zero existing tables, columns, or constraints are modified.

CREATE TABLE IF NOT EXISTS "srl_student_profiles" (
    "id"                    SERIAL          NOT NULL,
    "enrollment_no"         VARCHAR(20)     NOT NULL,
    "linkedin"              TEXT,
    "roles"                 TEXT[]          NOT NULL DEFAULT ARRAY[]::TEXT[],
    "reflection"            TEXT,
    "research_areas"        TEXT[]          NOT NULL DEFAULT ARRAY[]::TEXT[],
    "ongoing_research"      JSONB           NOT NULL DEFAULT '[]',
    "research_works"        JSONB           NOT NULL DEFAULT '[]',
    "achievements"          JSONB           NOT NULL DEFAULT '[]',
    "papers_published"      JSONB           NOT NULL DEFAULT '[]',
    "hackathons"            JSONB           NOT NULL DEFAULT '[]',
    "srl_publications"      JSONB           NOT NULL DEFAULT '[]',
    "achievements_extended" JSONB,
    "metadata"              JSONB,
    "is_active"             BOOLEAN         NOT NULL DEFAULT true,
    "deleted_at"            TIMESTAMPTZ(6),
    "created_by"            VARCHAR(150),
    "updated_by"            VARCHAR(150),
    "created_at"            TIMESTAMPTZ(6)  NOT NULL DEFAULT NOW(),
    "updated_at"            TIMESTAMPTZ(6)  NOT NULL DEFAULT NOW(),
    CONSTRAINT "srl_student_profiles_pkey" PRIMARY KEY ("id")
);

-- Unique constraint on enrollment_no (one profile per student)
CREATE UNIQUE INDEX IF NOT EXISTS "srl_student_profiles_enrollment_no_key"
    ON "srl_student_profiles"("enrollment_no");

-- Index for fast lookups by enrollment
CREATE INDEX IF NOT EXISTS "idx_ssp_enrollment"
    ON "srl_student_profiles"("enrollment_no");

-- Index to quickly filter active profiles (soft-delete support)
CREATE INDEX IF NOT EXISTS "idx_ssp_is_active"
    ON "srl_student_profiles"("is_active");

-- FK to students_details (cascade so orphan profiles can't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'srl_student_profiles_enrollment_no_fkey'
    ) THEN
        ALTER TABLE "srl_student_profiles"
            ADD CONSTRAINT "srl_student_profiles_enrollment_no_fkey"
            FOREIGN KEY ("enrollment_no")
            REFERENCES "students_details"("enrollment_no")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
