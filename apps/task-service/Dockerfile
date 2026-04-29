# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps (cached layer)
COPY package*.json ./
RUN npm install

COPY . .


# Build only task-service
RUN npm run build task-service


# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app

# Only production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Expose port (change if your service uses different port)
EXPOSE 3002

# Run service
CMD ["node", "dist/apps/task-service/main.js"]