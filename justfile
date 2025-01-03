#!/usr/bin/env -S just --justfile

format:
  pnpm eslint --fix .
  pnpm prettier --write .

format-lock:
  pnpm prettier --write pnpm-lock.yaml

run-db:
  podman run \
    --name="todo-dev-db" \
    --rm \
    --replace \
    -e "POSTGRES_USER=devuser" \
    -e "POSTGRES_PASSWORD=devpasswrod" \
    -p '5432:5432/tcp' \
    -v "todo-postgres:/var/lib/postgresql/data" \
    "docker.io/postgres:16"

[working-directory: 'packages/api']
run-api-dev:
  direnv exec . pnpm run start:dev

[working-directory: 'packages/api']
db-seed:
  direnv exec . ts-node prisma/seed.ts
