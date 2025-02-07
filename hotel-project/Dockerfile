FROM node AS build

WORKDIR /app/front

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "build"]

FROM nginx:latest

COPY --from=build /app/front/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]