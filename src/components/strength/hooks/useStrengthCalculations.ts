import { useMemo } from 'react';
import { 
 type Gender, 
 type LiftType, 
 type StrengthLevel, 
 type Weights, 
 type ProgressInfo, 
 type LiftResult,
 type Analysis 
} from '../types/strengthTypes';
import { useStrengthStandards } from './useStrengthStandards';

export const useStrengthCalculations = (
  bodyWeight: number,
  gender: Gender,
  weights: Weights
) => {
  const { standards, liftNames } = useStrengthStandards();

  const calculateLevel = (
    weight: number,
    bodyWeight: number,
    liftType: LiftType
  ): StrengthLevel => {
    const ratio = weight / bodyWeight;
    const standard = standards[gender][liftType];

    if (ratio >= standard.elite) return 'elite';
    if (ratio >= standard.advanced) return 'advanced';
    if (ratio >= standard.intermediate) return 'intermediate';
    if (ratio >= standard.novice) return 'novice';
    return 'untrained';
  };

  const getProgressToNext = (
    weight: number,
    bodyWeight: number,
    liftType: LiftType
  ): ProgressInfo => {
    const ratio = weight / bodyWeight;
    const standard = standards[gender][liftType];
    const currentLevel = calculateLevel(weight, bodyWeight, liftType);

    let nextLevel: StrengthLevel;
    let nextRatio: number;

    switch (currentLevel) {
      case 'untrained':
        nextLevel = 'novice';
        nextRatio = standard.novice;
        break;
      case 'novice':
        nextLevel = 'intermediate';
        nextRatio = standard.intermediate;
        break;
      case 'intermediate':
        nextLevel = 'advanced';
        nextRatio = standard.advanced;
        break;
      case 'advanced':
        nextLevel = 'elite';
        nextRatio = standard.elite;
        break;
      case 'elite':
        return { nextLevel: 'elite', progress: 100, nextWeight: weight };
      default:
        nextLevel = 'novice';
        nextRatio = standard.novice;
    }

    const nextWeight = Math.round(nextRatio * bodyWeight);
    const progress = Math.min(100, Math.round((ratio / nextRatio) * 100));

    return { nextLevel, progress, nextWeight };
  };

  const getLevelColor = (level: StrengthLevel): string => {
    const colors: Record<StrengthLevel, string> = {
      untrained: '#e53e3e',
      novice: '#dd6b20',
      intermediate: '#38a169',
      advanced: '#3182ce',
      elite: '#805ad5',
    };
    return colors[level] || '#718096';
  };

  const getOverallLevel = (): StrengthLevel => {
    const levels = (Object.keys(weights) as LiftType[]).map((lift) =>
      calculateLevel(weights[lift], bodyWeight, lift)
    );

    const levelScores: Record<StrengthLevel, number> = {
      untrained: 1,
      novice: 2,
      intermediate: 3,
      advanced: 4,
      elite: 5,
    };

    const avgScore =
      levels.reduce((sum, level) => sum + levelScores[level], 0) /
      levels.length;

    if (avgScore >= 4.5) return 'elite';
    if (avgScore >= 3.5) return 'advanced';
    if (avgScore >= 2.5) return 'intermediate';
    if (avgScore >= 1.5) return 'novice';
    return 'untrained';
  };

  const getStrongestLift = (): string => {
    let strongest = '';
    let highestRatio = 0;

    (Object.keys(weights) as LiftType[]).forEach((lift) => {
      const ratio = weights[lift] / bodyWeight;
      if (ratio > highestRatio) {
        highestRatio = ratio;
        strongest = liftNames[lift];
      }
    });

    return strongest;
  };

  const results: Record<LiftType, LiftResult> = useMemo(() => {
    const newResults: Record<LiftType, LiftResult> = {} as Record<LiftType, LiftResult>;
    
    (Object.keys(weights) as LiftType[]).forEach((lift) => {
      const level = calculateLevel(weights[lift], bodyWeight, lift);
      const progress = getProgressToNext(weights[lift], bodyWeight, lift);
      const ratio = weights[lift] / bodyWeight;

      newResults[lift] = {
        level,
        ratio: ratio.toFixed(2),
        progress,
        color: getLevelColor(level),
      };
    });

    return newResults;
  }, [weights, bodyWeight, gender]);

  const analysis: Analysis = useMemo(() => {
    const overallLevel = getOverallLevel();
    const strongestLift = getStrongestLift();

    const getNextLevel = (level: StrengthLevel): StrengthLevel => {
      switch (level) {
        case 'untrained':
          return 'novice';
        case 'novice':
          return 'intermediate';
        case 'intermediate':
          return 'advanced';
        case 'advanced':
          return 'elite';
        case 'elite':
          return 'elite';
        default:
          return 'novice';
      }
    };

    const nextLevel = getNextLevel(overallLevel);

    const liftsAtNextLevel = (Object.keys(weights) as LiftType[]).filter(
      (lift) => {
        const liftLevel = calculateLevel(weights[lift], bodyWeight, lift);
        return overallLevel === 'elite'
          ? liftLevel === 'elite'
          : liftLevel === nextLevel ||
              liftLevel === 'advanced' ||
              liftLevel === 'elite';
      }
    );

    return {
      overallLevel,
      strongestLift,
      intermediateLifts: liftsAtNextLevel.length,
      totalLifts: Object.keys(weights).length,
      nextLevel,
    };
  }, [weights, bodyWeight, gender]);

  return {
    results,
    analysis,
    calculateLevel,
    getProgressToNext,
    getLevelColor,
    standards,
    liftNames,
  };
};