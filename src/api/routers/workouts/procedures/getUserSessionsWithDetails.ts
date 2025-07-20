import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const getUserSessionsWithDetails = protectedProcedure
  .input(z.object({
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
    startDate: z.string().or(z.date()).optional(),
    endDate: z.string().or(z.date()).optional(),
    dayType: z.string().optional(),
  }))
  .query(async ({ input, ctx }) => {
    // First get the workout sessions
    let sessionQuery = ctx.db
      .selectFrom('workout_sessions')
      .selectAll()
      .where('user_id', '=', ctx.user.id)
      .orderBy('date', 'desc')
      .limit(input.limit)
      .offset(input.offset);

    if (input.startDate) {
      sessionQuery = sessionQuery.where('date', '>=', new Date(input.startDate));
    }

    if (input.endDate) {
      sessionQuery = sessionQuery.where('date', '<=', new Date(input.endDate));
    }

    if (input.dayType) {
      sessionQuery = sessionQuery.where('day_type', '=', input.dayType);
    }

    const sessions = await sessionQuery.execute();

    // For each session, get exercises and sets
    const sessionsWithDetails = await Promise.all(
      sessions.map(async (session) => {
        // Get exercises for this session
        const exercises = await ctx.db
          .selectFrom('session_exercises as se')
          .innerJoin('exercises as e', 'e.id', 'se.exercise_id')
          .select([
            'se.id as session_exercise_id',
            'se.order_index',
            'se.band_type',
            'se.use_bosu_ball',
            'e.id as exercise_id',
            'e.name as exercise_name',
            'e.tracking_type',
            'e.supports_dual_weights',
          ])
          .where('se.session_id', '=', session.id)
          .orderBy('se.order_index', 'asc')
          .execute();

        // For each exercise, get its sets
        const exercisesWithSets = await Promise.all(
          exercises.map(async (exercise) => {
            const sets = await ctx.db
              .selectFrom('session_sets')
              .selectAll()
              .where('session_exercise_id', '=', exercise.session_exercise_id)
              .orderBy('set_number', 'asc')
              .execute();

            return {
              sessionExerciseId: exercise.session_exercise_id,
              exerciseId: exercise.exercise_id,
              exerciseName: exercise.exercise_name,
              orderIndex: exercise.order_index,
              bandType: exercise.band_type,
              useBosuBall: exercise.use_bosu_ball,
              trackingType: exercise.tracking_type,
              supportsDualWeights: exercise.supports_dual_weights,
              sets: sets.map(set => ({
                id: set.id,
                setNumber: set.set_number,
                weight: set.weight ? Number(set.weight) : null,
                weightLeft: set.weight_left ? Number(set.weight_left) : null,
                weightRight: set.weight_right ? Number(set.weight_right) : null,
                totalWeight: set.total_weight ? Number(set.total_weight) : null,
                reps: set.reps,
                timeSeconds: set.time_seconds,
                isFailure: set.is_failure,
                completed: set.completed,
                rpe: set.rpe,
              })),
            };
          })
        );

        return {
          id: session.id,
          date: session.date,
          dayType: session.day_type,
          duration: session.duration_minutes,
          notes: session.notes,
          exercises: exercisesWithSets,
        };
      })
    );

    return sessionsWithDetails;
  });