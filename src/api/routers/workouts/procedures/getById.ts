import { z } from 'zod';
import { publicProcedure } from '@/api/trpc';

export const getWorkoutById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    const workout = await ctx.db
      .selectFrom('workout_sessions')
      .selectAll()
      .where('id', '=', input.id)
      .executeTakeFirst();
    
    if (!workout) {
      throw new Error('Workout not found');
    }
    
    return workout;
  });