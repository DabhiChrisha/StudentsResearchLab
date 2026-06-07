-- Widen authorization.password column from VARCHAR(20) to VARCHAR(255)
-- Required to store bcrypt hashes (~60 chars)
ALTER TABLE "authorization" ALTER COLUMN "password" TYPE VARCHAR(255);
