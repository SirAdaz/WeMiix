# =====================================================
# Dockerfile WeMiix Frontend — Next.js 16
# Build multi-stage : dev (hot-reload) + production
# =====================================================

# --- Étape base commune ---
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# --- Étape dépendances ---
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# --- Étape développement (hot-reload via volume mount) ---
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- Étape build production ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Étape runtime production (image légère) ---
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copier uniquement les artefacts nécessaires
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
