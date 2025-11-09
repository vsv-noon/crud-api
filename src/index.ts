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
  router(req, res);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
