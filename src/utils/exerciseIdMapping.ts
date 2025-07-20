// Exercise ID constants for database exercise matching
// These IDs correspond to exercises in the database and should be used
// instead of name-based matching for workout history and templates

export const EXERCISE_IDS = {
  // Day 1 Exercises
  BARBELL_BACK_SQUAT: 'f228a3dc-772d-410e-925c-88d375601d9e',
  BARBELL_ROMANIAN_DEADLIFT: '7c37b01f-6c6c-4968-a7d7-c0167e40e25e',
  RUSSIAN_TWIST: '310fc57e-e082-4b3e-ac9d-a9faced278d1',
  DUMBBELL_OVERHEAD_PRESS: 'dc787215-87b3-428e-93c9-57cec853cdfd',
  PULL_UPS_WITH_BANDS: '05c15c10-dda4-4405-b981-8217b3ecdb91',
  BEAR_POS_W_SLIDING_WEIGHT: 'cb4f78f4-6203-406c-8e3e-df14d4c7236b',

  // Day 2 Exercises  
  BARBELL_DEADLIFT: 'e45bb281-0666-4b6b-b8bf-c7f0dbf37b9f',
  DUMBBELL_INCLINE_PRESS: '69a6f942-d109-4c91-a5cd-b1fe4e532590',
  DEFICIT_PUSHUPS: '96795efe-202f-4cda-984d-58d15fa3278d',
  BULGARIAN_SPLIT_SQUATS: 'b2fe0201-2c63-498d-9300-4eb09174b7c8',
  FARMERS_CARRY: '74dae024-de5e-4517-925e-addce23d79d0', // Updated to canonical ID
  GLUTE_BRIDGE_PULLOVER: '7e8abf3e-9fcf-44cd-8e01-ed71b566f1ee',

  // Day 3 Exercises
  GOBLET_SQUAT_PAUSE: 'a66cab0c-7cee-4f66-aefc-addae56da858',
  BARBELL_BENCH_PRESS: '04686f53-7225-44bd-b4c5-734fa5e0e563',
  DUMBBELL_LATERAL_RAISES: 'f102b02b-9ac0-495f-a8e2-cd5cf6c992bd',
  KB_HALO_CHOP: 'db496217-1598-4b51-9759-a195c2dcf9fd',
  BARBELL_ROWS: 'edd43650-e34b-4acd-81df-198b9387c3cb', // Updated to canonical name and ID
  PALLOFF_PRESS: 'eac59be5-3dd6-4683-8045-96927f3389c6',
} as const;

// Exercise name to ID mapping for workout history matching
export const EXERCISE_NAME_TO_ID: Record<string, string> = {
  // Canonical names -> Database IDs (exactly as they appear in database)
  'Barbell Back Squat': EXERCISE_IDS.BARBELL_BACK_SQUAT,
  'Barbell Romanian Deadlift': EXERCISE_IDS.BARBELL_ROMANIAN_DEADLIFT,
  'Russian Twist': EXERCISE_IDS.RUSSIAN_TWIST,
  'Dumbbell Overhead Press': EXERCISE_IDS.DUMBBELL_OVERHEAD_PRESS,
  'Pull-Ups with Bands': EXERCISE_IDS.PULL_UPS_WITH_BANDS,
  'Bear Pos w/ Sliding Weight': EXERCISE_IDS.BEAR_POS_W_SLIDING_WEIGHT,
  
  'Barbell Deadlift': EXERCISE_IDS.BARBELL_DEADLIFT,
  'Dumbbell Incline Press': EXERCISE_IDS.DUMBBELL_INCLINE_PRESS,
  'Deficit Pushups': EXERCISE_IDS.DEFICIT_PUSHUPS,
  'Bulgarian Split Squats': EXERCISE_IDS.BULGARIAN_SPLIT_SQUATS,
  'Farmer\'s Carry': EXERCISE_IDS.FARMERS_CARRY, // Updated to canonical name
  'Glute Bridge Pullover': EXERCISE_IDS.GLUTE_BRIDGE_PULLOVER,
  
  'Goblet Squat (Pause)': EXERCISE_IDS.GOBLET_SQUAT_PAUSE,
  'Barbell Bench Press': EXERCISE_IDS.BARBELL_BENCH_PRESS,
  'Dumbbell Lateral Raises': EXERCISE_IDS.DUMBBELL_LATERAL_RAISES,
  'KB Halo / Chop': EXERCISE_IDS.KB_HALO_CHOP,
  'Barbell Rows': EXERCISE_IDS.BARBELL_ROWS, // Updated to canonical name
  'Palloff Press': EXERCISE_IDS.PALLOFF_PRESS,
};

// Helper function to get exercise ID by name
export function getExerciseIdByName(exerciseName: string): string | null {
  return EXERCISE_NAME_TO_ID[exerciseName] || null;
}

// Helper function to match exercise by ID in workout history
export function findExerciseInWorkoutById(
  workout: WorkoutSession | null, 
  exerciseId: string
): ExerciseEntry | null {
  if (!workout) return null;
  
  // Now that workout history includes exerciseId, we can match directly by ID
  const found = workout.exercises.find(ex => ex.exerciseId === exerciseId);
  
  return found || null;
}

// Type for exercise ID keys
export type ExerciseId = typeof EXERCISE_IDS[keyof typeof EXERCISE_IDS];