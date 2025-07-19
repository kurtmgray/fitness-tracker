import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const createBandConfiguration = protectedProcedure
  .input(z.object({
    name: z.string().min(1).max(100),
    colors: z.array(z.enum(['red', 'blue', 'yellow', 'black'])).min(1),
  }))
  .mutation(async ({ input, ctx }) => {
    const configuration = await ctx.db
      .insertInto('band_configurations')
      .values({
        name: input.name,
        colors: input.colors,
        user_id: ctx.user.id,
        is_default: false,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return configuration;
  });