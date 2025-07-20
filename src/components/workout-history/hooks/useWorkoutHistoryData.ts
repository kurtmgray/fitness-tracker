import { useState, useMemo } from 'react';
import { calculateTotalWeight, getExerciseTrackingType } from '@/utils/exerciseUtils';
import { calculateTimeVolume } from '@/utils/timeUtils';
import { trpc } from '@/lib/trpc';

export const useWorkoutHistoryData = () => {
  // Fetch real workout data from the database with full details
  const { data: rawSessions, isLoading } = trpc.workouts.getUserSessionsWithDetails.useQuery({ 
    limit: 50 
  });
  
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<string>>(new Set());

  // Transform raw session data into the expected format
  const weekData = useMemo(() => {
    if (!rawSessions || rawSessions.length === 0) return [];

    // Group sessions by week
    const weekMap = new Map<string, any[]>();
    
    rawSessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const weekStart = new Date(sessionDate);
      weekStart.setDate(sessionDate.getDate() - sessionDate.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, []);
      }
      weekMap.get(weekKey)!.push(session);
    });

    // Convert to WeekData format
    return Array.from(weekMap.entries()).map(([weekKey, sessions]) => ({
      weekStartDate: new Date(weekKey),
      workouts: sessions.map(session => ({
        id: session.id,
        date: new Date(session.date),
        day: session.dayType as WorkoutDay,
        dayType: session.dayType,
        duration: session.duration,
        exercises: session.exercises.map((exercise: any) => ({
          exerciseId: exercise.exerciseId, // Include the exercise ID for proper matching
          exerciseName: exercise.exerciseName,
          equipment: 'barbell', // TODO: Get from equipment preferences
          sets: exercise.sets.map((set: any) => ({
            weight: set.weight,
            weightLeft: set.weightLeft,
            weightRight: set.weightRight,
            reps: set.reps,
            timeSeconds: set.timeSeconds,
            isFailure: set.isFailure,
            completed: set.completed,
          })),
        })),
        completed: true,
      })),
    })).sort((a, b) => b.weekStartDate.getTime() - a.weekStartDate.getTime());
  }, [rawSessions]);

  const dayTitles: Record<WorkoutDay, string> = {
    day1: 'Pull & Lower Focus',
    day2: 'Push & Functional Focus',
    day3: 'Balanced Hypertrophy & Stability',
  };

  const toggleWeek = (weekKey: string) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekKey)) {
      newExpanded.delete(weekKey);
    } else {
      newExpanded.add(weekKey);
    }
    setExpandedWeeks(newExpanded);
  };

  const toggleWorkout = (workoutId: string) => {
    const newExpanded = new Set(expandedWorkouts);
    if (newExpanded.has(workoutId)) {
      newExpanded.delete(workoutId);
    } else {
      newExpanded.add(workoutId);
    }
    setExpandedWorkouts(newExpanded);
  };

  // Calculate volume using new data model
  const calculateVolume = (set: any, exerciseName?: string): number => {
    if (!exerciseName) return 0;
    
    const trackingType = getExerciseTrackingType(exerciseName);
    
    if (trackingType === 'time') {
      return calculateTimeVolume(
        exerciseName,
        set.timeSeconds || set.time_seconds || 0,
        set.weight,
        set.weightLeft || set.weight_left,
        set.weightRight || set.weight_right
      );
    }
    
    const weight = calculateTotalWeight(
      exerciseName,
      set.weight,
      set.weightLeft || set.weight_left,
      set.weightRight || set.weight_right
    );
    
    return weight * (set.reps || 0);
  };

  const getWeekStats = (workouts: WorkoutSession[]) => {
    const totalWorkouts = workouts.length;
    const totalVolume = workouts.reduce((sum, workout) => {
      return (
        sum +
        workout.exercises.reduce((exerciseSum, exercise) => {
          return (
            exerciseSum +
            exercise.sets.reduce((setSum, set) => {
              return setSum + calculateVolume(set, exercise.exerciseName);
            }, 0)
          );
        }, 0)
      );
    }, 0);

    const avgDuration =
      workouts.reduce((sum, w) => sum + (w.duration || 0), 0) / workouts.length;

    return { totalWorkouts, totalVolume, avgDuration };
  };

  const calculateWorkoutVolume = (workout: WorkoutSession): number => {
    return workout.exercises.reduce((sum, exercise) => {
      return (
        sum +
        exercise.sets.reduce((setSum, set) => {
          return setSum + calculateVolume(set, exercise.exerciseName);
        }, 0)
      );
    }, 0);
  };

  const formatDateRange = (weekStart: Date): string => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const formatOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    const start = weekStart.toLocaleDateString('en-US', formatOptions);
    const end = weekEnd.toLocaleDateString('en-US', formatOptions);

    return `${start} - ${end}`;
  };

  return {
    mockData: weekData,
    isLoading,
    expandedWeeks,
    expandedWorkouts,
    dayTitles,
    toggleWeek,
    toggleWorkout,
    getWeekStats,
    calculateWorkoutVolume,
    formatDateRange,
  };
};