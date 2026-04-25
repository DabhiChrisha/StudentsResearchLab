# syntax=docker/dockerfile:1

# ── Backend Dockerfile (Node.js + Express) ──

FROM node:20-alpine AS production

WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package.json package-lock.json ./

# Copy all application code first (needed so prisma schema is present during install)
COPY . .

# Install dependencies - postinstall will run `prisma generate` automatically
# DATABASE_URL dummy value is required because prisma.config.ts reads it at generate time
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm ci

EXPOSE 8000

# Run with Node.js
CMD ["npm", "start"]
