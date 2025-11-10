import { IncomingMessage, ServerResponse } from 'http';
import { db } from '../db';
import { sendJSON, parseJsonBody } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { validateUserPayload, validateUserId } from '../validators';

const pathIdRegex = /^\/api\/users\/([^\/]+)\/?$/;

export const usersHandler = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const { method, url } = req;
    if (!url) return sendJSON(res, 404, { message: 'Not Found' });

    if (method === 'GET' && url === '/api/users') {
      const all = await db.getAll();
      return sendJSON(res, 200, all);
    }

    const match = url.match(pathIdRegex);
    if (!match) {
      return sendJSON(res, 404, { message: 'Not Found' });
    }

    const userId = match[1];

    const idValidation = validateUserId(userId);
    if (!idValidation.valid)
      return sendJSON(res, 400, { message: idValidation.message });

    if (method === 'GET') {
      const user = await db.getById(userId);
      if (!user)
        return sendJSON(res, 404, {
          message: `User with id ${userId} not found`,
        });
      return sendJSON(res, 200, user);
    }

    if (method === 'DELETE') {
      const existed = await db.delete(userId);
      if (!existed)
        return sendJSON(res, 404, {
          message: `User with id ${userId} not found`,
        });

      res.writeHead(204);
      return res.end();
    }

    if (method === 'POST') {
      return sendJSON(res, 404, { message: 'Not Found' });
    }

    if (method === 'PUT') {
      const body = await parseJsonBody(req).catch((err) => {
        throw { status: 400, message: 'Invalid JSON body' };
      });

      const validation = validateUserPayload(body);
      if (!validation.valid)
        return sendJSON(res, 400, { message: validation.message });

      const existing = await db.getById(userId);
      if (!existing)
        return sendJSON(res, 404, {
          message: `User with id ${userId} not found`,
        });

      const updated = await db.update(userId, {
        username: body.username,
        age: body.age,
        hobbies: body.hobbies,
      });

      return sendJSON(res, 200, updated);
    }

    return sendJSON(res, 404, { message: 'Not Found' });
  } catch (err: any) {
    if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
      return sendJSON(res, err.status, { message: err.message });
    }
    console.error('Unhandled usersHandler error', err);
    return sendJSON(res, 500, { message: 'Internal Server Error' });
  }
};
