# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install only what's needed first (better caching)
COPY package*.json ./
RUN npm install

# Copy only required files (not entire repo blindly)
COPY tsconfig*.json ./
COPY apps/api-gateway ./apps/api-gateway
COPY libs ./libs

# Build only api-gateway
RUN npm run build api-gateway


# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy only compiled output
COPY --from=builder /app/dist ./dist

# App port
EXPOSE 3000

# Run app
CMD ["node", "dist/apps/api-gateway/main.js"]