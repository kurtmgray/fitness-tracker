import { useState } from 'react';
import { generateMockData } from '../../../utils/workoutMocks';

export const useWorkoutHistoryData = () => {
  const [mockData] = useState<WeekData[]>(generateMockData());
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<string>>(new Set());

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

  const parseWeight = (weight: number | string): number => {
    if (typeof weight === 'number') return weight;
    if (typeof weight === 'string') {
      // Handle bodyweight exercises
      if (weight.toLowerCase().includes('bw') || weight.toLowerCase().includes('bodyweight')) {
        return 185; // Estimate bodyweight for volume calculation
      }
      // Extract numeric value from strings like "44# KB", "Red Band", etc.
      const numericMatch = weight.match(/(\d+(?:\.\d+)?)/);
      return numericMatch ? parseFloat(numericMatch[1]) : 0;
    }
    return 0;
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
              const weight = parseWeight(set.weight);
              return setSum + weight * set.reps;
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
          const weight = parseWeight(set.weight);
          return setSum + weight * set.reps;
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
    mockData,
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