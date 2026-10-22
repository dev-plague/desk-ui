# syntax=docker/dockerfile:1

# Imagen de despliegue del sitio y del registry para Dokploy (o cualquier host
# Docker). El build genera el registry en apps/docs/public/r y el sitio en
# apps/docs/dist; nginx sirve ambos en el puerto 80.
FROM node:22-bookworm-slim AS build

ENV CI=true

RUN corepack enable && corepack prepare pnpm@10.34.7 --activate

WORKDIR /app

# Instala primero solo los manifiestos para aprovechar la caché de capas.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/docs/package.json apps/docs/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/cli/package.json packages/cli/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build:site \
  && test -f apps/docs/dist/index.html \
  && test -f apps/docs/dist/r/registry.json

FROM nginx:1.27-alpine AS runtime

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/docs/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
