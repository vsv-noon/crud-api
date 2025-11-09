import { IncomingMessage, ServerResponse } from 'http';
import { sendJSON, parseJsonBody } from '../utils';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { validateUserPayload } from '../validators';

export const rootHandler = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const { method, url } = req;
    if (!url) return sendJSON(res, 404, { message: 'Not Found' });

    if (method === 'POST' && url === '/api/users') {
      const body = await parseJsonBody(req).catch(() => {
        throw { status: 400, message: 'Invalid JSON body' };
      });
      const validation = validateUserPayload(body);
      if (!validation.valid)
        return sendJSON(res, 400, { message: validation.message });

      const newUser = {
        id: uuidv4(),
        username: body.username,
        age: body.age,
        hobbies: body.hobbies,
      };

      const created = await db.create(newUser);
      return sendJSON(res, 201, created);
    }

    return sendJSON(res, 404, { message: 'Not Found' });
  } catch (err: any) {
    if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
      return sendJSON(res, err.status, { message: err.message });
    }
    console.error('Unhandled rootHandler error', err);
    return sendJSON(res, 500, { message: 'Internal Server Error' });
  }
};
