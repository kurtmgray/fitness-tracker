import { useState, useMemo } from 'react';
import { generateMockData } from '../../../utils/workoutMocks';

export const useWorkoutHistory = () => {
  const mockData = useMemo(() => generateMockData(), []);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>(
    mockData.flatMap((week) => week.workouts)
  );

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