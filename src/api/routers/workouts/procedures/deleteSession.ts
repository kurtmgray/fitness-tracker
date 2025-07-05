import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const deleteWorkoutSession = protectedProcedure
  .input(z.object({
    sessionId: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    // Delete in order: sets -> exercises -> session
    // Get all session exercises first
    const sessionExercises = await ctx.db
      .selectFrom('session_exercises')
      .select('id')
      .where('session_id', '=', input.sessionId)
      .execute();

    const exerciseIds = sessionExercises.map(e => e.id);

    // Delete all sets for these exercises
    if (exerciseIds.length > 0) {
      await ctx.db
        .deleteFrom('session_sets')
        .where('session_exercise_id', 'in', exerciseIds)
        .execute();
    }

    // Delete all session exercises
    await ctx.db
      .deleteFrom('session_exercises')
      .where('session_id', '=', input.sessionId)
      .execute();

    // Delete the session (verify user ownership)
    const deletedSession = await ctx.db
      .deleteFrom('workout_sessions')
      .where('id', '=', input.sessionId)
      .where('user_id', '=', ctx.user.id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return { success: true, deletedSession };
  });