import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const updateWorkoutSession = protectedProcedure
  .input(z.object({
    sessionId: z.string(),
    date: z.string().or(z.date()).optional(),
    dayType: z.string().optional(),
    durationMinutes: z.number().optional(),
    notes: z.string().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    const updateData: any = {
      updated_at: new Date(),
    };

    if (input.date) updateData.date = new Date(input.date);
    if (input.dayType !== undefined) updateData.day_type = input.dayType;
    if (input.durationMinutes !== undefined) updateData.duration_minutes = input.durationMinutes;
    if (input.notes !== undefined) updateData.notes = input.notes;

    const session = await ctx.db
      .updateTable('workout_sessions')
      .set(updateData)
      .where('id', '=', input.sessionId)
      .where('user_id', '=', ctx.user.id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return session;
  });