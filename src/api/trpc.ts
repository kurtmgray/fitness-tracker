import { initTRPC } from '@trpc/server';
import jwt from 'jsonwebtoken';
import { db } from './db/connection';

interface Context {
  db: typeof db;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error('Unauthorized');
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const createContext = (opts?: { headers?: Record<string, string> }): Context => {
  const token = opts?.headers?.authorization?.replace('Bearer ', '');
  let user;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      user = decoded.user;
    } catch (err) {
      // user undefined, not authenticated
    }
  }

  return {
    db,
    user,
  };
};