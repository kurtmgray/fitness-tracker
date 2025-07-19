// Exercise-based equipment and calculation utilities

export interface ExerciseEquipmentRules {
  exerciseName: string;
  defaultEquipment: string;
  weightMultiplier: number;
  trackingType: 'reps' | 'time' | 'failure';
  supportsDualWeights?: boolean; // True if exercise can use different weights per hand
}

// Hardcoded exercise rules based on our 19 exercises
// This matches the database seed data
export const EXERCISE_EQUIPMENT_RULES: Record<string, ExerciseEquipmentRules> = {
  'Barbell Back Squat': {
    exerciseName: 'Barbell Back Squat',
    defaultEquipment: 'barbell',
    weightMultiplier: 1,
    trackingType: 'reps'
  },
  'Barbell Romanian Deadlift': {
    exerciseName: 'Barbell Romanian Deadlift', 
    defaultEquipment: 'barbell',
    weightMultiplier: 1,
    trackingType: 'reps'
  },
  'Russian Twist': {
    exerciseName: 'Russian Twist',
    defaultEquipment: 'kettlebell',
    weightMultiplier: 1,
    trackingType: 'reps'
  },
  'Dumbbell Overhead Press': {
    exerciseName: 'Dumbbell Overhead Press',
    defaultEquipment: 'dumbbell',
    weightMultiplier: 2,
    trackingType: 'reps'
  },
  'Pull-Ups with Bands': {
    exerciseName: 'Pull-Ups with Bands',
    defaultEquipment: 'bodyweight',
    weightMultiplier: 1,
    trackingType: 'reps'
  },
  'Bear Pos w/ Sliding Weight': {
    exerciseName: 'Bear Pos w/ Sliding Weight',
    defaultEquipment: 'plate',
    weightMultiplier: 1,
    trackingType: 'reps'
  },
  'Barbell Deadlift': {
    exerciseName: 'Barbell Deadlift',
    defaultEquipment: 'barbell',
    weightMultiplier: 1,
    trackingType: 'reps'
  },
  'Dumbbell Incline Press': {
    exerciseName: 'Dumbbell Incline Press',
    defaultEquipment: 'dumbbell',
    weightMultiplier: 2,
    trackingType: 'reps'
  },
  'Deficit Pushups': {
    exerciseName: 'Deficit Pushups',
    defaultEquipment: 'bodyweight',
    weightMultiplier: 1,
    trackingType: 'failure'
  },
  'Bulgarian Split Squats': {
    exerciseName: 'Bulgarian Split Squats',
    defaultEquipment: 'kettlebell',
    weightMultiplier: 2,
    trackingType: 'reps',
    supportsDualWeights: true
  },
  'Farmers Carry': {
    exerciseName: 'Farmers Carry',
    defaultEquipment: 'kettlebell',
    weightMultiplier: 2,
    trackingType: 'time',
    supportsDualWeights: true
  },
  "Farmer's Carry": {
    exerciseName: "Farmer's Carry",
    defaultEquipment: 'kettlebell',
    weightMultiplier: 2,
    trackingType: 'time',
    supportsDualWeights: true
  },
  'Glute Bridge Pullover': {
    exerciseName: 'Glute Bridge Pullover',
    defaultEquipment: 'plate',
    weightMultiplier: 1,
    trackingType: 'reps'
  },
  'Goblet Squat (Pause)': {
    exerciseName: 'Goblet Squat (Pause)',
    defaultEquipment: 'kettlebell',
    weightMultiplier: 1,
    trackingType: 'reps'
  },
  'Barbell Bench Press': {
    exerciseName: 'Barbell Bench Press',
    defaultEquipment: 'barbell',
    weightMultiplier: 1,
    trackingType: 'reps'
  },
  'Dumbbell Lateral Raises': {
    exerciseName: 'Dumbbell Lateral Raises',
    defaultEquipment: 'dumbbell',
    weightMultiplier: 2,
    trackingType: 'reps'
  },
  'KB Halo / Chop': {
    exerciseName: 'KB Halo / Chop',
    defaultEquipment: 'kettlebell',
    weightMultiplier: 1,
    trackingType: 'reps'
  },
  'Chest Supported DB Rows': {
    exerciseName: 'Chest Supported DB Rows',
    defaultEquipment: 'dumbbell',
    weightMultiplier: 2,
    trackingType: 'reps'
  },
  'Barbell Rows': {
    exerciseName: 'Barbell Rows',
    defaultEquipment: 'barbell',
    weightMultiplier: 1,
    trackingType: 'reps'
  },
  'Palloff Press': {
    exerciseName: 'Palloff Press',
    defaultEquipment: 'bodyweight',
    weightMultiplier: 1,
    trackingType: 'reps'
  }
};

// Get exercise equipment rules by name
export const getExerciseRules = (exerciseName: string): ExerciseEquipmentRules | null => {
  return EXERCISE_EQUIPMENT_RULES[exerciseName] || null;
};

// Calculate total weight based on exercise rules (legacy single weight)
export const calculateExerciseWeight = (exerciseName: string, inputWeight: number | null): number => {
  if (inputWeight === null) return 0;
  
  const rules = getExerciseRules(exerciseName);
  if (!rules) return inputWeight;
  
  // Bodyweight exercises use estimated bodyweight for calculations
  if (rules.defaultEquipment === 'bodyweight') {
    return 185; // Estimated bodyweight
  }
  
  return inputWeight * rules.weightMultiplier;
};

