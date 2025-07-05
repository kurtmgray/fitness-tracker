import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const removeExerciseFromSession = protectedProcedure
  .input(z.object({
    sessionExerciseId: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    // Verify the session exercise belongs to a session owned by the user
    const existingExercise = await ctx.db
      .selectFrom('session_exercises')
      .innerJoin('workout_sessions', 'workout_sessions.id', 'session_exercises.session_id')
      .select('session_exercises.id')
      .where('session_exercises.id', '=', input.sessionExerciseId)
      .where('workout_sessions.user_id', '=', ctx.user.id)
      .executeTakeFirst();

    if (!existingExercise) {
      throw new Error('Session exercise not found');
    }

    // Delete all sets for this exercise first
    await ctx.db
      .deleteFrom('session_sets')
      .where('session_exercise_id', '=', input.sessionExerciseId)
      .execute();

    // Delete the session exercise
    const deletedExercise = await ctx.db
      .deleteFrom('session_exercises')
      .where('id', '=', input.sessionExerciseId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return { success: true, deletedExercise };
  });