# Базовый контейнер для dev-режима CRA
FROM node:18-alpine

WORKDIR /app

# 1) Ставим зависимости «условно», чтобы не падать, если lock-файла нет
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm i --package-lock-only && npm ci; \
    fi

# 2) Копируем исходники
COPY . .

# 3) CRA dev-сервер на 0.0.0.0:80 (без прод-сборки)
ENV HOST=0.0.0.0
ENV PORT=80
# CRA читает REACT_APP_* при старте dev-сервера → прокинем на этапе запуска в compose
ENV CI=false
ENV CHOKIDAR_USEPOLLING=true
ENV WDS_SOCKET_PORT=0

EXPOSE 80
CMD ["npm", "start"]


