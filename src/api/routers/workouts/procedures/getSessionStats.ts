import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const getWorkoutSessionStats = protectedProcedure
  .input(z.object({
    sessionId: z.string(),
  }))
  .query(async ({ input, ctx }) => {
    // Get session with exercises and sets
    const session = await ctx.db
      .selectFrom('workout_sessions')
      .selectAll()
      .where('id', '=', input.sessionId)
      .where('user_id', '=', ctx.user.id)
      .executeTakeFirst();

    if (!session) {
      throw new Error('Workout session not found');
    }

    // Get exercises with exercise details
    const exercises = await ctx.db
      .selectFrom('session_exercises')
      .innerJoin('exercises', 'exercises.id', 'session_exercises.exercise_id')
      .selectAll()
      .where('session_exercises.session_id', '=', input.sessionId)
      .orderBy('session_exercises.order_index', 'asc')
      .execute();

    // Get all sets for this session
    const sets = await ctx.db
      .selectFrom('session_sets')
      .innerJoin('session_exercises', 'session_exercises.id', 'session_sets.session_exercise_id')
      .selectAll()
      .where('session_exercises.session_id', '=', input.sessionId)
      .orderBy('session_sets.set_number', 'asc')
      .execute();

    // Calculate stats
    const totalSets = sets.length;
    const completedSets = sets.filter(set => set.completed).length;
    const totalVolume = sets.reduce((total, set) => {
      if (set.completed && set.weight && set.reps) {
        return total + (Number(set.weight) * set.reps);
      }
      return total;
    }, 0);

    const exerciseStats = exercises.map(exercise => {
      const exerciseSets = sets.filter(set => set.session_exercise_id === exercise.id);
      const exerciseVolume = exerciseSets.reduce((total, set) => {
        if (set.completed && set.weight && set.reps) {
          return total + (Number(set.weight) * set.reps);
        }
        return total;
      }, 0);

      return {
        exercise,
        sets: exerciseSets,
        setCount: exerciseSets.length,
        completedSets: exerciseSets.filter(set => set.completed).length,
        volume: exerciseVolume,
        maxWeight: exerciseSets.reduce((max, set) => {
          if (set.weight && Number(set.weight) > max) {
            return Number(set.weight);
          }
          return max;
        }, 0),
      };
    });

    return {
      session,
      exercises: exerciseStats,
      stats: {
        totalSets,
        completedSets,
        totalVolume,
        exerciseCount: exercises.length,
        completionRate: totalSets > 0 ? (completedSets / totalSets) * 100 : 0,
      },
    };
  });