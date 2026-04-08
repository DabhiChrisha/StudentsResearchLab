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

EXPOSE 8000

# Run with Node.js
CMD ["npm", "start"]
