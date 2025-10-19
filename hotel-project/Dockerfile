
# ---------- build ----------
FROM node:18-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm i --package-lock-only && npm ci; fi

COPY . .

ARG REACT_APP_API_URL=
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# ---------- serve ----------
FROM nginx:alpine

# Подкладываем СВОЙ конфиг вместо default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Готовая сборка
COPY --from=build /app/build/ /usr/share/nginx/html/

EXPOSE 80
