FROM node:24.2.0-slim AS builder

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm install -g pnpm

WORKDIR /build

COPY . .

RUN pnpm install --frozen-lockfile && \
    pnpm run build:ui

FROM nginx:alpine

COPY --from=builder /build/ui/dist /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"] 