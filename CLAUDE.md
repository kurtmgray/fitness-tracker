# Full-Stack React + tRPC + Kysely Setup Guide

This guide helps Claude instances quickly set up a full-stack TypeScript application with React frontend, tRPC API, Kysely ORM, PostgreSQL database, and Google OAuth authentication.

## 🏗️ Stack Overview

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS + TanStack Router + TanStack Query
- **Backend**: tRPC + Kysely + PostgreSQL + JWT authentication
- **Auth**: Google OAuth with Google Identity Services
- **Tools**: kysely-codegen for type generation, tsx for TypeScript execution

## 📁 Project Structure

```
src/
├── api/                          # Backend API (tRPC + Kysely)
│   ├── db/
│   │   ├── connection.ts         # Kysely database connection
│   │   └── types.ts             # Generated database types
│   ├── routers/
│   │   ├── auth/
│   │   │   ├── auth.ts          # Auth router
│   │   │   └── procedures/      # Auth procedures
│   │   ├── exercises/
│   │   │   ├── exercises.ts     # Exercise router
│   │   │   └── procedures/      # Exercise procedures
│   │   └── workouts/
│   │       ├── workouts.ts      # Workout router
│   │       └── procedures/      # Workout procedures
│   ├── router.ts                # Main tRPC router
│   ├── server.ts                # tRPC standalone server
│   └── trpc.ts                  # tRPC configuration
├── components/
│   ├── auth/                    # Authentication components
│   │   ├── AuthProvider.tsx     # Auth context
│   │   ├── GoogleLogin.tsx      # Google OAuth button
│   │   ├── LoginPage.tsx        # Login UI
│   │   └── ProtectedRoute.tsx   # Route protection
│   └── ...                     # Other components
├── lib/
│   └── trpc.ts                 # tRPC client setup
└── main.tsx                    # App entry point
```

## 🚀 Quick Setup Commands

### 1. Install Dependencies

```bash
# Core dependencies
npm install @trpc/server @trpc/client @trpc/react-query
npm install @tanstack/react-query @tanstack/react-router
npm install kysely pg jsonwebtoken zod dotenv cors helmet
npm install google-auth-library

# Dev dependencies  
npm install -D @types/pg @types/jsonwebtoken @types/cors
npm install -D kysely-codegen tsx typescript
```

### 2. Environment Variables (.env)

```bash
DATABASE_URL=postgresql://username@localhost:5432/database_name
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
API_PORT=3001
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### 3. Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite --port 3000",
    "api:dev": "tsx watch src/api/server.ts",
    "db:generate": "kysely-codegen --out-file src/api/db/types.ts"
  }
}
```

## 🗄️ Database Setup

### PostgreSQL with Postgres.app

1. **Install Postgres.app** (easiest for macOS)
2. **Add psql to PATH**: `/Applications/Postgres.app/Contents/Versions/16/bin`
3. **Create database**:
   ```bash
   psql -U username -c "CREATE DATABASE your_database_name;"
   ```

### Essential Tables

```sql
-- Users table for Google OAuth
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add other domain-specific tables as needed
```

### Generate Types

```bash
npm run db:generate
```

## 🔧 Key Configuration Files

### Database Connection (`src/api/db/connection.ts`)

```typescript
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { DB } from './types';

const dialect = new PostgresDialect({
  pool: new Pool({
    host: 'localhost',
    port: 5432,
    user: 'your_username',
    database: 'your_database_name',
  }),
});

export const db = new Kysely<DB>({ dialect });
```

### tRPC Server (`src/api/server.ts`)

```typescript
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

server.listen(process.env.API_PORT || 3001);
```

### tRPC Client (`src/lib/trpc.ts`)

```typescript
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';
import type { AppRouter } from '../api/router';

export const trpc = createTRPCReact<AppRouter>();
export const queryClient = new QueryClient();
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001',
      headers: () => {
        const token = localStorage.getItem('auth-token');
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});
```

### App Entry Point (`src/main.tsx`)

```typescript
root.render(
  <StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </StrictMode>
);
```

## 🔐 Google OAuth Setup

### Google Cloud Console

1. **Create OAuth Client ID** at console.cloud.google.com
2. **Authorized JavaScript origins**: `http://localhost:3000`
3. **Authorized redirect URIs**: `http://localhost:3000`
4. **Copy Client ID** to `.env` as `VITE_GOOGLE_CLIENT_ID`

### Frontend Implementation

Uses Google Identity Services for modern OAuth flow:

```typescript
// GoogleLogin component handles the OAuth flow
// AuthProvider manages authentication state
// ProtectedRoute wraps components requiring auth
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Terminal 1: API Server
npm run api:dev

# Terminal 2: Frontend
npm run dev
```

### Access Points

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001

## 🎯 tRPC Router Organization

### Procedure Structure

```typescript
// Each domain gets its own router and procedures folder
src/api/routers/
├── auth/
│   ├── auth.ts              # Main router
│   └── procedures/
│       ├── googleLogin.ts   # Individual procedures
│       ├── me.ts
│       └── logout.ts
└── domain/
    ├── domain.ts
    └── procedures/
        ├── list.ts
        ├── getById.ts
        └── create.ts
```

### Import Pattern

Use `@/` path alias (configured in vite.config.ts):

```typescript
import { publicProcedure } from '@/api/trpc';
import { router } from '@/api/trpc';
```

## 🔍 Common Issues & Solutions

### Database Connection

**Issue**: "relation does not exist" despite table existing
**Solution**: Check that API server connects to correct database:
- Use explicit connection config instead of connection string
- Verify database name matches between creation and connection

### CORS Issues

**Solution**: Configure CORS middleware in tRPC standalone server (see server.ts example above)

### Google OAuth "Origin not allowed"

**Solution**: 
- Verify Client ID in Google Cloud Console
- Ensure `http://localhost:3000` is in authorized origins
- Wait 5-15 minutes for changes to propagate

### Environment Variables

**Frontend**: Use `VITE_` prefix (e.g., `VITE_GOOGLE_CLIENT_ID`)
**Backend**: Use direct names (e.g., `DATABASE_URL`)

## 📦 Essential File Templates

When creating new domains, copy existing patterns:

1. **Router**: Copy `src/api/routers/auth/auth.ts`
2. **Procedures**: Copy `src/api/routers/auth/procedures/`
3. **Frontend hooks**: Use `trpc.domain.procedure.useQuery/useMutation()`

## 🔄 Development Workflow

1. **Create database tables** (run SQL or update schema)
2. **Generate types**: `npm run db:generate`
3. **Create tRPC procedures** in `/procedures` folders
4. **Export from router** files
5. **Add to main router** (`src/api/router.ts`)
6. **Use in frontend** with tRPC hooks

This setup provides type-safe, full-stack development with hot reloading, automatic type generation, and modern authentication patterns.