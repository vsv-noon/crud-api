# CRUD API

This project implements a minimal CRUD API for `/api/users` using Node.js (native http) and TypeScript.

## How to run
1. Copy `.env.example` to `.env` and set `PORT` if required.
2. Install deps: `npm install`
3. Dev: `npm run start:dev` (uses ts-node-dev)
4. Prod: `npm run start:prod`
5. Test: `npm run test`

## Features
- GET `/api/users` — returns all users (200)
- POST `/api/users` — create user (201). Required fields in JSON body: `username` (string), `age` (number), `hobbies` (string[])
- GET `/api/users/:id` — get user by id (200). Returns 400 if id is not UUID, 404 if not found.
- PUT `/api/users/:id` — update user (200). Validates id and body.
- DELETE `/api/users/:id` — delete user (204).


Users are stored as objects that have following properties:
```JSON
{
  "username": "Alice",
  "age": 25,
  "hobbies": ["reading", "music"]
}
```