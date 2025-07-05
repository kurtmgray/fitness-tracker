import { publicProcedure } from '../../../trpc';

export const listExercises = publicProcedure.query(async ({ ctx }) => {
  const exercises = await ctx.db
    .selectFrom('exercises')
    .selectAll()
    .where('is_active', '=', true)
    .orderBy('name', 'asc')
    .execute();
  
  return exercises;
});