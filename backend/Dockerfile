# syntax=docker/dockerfile:1

# ── Backend Dockerfile (Node.js + Express) ──

FROM node:20-alpine AS production

WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --ignore-scripts

# Copy all application code
COPY . .

# Prisma client must be generated after the schema is copied because
# npm install scripts are intentionally skipped above.
# A dummy DATABASE_URL is required because prisma.config.ts (Prisma v7)
# reads the env var at generate time. The real URL is injected at runtime.
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

EXPOSE 8000

# Run with Node.js
CMD ["npm", "start"]
