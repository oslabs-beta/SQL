FROM node:22 AS builder

WORKDIR /app

# Copy package files from project root
COPY package*.json ./

RUN npm install

# Copy source code into src directory
COPY src/ ./src/

EXPOSE 5173

CMD ["npm", "run", "dev"]
