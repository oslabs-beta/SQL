FROM node:18.19-slim

WORKDIR /app

# Copy package files from project root
COPY package*.json ./

RUN npm install

# Copy source code into src directory
COPY src/ ./src/

EXPOSE 3000

CMD ["npm", "run", "dev"]