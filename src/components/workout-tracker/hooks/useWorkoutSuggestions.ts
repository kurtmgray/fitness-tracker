export const useWorkoutSuggestions = () => {
  const suggestNextWeight = (
    lastWeight: number,
    lastRpe: number,
    weightType: string
  ): number => {
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

    let adjusted =
      suggested > lastWeight
        ? Math.min(suggested, maxIncrease)
        : Math.max(suggested, minDecrease);

    if (weightType === 'barbell') {
      return Math.round(adjusted / 5) * 5;
    } else if (weightType === 'dumbbell' || weightType === 'kettlebell') {
      return Math.round(adjusted / 2.5) * 2.5;
    } else {
      return lastWeight;
    }
  };

  const getSuggestedWeight = (
    exercise: ExerciseTemplate,
    lastWorkout: WorkoutSession | null
  ): number => {
    if (!lastWorkout) return 0;

    const lastExercise = lastWorkout.exercises.find(
      (ex) => ex.exerciseName === exercise.name
    );

    if (!lastExercise) return 0;

    const completedSets = lastExercise.sets.filter(
      (s) => s.completed && typeof s.weight === 'number'
    );
    
    if (completedSets.length === 0) {
      return lastExercise.sets[0]?.weight as number ?? 0;
    }

    const avgRpe =
      completedSets.reduce((sum, s) => sum + (s.rpe ?? 8), 0) /
      completedSets.length;
    
    return suggestNextWeight(
      Number(completedSets[0].weight),
      avgRpe,
      exercise.weightType
    );
  };

  return {
    suggestNextWeight,
    getSuggestedWeight,
  };
};