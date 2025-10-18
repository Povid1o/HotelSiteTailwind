# ---------- build ----------
FROM node:18-alpine AS build
WORKDIR /app

# ставим зависимости (работает и с/без package-lock.json)
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm i --package-lock-only && npm ci; fi

# исходники
COPY . .

# URL API прилетает на этапе сборки
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# сборка
RUN npm run build

# ---------- serve ----------
FROM nginx:alpine

# SPA fallback: любые пути -> /index.html
RUN sed -i 's|try_files \$uri \$uri/ =404;|try_files \$uri \$uri/ /index.html;|' /etc/nginx/conf.d/default.conf

# собранные файлы
COPY --from=build /app/build/ /usr/share/nginx/html/

EXPOSE 80

CMD ["npm", "start"]
