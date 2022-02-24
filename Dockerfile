# syntax=docker/dockerfile:1
FROM node:16-alpine AS node-builder
WORKDIR /src/
COPY ./frontend/ /src/
RUN yarn install --immutable --immutable-cache --check-cache --network-timeout=1000000
RUN yarn run build

FROM golang:1.17 AS go-builder
WORKDIR /src/
COPY . /src/
COPY --from=node-builder /src/build ./frontend/build
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags '-s -w -extldflags=-static' -o ./bookmarkmanager .

FROM alpine:latest as runner
EXPOSE 8000
ENV DB_PATH=/data/database.sqlite
ENV MODE=RELEASE
ENV PORT=8000
ENV TRUSTED_PROXIES=0.0.0.0
ENV REGISTRATIONS_ENABLED=true
WORKDIR /app
COPY --from=go-builder /src/bookmarkmanager ./
CMD ["./bookmarkmanager"]
