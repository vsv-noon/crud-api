import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer, Server } from 'http';
import { router } from '../router';
import type { AddressInfo } from 'net';

const PORT = 0;
let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = createServer((req, res) => router(req, res));
  await new Promise<void>((resolve) => {
    server.listen(PORT, () => {
      const address = server.address() as AddressInfo;
      baseUrl = `http://localhost:${address.port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

const fetchJSON = async (url: string, options: any = {}) => {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const body = res.status === 204 ? null : await res.json().catch(() => null);
  return { status: res.status, body };
};

describe('API CRUD tests', () => {
  let createdId: string;

  it('GET /api/users should return empty array', async () => {
    const res = await fetchJSON(`${baseUrl}/api/users`, { method: 'GET' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('POST /api/users should create new user', async () => {
    const user = { username: 'John', age: 30, hobbies: ['reading'] };
    const res = await fetchJSON(`${baseUrl}/api/users`, {
      method: 'POST',
      body: JSON.stringify(user),
    });
    expect(res.status).toBe(201);
    expect(res.body.username).toBe('John');
    expect(res.body.age).toBe(30);
    expect(Array.isArray(res.body.hobbies)).toBe(true);
    createdId = res.body.id;
  });

  it('GET /api/users/{id} should return created user', async () => {
    const res = await fetchJSON(`${baseUrl}/api/users/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdId);
    expect(res.body.username).toBe('John');
  });

  it('PUT /api/users/{id} should update user', async () => {
    const res = await fetchJSON(`${baseUrl}/api/users/${createdId}`, {
      method: 'PUT',
      body: JSON.stringify({
        username: 'Johnny',
        age: 31,
        hobbies: ['coding'],
      }),
    });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('Johnny');
  });

  it('DELETE /api/users/{id} should delete user', async () => {
    const res = await fetchJSON(`${baseUrl}/api/users/${createdId}`, {
      method: 'DELETE',
    });
    expect(res.status).toBe(204);
  });

  it('GET deleted user should return 404', async () => {
    const res = await fetchJSON(`${baseUrl}/api/users/${createdId}`);
    expect(res.status).toBe(404);
  });
});
