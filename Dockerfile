# Stage 1: Build Frontend React static bundle
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Final Monolithic Container
FROM node:20-alpine
WORKDIR /app

# Copy backend dependencies & install
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend source code & built frontend production bundle
COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose single monolithic port
EXPOSE 5000

WORKDIR /app/backend

# Run single monolithic application
CMD ["node", "app.js"]
