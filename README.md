# CRUD API

This project implements a minimal CRUD API for `/api/users` using Node.js (native http) and TypeScript.

## How to run
1. Copy `.env.example` to `.env` and set `PORT` if required.
2. Install deps: `npm install`
3. Dev: `npm run start:dev` (uses ts-node-dev)
4. Prod: `npm run start:prod`

## Features
- GET `/api/users` — returns all users (200)