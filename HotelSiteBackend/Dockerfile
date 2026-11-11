FROM node:22-alpine
WORKDIR /app

# только зависимости
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# исходники
COPY . .
RUN mkdir -p /app/static && chown -R node:node /app
USER node

# убедись, что твой app читает PORT и слушает его (process.env.PORT || 8000)
ENV NODE_ENV=production
ENV PORT=8000
# Leave room for native buffers inside the container memory limit.
ENV NODE_OPTIONS="--max-old-space-size=512"
EXPOSE 8000
CMD ["node", "index.js"]
