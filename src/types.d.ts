
 type WorkoutDay = 'day1' | 'day2' | 'day3';

interface SetEntry {
  weight: number | string;
  reps: number;
  completed: boolean;
  rpe?: number;
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
  duration?: number;
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

interface SetEntry {
  weight: number | string;
  reps: number;
  completed: boolean;
  rpe?: number;
}

interface ExerciseEntry {
  exerciseName: string;
  sets: SetEntry[];
  useBosoBall?: boolean;
  bandType?: string;
  notes?: string;
}

interface Suggestion {
  suggestedWeight: number;
  lastWeight: number;
  avgRpe: number;
}

type WorkoutPhase = 'selection' | 'setup' | 'tracking' | 'complete';
