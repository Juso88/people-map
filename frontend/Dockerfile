FROM node:23-alpine

EXPOSE 80
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY public/ /app/public
COPY src/ /app/src
RUN npm run build
COPY dist/ /app/dist