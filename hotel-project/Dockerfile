# ---------- build ----------
FROM node:18-alpine AS build
WORKDIR /app

# Копируем манифесты (любые lock, если есть)
COPY package.json ./
COPY package-lock.json* ./

# Установка зависимостей:
# - если package-lock.json есть → npm ci
# - если нет → создаём lock и затем npm ci (быстро и детерминированно)
RUN if [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm i --package-lock-only && npm ci; \
    fi

# Копируем исходники и билдим
COPY . .

# REACT_APP_* переменная попадёт в билд CRA
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
RUN npm run build

# ---------- serve ----------
FROM nginx:alpine

# SPA: любые 404 пробрасываем на index.html
# (правим дефолтный конфиг nginx корректно и без обрезаний)
RUN sed -i 's|try_files \$uri \$uri/ =404;|try_files \$uri \$uri/ /index.html;|' /etc/nginx/conf.d/default.conf

# Кладём собранный фронт
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

