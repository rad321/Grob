FROM node:lts-stretch-slim
WORKDIR /usr/src/app
COPY . .
COPY package.json .
RUN npm install
RUN npm install -g typescript
RUN npm install -g ts-node
CMD ["npm", "start"]
