FROM node

WORKDIR /app/back

COPY . .

RUN npm install nodemon

RUN npm install

ENTRYPOINT [ "npm", "run", "dev" ]