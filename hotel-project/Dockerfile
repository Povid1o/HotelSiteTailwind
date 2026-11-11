
# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

COPY . .

ARG REACT_APP_API_URL= 
ENV REACT_APP_API_URL=$REACT_APP_API_URL
# Номер счётчика Яндекс Метрики; пусто — аналитика выключена
ARG REACT_APP_YM_ID=
ENV REACT_APP_YM_ID=$REACT_APP_YM_ID
ENV GENERATE_SOURCEMAP=false
RUN npm run build

# ---------- serve ----------
FROM nginx:alpine

# Подкладываем СВОЙ конфиг вместо default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/security-headers.conf

# Готовая сборка
COPY --from=build /app/build/ /usr/share/nginx/html/

EXPOSE 80
