# ---------- build ----------
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
#COPY scripts ./scripts
RUN npm ci


COPY . .

# берём API URL во время сборки через ARG → ENV, CRA подхватит REACT_APP_*
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# ---------- serve ----------
FROM nginx:alpine
# SPA: все маршруты на index.html
RUN sed -i 's/try_files $uri $uri\/ =404;/try_files $uri $uri\/ \/index.html;/'>
COPY --from=build /app/build/ /usr/share/nginx/html/
EXPOSE 80
