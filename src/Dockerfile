FROM node:22 AS builder

WORKDIR /app

# Copy package files from project root
COPY package*.json ./
COPY vite.config.ts ./  
COPY tsconfig.json ./   

RUN npm install

# Copy source code into src directory
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]