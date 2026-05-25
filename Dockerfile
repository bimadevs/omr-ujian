FROM node:20-alpine
RUN apk add --no-cache libc6-compat vips-dev python3 make g++ gcc sqlite-dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3323
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
