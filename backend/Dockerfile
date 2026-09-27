# Use official Node.js lightweight image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose Monolithic backend port
EXPOSE 5000

# Run Monolithic backend
CMD ["node", "app.js"]
