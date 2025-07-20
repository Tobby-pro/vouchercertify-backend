FROM node:20-slim

WORKDIR /app

# Install dependencies and global tools
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y openssl && \
    npm install -g dotenv-cli && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the app
COPY . .

EXPOSE 4000

# JSON format CMD for better signal handling
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && node index.js"]
