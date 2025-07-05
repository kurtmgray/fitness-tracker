import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const getUserWorkoutTemplates = protectedProcedure
  .input(z.object({
    includeDefault: z.boolean().default(true),
    dayType: z.string().optional(),
  }))
  .query(async ({ input, ctx }) => {
    let query = ctx.db
      .selectFrom('workout_templates')
      .selectAll()
      .where('is_active', '=', true)
      .orderBy('name', 'asc');

    if (input.includeDefault) {
      query = query.where(eb => 
        eb.or([
          eb('user_id', '=', ctx.user.id),
          eb('user_id', 'is', null) // Global templates
        ])
      );
    } else {
      query = query.where('user_id', '=', ctx.user.id);
    }

    if (input.dayType) {
      query = query.where('day_type', '=', input.dayType);
    }

    const templates = await query.execute();

    // Get exercises for each template
    const templatesWithExercises = await Promise.all(
      templates.map(async (template) => {
        const exercises = await ctx.db
          .selectFrom('template_exercises')
          .innerJoin('exercises', 'exercises.id', 'template_exercises.exercise_id')
          .selectAll()
          .where('template_exercises.template_id', '=', template.id)
          .orderBy('template_exercises.order_index', 'asc')
          .execute();

        return {
          ...template,
          exercises,
        };
      })
    );

    return templatesWithExercises;
  });