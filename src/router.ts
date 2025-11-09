import { IncomingMessage, ServerResponse } from 'http';
import { rootHandler } from './handlers/rootHandler';
import { usersHandler } from './handlers/usersHandler';

export const router = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const url = req.url || '';
    if (
      (req.method === 'GET' && url === '/api/users') ||
      (req.method === 'POST' && url === '/api/users')
    ) {
      return rootHandler(req, res);
    }

    if (url.startsWith('/api/users')) {
      return usersHandler(req, res);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  } catch (err) {
    console.error('Router error', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
};
