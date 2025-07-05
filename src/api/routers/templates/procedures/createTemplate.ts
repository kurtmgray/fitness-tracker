import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const createWorkoutTemplate = protectedProcedure
  .input(z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    dayType: z.string().optional(),
    isDefault: z.boolean().default(false),
    exercises: z.array(z.object({
      exerciseId: z.string(),
      orderIndex: z.number(),
      targetSets: z.number().min(1),
      targetReps: z.string(),
      notes: z.string().optional(),
      hasBosuBallOption: z.boolean().default(false),
      isTimeBased: z.boolean().default(false),
      isFailure: z.boolean().default(false),
    })).optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    // Create the template
    const template = await ctx.db
      .insertInto('workout_templates')
      .values({
        user_id: ctx.user.id,
        name: input.name,
        description: input.description || null,
        day_type: input.dayType || null,
        is_default: input.isDefault,
        is_active: true,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    // Add exercises if provided
    if (input.exercises && input.exercises.length > 0) {
      const templateExercises = await ctx.db
        .insertInto('template_exercises')
        .values(
          input.exercises.map(exercise => ({
            template_id: template.id,
            exercise_id: exercise.exerciseId,
            order_index: exercise.orderIndex,
            target_sets: exercise.targetSets,
            target_reps: exercise.targetReps,
            notes: exercise.notes || null,
            has_bosu_ball_option: exercise.hasBosuBallOption,
            is_time_based: exercise.isTimeBased,
            is_failure: exercise.isFailure,
          }))
        )
        .returningAll()
        .execute();

      return { template, exercises: templateExercises };
    }

    return { template, exercises: [] };
  });