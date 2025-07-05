import { publicProcedure } from '@/api/trpc';

export const listWorkouts = publicProcedure.query(async ({ ctx }) => {
  const workouts = await ctx.db
    .selectFrom('workout_sessions')
    .selectAll()
    .orderBy('date', 'desc')
    .execute();
  
  return workouts;
});