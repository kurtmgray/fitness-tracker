import { useState } from 'react';
import { useWorkoutHistory } from './useWorkoutHistory';
import { useWorkoutSuggestions } from './useWorkoutSuggestions';
import { supportsDualWeights } from '../../../utils/exerciseUtils';

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
      reps: '30 seconds',
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

  const { workoutHistory, getLastWorkout, addWorkoutToHistory } = useWorkoutHistory();
  const { getSuggestedWeight } = useWorkoutSuggestions();

  const initializeSession = (day: WorkoutDay): void => {
    const template = workoutTemplates[day];
    const lastWorkout = getLastWorkout(day);

    const exercises: ExerciseEntry[] = template.map((exercise) => {
      const suggestedWeight = getSuggestedWeight(exercise, lastWorkout, workoutHistory);

      const isDualWeight = supportsDualWeights(exercise.name);
      
      return {
        exerciseName: exercise.name,
        sets: Array(exercise.sets)
          .fill(null)
          .map(() => ({
            weight: isDualWeight ? null : suggestedWeight,
            weightLeft: isDualWeight ? suggestedWeight : undefined,
            weightRight: isDualWeight ? suggestedWeight : undefined,
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

  const updateSession = (updatedSession: WorkoutSession) => {
    setCurrentSession(updatedSession);
  };

  const completeSet = (weight: number, reps: number, rpe?: number): void => {
    if (!currentSession) return;

    const updatedSession = { ...currentSession };
    const currentSetForExercise = exerciseSetProgress[currentExerciseIndex] || 0;

    updatedSession.exercises[currentExerciseIndex].sets[currentSetForExercise] = {
      weight,
      reps,
      completed: true,
      rpe,
    };

    setCurrentSession(updatedSession);

    const newProgress = { ...exerciseSetProgress };
    newProgress[currentExerciseIndex] = currentSetForExercise + 1;
    setExerciseSetProgress(newProgress);

    const nextExerciseIndex = (currentExerciseIndex + 1) % updatedSession.exercises.length;
    setCurrentExerciseIndex(nextExerciseIndex);

    const isWorkoutComplete = updatedSession.exercises.every((exercise, idx) => {
      const setsCompleted = newProgress[idx] || 0;
      return setsCompleted >= exercise.sets.length;
    });

    if (isWorkoutComplete) {
      setCurrentPhase('complete');
      addWorkoutToHistory(updatedSession);
    }
  };

  const goBack = (): void => {
    if (currentPhase === 'setup') {
      setCurrentPhase('selection');
      setSelectedDay(null);
      setCurrentSession(null);
    } else if (currentPhase === 'tracking') {
      setCurrentPhase('setup');
      setCurrentExerciseIndex(0);
      setCurrentSetIndex(0);
      setExerciseSetProgress({});
    }
  };

  const suggestNextWeight = (lastWeight: number, lastRpe: number, weightType: string): number => {
    let factor: number;

    if (lastRpe <= 6) {
      factor = 1.075;
    } else if (lastRpe <= 7) {
      factor = 1.05;
    } else if (lastRpe <= 8.5) {
      factor = 1.0;
    } else if (lastRpe <= 9) {
      factor = 0.975;
    } else {
      factor = 0.925;
    }

    const suggested = lastWeight * factor;
    const maxIncrease = Math.min(lastWeight * 1.1, lastWeight + 10);
    const minDecrease = Math.max(lastWeight * 0.9, lastWeight - 10);

    let adjusted = suggested > lastWeight ? Math.min(suggested, maxIncrease) : Math.max(suggested, minDecrease);

    if (weightType === 'barbell') {
      return Math.round(adjusted / 5) * 5;
    } else if (weightType === 'dumbbell' || weightType === 'kettlebell') {
      return Math.round(adjusted / 2.5) * 2.5;
    } else {
      return lastWeight;
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
    workoutHistory,
    
    // Data
    workoutTemplates,
    dayTitles,
    
    // Actions
    selectDay,
    startWorkout,
    completeWorkout,
    resetSession,
    updateSession,
    setCurrentPhase,
    completeSet,
    goBack,
    setCurrentExerciseIndex,
    
    // Helpers
    getLastWorkout,
    suggestNextWeight,
  };
};