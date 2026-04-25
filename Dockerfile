# syntax=docker/dockerfile:1

# ── Frontend Dockerfile (Multi-stage: Node build → Nginx serve) ──

# Stage 1: Build the React + Vite application
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm ci --ignore-scripts

# Copy source code
COPY frontend/ .

# Accept Supabase env vars as build args (baked into the static bundle)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
# Empty API base = relative URLs, so Nginx proxies /api/ to backend
ARG VITE_API_BASE_URL=""

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build production bundle
RUN npm run build

# ─────────────────────────────────────────────

# Stage 2: Serve with Nginx
FROM nginx:alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config as a TEMPLATE (envsubst will fill in $BACKEND_URL at runtime)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy built assets from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Run envsubst to inject env vars, then start nginx
CMD ["/bin/sh", "-c", "envsubst '$BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
