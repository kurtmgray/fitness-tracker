// Volume calculation utilities for fitness tracker

import { calculateTotalWeight, getExerciseTrackingType } from './exerciseUtils';
import { calculateTimeVolume } from './timeUtils';

// Calculate volume for a single set
export const calculateSetVolume = (
  exerciseName: string,
  set: {
    weight?: number | null;
    weightLeft?: number | null;
    weightRight?: number | null;
    reps?: number | null;
    timeSeconds?: number | null;
  }
): number => {
  const trackingType = getExerciseTrackingType(exerciseName);
  
  if (trackingType === 'time') {
    return calculateTimeVolume(
      exerciseName,
      set.timeSeconds || 0,
      set.weight,
      set.weightLeft,
      set.weightRight
    );
  }
  
  const weight = calculateTotalWeight(
    exerciseName,
    set.weight,
    set.weightLeft,
    set.weightRight
  );
  
  return weight * (set.reps || 0);
};

// Calculate volume for an entire exercise
export const calculateExerciseVolume = (
  exerciseName: string,
  sets: Array<{
    weight?: number | null;
    weightLeft?: number | null;
    weightRight?: number | null;
    reps?: number | null;
    timeSeconds?: number | null;
  }>
): number => {
  return sets.reduce((total, set) => {
    return total + calculateSetVolume(exerciseName, set);
  }, 0);
};

// Calculate volume for an entire workout
export const calculateWorkoutVolume = (
  exercises: Array<{
    exerciseName: string;
    sets: Array<{
      weight?: number | null;
      weightLeft?: number | null;
      weightRight?: number | null;
      reps?: number | null;
      timeSeconds?: number | null;
    }>;
  }>
): number => {
  return exercises.reduce((total, exercise) => {
    return total + calculateExerciseVolume(exercise.exerciseName, exercise.sets);
  }, 0);
};

// Get volume unit for display
export const getVolumeUnit = (exerciseName: string): string => {
  const trackingType = getExerciseTrackingType(exerciseName);
  return trackingType === 'time' ? 'lb-minutes' : 'lbs';
};

// Format volume for display
export const formatVolume = (volume: number, exerciseName?: string): string => {
  if (exerciseName) {
    const unit = getVolumeUnit(exerciseName);
    return `${volume.toLocaleString()} ${unit}`;
  }
  
  // For mixed workouts, assume standard volume
  return `${volume.toLocaleString()} lbs`;
};

// Calculate volume progression between workouts
export const calculateVolumeProgression = (
  currentVolume: number,
  previousVolume: number
): {
  change: number;
  percentage: number;
  direction: 'increase' | 'decrease' | 'same';
} => {
  const change = currentVolume - previousVolume;
  const percentage = previousVolume > 0 ? (change / previousVolume) * 100 : 0;
  
  let direction: 'increase' | 'decrease' | 'same';
  if (change > 0) direction = 'increase';
  else if (change < 0) direction = 'decrease';
  else direction = 'same';
  
  return { change, percentage, direction };
};