FROM node:14

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

CMD if [ "$NODE_ENV" = "prod" ]; then \
  npm run start:prod; \
  else \
  npm run start:dev; \
  fi