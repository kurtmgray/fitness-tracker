import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { publicProcedure } from '../../../trpc';

export const googleLogin = publicProcedure
  .input(z.object({
    googleToken: z.string(),
    name: z.string(),
    email: z.string().email(),
    avatarUrl: z.string().optional(),
    googleId: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    const existingUser = await ctx.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', input.email)
      .executeTakeFirst();

    let user;
    if (existingUser) {
      user = await ctx.db
        .updateTable('users')
        .set({
          name: input.name,
          avatar_url: input.avatarUrl || null,
          google_id: input.googleId,
          updated_at: new Date(),
        })
        .where('id', '=', existingUser.id)
        .returningAll()
        .executeTakeFirstOrThrow();
    } else {
      user = await ctx.db
        .insertInto('users')
        .values({
          google_id: input.googleId,
          email: input.email,
          name: input.name,
          avatar_url: input.avatarUrl || null,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    }

    const token = jwt.sign(
      { user: { id: user.id, email: user.email, name: user.name } },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return { token, user };
  });