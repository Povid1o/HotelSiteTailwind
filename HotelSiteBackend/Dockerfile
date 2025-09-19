FROM node:18-alpine
WORKDIR /app

# только зависимости
COPY package*.json ./
RUN npm install --omit=dev

# исходники
COPY . .

# убедись, что твой app читает PORT и слушает его (process.env.PORT || 8000)
ENV NODE_ENV=production
ENV PORT=8000
EXPOSE 8000
CMD ["node", "index.js"]
