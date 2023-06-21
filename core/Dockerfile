FROM node:18

WORKDIR /better-buys

COPY ./package.json /better-buys/

RUN npm install

COPY . /better-buys/

CMD ["npm", "run", "start:dev"]

