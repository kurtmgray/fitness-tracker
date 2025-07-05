import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const createStrengthAssessment = protectedProcedure
  .input(z.object({
    bodyWeight: z.number().positive(),
    gender: z.enum(['male', 'female', 'other']),
    benchWeight: z.number().positive().optional(),
    benchLevel: z.string().optional(),
    squatWeight: z.number().positive().optional(),
    squatLevel: z.string().optional(),
    deadliftWeight: z.number().positive().optional(),
    deadliftLevel: z.string().optional(),
    overheadPressWeight: z.number().positive().optional(),
    overheadPressLevel: z.string().optional(),
    romanianDeadliftWeight: z.number().positive().optional(),
    romanianDeadliftLevel: z.string().optional(),
    overallLevel: z.string().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    const assessment = await ctx.db
      .insertInto('strength_assessments')
      .values({
        user_id: ctx.user.id,
        body_weight: input.bodyWeight,
        gender: input.gender,
        bench_weight: input.benchWeight || null,
        bench_level: input.benchLevel || null,
        squat_weight: input.squatWeight || null,
        squat_level: input.squatLevel || null,
        deadlift_weight: input.deadliftWeight || null,
        deadlift_level: input.deadliftLevel || null,
        overhead_press_weight: input.overheadPressWeight || null,
        overhead_press_level: input.overheadPressLevel || null,
        romanian_deadlift_weight: input.romanianDeadliftWeight || null,
        romanian_deadlift_level: input.romanianDeadliftLevel || null,
        overall_level: input.overallLevel || null,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return assessment;
  });