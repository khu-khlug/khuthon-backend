FROM node:iron-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:prod" ]