import { IncomingMessage, ServerResponse } from 'http';

export const sendJSON = (
  res: ServerResponse,
  statusCode: number,
  payload: any
) => {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body, 'utf8').toString(),
  });
  res.end(body);
};

export const parseJsonBody = (req: IncomingMessage): Promise<any> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => {
      if (chunks.length === 0) return resolve({});
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        const parsed = JSON.parse(raw);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', (err) => reject(err));
  });
