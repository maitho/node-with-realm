FROM node:12-alpine as base

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app

CMD ["npm","run","start:dev"]