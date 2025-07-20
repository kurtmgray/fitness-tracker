// Data normalization utilities for fitness tracker

import type { EquipmentType } from '@/components/shared/EquipmentSelector';

// Exercise name mapping from your data to our standardized names
const EXERCISE_NAME_MAPPING: Record<string, string> = {
  'Back Squat': 'Barbell Back Squat',
  'Barbell Back Squat': 'Barbell Back Squat',
  'Romanian DL': 'Barbell Romanian Deadlift',
  'Barbell Romanian Deadlift': 'Barbell Romanian Deadlift',
  'Russian': 'Russian Twist',
  'Russian Twist': 'Russian Twist',
  'DB Overhead': 'Dumbbell Overhead Press',
  'Dumbbell Overhead Press': 'Dumbbell Overhead Press',
  'Pullups': 'Pull-Ups with Bands',
  'Pull-Ups with Bands': 'Pull-Ups with Bands',
  'Bear': 'Bear Pos w/ Sliding Weight',
  'Bear Pos w/ Sliding Weight': 'Bear Pos w/ Sliding Weight',
  'Deadlift': 'Barbell Deadlift',
  'Barbell Deadlift': 'Barbell Deadlift',
  'DB Incline': 'Dumbbell Incline Press',
  'Dumbbell Incline Press': 'Dumbbell Incline Press',
  'Def. Pushups': 'Deficit Pushups',
  'Deficit Pushups': 'Deficit Pushups',
  'Bulgarian': 'Bulgarian Split Squats',
  'Bulgarian Split Squats': 'Bulgarian Split Squats',
  'Farmer\'s': 'Farmer\'s Carry',
  'Farmer\'s Carry': 'Farmer\'s Carry',
  'Pullover': 'Glute Bridge Pullover',
  'Glute Bridge Pullover': 'Glute Bridge Pullover',
  'Goblet': 'Goblet Squat (Pause)',
  'Goblet Squat (Pause at Bottom)': 'Goblet Squat (Pause)',
  'Bench Press': 'Barbell Bench Press',
  'Barbell Bench Press': 'Barbell Bench Press',
  'Lateral Raise': 'Dumbbell Lateral Raises',
  'Dumbbell Lateral Raises': 'Dumbbell Lateral Raises',
  'Halo Chop': 'KB Halo / Chop',
  'KB Halo / Chop': 'KB Halo / Chop',
  'Rows': 'Chest Supported DB Rows',
  'Bent-over Rows': 'Barbell Rows',
  'Bent Over BB Rows': 'Barbell Rows',
  'Palloff': 'Palloff Press',
  'Palloff Press': 'Palloff Press',
};

// Equipment parsing from your notation
const parseEquipment = (equipmentStr: string): EquipmentType => {
  const lower = equipmentStr.toLowerCase();
  if (lower.includes('barbell') || lower.includes('bb')) return 'barbell';
  if (lower.includes('dumbbell') || lower.includes('db')) return 'dumbbell';
  if (lower.includes('kettlebell') || lower.includes('kb')) return 'kettlebell';
  if (lower.includes('bodyweight') || lower.includes('bw')) return 'bodyweight';
  if (lower.includes('plate')) return 'plate';
  if (lower.includes('band')) return 'band';
  return 'barbell'; // default
};

