#!/usr/bin/env -S just --justfile

_:
    @just --list

format-lock:
    pnpm prettier --write pnpm-lock.yaml

run-db:
    podman run \
        --name="todo-dev-db" \
        --rm \
        --replace \
        -e "POSTGRES_USER=devuser" \
        -e "POSTGRES_DB=devdb" \
        -e "POSTGRES_PASSWORD=devpassword" \
        -p '5432:5432/tcp' \
        -v "todo-postgres:/var/lib/postgresql/data" \
        "docker.io/postgres:16"

[positional-arguments]
@build target:
    if [ "$1" != "all" ]; then \
        buildah build --layers --target "$1"; \
    else \
        buildah build --layers; \
    fi

[working-directory('packages/api')]
init-db:
    direnv exec . prisma migrate dev --name "init"
    @just db-seed

[working-directory('packages/api')]
db-seed:
    direnv exec . ts-node prisma/seed.ts

[working-directory('packages/api')]
run-api-dev:
    direnv exec . pnpm run start:dev

[working-directory('packages/api')]
test-api:
    hurl --test --variable random_int_number=$(shuf -i 1-1000 -n 1) $(fd . -e hurl)
    pnpm run test

[working-directory('packages/ui')]
run-ui-dev:
    direnv exec . pnpm run dev

[working-directory('packages/ui')]
run-ui-steiger:
    pnpm exec steiger './src' --watch

run-devs:
    #!/bin/sh

    set -e
    sname="todo-dev"

    if tmux has -t "$sname" > /dev/null 2>&1; then
      tmux attach-session -t "$sname"
      exit 0
    fi

    tmux new-session -n "api" -s "$sname" -d bash
    tmux split-window -t "$sname:0" -v bash
    tmux send -t "$sname:0.0" "just run-db" C-m
    tmux send -t "$sname:0.1" "just run-api-dev" C-m
    tmux new-window -n "ui" -t "$sname:1" -d bash
    tmux split-window -t "$sname:1" -v bash
    tmux send-keys -t "$sname:1.0" 'just run-ui-dev' C-m
    tmux send -t "$sname:1.1" "just run-ui-steiger" C-m
    tmux select-window -t "$sname:0"
    tmux attach-session -t "$sname"
