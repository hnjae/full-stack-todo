#!/usr/bin/env -S just --justfile

format:
  pnpm eslint --fix .
  pnpm prettier --write .
