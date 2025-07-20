import React, { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useWorkoutHistory } from './useWorkoutHistory';
import { useWorkoutSuggestions } from './useWorkoutSuggestions';
// import { supportsDualWeights } from '../../../utils/exerciseUtils';
import { findExerciseInWorkoutById } from '../../../utils/exerciseIdMapping';
import { trpc } from '@/lib/trpc';

// Legacy workout templates - moved to database
// These will be fetched dynamically via getWorkoutTemplate

const dayTitles: Record<WorkoutDay, string> = {
  day1: 'Pull & Lower Focus',
  day2: 'Push & Functional Focus',
  day3: 'Balanced Hypertrophy & Stability',
};

export const useWorkoutSession = (routeSelectedDay?: WorkoutDay | null, routeCurrentPhase?: WorkoutPhase) => {
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState<WorkoutPhase>(routeCurrentPhase || 'selection');
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(routeSelectedDay || null);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [exerciseSetProgress, setExerciseSetProgress] = useState<Record<number, number>>({});
  
  // Database session tracking
  const [dbSessionId, setDbSessionId] = useState<string | null>(null);
  const [sessionExerciseIds, setSessionExerciseIds] = useState<Record<number, string>>({});

  const { workoutHistory, getLastWorkout, addWorkoutToHistory } = useWorkoutHistory();
  const { getSuggestedWeight } = useWorkoutSuggestions();
  
  // tRPC mutations for real-time tracking
  const createSessionMutation = trpc.workouts.createFullWorkoutSession.useMutation();
  const saveSetMutation = trpc.workouts.saveSet.useMutation();
  const completeSessionMutation = trpc.workouts.completeWorkoutSession.useMutation();
  
  // tRPC query for active session recovery
  const { data: activeSession } = trpc.workouts.getActiveSession.useQuery(
    { dayType: selectedDay! },
    { enabled: !!selectedDay && (routeCurrentPhase === 'tracking' || routeCurrentPhase === 'complete') }
  );
  
  // Fetch workout template from database when a day is selected
  const { data: workoutTemplate } = trpc.workouts.getWorkoutTemplate.useQuery(
    { dayType: selectedDay! },
    { enabled: !!selectedDay }
  );

  const initializeSession = (day: WorkoutDay): void => {
    // Just set the selected day - the useEffect will handle the rest
    setSelectedDay(day);
  };
  
  // Sync with route changes
  React.useEffect(() => {
    if (routeSelectedDay) {
      setSelectedDay(routeSelectedDay);
    }
    if (routeCurrentPhase) {
      setCurrentPhase(routeCurrentPhase);
    }
  }, [routeSelectedDay, routeCurrentPhase]);
  
  // State recovery from database when navigating to tracking/complete routes
  React.useEffect(() => {
    if (activeSession && (routeCurrentPhase === 'tracking' || routeCurrentPhase === 'complete')) {
      // Reconstruct session state from database
      const recoveredSession: WorkoutSession = {
        id: activeSession.id,
        day: activeSession.dayType as WorkoutDay,
        date: activeSession.createdAt,
        exercises: activeSession.sessionExercises.map((sessionExercise: any) => ({
          exerciseName: sessionExercise.exercise.name,
          exerciseId: sessionExercise.exercise.id,
          sets: sessionExercise.sets.map((set: any) => ({
            weight: set.weight,
            weightLeft: set.weightLeft,
            weightRight: set.weightRight,
            reps: set.reps,
            timeSeconds: set.timeSeconds,
            isFailure: set.isFailure,
            completed: set.completed,
            rpe: set.rpe,
          })),
          useBosoBall: sessionExercise.useBosoBall,
        })),
      };
      
      // Calculate exercise progress from completed sets
      const progress: Record<number, number> = {};
      recoveredSession.exercises.forEach((exercise, idx) => {
        progress[idx] = exercise.sets.filter(set => set.completed).length;
      });
      
      // Map session exercise IDs
      const exerciseIdMap: Record<number, string> = {};
      activeSession.sessionExercises.forEach((sessionExercise: any, index: number) => {
        exerciseIdMap[index] = sessionExercise.id;
      });
      
      // Update state
      setCurrentSession(recoveredSession);
      setExerciseSetProgress(progress);
      setDbSessionId(activeSession.id);
      setSessionExerciseIds(exerciseIdMap);
      
      // Find current exercise index (first incomplete exercise)
      const currentIdx = recoveredSession.exercises.findIndex((exercise, idx) => {
        const completedSets = progress[idx] || 0;
        return completedSets < exercise.sets.length;
      });
      
      if (currentIdx !== -1) {
        setCurrentExerciseIndex(currentIdx);
      }
    }
  }, [activeSession, routeCurrentPhase]);

  // Effect to create session when template loads
  React.useEffect(() => {
    if (selectedDay && workoutTemplate && workoutTemplate.exercises) {
      const template = workoutTemplate.exercises;
      const lastWorkout = getLastWorkout(selectedDay);
      

      const exercises: ExerciseEntry[] = template.map((exercise: any) => {
        // Find last exercise data using ID-based matching
        const lastExercise = findExerciseInWorkoutById(lastWorkout, exercise.id);
        
        // Get last completed set data
        const lastCompletedSet = lastExercise?.sets.find(s => s.completed);
        
        // Use last workout weights as starting point, fallback to suggested weight
        const legacyExercise = {
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weightType: exercise.equipmentCategory || 'barbell',
          isFailure: exercise.isFailure,
          isTimeBased: exercise.isTimeBased,
          hasBosoBallOption: exercise.hasBosoBallOption
        };
        
        const suggestedWeight = getSuggestedWeight(legacyExercise, lastWorkout, workoutHistory);
        const isDualWeight = exercise.supportsDualWeights;
        
        // Use last workout's actual weights if available, fallback to suggested weight
        const baseWeight = suggestedWeight || 25; // Ensure we have a fallback
        const initialWeight = lastCompletedSet?.weight || baseWeight;
        const initialWeightLeft = lastCompletedSet?.weightLeft || baseWeight;
        const initialWeightRight = lastCompletedSet?.weightRight || baseWeight;
        const initialReps = parseInt(exercise.reps.split('-')[0]) || 8;
        
        
        return {
          exerciseName: exercise.name,
          sets: Array(exercise.sets)
            .fill(null)
            .map(() => ({
              weight: isDualWeight ? null : initialWeight,
              weightLeft: isDualWeight ? initialWeightLeft : undefined,
              weightRight: isDualWeight ? initialWeightRight : undefined,
              reps: initialReps,
              completed: false,
              rpe: undefined,
            })),
          useBosoBall: false,
        };
      });

      const session: WorkoutSession = {
        id: `workout-${Date.now()}`,
        date: new Date(),
        day: selectedDay,
        exercises,
        duration: 0,
      };

      setCurrentSession(session);
    }
  }, [selectedDay, workoutTemplate]);

  const startWorkout = async (equipmentPreferences?: Record<string, { equipmentTypeId: string; equipmentInstanceId?: string }>) => {
    if (!currentSession || !workoutTemplate) return;

    try {
      // Ensure equipmentPreferences is a plain object (not a React event)
      const cleanEquipmentPreferences = equipmentPreferences && typeof equipmentPreferences === 'object' && !('nativeEvent' in equipmentPreferences) 
        ? equipmentPreferences 
        : undefined;

      console.log('Starting workout with equipment preferences:', cleanEquipmentPreferences);

      // Create database session with exercises and equipment preferences
      const result = await createSessionMutation.mutateAsync({
        dayType: selectedDay!,
        templateId: workoutTemplate.templateId,
        exercises: workoutTemplate.exercises.map((exercise: any, index: number) => ({
          exerciseId: exercise.id,
          orderIndex: index,
          useBosoBall: currentSession.exercises[index]?.useBosoBall || false,
          bandType: '', // Empty string instead of null
          notes: '',   // Empty string instead of null
        })),
        equipmentPreferences: cleanEquipmentPreferences,
      });

      // Store database session info
      setDbSessionId(result.session.id);
      
      // Map exercise indices to session exercise IDs
      const exerciseIdMap: Record<number, string> = {};
      result.sessionExercises.forEach((sessionExercise, index) => {
        exerciseIdMap[index] = sessionExercise.id;
      });
      setSessionExerciseIds(exerciseIdMap);

      setCurrentPhase('tracking');
      setCurrentExerciseIndex(0);
      setCurrentSetIndex(0);
      setExerciseSetProgress({});
    } catch (error) {
      console.error('Failed to start workout session:', error);
      // Fall back to local tracking
      setCurrentPhase('tracking');
      setCurrentExerciseIndex(0);
      setCurrentSetIndex(0);
      setExerciseSetProgress({});
    }
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
    initializeSession(day);
    setCurrentPhase('setup');
  };

  const updateSession = (updatedSession: WorkoutSession) => {
    setCurrentSession(updatedSession);
  };

  const completeSet = async (setData: {
    weight?: number;
    weightLeft?: number;
    weightRight?: number;
    reps?: number;
    timeSeconds?: number;
    isFailure?: boolean;
    rpe?: number;
  }): Promise<void> => {
    if (!currentSession) return;

    const updatedSession = { ...currentSession };
    const currentSetForExercise = exerciseSetProgress[currentExerciseIndex] || 0;
    const setNumber = currentSetForExercise + 1;

    // Update local session
    updatedSession.exercises[currentExerciseIndex].sets[currentSetForExercise] = {
      weight: setData.weight || null,
      weightLeft: setData.weightLeft || null,
      weightRight: setData.weightRight || null,
      reps: setData.reps || 0,
      timeSeconds: setData.timeSeconds || null,
      isFailure: setData.isFailure || false,
      completed: true,
      rpe: setData.rpe || null,
    };

    setCurrentSession(updatedSession);

    // Save to database if we have a session
    if (dbSessionId && sessionExerciseIds[currentExerciseIndex]) {
      try {
        await saveSetMutation.mutateAsync({
          sessionExerciseId: sessionExerciseIds[currentExerciseIndex],
          setNumber,
          weight: setData.weight || null,
          weightLeft: setData.weightLeft || null,
          weightRight: setData.weightRight || null,
          reps: setData.reps || null,
          timeSeconds: setData.timeSeconds || null,
          isFailure: setData.isFailure || false,
          completed: true,
          rpe: setData.rpe || null,
        });
      } catch (error) {
        console.error('Failed to save set to database:', error);
        // Continue with local tracking if database save fails
      }
    }

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
      // Complete the database session
      if (dbSessionId) {
        try {
          await completeSessionMutation.mutateAsync({
            sessionId: dbSessionId,
            durationMinutes: Math.floor(Math.random() * 30) + 45, // TODO: Track actual duration
          });
        } catch (error) {
          console.error('Failed to complete workout session:', error);
        }
      }
      
      // Also add to local history for immediate UI updates
      addWorkoutToHistory(updatedSession);
      
      // Navigate to complete route
      router.navigate({ to: `/workout/${selectedDay}/complete` });
    }
  };

  const goBack = (): void => {
    if (currentPhase === 'setup') {
      router.navigate({ to: '/workout' });
    } else if (currentPhase === 'tracking') {
      router.navigate({ to: `/workout/${selectedDay}` });
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
    workoutTemplate,
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
    
    // Loading states
    isLoadingTemplate: !workoutTemplate && !!selectedDay,
  };
};