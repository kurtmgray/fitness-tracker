import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const addSetToExercise = protectedProcedure
  .input(z.object({
    sessionExerciseId: z.string(),
    setNumber: z.number(),
    reps: z.number().optional(),
    weight: z.number().nullable().optional(),
    weightLeft: z.number().nullable().optional(),
    weightRight: z.number().nullable().optional(),
    timeSeconds: z.number().optional(),
    isFailure: z.boolean().optional(),
    rpe: z.number().min(1).max(10).optional(),
    completed: z.boolean().optional(),
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

    // Calculate total weight if dual weights provided
    const totalWeight = input.weightLeft && input.weightRight 
      ? input.weightLeft + input.weightRight 
      : input.weight;

    const set = await ctx.db
      .insertInto('session_sets')
      .values({
        session_exercise_id: input.sessionExerciseId,
        set_number: input.setNumber,
        reps: input.reps ?? 0,
        weight: input.weight || null,
        weight_left: input.weightLeft || null,
        weight_right: input.weightRight || null,
        total_weight: totalWeight || null,
        time_seconds: input.timeSeconds || null,
        is_failure: input.isFailure || false,
        rpe: input.rpe || null,
        completed: input.completed || false,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return set;
  });