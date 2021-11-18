FROM node:alpine
WORKDIR /app
COPY package*.json /app/
COPY .env /app/
COPY . .
RUN npm install --production
RUN npm install -g @adonisjs/cli
RUN npm install @adonisjs/ace@5.1.0 --save
RUN node ace build
ENV HOST=0.0.0.0
ENV PORT=80
ENV NODE_ENV=production
ENV APP_URL=http://${HOST}:${PORT}
ENV CACHE_VIEWS=false
ENV APP_KEY=
ENV DB_CONNECTION=pg
ENV PG_DB_NAME=
ENV DB_HOST=
ENV DB_PORT=5432
ENV DB_USER=
ENV DB_PASSWORD=
ENV DB_DATABASE=
ENV SERVER_URL=
EXPOSE 80
CMD [ "node", "ace", "serve" ]