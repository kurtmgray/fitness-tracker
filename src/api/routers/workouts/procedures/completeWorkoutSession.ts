import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const completeWorkoutSession = protectedProcedure
  .input(z.object({
    sessionId: z.string().uuid(),
    durationMinutes: z.number().min(1).optional(),
    notes: z.string().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    // Update the workout session as completed
    const session = await ctx.db
      .updateTable('workout_sessions')
      .set({
        duration_minutes: input.durationMinutes,
        notes: input.notes || null,
        updated_at: new Date(),
      })
      .where('id', '=', input.sessionId)
      .where('user_id', '=', ctx.user.id) // Ensure user owns this session
      .returning(['id', 'date', 'day_type', 'duration_minutes', 'notes'])
      .executeTakeFirstOrThrow();

    return session;
  });