// Parse weight from various formats
const parseWeight = (weightStr: string): { weight?: number; weightLeft?: number; weightRight?: number; } => {
  if (!weightStr || weightStr.toLowerCase().includes('bw')) {
    return {};
  }

  // Remove units and extra characters
  const cleaned = weightStr.replace(/[#\s]/g, '');
  
  // Check for dual weights: "25,44" or "25/44" or "53x2"
  if (cleaned.includes(',') || cleaned.includes('/')) {
    const parts = cleaned.split(/[,/]/).map(p => parseFloat(p)).filter(n => !isNaN(n));
    if (parts.length === 2) {
      return { weightLeft: parts[0], weightRight: parts[1] };
    }
  }
  
  // Check for "53x2" format (same weight both hands)
  if (cleaned.includes('x2')) {
    const weight = parseFloat(cleaned.replace('x2', ''));
    if (!isNaN(weight)) {
      return { weightLeft: weight, weightRight: weight };
    }
  }
  
  // Single weight
  const weight = parseFloat(cleaned);
  if (!isNaN(weight)) {
    return { weight };
  }
  
  return {};
};

// Parse reps from various formats
const parseReps = (repsStr: string): { reps?: number; timeSeconds?: number; isFailure?: boolean; } => {
  if (!repsStr) return {};
  
  const lower = repsStr.toLowerCase();
  
  // Failure sets
  if (lower.includes('failure') || lower.includes('bwf')) {
    return { isFailure: true };
  }
  
  // Time-based: "2m" -> 120 seconds
  if (lower.includes('m') && !lower.includes('min')) {
    const minutes = parseFloat(repsStr.replace(/[m\s]/g, ''));
    if (!isNaN(minutes)) {
      return { timeSeconds: minutes * 60 };
    }
  }
  
  // Regular reps with multiplier: "10x2" -> 10 reps
  const repsMatch = repsStr.match(/(\d+)(?:x\d+)?/);
  if (repsMatch) {
    return { reps: parseInt(repsMatch[1]) };
  }
  
  // Just a number
  const reps = parseInt(repsStr);
  if (!isNaN(reps)) {
    return { reps };
  }
  
  return {};
};

// Parse band configuration
const parseBandConfig = (bandStr: string): { name: string; colors: string[]; } | null => {
  if (!bandStr) return null;
  
  const lower = bandStr.toLowerCase();
  
  if (lower.includes('red') && lower.includes('blue')) {
    return { name: 'Red + Blue', colors: ['red', 'blue'] };
  }
  if (lower.includes('red')) {
    return { name: 'Red', colors: ['red'] };
  }
  if (lower.includes('blue')) {
    return { name: 'Blue', colors: ['blue'] };
  }
  if (lower.includes('yellow')) {
    return { name: 'Yellow', colors: ['yellow'] };
  }
  if (lower.includes('black')) {
    return { name: 'Black', colors: ['black'] };
  }
  
  return { name: 'Red + Blue', colors: ['red', 'blue'] }; // default
};

// Normalize a single set
export const normalizeSet = (
  setData: {
    reps?: string;
    weight1?: string;
    weight2?: string;
    weight?: string;
  }
): {
  weight?: number;
  weightLeft?: number;
  weightRight?: number;
  reps?: number;
  timeSeconds?: number;
  isFailure?: boolean;
  completed: boolean;
} => {
  // Parse reps/time
  const repsData = parseReps(setData.reps || '');
  
  // Parse weights
  let weightData = {};
  
  if (setData.weight1 && setData.weight2) {
    // Dual weight format
    const w1 = parseWeight(setData.weight1);
    const w2 = parseWeight(setData.weight2);
    weightData = {
      weightLeft: w1.weight || 0,
      weightRight: w2.weight || 0,
    };
  } else if (setData.weight1) {
    // Single weight in weight1 column
    weightData = parseWeight(setData.weight1);
  } else if (setData.weight) {
    // Weight in combined format
    weightData = parseWeight(setData.weight);
  }
  
  return {
    ...weightData,
    ...repsData,
    completed: true,
  };
};

// Normalize exercise data
export const normalizeExercise = (
  exerciseData: {
    abbreviation?: string;
    exercise?: string;
    equipment?: string;
    sets?: number;
    reps?: string;
    suggWeight?: string;
    sets_data?: Array<{
      reps?: string;
      weight1?: string;
      weight2?: string;
      weight?: string;
    }>;
  }
): {
  exerciseName: string;
  equipment: EquipmentType;
  bandConfiguration?: { name: string; colors: string[]; };
  sets: Array<{
    weight?: number;
    weightLeft?: number;
    weightRight?: number;
    reps?: number;
    timeSeconds?: number;
    isFailure?: boolean;
    completed: boolean;
  }>;
} => {
  // Map exercise name
  const rawName = exerciseData.exercise || exerciseData.abbreviation || '';
  const exerciseName = EXERCISE_NAME_MAPPING[rawName] || rawName;
  
  // Parse equipment
  const equipment = parseEquipment(exerciseData.equipment || '');
  
  // Parse band configuration if it's a band exercise
  let bandConfiguration;
  if (equipment === 'band' && exerciseData.suggWeight) {
    bandConfiguration = parseBandConfig(exerciseData.suggWeight);
  }
  
  // Normalize sets
  const sets = (exerciseData.sets_data || []).map(setData => 
    normalizeSet(setData, exerciseName, equipment)
  );
  
  return {
    exerciseName,
    equipment,
    bandConfiguration: bandConfiguration || undefined,
    sets,
  };
};

// Normalize full workout day
export const normalizeWorkoutDay = (
  dayData: {
    dayTitle?: string;
    dayType?: 'day1' | 'day2' | 'day3';
    date?: Date;
    exercises: Array<any>;
  }
): {
  dayType: 'day1' | 'day2' | 'day3';
  date: Date;
  exercises: Array<ReturnType<typeof normalizeExercise>>;
  equipmentPreferences: Record<string, EquipmentType>;
} => {
  const exercises = dayData.exercises.map(normalizeExercise);
  
  // Build equipment preferences map
  const equipmentPreferences: Record<string, EquipmentType> = {};
  exercises.forEach(exercise => {
    equipmentPreferences[exercise.exerciseName] = exercise.equipment;
  });
  
  return {
    dayType: dayData.dayType || 'day1',
    date: dayData.date || new Date(),
    exercises,
    equipmentPreferences,
  };
};

// Example usage for your data
export const normalizeYourData = () => {
  // This would be called with your actual spreadsheet data
  // after parsing it into the intermediate format
  
  const week1Day1 = {
    dayType: 'day1' as const,
    date: new Date('2025-01-13'),
    exercises: [
      {
        abbreviation: 'Back Squat',
        exercise: 'Barbell Back Squat',
        equipment: 'Barbell',
        sets_data: [
          { reps: '6', weight1: '195' },
          { reps: '6', weight1: '195' },
          { reps: '6', weight1: '195' },
          { reps: '6', weight1: '195' },
        ]
      },
      {
        abbreviation: 'Bulgarian',
        exercise: 'Bulgarian Split Squats',
        equipment: 'Kettlebell or Plate',
        sets_data: [
          { reps: '8', weight1: '25', weight2: '44' },
          { reps: '8', weight1: '25', weight2: '44' },
          { reps: '8', weight1: '25', weight2: '44' },
        ]
      },
      {
        abbreviation: 'Farmer\'s',
        exercise: 'Farmer\'s Carry',
        equipment: 'Kettlebell or Plate',
        sets_data: [
          { reps: '2m', weight1: '53', weight2: '44' },
          { reps: '2m', weight1: '44', weight2: '53' },
          { reps: '2m', weight1: '53', weight2: '44' },
        ]
      },
      {
        abbreviation: 'Def. Pushups',
        exercise: 'Deficit Pushups',
        equipment: 'Bodyweight',
        sets_data: [
          { reps: '45', weight1: 'BW' },
          { reps: '45', weight1: 'BW' },
        ]
      },
    ]
  };
  
  return normalizeWorkoutDay(week1Day1);
};