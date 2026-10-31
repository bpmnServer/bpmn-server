FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run config && npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