// Calculate total weight for any set (handles both single and dual weights)
export const calculateTotalWeight = (
  exerciseName: string,
  weight?: number | null,
  weightLeft?: number | null,
  weightRight?: number | null
): number => {
  const rules = getExerciseRules(exerciseName);
  
  // Bodyweight exercises
  if (rules?.defaultEquipment === 'bodyweight') {
    return 185; // Estimated bodyweight
  }
  
  // Dual weight exercises
  if (weightLeft !== undefined && weightRight !== undefined) {
    return (weightLeft || 0) + (weightRight || 0);
  }
  
  // Single weight exercises
  if (weight !== null && weight !== undefined) {
    return weight * (rules?.weightMultiplier || 1);
  }
  
  return 0;
};

// Get equipment display for an exercise
export const getExerciseEquipmentDisplay = (exerciseName: string): string => {
  const rules = getExerciseRules(exerciseName);
  if (!rules) return '';
  
  const equipmentLabels: Record<string, string> = {
    'barbell': 'BB',
    'dumbbell': 'DB',
    'kettlebell': 'KB', 
    'bodyweight': 'BW',
    'plate': 'PL',
    'band': 'BD'
  };
  
  return equipmentLabels[rules.defaultEquipment] || '';
};

// Format weight display with equipment context
export const formatExerciseWeight = (exerciseName: string, weight: number | null): string => {
  const rules = getExerciseRules(exerciseName);
  if (!rules) return weight?.toString() || '0';
  
  if (weight === null || rules.defaultEquipment === 'bodyweight') {
    return 'BW';
  }
  
  const equipmentLabel = getExerciseEquipmentDisplay(exerciseName);
  
  if (rules.weightMultiplier === 2) {
    const total = weight * 2;
    return `${weight} × 2 = ${total} lbs (${equipmentLabel})`;
  }
  
  return `${weight} lbs (${equipmentLabel})`;
};

// Check if exercise is bodyweight
export const isBodyweightExercise = (exerciseName: string): boolean => {
  const rules = getExerciseRules(exerciseName);
  return rules?.defaultEquipment === 'bodyweight' || false;
};

// Check if exercise uses dumbbells (weight multiplier)
export const isDumbbellExercise = (exerciseName: string): boolean => {
  const rules = getExerciseRules(exerciseName);
  return rules?.defaultEquipment === 'dumbbell' || false;
};

// Get tracking type for exercise
export const getExerciseTrackingType = (exerciseName: string): 'reps' | 'time' | 'failure' => {
  const rules = getExerciseRules(exerciseName);
  return rules?.trackingType || 'reps';
};

// Check if exercise is time-based
export const isTimeBased = (exerciseName: string): boolean => {
  return getExerciseTrackingType(exerciseName) === 'time';
};

// Get appropriate label for reps/time field
export const getRepsLabel = (exerciseName: string): string => {
  return isTimeBased(exerciseName) ? 'Target Time (seconds)' : 'Target Reps';
};

// Get appropriate unit for display
export const getRepsUnit = (exerciseName: string): string => {
  return isTimeBased(exerciseName) ? 'seconds' : 'reps';
};

// Check if exercise supports different weights per hand
export const supportsDualWeights = (exerciseName: string): boolean => {
  const rules = getExerciseRules(exerciseName);
  return rules?.supportsDualWeights || false;
};

// Calculate total weight for dual weight exercises
export const calculateDualWeight = (weightLeft: number | null, weightRight: number | null): number | null => {
  if (weightLeft === null && weightRight === null) return null;
  return (weightLeft || 0) + (weightRight || 0);
};

// Format dual weight display
export const formatDualWeight = (exerciseName: string, weightLeft: number | null, weightRight: number | null): string => {
  if (!supportsDualWeights(exerciseName)) {
    return formatExerciseWeight(exerciseName, weightLeft || weightRight);
  }
  
  const rules = getExerciseRules(exerciseName);
  if (rules?.defaultEquipment === 'bodyweight') return 'BW';
  
  if (weightLeft === null && weightRight === null) return '0 lbs';
  
  const left = weightLeft || 0;
  const right = weightRight || 0;
  const total = left + right;
  
  if (left === right && left > 0) {
    return `${left} × 2 = ${total} lbs`;
  } else {
    return `${left} + ${right} = ${total} lbs`;
  }
};

// Format any set weight (single or dual)
export const formatSetWeight = (
  exerciseName: string,
  weight?: number | null,
  weightLeft?: number | null,
  weightRight?: number | null
): string => {
  const rules = getExerciseRules(exerciseName);
  
  // Bodyweight exercises
  if (rules?.defaultEquipment === 'bodyweight') {
    return 'BW';
  }
  
  // Dual weight exercises
  if (supportsDualWeights(exerciseName) && (weightLeft !== undefined || weightRight !== undefined)) {
    return formatDualWeight(exerciseName, weightLeft || null, weightRight || null);
  }
  
  // Single weight exercises
  if (weight !== null && weight !== undefined) {
    return formatExerciseWeight(exerciseName, weight);
  }
  
  return '0 lbs';
};