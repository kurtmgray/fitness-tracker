import { z } from 'zod';
import { protectedProcedure } from '@/api/trpc';

export const getEquipmentPreferences = protectedProcedure
  .input(z.object({
    sessionId: z.string(),
  }))
  .query(async ({ input, ctx }) => {
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

    const preferences = await ctx.db
      .selectFrom('workout_equipment_preferences')
      .selectAll()
      .where('session_id', '=', input.sessionId)
      .execute();

    // Convert to object format for easier frontend usage
    const preferencesMap = preferences.reduce((acc, pref) => {
      acc[pref.exercise_id] = pref.equipment_type;
      return acc;
    }, {} as Record<string, string>);

    return preferencesMap;
  });