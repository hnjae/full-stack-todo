# Use non-slim node image for OpenSSL support
FROM docker.io/library/node:20 AS node
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM node AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/api/package.json ./packages/api/package.json
COPY packages/ui/package.json ./packages/ui/package.json
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run --recursive build && \
  pnpm deploy --filter=api --prod /prod/api && \
  pnpm deploy --filter=ui --prod /prod/ui

FROM node AS api
ENV NODE_ENV=production
WORKDIR /prod/api
COPY --from=build /prod/api /prod/api
RUN pnpm exec prisma generate
EXPOSE 80
CMD ["pnpm", "start:prod"]

FROM docker.io/library/nginx:1.28 AS ui
COPY --from=build /prod/ui/dist /usr/share/nginx/html
EXPOSE 80
