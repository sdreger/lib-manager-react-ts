# syntax=docker/dockerfile:1

FROM nginxinc/nginx-unprivileged:1.27-alpine3.21 AS base

FROM node:23.11.0-alpine3.21@sha256:86703151a18fcd06258e013073508c4afea8e19cd7ed451554221dd00aea83fc AS builder
LABEL org.opencontainers.image.source=https://gitea.dreger.lan/sdreger/lib-manager-react-ts

RUN set -x && apk add --no-cache gettext
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM base AS api-proxy

ENV API_URL=http://127.0.0.1:8070
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /usr/bin/envsubst /usr/local/bin/envsubst
COPY deploy/docker/nginx-proxy.conf.template /etc/nginx/conf.d/default.conf.template
EXPOSE 8080
CMD ["sh", "-c", "envsubst '${API_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

FROM base AS no-api-proxy

COPY --from=builder /app/dist /usr/share/nginx/html
COPY deploy/docker/nginx.conf.template /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
