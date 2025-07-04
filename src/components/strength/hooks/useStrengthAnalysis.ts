import { useMemo } from 'react';
import { 
  type Weights, 
  type LiftType, 
  type LiftResult, 
  type Analysis, 
  type AIAnalysis 
} from '../types/strengthTypes';
import { useStrengthStandards } from './useStrengthStandards';

export const useStrengthAnalysis = (
  bodyWeight: number,
  weights: Weights,
  results: Record<LiftType, LiftResult>,
  analysis: Analysis
) => {
  const { liftNames } = useStrengthStandards();

  const getAIAnalysis = (): AIAnalysis => {
    const overallLevel = analysis.overallLevel;
    const intermediateLifts = analysis.intermediateLifts;

    const squatRatio = weights.squat / bodyWeight;
    const deadliftRatio = weights.deadlift / bodyWeight;
    const rdlRatio = weights.romanianDeadlift / bodyWeight;

    const insights: string[] = [];
    const recommendations: string[] = [];

    if (overallLevel === 'elite') {
      insights.push(
        "Elite level across the board - you're in the top 1% of lifters!"
      );
    } else if (overallLevel === 'advanced') {
      insights.push(
        "Advanced lifter - you've built serious strength and are approaching elite territory."
      );
    } else if (overallLevel === 'intermediate') {
      insights.push(
        "Solid intermediate strength - you've moved beyond beginner gains and built real strength."
      );
    } else if (overallLevel === 'novice') {
      insights.push(
        "Novice level - great foundation! You're past the initial learning phase."
      );
    } else {
      insights.push(
        'Starting your strength journey - every rep counts at this stage!'
      );
    }

    if (deadliftRatio > squatRatio + 0.2) {
      insights.push(
        'Strong posterior chain - your deadlift significantly outpaces your squat, suggesting good hip hinge mechanics.'
      );
      if (rdlRatio > squatRatio) {
        insights.push(
          'Exceptional hamstring/glute development - both your deadlifts are stronger than your squat.'
        );
      }
    }

    const benchToOhpRatio = weights.bench / weights.overheadPress;
    if (benchToOhpRatio > 2.5) {
      insights.push(
        'Overhead pressing lagging - your bench is much stronger than your overhead press.'
      );
      recommendations.push(
        'Focus on overhead pressing frequency and shoulder mobility work.'
      );
    } else if (benchToOhpRatio < 1.8) {
      insights.push(
        'Excellent shoulder strength - your overhead press is unusually strong relative to bench.'
      );
    }

    if (squatRatio < deadliftRatio - 0.3) {
      insights.push(
        'Squat potentially limited by mobility or technique - significant gap vs deadlift.'
      );
      recommendations.push(
        'Work on ankle/hip mobility and squat technique refinement.'
      );
    }

    if (overallLevel === 'untrained' || overallLevel === 'novice') {
      recommendations.push(
        'Focus on consistent training 3x/week with linear progression.'
      );
      recommendations.push(
        'Master technique on all lifts before pushing heavy weights.'
      );
    } else if (overallLevel === 'intermediate') {
      recommendations.push(
        'Consider periodization - weekly or monthly progression vs linear.'
      );
      recommendations.push(
        'Add volume through accessories to address weak points.'
      );
    } else if (overallLevel === 'advanced') {
      recommendations.push(
        'Specialized programming needed - consider conjugate or block periodization.'
      );
      recommendations.push(
        'Competition or specific strength goals will drive optimal programming.'
      );
    }

    if (intermediateLifts >= 4) {
      recommendations.push(
        'Prioritize recovery - sleep 7-9hrs, manage stress, consider deload weeks.'
      );
    }

    (Object.keys(weights) as LiftType[]).forEach((lift) => {
      const result = results[lift];
      if (!result) return;

      if (result.level === 'untrained' && overallLevel !== 'untrained') {
        recommendations.push(
          `Your ${liftNames[lift]} needs attention - it's holding back overall progress.`
        );
      }

      if (result.level === 'elite' && overallLevel !== 'elite') {
        insights.push(
          `Your ${liftNames[lift]} is elite level - a real strength!`
        );
      }
    });

    if (insights.length === 0) {
      insights.push(
        "Based on your current weights, you're building a solid strength foundation!"
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Keep training consistently and focus on progressive overload.'
      );
      recommendations.push(
        'Ensure proper form on all lifts before increasing weight.'
      );
    }

    return {
      insights,
      recommendations,
      overallAssessment: overallLevel,
    };
  };

  const aiAnalysis = useMemo(() => getAIAnalysis(), [
    bodyWeight,
    weights,
    results,
    analysis
  ]);

  return { aiAnalysis };
};