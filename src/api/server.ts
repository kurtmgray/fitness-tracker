import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './router';
import { createContext } from './trpc';
import dotenv from 'dotenv';

dotenv.config();

const server = createHTTPServer({
  router: appRouter,
  createContext: (opts) => createContext({
    headers: opts.req.headers as Record<string, string>
  }),
  middleware: (req, res, next) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    next();
  },
});

const PORT = process.env.API_PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 tRPC Server running on http://localhost:${PORT}`);
});