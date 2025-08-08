import assert from 'node:assert';
import http from 'node:http';
import { createServer } from '../src/index.js';

const server = createServer().listen(0, () => {
  const { port } = server.address();
  const options = {
    hostname: '127.0.0.1',
    port,
    path: '/api/requests/123/status',
    method: 'GET'
  };

  const req = http.request(options, res => {
    let data = '';
    res.on('data', chunk => (data += chunk));
    res.on('end', () => {
      const obj = JSON.parse(data);
      assert.strictEqual(obj.id, '123');
      assert.strictEqual(obj.status, 'pending');
      console.log('basic test passed');
      server.close();
    });
  });

  req.on('error', err => {
    console.error(err);
    server.close();
  });

  req.end();
});
