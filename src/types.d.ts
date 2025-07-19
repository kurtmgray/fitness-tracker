
type WorkoutDay = 'day1' | 'day2' | 'day3';

interface SetEntry {
  weight: number | null; // Primary weight or null for bodyweight
  weightLeft?: number | null; // Left hand weight for asymmetric exercises
  weightRight?: number | null; // Right hand weight for asymmetric exercises
  reps: number;
  completed: boolean;
  rpe?: number; // 1-10 
  equipment?: {
    type: 'barbell' | 'dumbbell' | 'kettlebell' | 'bodyweight' | 'plate' | 'band';
    modifier?: 'per_hand' | 'total' | 'asymmetric';
    note?: string;
  };
}

interface ExerciseEntry {
  exerciseName: string;
  sets: SetEntry[];
  useBosoBall?: boolean;
  bandType?: string;
  notes?: string;
}

interface WorkoutSession {
  id: string;
  date: Date;
  day: WorkoutDay;
  exercises: ExerciseEntry[];
  duration?: number; // minutes
  notes?: string;
}

interface WeekData {
  weekStartDate: Date;
  workouts: WorkoutSession[];
}

interface ExerciseTemplate {
  name: string;
  sets: number;
  reps: string;
  weightType: string;
  hasBosoBallOption?: boolean;
  isTimeBased?: boolean;
  isFailure?: boolean;
  notes?: string;
}

interface Suggestion {
  suggestedWeight: number;
  lastWeight: number;
  avgRpe: number;
}

type WorkoutPhase = 'selection' | 'setup' | 'tracking' | 'complete';

interface DbWorkoutSession {
  id: string;
  user_id: string;
  template_id?: string;
  date: string; // ISO date string
  day_type: string;
  duration_minutes?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface DbSessionExercise {
  id: string;
  session_id: string;
  exercise_id: string;
  order_index: number;
  use_bosu_ball: boolean;
  band_type?: string;
  notes?: string;
  created_at: string;
}

interface DbSessionSet {
  id: string;
  session_exercise_id: string;
  set_number: number;
  weight?: number; // Primary weight - Decimal in DB
  weight_left?: number; // Left hand weight for asymmetric exercises
  weight_right?: number; // Right hand weight for asymmetric exercises
  reps: number;
  rpe?: number;
  completed: boolean;
  equipment_type?: 'barbell' | 'dumbbell' | 'kettlebell' | 'bodyweight' | 'plate' | 'band';
  equipment_modifier?: 'per_hand' | 'total' | 'asymmetric';
  equipment_note?: string;
  created_at: string;
}
