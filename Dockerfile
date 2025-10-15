# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application source
COPY . .

# Expose application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
