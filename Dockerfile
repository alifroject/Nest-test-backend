FROM node:20-alpine

WORKDIR /app

# Copy package files & install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all source codes
COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/src/main.js"]