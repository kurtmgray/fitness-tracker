import { useState } from 'react';

export const useWorkoutHistory = () => {
  // TODO: Replace with real tRPC data fetching
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);

  const getLastWorkout = (day: WorkoutDay): WorkoutSession | null => {
    return (
      workoutHistory
        .filter((session) => session.day === day)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0] || null
    );
  };

  const addWorkoutToHistory = (workout: WorkoutSession) => {
    setWorkoutHistory(prev => [...prev, workout]);
  };

  return {
    workoutHistory,
    getLastWorkout,
    addWorkoutToHistory,
  };
};