import express from 'express';
import { createHTTPHandler } from '@trpc/server/adapters/express';
import { appRouter } from './src/api/router.js';
import { createContext } from './src/api/trpc.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// tRPC API handler
app.use('/trpc', createHTTPHandler({
  router: appRouter,
  createContext: ({ req, res }) => createContext({
    headers: req.headers
  }),
}));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});