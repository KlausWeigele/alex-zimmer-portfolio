# Multi-Stage Dockerfile für Alex Zimmer Portfolio
# Optimized für Hetzner Cloud Deployment mit German/EU compliance

# ---------- Base Image ----------
FROM node:20-alpine AS base
# Enable pnpm (Klaus Weigele Standards)
RUN corepack enable pnpm
# Set German timezone für consistent logging
RUN apk add --no-cache tzdata && \
    ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime && \
    echo "Europe/Berlin" > /etc/timezone

# ---------- Dependencies ----------
FROM base AS deps
WORKDIR /app

# Copy package files (pnpm preferred)
COPY package.json pnpm-lock.yaml* ./
COPY .npmrc* ./

# Install dependencies mit pnpm (faster + more reliable)
RUN pnpm install --frozen-lockfile --prefer-offline

# ---------- Builder ----------
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV TZ=Europe/Berlin

# Build the application mit pnpm
RUN pnpm build

# ---------- Runner (Production) ----------
FROM base AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV TZ=Europe/Berlin

# Create non-root user for security (ChatGPT's approach)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from builder stage
COPY --from=builder /app/public ./public

# Copy Next.js standalone build (thanks to output: 'standalone')
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Install wget für healthcheck (Alpine minimal)
RUN apk add --no-cache wget

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check für Docker + Load Balancer monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/healthz || exit 1

# Start the application
CMD ["node", "server.js"]

# ---------- Development Stage (Optional) ----------
FROM base AS development
WORKDIR /app

# Install all dependencies (including dev dependencies)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Copy source code
COPY . .

# Set development environment
ENV NODE_ENV=development
ENV TZ=Europe/Berlin

# Expose port für dev server
EXPOSE 3000

# Start development server
CMD ["pnpm", "dev"]