import type { Equipment, EquipmentType, EquipmentModifier } from '../types/equipment';

// Transform mixed weight strings to structured data
export const parseWeightString = (weightValue: string | number): {
  weight: number | null;
  equipment?: Equipment;
} => {
  // Handle numeric weights (barbell exercises)
  if (typeof weightValue === 'number') {
    return {
      weight: weightValue,
      equipment: { type: 'barbell' }
    };
  }

  const weightStr = weightValue.toString().trim();

  // Handle bodyweight
  if (weightStr === 'BW') {
    return {
      weight: null,
      equipment: { type: 'bodyweight' }
    };
  }

  // Handle complex weight strings
  const patterns = [
    // "45# DB" pattern
    { 
      regex: /^(\d+)#?\s*DB$/i,
      type: 'dumbbell' as EquipmentType,
      modifier: 'per_hand' as EquipmentModifier
    },
    // "44# KB" pattern
    { 
      regex: /^(\d+)#?\s*KB$/i,
      type: 'kettlebell' as EquipmentType
    },
    // "25/44# KB" pattern (complex Bulgarian split squats)
    { 
      regex: /^(\d+)\/(\d+)#?\s*KB$/i,
      type: 'kettlebell' as EquipmentType,
      note: 'alternating weights'
    },
    // Just numbers with # (assume barbell)
    { 
      regex: /^(\d+)#?$/,
      type: 'barbell' as EquipmentType
    }
  ];

  for (const pattern of patterns) {
    const match = weightStr.match(pattern.regex);
    if (match) {
      const weight = parseInt(match[1]);
      const equipment: Equipment = {
        type: pattern.type,
        ...(pattern.modifier && { modifier: pattern.modifier }),
        ...(pattern.note && { note: pattern.note })
      };

      return { weight, equipment };
    }
  }

  // Fallback: try to extract just the number
  const numberMatch = weightStr.match(/(\d+)/);
  if (numberMatch) {
    return {
      weight: parseInt(numberMatch[1]),
      equipment: { type: 'barbell' } // Default to barbell
    };
  }

  // Can't parse, return as-is but log warning
  console.warn(`Could not parse weight string: ${weightStr}`);
  return {
    weight: null,
    equipment: { type: 'bodyweight' }
  };
};

// Transform a workout set to the new structure
export const transformWorkoutSet = (set: any): any => {
  const parsed = parseWeightString(set.weight);
  
  return {
    ...set,
    weight: parsed.weight,
    equipment: parsed.equipment
  };
};

// Transform an entire exercise
export const transformExercise = (exercise: any): any => {
  return {
    ...exercise,
    sets: exercise.sets.map(transformWorkoutSet)
  };
};

// Transform an entire workout
export const transformWorkout = (workout: any): any => {
  return {
    ...workout,
    exercises: workout.exercises.map(transformExercise)
  };
};

// Transform entire workout data
export const transformWorkoutData = (workoutData: any[]): any[] => {
  return workoutData.map(week => ({
    ...week,
    workouts: week.workouts.map(transformWorkout)
  }));
};