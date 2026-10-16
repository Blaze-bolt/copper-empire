import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = process.cwd();
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.mp3': 'audio/mpeg' };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const path = resolve(pathname.startsWith('/vendor/')?resolve(root,'dist'):root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!path.startsWith(root + sep) || pathname.split('/').some(part => part.startsWith('.')) || !['.html', '.css', '.js', '.svg', '.mp3'].includes(extname(path))) { res.writeHead(403); return res.end('Forbidden'); }
    const data = await readFile(path);
    res.writeHead(200, { 'Content-Type': (types[extname(path)] || 'text/plain') + '; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, process.env.HOST || '127.0.0.1', () => console.log(`Copper Empire ready at http://localhost:${port}`));
