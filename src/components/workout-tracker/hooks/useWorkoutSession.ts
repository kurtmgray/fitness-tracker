import { useState } from 'react';
import { useWorkoutHistory } from './useWorkoutHistory';
import { useWorkoutSuggestions } from './useWorkoutSuggestions';

const workoutTemplates: Record<WorkoutDay, ExerciseTemplate[]> = {
  day1: [
    { name: 'Barbell Back Squat', sets: 4, reps: '6', weightType: 'barbell' },
    {
      name: 'Barbell Romanian Deadlift',
      sets: 3,
      reps: '8-10',
      weightType: 'barbell',
    },
    { name: 'Russian Twist', sets: 3, reps: '15', weightType: 'kettlebell' },
    {
      name: 'Dumbbell Overhead Press',
      sets: 3,
      reps: '6-8',
      weightType: 'dumbbell',
    },
    {
      name: 'Pull-Ups with Bands',
      sets: 3,
      reps: '6-8',
      weightType: 'bodyweight',
    },
    {
      name: 'Bear Pos w/ Sliding Weight',
      sets: 3,
      reps: '10x2',
      weightType: 'plate',
    },
  ],
  day2: [
    { name: 'Barbell Deadlift', sets: 4, reps: '5', weightType: 'barbell' },
    {
      name: 'Dumbbell Incline Press',
      sets: 3,
      reps: '6-8',
      weightType: 'dumbbell',
    },
    {
      name: 'Deficit Pushups',
      sets: 2,
      reps: 'Failure',
      weightType: 'bodyweight',
      isFailure: true,
    },
    {
      name: 'Bulgarian Split Squats',
      sets: 3,
      reps: '8 per leg',
      weightType: 'kettlebell',
    },
    {
      name: "Farmer's Carry",
      sets: 3,
      reps: '40 yards',
      weightType: 'kettlebell',
      isTimeBased: true,
    },
    {
      name: 'Glute Bridge Pullover',
      sets: 3,
      reps: '20',
      weightType: 'plate',
    },
  ],
  day3: [
    {
      name: 'Goblet Squat (Pause)',
      sets: 3,
      reps: '6-8',
      weightType: 'kettlebell',
      hasBosoBallOption: true,
    },
    {
      name: 'Barbell Bench Press',
      sets: 4,
      reps: '6',
      weightType: 'barbell',
    },
    {
      name: 'Dumbbell Lateral Raises',
      sets: 3,
      reps: '15',
      weightType: 'dumbbell',
    },
    {
      name: 'KB Halo / Chop',
      sets: 3,
      reps: '10x2',
      weightType: 'kettlebell',
    },
    {
      name: 'Chest Supported DB Rows',
      sets: 3,
      reps: '12',
      weightType: 'dumbbell',
    },
    { name: 'Palloff Press', sets: 3, reps: '10x2', weightType: 'band' },
  ],
};

const dayTitles: Record<WorkoutDay, string> = {
  day1: 'Pull & Lower Focus',
  day2: 'Push & Functional Focus',
  day3: 'Balanced Hypertrophy & Stability',
};

export const useWorkoutSession = () => {
  const [currentPhase, setCurrentPhase] = useState<WorkoutPhase>('selection');
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [exerciseSetProgress, setExerciseSetProgress] = useState<Record<number, number>>({});

  const { getLastWorkout, addWorkoutToHistory } = useWorkoutHistory();
  const { getSuggestedWeight } = useWorkoutSuggestions();

  const initializeSession = (day: WorkoutDay): void => {
    const template = workoutTemplates[day];
    const lastWorkout = getLastWorkout(day);

    const exercises: ExerciseEntry[] = template.map((exercise) => {
      const suggestedWeight = getSuggestedWeight(exercise, lastWorkout);

      return {
        exerciseName: exercise.name,
        sets: Array(exercise.sets)
          .fill(null)
          .map(() => ({
            weight: suggestedWeight,
            reps: parseInt(exercise.reps.split('-')[0]) || 8,
            completed: false,
            rpe: undefined,
          })),
        useBosoBall: false,
      };
    });

    const session: WorkoutSession = {
      id: `workout-${Date.now()}`,
      date: new Date(),
      day,
      exercises,
      duration: 0,
    };

    setCurrentSession(session);
    setSelectedDay(day);
  };

  const startWorkout = () => {
    setCurrentPhase('tracking');
    setCurrentExerciseIndex(0);
    setCurrentSetIndex(0);
    setExerciseSetProgress({});
  };

  const completeWorkout = () => {
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        duration: Math.floor(Math.random() * 30) + 45, // Mock duration
      };
      addWorkoutToHistory(completedSession);
    }
    setCurrentPhase('complete');
  };

  const resetSession = () => {
    setCurrentPhase('selection');
    setSelectedDay(null);
    setCurrentSession(null);
    setCurrentExerciseIndex(0);
    setCurrentSetIndex(0);
    setExerciseSetProgress({});
  };

  const selectDay = (day: WorkoutDay) => {
    setSelectedDay(day);
    initializeSession(day);
    setCurrentPhase('setup');
  };

  const updateCurrentSet = (weight: number, reps: number, rpe?: number) => {
    if (!currentSession) return;

    const updatedSession = { ...currentSession };
    const currentExercise = updatedSession.exercises[currentExerciseIndex];
    
    if (currentExercise) {
      currentExercise.sets[currentSetIndex] = {
        weight,
        reps,
        completed: true,
        rpe,
      };
      setCurrentSession(updatedSession);
    }
  };

  const nextSet = () => {
    if (!currentSession) return;

    const currentExercise = currentSession.exercises[currentExerciseIndex];
    
    if (currentSetIndex < currentExercise.sets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
    } else if (currentExerciseIndex < currentSession.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
      setExerciseSetProgress(prev => ({
        ...prev,
        [currentExerciseIndex]: currentExercise.sets.length
      }));
    } else {
      completeWorkout();
    }
  };

  return {
    // State
    currentPhase,
    selectedDay,
    currentSession,
    currentExerciseIndex,
    currentSetIndex,
    exerciseSetProgress,
    
    // Data
    workoutTemplates,
    dayTitles,
    
    // Actions
    selectDay,
    startWorkout,
    completeWorkout,
    resetSession,
    updateCurrentSet,
    nextSet,
    setCurrentPhase,
    
    // Helpers
    getLastWorkout,
  };
};