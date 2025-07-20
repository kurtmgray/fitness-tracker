import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export const useWorkoutHistory = () => {
  // Fetch real workout data from database
  const { data: rawSessions } = trpc.workouts.getUserSessionsWithDetails.useQuery({ limit: 20 });
  
  // Local state for any new workouts added during the session
  const [newWorkouts, setNewWorkouts] = useState<WorkoutSession[]>([]);

  // Transform database sessions to WorkoutSession format
  const workoutHistory: WorkoutSession[] = (rawSessions || []).map(session => ({
    id: session.id,
    date: new Date(session.date),
    day: session.dayType as WorkoutDay,
    exercises: session.exercises.map(exercise => ({
      exerciseId: exercise.exerciseId, // Include the exercise ID for proper matching
      exerciseName: exercise.exerciseName,
      sets: exercise.sets.map(set => ({
        weight: set.weight,
        weightLeft: set.weightLeft,
        weightRight: set.weightRight,
        reps: set.reps,
        timeSeconds: set.timeSeconds,
        completed: set.completed,
        isFailure: set.isFailure,
        rpe: set.rpe,
      })),
      useBosoBall: false, // TODO: Get from database if needed
    })),
    duration: session.duration,
  })).concat(newWorkouts);

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
    setNewWorkouts(prev => [...prev, workout]);
  };

  return {
    workoutHistory,
    getLastWorkout,
    addWorkoutToHistory,
  };
};