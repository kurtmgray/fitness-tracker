// Progress tracking utilities for fitness tracker

import { calculateTotalWeight, getExerciseTrackingType } from './exerciseUtils';
import { calculateSetVolume } from './volumeUtils';

export interface ProgressDataPoint {
  date: Date;
  weight: number;
  reps: number;
  volume: number;
  rpe?: number;
  timeSeconds?: number;
  isFailure?: boolean;
}

export interface ExerciseProgress {
  exerciseName: string;
  dataPoints: ProgressDataPoint[];
  trend: 'increasing' | 'decreasing' | 'stable';
  maxWeight: number;
  maxVolume: number;
  maxReps: number;
  bestTime?: number; // For time-based exercises
  averageRpe?: number;
}

export interface ProgressSummary {
  totalWorkouts: number;
  totalVolume: number;
  averageVolume: number;
  volumeTrend: 'increasing' | 'decreasing' | 'stable';
  strengthGains: Array<{
    exerciseName: string;
    weightIncrease: number;
    percentage: number;
  }>;
  consistencyScore: number; // 0-100
}

// Extract progress data for a specific exercise
export const extractExerciseProgress = (
  exerciseName: string,
  workouts: Array<{
    date: Date;
    exercises: Array<{
      exerciseName: string;
      sets: Array<{
        weight?: number | null;
        weightLeft?: number | null;
        weightRight?: number | null;
        reps?: number | null;
        timeSeconds?: number | null;
        rpe?: number | null;
        isFailure?: boolean;
      }>;
    }>;
  }>
): ExerciseProgress => {
  const dataPoints: ProgressDataPoint[] = [];

  workouts.forEach(workout => {
    const exercise = workout.exercises.find(ex => ex.exerciseName === exerciseName);
    if (!exercise) return;

    exercise.sets.forEach(set => {
      const weight = calculateTotalWeight(
        exerciseName,
        set.weight,
        set.weightLeft,
        set.weightRight
      );
      
      const volume = calculateSetVolume(exerciseName, set);

      dataPoints.push({
        date: workout.date,
        weight,
        reps: set.reps || 0,
        volume,
        rpe: set.rpe || undefined,
        timeSeconds: set.timeSeconds || undefined,
        isFailure: set.isFailure || false,
      });
    });
  });

  // Sort by date
  dataPoints.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate trend
  const trend = calculateTrend(dataPoints.map(p => p.volume));

  // Calculate maximums
  const maxWeight = Math.max(...dataPoints.map(p => p.weight));
  const maxVolume = Math.max(...dataPoints.map(p => p.volume));
  const maxReps = Math.max(...dataPoints.map(p => p.reps));
  const bestTime = dataPoints.length > 0 
    ? Math.max(...dataPoints.filter(p => p.timeSeconds).map(p => p.timeSeconds!))
    : undefined;

  // Calculate average RPE
  const rpeDataPoints = dataPoints.filter(p => p.rpe !== undefined);
  const averageRpe = rpeDataPoints.length > 0
    ? rpeDataPoints.reduce((sum, p) => sum + p.rpe!, 0) / rpeDataPoints.length
    : undefined;

  return {
    exerciseName,
    dataPoints,
    trend,
    maxWeight,
    maxVolume,
    maxReps,
    bestTime,
    averageRpe,
  };
};

// Calculate trend direction from data points
const calculateTrend = (values: number[]): 'increasing' | 'decreasing' | 'stable' => {
  if (values.length < 2) return 'stable';

  const recentValues = values.slice(-5); // Look at last 5 data points
  const firstHalf = recentValues.slice(0, Math.ceil(recentValues.length / 2));
  const secondHalf = recentValues.slice(Math.floor(recentValues.length / 2));

  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

  const changePercentage = ((secondAvg - firstAvg) / firstAvg) * 100;

  if (changePercentage > 5) return 'increasing';
  if (changePercentage < -5) return 'decreasing';
  return 'stable';
};

