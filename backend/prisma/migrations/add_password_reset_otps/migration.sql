-- Create password_reset_otps table for OTP-based password reset flow
CREATE TABLE IF NOT EXISTS "password_reset_otps" (
  "id"         BIGSERIAL PRIMARY KEY,
  "email"      VARCHAR(150) NOT NULL,
  "otp_hash"   VARCHAR(255) NOT NULL,
  "expires_at" TIMESTAMPTZ  NOT NULL,
  "used"       BOOLEAN      NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_prot_email" ON "password_reset_otps" ("email");
