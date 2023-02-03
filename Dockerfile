FROM node:16 AS base
WORKDIR /app
COPY package.json yarn.lock .env tsconfig.json ./
RUN yarn
COPY . .
ENV NODE_PATH=./dist
RUN npx prisma generate
CMD node dist/index.js





