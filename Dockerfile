# # DEPLOY
# Builder Container
FROM node:14.17.6-alpine3.13 as builder
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Main Container
FROM node:14.17.6-alpine3.13
WORKDIR /usr/app

COPY --from=builder /usr/app/build .
COPY .env .
# COPY package*.json ./

RUN npm install --production
EXPOSE 3434
CMD node server.js


# # DEVELOPMENT
# FROM node:14.17.6-alpine3.13
# WORKDIR /usr/app
# COPY package*.json ./
# RUN npm install
# COPY . .

# # COPY .env .
# EXPOSE 3001

# RUN npm run dev
