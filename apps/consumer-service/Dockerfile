# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (cached layer)
COPY package*.json ./
RUN npm install

COPY . .


# Build only consumer-service
RUN npm run build consumer-service


# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled output
COPY --from=builder /app/dist ./dist

# No EXPOSE (it's a background worker)

# Start consumer
CMD ["node", "dist/apps/consumer-service/main.js"]