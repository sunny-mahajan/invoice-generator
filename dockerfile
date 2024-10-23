# Use an official Node.js runtime as a parent image
FROM node:18-bullseye-slim

# Install necessary dependencies for Puppeteer and Chromium
RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxshmfence1 \
    libnss3-dev \
    lsb-release \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Install Puppeteer with Chromium
RUN npm install puppeteer

# Expose the port Next.js will run on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]
