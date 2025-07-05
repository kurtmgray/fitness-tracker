import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const deleteSet = protectedProcedure
  .input(z.object({
    setId: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    // Verify the set belongs to a session owned by the user
    const existingSet = await ctx.db
      .selectFrom('session_sets')
      .innerJoin('session_exercises', 'session_exercises.id', 'session_sets.session_exercise_id')
      .innerJoin('workout_sessions', 'workout_sessions.id', 'session_exercises.session_id')
      .select('session_sets.id')
      .where('session_sets.id', '=', input.setId)
      .where('workout_sessions.user_id', '=', ctx.user.id)
      .executeTakeFirst();

    if (!existingSet) {
      throw new Error('Set not found');
    }

    const deletedSet = await ctx.db
      .deleteFrom('session_sets')
      .where('id', '=', input.setId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return { success: true, deletedSet };
  });