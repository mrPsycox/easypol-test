FROM node:12.17.0-alpine

WORKDIR /usr

COPY package.json ./

COPY tsconfig.json ./

COPY src ./src

COPY .env ./

RUN ls -a

RUN npm install

RUN npm run build

CMD ["npm","start"]
