import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const saveSet = protectedProcedure
  .input(z.object({
    sessionExerciseId: z.string().uuid(),
    setNumber: z.number().min(1),
    weight: z.number().nullable().optional(),
    weightLeft: z.number().nullable().optional(),
    weightRight: z.number().nullable().optional(),
    totalWeight: z.number().nullable().optional(),
    reps: z.number().nullable().optional(),
    timeSeconds: z.number().nullable().optional(),
    isFailure: z.boolean().optional(),
    completed: z.boolean(),
    rpe: z.number().min(1).max(10).nullable().optional(),
    notes: z.string().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    // Calculate total weight if not provided
    let calculatedTotalWeight = input.totalWeight;
    if (!calculatedTotalWeight && (input.weightLeft || input.weightRight)) {
      calculatedTotalWeight = (input.weightLeft || 0) + (input.weightRight || 0);
    } else if (!calculatedTotalWeight && input.weight) {
      calculatedTotalWeight = input.weight;
    }

    // Insert or update the set
    const set = await ctx.db
      .insertInto('session_sets')
      .values({
        session_exercise_id: input.sessionExerciseId,
        set_number: input.setNumber,
        weight: input.weight,
        weight_left: input.weightLeft,
        weight_right: input.weightRight,
        total_weight: calculatedTotalWeight,
        reps: input.reps,
        time_seconds: input.timeSeconds,
        is_failure: input.isFailure || false,
        completed: input.completed,
        rpe: input.rpe,
        notes: input.notes || null,
      })
      .onConflict((oc) => 
        oc.columns(['session_exercise_id', 'set_number']).doUpdateSet({
          weight: input.weight,
          weight_left: input.weightLeft,
          weight_right: input.weightRight,
          total_weight: calculatedTotalWeight,
          reps: input.reps,
          time_seconds: input.timeSeconds,
          is_failure: input.isFailure || false,
          completed: input.completed,
          rpe: input.rpe,
          notes: input.notes || null,
          updated_at: new Date(),
        })
      )
      .returning(['id', 'set_number', 'weight', 'weight_left', 'weight_right', 'total_weight', 'reps', 'time_seconds', 'completed', 'rpe'])
      .executeTakeFirstOrThrow();

    return set;
  });