// Generate progress summary across all exercises
export const generateProgressSummary = (
  workouts: Array<{
    date: Date;
    exercises: Array<{
      exerciseName: string;
      sets: Array<{
        weight?: number | null;
        weightLeft?: number | null;
        weightRight?: number | null;
        reps?: number | null;
        timeSeconds?: number | null;
      }>;
    }>;
  }>
): ProgressSummary => {
  const totalWorkouts = workouts.length;
  
  // Calculate total and average volume
  const workoutVolumes = workouts.map(workout =>
    workout.exercises.reduce((sum, exercise) =>
      sum + exercise.sets.reduce((setSum, set) =>
        setSum + calculateSetVolume(exercise.exerciseName, set), 0
      ), 0
    )
  );

  const totalVolume = workoutVolumes.reduce((sum, vol) => sum + vol, 0);
  const averageVolume = totalWorkouts > 0 ? totalVolume / totalWorkouts : 0;
  const volumeTrend = calculateTrend(workoutVolumes);

  // Calculate strength gains
  const exerciseNames = Array.from(new Set(
    workouts.flatMap(w => w.exercises.map(e => e.exerciseName))
  ));

  const strengthGains = exerciseNames.map(exerciseName => {
    const progress = extractExerciseProgress(exerciseName, workouts);
    const dataPoints = progress.dataPoints;
    
    if (dataPoints.length < 2) {
      return { exerciseName, weightIncrease: 0, percentage: 0 };
    }

    const firstWeight = dataPoints[0].weight;
    const lastWeight = dataPoints[dataPoints.length - 1].weight;
    const weightIncrease = lastWeight - firstWeight;
    const percentage = firstWeight > 0 ? (weightIncrease / firstWeight) * 100 : 0;

    return { exerciseName, weightIncrease, percentage };
  }).filter(gain => gain.weightIncrease > 0);

  // Calculate consistency score
  const consistencyScore = calculateConsistencyScore(workouts);

  return {
    totalWorkouts,
    totalVolume,
    averageVolume,
    volumeTrend,
    strengthGains,
    consistencyScore,
  };
};

// Calculate consistency score based on workout frequency
const calculateConsistencyScore = (
  workouts: Array<{ date: Date; }>
): number => {
  if (workouts.length === 0) return 0;

  const sortedDates = workouts.map(w => w.date).sort((a, b) => a.getTime() - b.getTime());
  const firstDate = sortedDates[0];
  const lastDate = sortedDates[sortedDates.length - 1];
  const totalDays = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (totalDays === 0) return 100;

  const expectedWorkouts = Math.ceil(totalDays / 2); // Assuming 3-4 workouts per week
  const actualWorkouts = workouts.length;
  
  return Math.min(100, (actualWorkouts / expectedWorkouts) * 100);
};

// Get personal records for an exercise
export const getPersonalRecords = (
  exerciseName: string,
  workouts: Array<{
    date: Date;
    exercises: Array<{
      exerciseName: string;
      sets: Array<{
        weight?: number | null;
        weightLeft?: number | null;
        weightRight?: number | null;
        reps?: number | null;
        timeSeconds?: number | null;
      }>;
    }>;
  }>
): {
  maxWeight: { weight: number; date: Date; } | null;
  maxVolume: { volume: number; date: Date; } | null;
  maxReps: { reps: number; date: Date; } | null;
  bestTime: { timeSeconds: number; date: Date; } | null;
} => {
  const progress = extractExerciseProgress(exerciseName, workouts);
  
  const maxWeightPoint = progress.dataPoints.reduce((max, point) =>
    point.weight > (max?.weight || 0) ? point : max, null as ProgressDataPoint | null);
    
  const maxVolumePoint = progress.dataPoints.reduce((max, point) =>
    point.volume > (max?.volume || 0) ? point : max, null as ProgressDataPoint | null);
    
  const maxRepsPoint = progress.dataPoints.reduce((max, point) =>
    point.reps > (max?.reps || 0) ? point : max, null as ProgressDataPoint | null);
    
  const bestTimePoint = progress.dataPoints
    .filter(point => point.timeSeconds !== undefined)
    .reduce((best, point) =>
      (point.timeSeconds || 0) > (best?.timeSeconds || 0) ? point : best, null as ProgressDataPoint | null);

  return {
    maxWeight: maxWeightPoint ? { weight: maxWeightPoint.weight, date: maxWeightPoint.date } : null,
    maxVolume: maxVolumePoint ? { volume: maxVolumePoint.volume, date: maxVolumePoint.date } : null,
    maxReps: maxRepsPoint ? { reps: maxRepsPoint.reps, date: maxRepsPoint.date } : null,
    bestTime: bestTimePoint ? { timeSeconds: bestTimePoint.timeSeconds!, date: bestTimePoint.date } : null,
  };
};