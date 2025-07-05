import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const updateSessionExercise = protectedProcedure
  .input(z.object({
    sessionExerciseId: z.string(),
    orderIndex: z.number().optional(),
    notes: z.string().optional(),
    bandType: z.string().optional(),
    useBosuBall: z.boolean().optional(),
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

    const updateData: any = {};
    if (input.orderIndex !== undefined) updateData.order_index = input.orderIndex;
    if (input.notes !== undefined) updateData.notes = input.notes;
    if (input.bandType !== undefined) updateData.band_type = input.bandType;
    if (input.useBosuBall !== undefined) updateData.use_bosu_ball = input.useBosuBall;

    const sessionExercise = await ctx.db
      .updateTable('session_exercises')
      .set(updateData)
      .where('id', '=', input.sessionExerciseId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return sessionExercise;
  });