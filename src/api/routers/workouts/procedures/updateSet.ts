import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const updateSet = protectedProcedure
  .input(z.object({
    setId: z.string(),
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

    const updateData: any = {};
    if (input.reps !== undefined) updateData.reps = input.reps;
    if (input.weight !== undefined) updateData.weight = input.weight;
    if (input.weightLeft !== undefined) updateData.weight_left = input.weightLeft;
    if (input.weightRight !== undefined) updateData.weight_right = input.weightRight;
    if (input.timeSeconds !== undefined) updateData.time_seconds = input.timeSeconds;
    if (input.isFailure !== undefined) updateData.is_failure = input.isFailure;
    if (input.rpe !== undefined) updateData.rpe = input.rpe;
    if (input.completed !== undefined) updateData.completed = input.completed;

    // Calculate total weight if dual weights are being updated
    if (input.weightLeft !== undefined || input.weightRight !== undefined) {
      // Get current values if only one is being updated
      const currentSet = await ctx.db
        .selectFrom('session_sets')
        .select(['weight_left', 'weight_right', 'weight'])
        .where('id', '=', input.setId)
        .executeTakeFirst();
      
      const leftWeight = input.weightLeft !== undefined ? input.weightLeft : Number(currentSet?.weight_left || 0);
      const rightWeight = input.weightRight !== undefined ? input.weightRight : Number(currentSet?.weight_right || 0);
      
      if (leftWeight && rightWeight) {
        updateData.total_weight = leftWeight + rightWeight;
      } else if (input.weight !== undefined) {
        updateData.total_weight = input.weight;
      }
    } else if (input.weight !== undefined) {
      updateData.total_weight = input.weight;
    }

    const set = await ctx.db
      .updateTable('session_sets')
      .set(updateData)
      .where('id', '=', input.setId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return set;
  });