-- Create guideline table for admin-managed yearly Guidelines PDFs
CREATE TABLE "guideline" (
  "id"           SERIAL PRIMARY KEY,
  "year"         INTEGER      NOT NULL UNIQUE,
  "pdf_url"      TEXT         NOT NULL,
  "public_id"    TEXT         NOT NULL,
  "uploaded_at"  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "created_at"   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updated_at"   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
