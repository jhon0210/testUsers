FROM node:22.11.0

WORKDIR /apirestPrueba
COPY package.json package-lock.json ./ 
RUN npm install

COPY . .
CMD ["npm", "start"]
