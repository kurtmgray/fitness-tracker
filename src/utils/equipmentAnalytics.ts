// Equipment usage analytics for fitness tracker

export interface EquipmentUsage {
  equipmentType: string;
  exerciseCount: number;
  totalVolume: number;
  averageWeight: number;
  mostUsedExercises: Array<{
    exerciseName: string;
    count: number;
    volume: number;
  }>;
}

export interface BandUsage {
  configuration: string;
  colors: string[];
  usageCount: number;
  exercises: string[];
}

// Analyze equipment usage across workouts
export const analyzeEquipmentUsage = (
  workouts: Array<{
    exercises: Array<{
      exerciseName: string;
      equipment?: string;
      sets: Array<{
        weight?: number | null;
        weightLeft?: number | null;
        weightRight?: number | null;
        reps?: number | null;
        timeSeconds?: number | null;
      }>;
    }>;
  }>
): EquipmentUsage[] => {
  const equipmentMap = new Map<string, {
    exerciseCount: number;
    totalVolume: number;
    totalWeight: number;
    weightCount: number;
    exercises: Map<string, { count: number; volume: number; }>;
  }>();

  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const equipment = exercise.equipment || 'unknown';
      
      if (!equipmentMap.has(equipment)) {
        equipmentMap.set(equipment, {
          exerciseCount: 0,
          totalVolume: 0,
          totalWeight: 0,
          weightCount: 0,
          exercises: new Map(),
        });
      }
      
      const equipmentData = equipmentMap.get(equipment)!;
      equipmentData.exerciseCount++;
      
      let exerciseVolume = 0;
      let exerciseWeight = 0;
      let weightEntries = 0;
      
      exercise.sets.forEach(set => {
        const weight = (set.weightLeft || 0) + (set.weightRight || 0) || set.weight || 0;
        const volume = weight * (set.reps || set.timeSeconds || 0);
        
        exerciseVolume += volume;
        if (weight > 0) {
          exerciseWeight += weight;
          weightEntries++;
        }
      });
      
      equipmentData.totalVolume += exerciseVolume;
      equipmentData.totalWeight += exerciseWeight;
      equipmentData.weightCount += weightEntries;
      
      // Track exercise-specific usage
      const exerciseStats = equipmentData.exercises.get(exercise.exerciseName) || { count: 0, volume: 0 };
      exerciseStats.count++;
      exerciseStats.volume += exerciseVolume;
      equipmentData.exercises.set(exercise.exerciseName, exerciseStats);
    });
  });

  return Array.from(equipmentMap.entries()).map(([equipmentType, data]) => ({
    equipmentType,
    exerciseCount: data.exerciseCount,
    totalVolume: data.totalVolume,
    averageWeight: data.weightCount > 0 ? data.totalWeight / data.weightCount : 0,
    mostUsedExercises: Array.from(data.exercises.entries())
      .map(([exerciseName, stats]) => ({
        exerciseName,
        count: stats.count,
        volume: stats.volume,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3),
  })).sort((a, b) => b.totalVolume - a.totalVolume);
};

// Analyze band configuration usage
export const analyzeBandUsage = (
  workouts: Array<{
    exercises: Array<{
      exerciseName: string;
      equipment?: string;
      bandConfiguration?: {
        name: string;
        colors: string[];
      };
    }>;
  }>
): BandUsage[] => {
  const bandMap = new Map<string, {
    colors: string[];
    usageCount: number;
    exercises: Set<string>;
  }>();

  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (exercise.equipment === 'band' && exercise.bandConfiguration) {
        const config = exercise.bandConfiguration;
        const configKey = config.name;
        
        if (!bandMap.has(configKey)) {
          bandMap.set(configKey, {
            colors: config.colors,
            usageCount: 0,
            exercises: new Set(),
          });
        }
        
        const bandData = bandMap.get(configKey)!;
        bandData.usageCount++;
        bandData.exercises.add(exercise.exerciseName);
      }
    });
  });

  return Array.from(bandMap.entries()).map(([configuration, data]) => ({
    configuration,
    colors: data.colors,
    usageCount: data.usageCount,
    exercises: Array.from(data.exercises),
  })).sort((a, b) => b.usageCount - a.usageCount);
};

// Get equipment preferences for a specific exercise
export const getExerciseEquipmentPreferences = (
  exerciseName: string,
  workouts: Array<{
    exercises: Array<{
      exerciseName: string;
      equipment?: string;
    }>;
  }>
): Array<{ equipment: string; count: number; percentage: number; }> => {
  const equipmentCounts = new Map<string, number>();
  let totalCount = 0;

  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (exercise.exerciseName === exerciseName) {
        const equipment = exercise.equipment || 'unknown';
        equipmentCounts.set(equipment, (equipmentCounts.get(equipment) || 0) + 1);
        totalCount++;
      }
    });
  });

  return Array.from(equipmentCounts.entries())
    .map(([equipment, count]) => ({
      equipment,
      count,
      percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
};

// Generate equipment recommendations
export const generateEquipmentRecommendations = (
  usage: EquipmentUsage[]
): Array<{
  type: 'underused' | 'overused' | 'balanced';
  equipment: string;
  message: string;
}> => {
  if (usage.length === 0) return [];

  const totalVolume = usage.reduce((sum, eq) => sum + eq.totalVolume, 0);
  const averageUsage = totalVolume / usage.length;

  return usage.map(eq => {
    const ratio = eq.totalVolume / averageUsage;
    
    if (ratio < 0.5) {
      return {
        type: 'underused' as const,
        equipment: eq.equipmentType,
        message: `Consider incorporating more ${eq.equipmentType} exercises for balanced training`,
      };
    } else if (ratio > 2) {
      return {
        type: 'overused' as const,
        equipment: eq.equipmentType,
        message: `High ${eq.equipmentType} usage - consider diversifying with other equipment`,
      };
    } else {
      return {
        type: 'balanced' as const,
        equipment: eq.equipmentType,
        message: `Good balance of ${eq.equipmentType} usage`,
      };
    }
  });
};