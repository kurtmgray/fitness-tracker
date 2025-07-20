import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './router';
import { createContext } from './trpc';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../../dist');

const server = createHTTPServer({
  router: appRouter,
  createContext: (opts) => createContext({
    headers: opts.req.headers as Record<string, string>
  }),
  middleware: (req, res, next) => {
    // Enable CORS
    const origin = process.env.NODE_ENV === 'production' 
      ? 'https://gac-fitnesstracker-c3071bd9b20b.herokuapp.com'
      : 'http://localhost:3000';
    
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Serve static files in production
    if (process.env.NODE_ENV === 'production' && req.url && !req.url.startsWith('/trpc')) {
      const filePath = req.url === '/' ? 'index.html' : req.url.slice(1);
      const fullPath = path.join(distPath, filePath);
      
      // Check if file exists
      if (fs.existsSync(fullPath) && !fs.statSync(fullPath).isDirectory()) {
        const ext = path.extname(fullPath);
        const contentType = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.gif': 'image/gif',
          '.ico': 'image/x-icon'
        }[ext] || 'application/octet-stream';
        
        res.setHeader('Content-Type', contentType);
        res.writeHead(200);
        res.end(fs.readFileSync(fullPath));
        return;
      } else {
        // Serve index.html for client-side routing
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(fs.readFileSync(path.join(distPath, 'index.html')));
        return;
      }
    }
    
    next();
  },
});

const PORT = process.env.PORT || process.env.API_PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 tRPC Server running on http://localhost:${PORT}`);
});