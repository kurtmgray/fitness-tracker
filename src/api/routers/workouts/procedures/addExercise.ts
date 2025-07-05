import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const addExerciseToSession = protectedProcedure
  .input(z.object({
    sessionId: z.string(),
    exerciseId: z.string(),
    orderIndex: z.number(),
    notes: z.string().optional(),
    bandType: z.string().optional(),
    useBosuBall: z.boolean().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    // Verify session belongs to user
    const session = await ctx.db
      .selectFrom('workout_sessions')
      .select('id')
      .where('id', '=', input.sessionId)
      .where('user_id', '=', ctx.user.id)
      .executeTakeFirst();

    if (!session) {
      throw new Error('Workout session not found');
    }

    const sessionExercise = await ctx.db
      .insertInto('session_exercises')
      .values({
        session_id: input.sessionId,
        exercise_id: input.exerciseId,
        order_index: input.orderIndex,
        notes: input.notes || null,
        band_type: input.bandType || null,
        use_bosu_ball: input.useBosuBall || false,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return sessionExercise;
  });