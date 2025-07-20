// Time formatting utilities for fitness tracker

// Convert seconds to MM:SS format
export const formatTime = (seconds: number): string => {
  if (seconds < 0) return "0:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Convert MM:SS string to seconds
export const parseTimeToSeconds = (timeString: string): number => {
  const parts = timeString.split(':');
  
  if (parts.length === 1) {
    // Just seconds
    return parseInt(parts[0]) || 0;
  }
  
  if (parts.length === 2) {
    // MM:SS format
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    return minutes * 60 + seconds;
  }
  
  return 0;
};

// Convert seconds to verbose format (e.g., "2 minutes 30 seconds")
export const formatTimeVerbose = (seconds: number): string => {
  if (seconds < 0) return "0 seconds";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  }
  
  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
};

// Format time for display in sets (based on exercise tracking type)
export const formatSetTime = (exerciseName: string, seconds: number | null): string => {
  if (seconds === null) return '0:00';
  return formatTime(seconds);
};

// Validate time input (returns true if valid)
export const isValidTimeInput = (timeString: string): boolean => {
  if (!timeString.trim()) return false;
  
  const parts = timeString.split(':');
  
  if (parts.length === 1) {
    // Just seconds
    const seconds = parseInt(parts[0]);
    return !isNaN(seconds) && seconds >= 0;
  }
  
  if (parts.length === 2) {
    // MM:SS format
    const minutes = parseInt(parts[0]);
    const seconds = parseInt(parts[1]);
    return !isNaN(minutes) && !isNaN(seconds) && minutes >= 0 && seconds >= 0 && seconds < 60;
  }
  
  return false;
};

// Get appropriate time label for exercises
export const getTimeLabel = (exerciseName: string): string => {
  return 'Time (MM:SS)';
};

// Get appropriate time placeholder
export const getTimePlaceholder = (exerciseName: string): string => {
  return '2:00';
};

// Calculate time-based volume (time * weight for weighted time exercises)
export const calculateTimeVolume = (
  exerciseName: string,
  seconds: number,
  weight?: number | null,
  weightLeft?: number | null,
  weightRight?: number | null
): number => {
  // Convert seconds to minutes for volume calculation
  const minutes = seconds / 60;
  
  // For time-based exercises, volume = time in minutes × total weight
  if (weightLeft !== undefined && weightRight !== undefined) {
    const totalWeight = (weightLeft || 0) + (weightRight || 0);
    return minutes * totalWeight;
  }
  
  if (weight) {
    return minutes * weight;
  }
  
  // Bodyweight time exercises use estimated bodyweight
  return minutes * 185;
};