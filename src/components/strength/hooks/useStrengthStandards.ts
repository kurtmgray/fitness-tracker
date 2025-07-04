import { useMemo } from 'react';
import { type GenderStandards, type LiftType } from '../types/strengthTypes';

export const useStrengthStandards = () => {
  const standards: GenderStandards = useMemo(() => ({
    male: {
      squat: {
        untrained: 0.6,
        novice: 0.8,
        intermediate: 1.0,
        advanced: 1.4,
        elite: 1.6,
      },
      deadlift: {
        untrained: 0.8,
        novice: 1.0,
        intermediate: 1.2,
        advanced: 1.6,
        elite: 2.0,
      },
      bench: {
        untrained: 0.6,
        novice: 0.8,
        intermediate: 1.0,
        advanced: 1.2,
        elite: 1.4,
      },
      overheadPress: {
        untrained: 0.4,
        novice: 0.5,
        intermediate: 0.6,
        advanced: 0.8,
        elite: 1.0,
      },
      romanianDeadlift: {
        untrained: 0.65,
        novice: 0.8,
        intermediate: 1.0,
        advanced: 1.3,
        elite: 1.4,
      },
    },
    female: {
      squat: {
        untrained: 0.45,
        novice: 0.6,
        intermediate: 0.75,
        advanced: 1.05,
        elite: 1.2,
      },
      deadlift: {
        untrained: 0.6,
        novice: 0.75,
        intermediate: 0.9,
        advanced: 1.2,
        elite: 1.5,
      },
      bench: {
        untrained: 0.35,
        novice: 0.45,
        intermediate: 0.6,
        advanced: 0.8,
        elite: 1.0,
      },
      overheadPress: {
        untrained: 0.25,
        novice: 0.35,
        intermediate: 0.45,
        advanced: 0.6,
        elite: 0.75,
      },
      romanianDeadlift: {
        untrained: 0.5,
        novice: 0.6,
        intermediate: 0.75,
        advanced: 1.0,
        elite: 1.15,
      },
    },
  }), []);

  const liftNames: Record<LiftType, string> = useMemo(() => ({
    squat: 'Back Squat',
    deadlift: 'Deadlift',
    bench: 'Bench Press',
    overheadPress: 'Overhead Press',
    romanianDeadlift: 'Romanian Deadlift',
  }), []);

  return {
    standards,
    liftNames,
  };
};