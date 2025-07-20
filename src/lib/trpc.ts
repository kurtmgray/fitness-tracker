import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';
import type { AppRouter } from '../api/router';

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: process.env.NODE_ENV === 'production' 
        ? '/trpc'  // Same server in production
        : 'http://localhost:3001/trpc',  // Fixed: add /trpc path for local dev
      headers: () => {
        const token = localStorage.getItem('auth-token');
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});