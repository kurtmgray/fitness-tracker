import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const createWorkoutSession = protectedProcedure
  .input(z.object({
    dayType: z.enum(['day1', 'day2', 'day3']),
    templateId: z.string().uuid(),
    exercises: z.array(z.object({
      exerciseId: z.string().uuid(),
      orderIndex: z.number(),
      useBosoBall: z.boolean().optional(),
      bandType: z.string().optional(),
      notes: z.string().optional(),
    })),
    equipmentPreferences: z.record(z.string(), z.object({
      equipmentTypeId: z.string().uuid(),
      equipmentInstanceId: z.string().uuid().optional(),
    })).optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    // Create the workout session
    const session = await ctx.db
      .insertInto('workout_sessions')
      .values({
        user_id: ctx.user.id,
        date: new Date(),
        day_type: input.dayType,
        template_id: input.templateId,
        duration_minutes: null, // Will be updated when workout is completed
        notes: null,
      })
      .returning(['id', 'date', 'day_type', 'template_id'])
      .executeTakeFirstOrThrow();

    // Create session exercises
    const sessionExercises = await Promise.all(
      input.exercises.map(async (exercise) => {
        const sessionExercise = await ctx.db
          .insertInto('session_exercises')
          .values({
            session_id: session.id,
            exercise_id: exercise.exerciseId,
            order_index: exercise.orderIndex,
            use_bosu_ball: exercise.useBosoBall || false,
            band_type: exercise.bandType || null,
            notes: exercise.notes || null,
          })
          .returning(['id', 'session_id', 'exercise_id', 'order_index'])
          .executeTakeFirstOrThrow();

        return sessionExercise;
      })
    );

    // Create equipment preferences if provided
    if (input.equipmentPreferences) {
      await Promise.all(
        Object.entries(input.equipmentPreferences).map(([exerciseId, preference]) =>
          ctx.db
            .insertInto('workout_equipment_preferences')
            .values({
              session_id: session.id,
              exercise_id: exerciseId,
              equipment_type_id: preference.equipmentTypeId,
              equipment_instance_id: preference.equipmentInstanceId || null,
            })
            .execute()
        )
      );
    }

    return {
      session,
      sessionExercises,
    };
  });