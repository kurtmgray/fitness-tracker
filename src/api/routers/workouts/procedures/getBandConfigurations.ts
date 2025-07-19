import { protectedProcedure } from '@/api/trpc';

export const getBandConfigurations = protectedProcedure
  .query(async ({ ctx }) => {
    const configurations = await ctx.db
      .selectFrom('band_configurations')
      .selectAll()
      .where('user_id', '=', ctx.user.id)
      .orderBy('is_default', 'desc')
      .orderBy('name', 'asc')
      .execute();

    return configurations;
  });