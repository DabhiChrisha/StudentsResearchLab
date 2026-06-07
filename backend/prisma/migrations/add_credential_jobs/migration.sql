-- Create credential_jobs table for delayed credential email delivery
CREATE TABLE "credential_jobs" (
  "id"             BIGSERIAL PRIMARY KEY,
  "email"          VARCHAR(150) NOT NULL,
  "enrollment_no"  VARCHAR(20)  NOT NULL,
  "student_name"   VARCHAR(150) NOT NULL,
  "scheduled_for"  TIMESTAMPTZ  NOT NULL,
  "status"         VARCHAR(10)  NOT NULL DEFAULT 'pending',
  "created_at"     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_credential_jobs_status_scheduled"
  ON "credential_jobs" ("status", "scheduled_for");
