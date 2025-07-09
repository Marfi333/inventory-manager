FROM node:20-slim AS builder

RUN npm install -g pnpm

WORKDIR /build
COPY . /build

RUN pnpm install --frozen-lockfile && \
    pnpm run build:api

FROM builder AS api

WORKDIR /app

COPY --from=builder /build/api /app/api
COPY --from=builder /build/api/node_modules /app/api/node_modules
COPY --from=builder /build/node_modules /app/node_modules
COPY --from=builder /build/package.json /app/package.json
COPY --from=builder /build/pnpm-workspace.yaml /app/pnpm-workspace.yaml

WORKDIR /app/api

CMD ["pnpm", "run", "start:tsc"]