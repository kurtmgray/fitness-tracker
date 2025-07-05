import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const updateSet = protectedProcedure
  .input(z.object({
    setId: z.string(),
    reps: z.number().optional(),
    weight: z.number().optional(),
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
    if (input.rpe !== undefined) updateData.rpe = input.rpe;
    if (input.completed !== undefined) updateData.completed = input.completed;

    const set = await ctx.db
      .updateTable('session_sets')
      .set(updateData)
      .where('id', '=', input.setId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return set;
  });