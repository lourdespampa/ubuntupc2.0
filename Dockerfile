FROM node:latest

WORKDIR /ubuntupc2.0

COPY package*.json ./

RUN npm install --production

COPY . .

ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "start"]
