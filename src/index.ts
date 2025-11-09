import 'dotenv/config';
import { createServer, IncomingMessage, ServerResponse } from 'http';

const CONTENT_TYPE_JSON = { 'Content-Type': 'application/json' };
const CONTENT_TYPE_HTML = { 'Content-Type': 'text/html' };

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
if (!process.env.PORT) {
  console.warn(
    'PORT not set in .env — using default 4000. Add a .env file (do not commit it) or set PORT env var.'
  );
}

const sendJSON = (res: ServerResponse, statusCode: number, payload: any) => {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body, 'utf8').toString(),
  });
  res.end(body);
};

const handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { method, url } = req;
    if (!url) return sendJSON(res, 404, { message: 'Not Found' });
    sendJSON(res, 200, { message: '200' });
  } catch (err) {
    console.error('Unhandled Handler error', err);
  }
};

const server = createServer((req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/api/users') {
      handleRequest(req, res);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  } catch (error) {
    res.statusCode = 500;
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
