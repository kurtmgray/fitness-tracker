import { protectedProcedure } from '../../../trpc';

export const me = protectedProcedure
  .query(async ({ ctx }) => {
    const user = await ctx.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', ctx.user.id)
      .executeTakeFirst();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  });