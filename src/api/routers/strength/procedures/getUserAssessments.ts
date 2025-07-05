import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const getUserStrengthAssessments = protectedProcedure
  .input(z.object({
    limit: z.number().min(1).max(50).default(10),
  }))
  .query(async ({ input, ctx }) => {
    const assessments = await ctx.db
      .selectFrom('strength_assessments')
      .selectAll()
      .where('user_id', '=', ctx.user.id)
      .orderBy('created_at', 'desc')
      .limit(input.limit)
      .execute();

    return assessments;
  });