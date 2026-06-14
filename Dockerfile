FROM node:19-alpine

WORKDIR /app

COPY . .

RUN npm i

ARG SERVER_PORT

EXPOSE ${SERVER_PORT}

CMD ["npm", "run", "start:dev"]
