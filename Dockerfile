FROM node:16 as development

WORKDIR /server
COPY package*.json ./

RUN npm install

COPY .. .

CMD ["npm", "run", "start:dev"]