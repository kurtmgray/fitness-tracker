import { protectedProcedure } from '@/api/trpc';
import { db } from '@/api/db/connection';
import { getExerciseRules } from '@/utils/exerciseUtils';

// Standard exercise name mapping for strength assessment
const STRENGTH_EXERCISE_MAPPING: Record<string, string[]> = {
  squat: ['Barbell Back Squat', 'Back Squat'],
  deadlift: ['Deadlift', 'Barbell Deadlift'],
  bench: ['Bench Press', 'Barbell Bench Press'],
  overheadPress: ['Overhead Press', 'Dumbbell Overhead Press'],
  romanianDeadlift: ['Romanian Deadlift', 'Barbell Romanian Deadlift'],
};

export const getActualMaxes = protectedProcedure
  .query(async ({ ctx }) => {
    const maxWeights: Record<string, number> = {};
    
    // Calculate max weights for each strength exercise
    for (const [liftType, exerciseNames] of Object.entries(STRENGTH_EXERCISE_MAPPING)) {
      const results = await db
        .selectFrom('session_sets as ss')
        .innerJoin('session_exercises as se', 'se.id', 'ss.session_exercise_id')
        .innerJoin('exercises as e', 'e.id', 'se.exercise_id')
        .innerJoin('workout_sessions as ws', 'ws.id', 'se.session_id')
        .select([
          'e.name as exercise_name',
          'ss.weight',
          'ss.weight_left',
          'ss.weight_right',
          'ss.total_weight'
        ])
        .where('ws.user_id', '=', ctx.user.id)
        .where('ss.completed', '=', true)
        .where('e.name', 'in', exerciseNames)
        .where((eb) => 
          eb.or([
            eb('ss.weight', '>', 0),
            eb('ss.total_weight', '>', 0)
          ])
        )
        .execute();
      
      let maxWeight = 0;
      
      // Apply exercise-specific weight multipliers
      for (const row of results) {
        const rules = getExerciseRules(row.exercise_name);
        let actualWeight = 0;
        
        if (row.weight_left && row.weight_right) {
          // Dual weight exercise
          actualWeight = (Number(row.weight_left) || 0) + (Number(row.weight_right) || 0);
        } else if (row.weight) {
          // Single weight exercise - apply multiplier
          const multiplier = rules?.weightMultiplier || 1;
          actualWeight = (Number(row.weight) || 0) * multiplier;
        } else if (row.total_weight) {
          // Use total weight as-is (already calculated)
          actualWeight = Number(row.total_weight) || 0;
        }
        
        if (actualWeight > maxWeight) {
          maxWeight = actualWeight;
        }
      }
      
      if (maxWeight > 0) {
        maxWeights[liftType] = maxWeight;
      }
    }
    
    // Get recent body weight from latest assessment or use default
    const latestAssessment = await db
      .selectFrom('strength_assessments')
      .select('body_weight')
      .where('user_id', '=', ctx.user.id)
      .orderBy('created_at', 'desc')
      .executeTakeFirst();
    
    return {
      maxWeights,
      bodyWeight: latestAssessment?.body_weight ? Number(latestAssessment.body_weight) : null,
      dataSource: 'workout_sessions',
      lastUpdated: new Date().toISOString(),
    };
  });