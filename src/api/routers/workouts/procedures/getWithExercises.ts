import { z } from 'zod';
import { publicProcedure } from '@/api/trpc';

export const getWorkoutWithExercises = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    const workout = await ctx.db
      .selectFrom('workout_sessions')
      .selectAll()
      .where('id', '=', input.id)
      .executeTakeFirst();
    
    if (!workout) {
      throw new Error('Workout not found');
    }
    
    const exercises = await ctx.db
      .selectFrom('session_exercises')
      .innerJoin('exercises', 'exercises.id', 'session_exercises.exercise_id')
      .selectAll()
      .where('session_exercises.session_id', '=', input.id)
      .orderBy('session_exercises.order_index')
      .execute();
    
    const sets = await ctx.db
      .selectFrom('session_sets')
      .innerJoin('session_exercises', 'session_exercises.id', 'session_sets.session_exercise_id')
      .selectAll()
      .where('session_exercises.session_id', '=', input.id)
      .orderBy('session_sets.set_number')
      .execute();
    
    return {
      workout,
      exercises,
      sets
    };
  });