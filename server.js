const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  // Strip query parameters
  filePath = filePath.split('?')[0];

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    // Set Caching and CORS headers for optimal local performance
    const headers = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    };

    // Range header support for video/media streaming
    const range = req.headers.range;
    if (range && contentType.startsWith('video/')) {
      const fileSize = stats.size;
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        ...headers,
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
      });

      file.pipe(res);
    } else {
      headers['Content-Length'] = stats.size;
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  ORBIT Luxury Watch Website is live on Localhost!`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
