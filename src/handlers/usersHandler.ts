import { IncomingMessage, ServerResponse } from 'http';
import { sendJSON } from '../utils';
import { db } from '../db';
import { validateUserId } from '../validators';

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

    

    if (method === 'POST') {
      return sendJSON(res, 404, { message: 'Not Found' });
    }

    return sendJSON(res, 404, { message: 'Not Found' });
  } catch (err) {
    console.error('Unhandled usersHandler error', err);
    return sendJSON(res, 500, { message: 'Internal Server Error' });
  }
};
