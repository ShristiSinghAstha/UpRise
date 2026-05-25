# ==========================================
# Phase 1: Base & Dependencies
# ==========================================
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ==========================================
# Phase 2: Development Environment
# ==========================================
FROM base AS development
RUN npm install --prefer-offline --retry=3
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# ==========================================
# Phase 3: Production Build
# ==========================================
FROM base AS builder
RUN npm install --prefer-offline --retry=3
COPY . .
# Set API URL to empty string so Nginx proxies /api to backend
ENV VITE_API_URL=""
RUN npm run build

# ==========================================
# Phase 4: Production Serve with Nginx
# ==========================================
FROM nginx:alpine AS production
# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy SPA fallback Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
