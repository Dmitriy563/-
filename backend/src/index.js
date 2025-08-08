import http from 'node:http';

function handleRequest(req, res) {
  const { method, url } = req;
  if (method === 'POST' && url === '/api/requests') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      res.writeHead(201, { 'Content-Type': 'application/json' });
      const payload = body ? JSON.parse(body) : null;
      res.end(JSON.stringify({ message: 'Request received', data: payload }));
    });
  } else if (method === 'GET' && url.startsWith('/api/requests/') && url.endsWith('/status')) {
    const id = url.split('/')[3];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ id, status: 'pending' }));
  } else {
    res.writeHead(404);
    res.end();
  }
}

export function createServer() {
  return http.createServer(handleRequest);
}

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  createServer().listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
