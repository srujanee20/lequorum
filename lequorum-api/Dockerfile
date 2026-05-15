FROM node:20-alpine

LABEL org.opencontainers.image.authors="Srujanee Nayak"
LABEL org.opencontainers.image.version="1.0.1"
LABEL org.opencontainers.image.description="Lequorum API Backend"

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev
COPY . .

ENV NODE_ENV=production

CMD ["npm", "start"]
