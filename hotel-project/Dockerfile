# ---------- build ----------
FROM node:18-alpine AS build
WORKDIR /app

# ставим зависимости (работает и с/без package-lock.json)
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm i --package-lock-only && npm ci; fi

# исходники
COPY . .

# URL API прилетает на этапе сборки
# Оставляем пустым - пути в API уже содержат 'api/...'
ARG REACT_APP_API_URL=
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# сборка
RUN npm run build

# ---------- serve ----------
FROM nginx:alpine

# Копируем кастомный nginx конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# собранные файлы
COPY --from=build /app/build/ /usr/share/nginx/html/

EXPOSE 80
