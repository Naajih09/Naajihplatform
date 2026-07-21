# ---- Build Stage ----
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate

WORKDIR /app

# Copy root workspace config
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/tailwind-config/package.json ./packages/tailwind-config/

# Install dependencies (root + api only)
RUN pnpm install --frozen-lockfile --filter api

# Copy source
COPY apps/api ./apps/api
COPY packages/typescript-config ./packages/typescript-config

# Generate Prisma client and build
WORKDIR /app/apps/api
RUN pnpm prisma generate
RUN pnpm build

# ---- Production Stage ----
FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@10.26.0 --activate

WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/apps/api/prisma ./prisma

# Regenerate Prisma client for production
RUN npx prisma generate

EXPOSE 3000

# Health check every 30s
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "dist/main.js"]
