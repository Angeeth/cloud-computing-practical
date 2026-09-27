# Use official Node.js lightweight image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose frontend port
EXPOSE 5173

# Start Vite dev server exposing to 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
