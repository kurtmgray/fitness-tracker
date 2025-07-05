import { z } from 'zod';
import { publicProcedure } from '../../../trpc';

export const getExerciseById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    const exercise = await ctx.db
      .selectFrom('exercises')
      .selectAll()
      .where('id', '=', input.id)
      .executeTakeFirst();
    
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    
    return exercise;
  });