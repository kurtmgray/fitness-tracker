import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const createWorkoutSession = protectedProcedure
  .input(z.object({
    date: z.string().or(z.date()),
    dayType: z.string().optional(),
    templateId: z.string().optional(),
    notes: z.string().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    const session = await ctx.db
      .insertInto('workout_sessions')
      .values({
        user_id: ctx.user.id,
        date: new Date(input.date),
        day_type: input.dayType || null,
        template_id: input.templateId || null,
        notes: input.notes || null,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return session;
  });