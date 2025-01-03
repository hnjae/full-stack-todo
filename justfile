#!/usr/bin/env -S just --justfile

format:
  pnpm eslint --fix .
  pnpm prettier --write .

format-lock:
  pnpm prettier --write pnpm-lock.yaml
