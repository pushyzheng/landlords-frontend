FROM node:8.0.0

WORKDIR /app

COPY build /app/
COPY config /app/
COPY src /app/
COPY static /app/
COPY index.html /app
COPY package.json /app

RUN npm install

EXPOSE 9000
