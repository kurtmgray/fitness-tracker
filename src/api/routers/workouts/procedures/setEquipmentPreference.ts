import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const setEquipmentPreference = protectedProcedure
  .input(z.object({
    sessionId: z.string(),
    exerciseId: z.string(),
    equipmentType: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    // Verify the session belongs to the user
    const existingSession = await ctx.db
      .selectFrom('workout_sessions')
      .select('id')
      .where('id', '=', input.sessionId)
      .where('user_id', '=', ctx.user.id)
      .executeTakeFirst();

    if (!existingSession) {
      throw new Error('Workout session not found');
    }

    // Upsert equipment preference
    const preference = await ctx.db
      .insertInto('workout_equipment_preferences')
      .values({
        session_id: input.sessionId,
        exercise_id: input.exerciseId,
        equipment_type: input.equipmentType,
      })
      .onConflict((oc) =>
        oc.columns(['session_id', 'exercise_id']).doUpdateSet({
          equipment_type: input.equipmentType,
        })
      )
      .returningAll()
      .executeTakeFirstOrThrow();

    return preference;
  });