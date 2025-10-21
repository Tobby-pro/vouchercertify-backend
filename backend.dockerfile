FROM node:20-slim

WORKDIR /app

# Install Chromium and Puppeteer dependencies
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    chromium \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libglib2.0-0 \
    libu2f-udev \
    libvulkan1 \
    openssl \
    && npm install -g dotenv-cli \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Let Puppeteer know where Chromium is inside Debian Slim
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the app
COPY . .

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && node index.js"]
