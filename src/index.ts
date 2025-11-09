import 'dotenv/config';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { router } from './router';

const CONTENT_TYPE_JSON = { 'Content-Type': 'application/json' };
const CONTENT_TYPE_HTML = { 'Content-Type': 'text/html' };

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
if (!process.env.PORT) {
  console.warn(
    'PORT not set in .env — using default 4000. Add a .env file (do not commit it) or set PORT env var.'
  );
}

const server = createServer((req, res) => {
  res.setHeader('X-Powered-By', 'Node.js');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }
  router(req, res);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
