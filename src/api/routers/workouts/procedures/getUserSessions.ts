import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const getUserWorkoutSessions = protectedProcedure
  .input(z.object({
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
    startDate: z.string().or(z.date()).optional(),
    endDate: z.string().or(z.date()).optional(),
    dayType: z.string().optional(),
  }))
  .query(async ({ input, ctx }) => {
    let query = ctx.db
      .selectFrom('workout_sessions')
      .selectAll()
      .where('user_id', '=', ctx.user.id)
      .orderBy('date', 'desc')
      .limit(input.limit)
      .offset(input.offset);

    if (input.startDate) {
      query = query.where('date', '>=', new Date(input.startDate));
    }

    if (input.endDate) {
      query = query.where('date', '<=', new Date(input.endDate));
    }

    if (input.dayType) {
      query = query.where('day_type', '=', input.dayType);
    }

    const sessions = await query.execute();
    return sessions;
  });