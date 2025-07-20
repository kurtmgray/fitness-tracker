import { protectedProcedure } from "@/api/trpc";
import { db } from "@/api/db/connection";
import { z } from "zod";

export const getActiveSession = protectedProcedure
  .input(
    z.object({
      dayType: z.enum(['day1', 'day2', 'day3']),
    })
  )
  .query(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { dayType } = input;

    // Find the most recent active (not completed) session for this day type
    const activeSession = await db
      .selectFrom('workout_sessions')
      .selectAll()
      .where('user_id', '=', userId)
      .where('day_type', '=', dayType)
      .where('completed_at', 'is', null) // Not completed
      .orderBy('created_at', 'desc')
      .limit(1)
      .executeTakeFirst();

    if (!activeSession) {
      return null;
    }

    // Get all session exercises with their sets and exercise details
    const sessionExercises = await db
      .selectFrom('session_exercises')
      .innerJoin('exercises', 'exercises.id', 'session_exercises.exercise_id')
      .selectAll(['session_exercises'])
      .select([
        'exercises.id as exercise_id',
        'exercises.name as exercise_name',
        'exercises.primary_equipment_type_id',
      ])
      .where('session_exercises.session_id', '=', activeSession.id)
      .orderBy('session_exercises.order_index', 'asc')
      .execute();

    // Get all sets for these session exercises
    const sessionExerciseIds = sessionExercises.map(se => se.id);
    const sets = await db
      .selectFrom('session_sets')
      .selectAll()
      .where('session_exercise_id', 'in', sessionExerciseIds)
      .orderBy('set_number', 'asc')
      .execute();

    // Group sets by session exercise
    const setsBySessionExercise: Record<string, any[]> = {};
    sets.forEach(set => {
      if (!setsBySessionExercise[set.session_exercise_id]) {
        setsBySessionExercise[set.session_exercise_id] = [];
      }
      setsBySessionExercise[set.session_exercise_id].push(set);
    });

    // Build the complete session structure
    const sessionExercisesWithSets = sessionExercises.map(sessionExercise => ({
      id: sessionExercise.id,
      exerciseId: sessionExercise.exercise_id,
      orderIndex: sessionExercise.order_index,
      useBosoBall: sessionExercise.use_boso_ball,
      bandType: sessionExercise.band_type,
      notes: sessionExercise.notes,
      exercise: {
        id: sessionExercise.exercise_id,
        name: sessionExercise.exercise_name,
        primaryEquipmentTypeId: sessionExercise.primary_equipment_type_id,
      },
      sets: setsBySessionExercise[sessionExercise.id] || [],
    }));

    return {
      id: activeSession.id,
      dayType: activeSession.day_type,
      createdAt: activeSession.created_at,
      completedAt: activeSession.completed_at,
      durationMinutes: activeSession.duration_minutes,
      sessionExercises: sessionExercisesWithSets,
    };
  });