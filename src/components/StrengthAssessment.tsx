import React, { useState, useEffect } from 'react';
import { Activity, User, Users, Target, Bot, BarChart3 } from 'lucide-react';

type Gender = 'male' | 'female';

type LiftType =
  | 'squat'
  | 'deadlift'
  | 'bench'
  | 'overheadPress'
  | 'romanianDeadlift';

type StrengthLevel =
  | 'untrained'
  | 'novice'
  | 'intermediate'
  | 'advanced'
  | 'elite';

interface Weights {
  squat: number;
  deadlift: number;
  bench: number;
  overheadPress: number;
  romanianDeadlift: number;
}

interface LiftStandards {
  untrained: number;
  novice: number;
  intermediate: number;
  advanced: number;
  elite: number;
}

interface GenderStandards {
  male: Record<LiftType, LiftStandards>;
  female: Record<LiftType, LiftStandards>;
}

interface ProgressInfo {
  nextLevel: StrengthLevel;
  progress: number;
  nextWeight: number;
}

interface LiftResult {
  level: StrengthLevel;
  ratio: string;
  progress: ProgressInfo;
  color: string;
}

interface Analysis {
  overallLevel: StrengthLevel;
  strongestLift: string;
  intermediateLifts: number;
  totalLifts: number;
  nextLevel: StrengthLevel;
}

interface AIAnalysis {
  insights: string[];
  recommendations: string[];
  overallAssessment: StrengthLevel;
}

const StrengthCalculator: React.FC = () => {
  const [bodyWeight, setBodyWeight] = useState<number>(175);
  const [gender, setGender] = useState<Gender>('male');
  const [weights, setWeights] = useState<Weights>({
    squat: 195,
    deadlift: 230,
    bench: 175,
    overheadPress: 90,
    romanianDeadlift: 200,
  });

  const [results, setResults] = useState<Record<LiftType, LiftResult>>(
    {} as Record<LiftType, LiftResult>
  );
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({
    insights: [],
    recommendations: [],
    overallAssessment: 'untrained',
  });
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

  // Working weight standards (80-85% of 1RM standards)
  const standards: GenderStandards = {
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
  };

  const liftNames: Record<LiftType, string> = {
    squat: 'Back Squat',
    deadlift: 'Deadlift',
    bench: 'Bench Press',
    overheadPress: 'Overhead Press',
    romanianDeadlift: 'Romanian Deadlift',
  };

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

  const getAnalysis = (): Analysis => {
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
  };

  const getAIAnalysis = (): AIAnalysis => {
    const analysis = getAnalysis();
    const overallLevel = analysis.overallLevel;
    const intermediateLifts = analysis.intermediateLifts;

    const squatRatio = weights.squat / bodyWeight;
    const deadliftRatio = weights.deadlift / bodyWeight;
    // const benchRatio = weights.bench / bodyWeight;
    // const ohpRatio = weights.overheadPress / bodyWeight;
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

  useEffect(() => {
    const newResults: Record<LiftType, LiftResult> = {} as Record<
      LiftType,
      LiftResult
    >;
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
    setResults(newResults);

    setShowAnalysis(false);
  }, [weights, bodyWeight, gender]);

  const analysis = getAnalysis();

  const handleGetAnalysis = (): void => {
    const newAiAnalysis = getAIAnalysis();
    setAiAnalysis(newAiAnalysis);
    setShowAnalysis(true);
  };

  const handleWeightChange = (lift: LiftType, value: number): void => {
    setWeights((prev) => ({
      ...prev,
      [lift]: value,
    }));
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/20 p-4 sm:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-semibold text-slate-800 mb-2 sm:mb-4">
          <Activity className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 mr-3 inline" />
          Strength Assessment
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          Enter your working weights to see where you stand
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Standards adjusted for {gender === 'male' ? 'men' : 'women'}
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-100">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4">
          Your Stats
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gender
            </label>
            <div className="flex bg-slate-200 rounded-lg p-1">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  gender === 'male'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-300'
                }`}
              >
                <User className="w-4 h-4 mr-1" />
                Male
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  gender === 'female'
                    ? 'bg-slate-500 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-300'
                }`}
              >
                <Users className="w-4 h-4 mr-1" />
                Female
              </button>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Weight (lbs)
            </label>
            <input
              type="number"
              value={bodyWeight}
              onChange={(e) => setBodyWeight(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              min="100"
              max="400"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Back Squat (lbs)
              </label>
              <input
                type="number"
                value={weights.squat}
                onChange={(e) =>
                  handleWeightChange('squat', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                min="0"
                max="1000"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadlift (lbs)
              </label>
              <input
                type="number"
                value={weights.deadlift}
                onChange={(e) =>
                  handleWeightChange('deadlift', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                min="0"
                max="1000"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bench Press (lbs)
              </label>
              <input
                type="number"
                value={weights.bench}
                onChange={(e) =>
                  handleWeightChange('bench', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                min="0"
                max="1000"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overhead Press (lbs)
              </label>
              <input
                type="number"
                value={weights.overheadPress}
                onChange={(e) =>
                  handleWeightChange('overheadPress', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                min="0"
                max="1000"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Romanian Deadlift (lbs)
              </label>
              <input
                type="number"
                value={weights.romanianDeadlift}
                onChange={(e) =>
                  handleWeightChange('romanianDeadlift', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                min="0"
                max="1000"
              />
            </div>
            <div className="flex-1 sm:opacity-0 sm:pointer-events-none"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 sm:p-6 rounded-xl text-center">
          <h3 className="text-xs sm:text-sm font-medium opacity-90">
            Overall Level
          </h3>
          <p className="text-lg sm:text-2xl font-bold capitalize">
            {analysis.overallLevel}
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-400 to-slate-500 text-white p-3 sm:p-6 rounded-xl text-center">
          <h3 className="text-xs sm:text-sm font-medium opacity-90">
            Strongest Lift
          </h3>
          <p className="text-sm sm:text-xl font-bold">
            {analysis.strongestLift}
          </p>
        </div>
        <div className="bg-gradient-to-r from-slate-400 to-blue-500 text-white p-3 sm:p-6 rounded-xl text-center">
          <h3 className="text-xs sm:text-sm font-medium opacity-90">
            Body Weight
          </h3>
          <p className="text-lg sm:text-2xl font-bold">{bodyWeight} lbs</p>
        </div>
        <div className="bg-gradient-to-r from-blue-400 to-slate-500 text-white p-3 sm:p-6 rounded-xl text-center">
          <h3 className="text-xs sm:text-sm font-medium opacity-90">
            {analysis.overallLevel === 'elite'
              ? 'Elite Lifts'
              : `${
                  analysis.nextLevel.charAt(0).toUpperCase() +
                  analysis.nextLevel.slice(1)
                }+ Lifts`}
          </h3>
          <p className="text-lg sm:text-2xl font-bold">
            {analysis.intermediateLifts}/{analysis.totalLifts}
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {(Object.keys(weights) as LiftType[]).map((lift) => {
          const result = results[lift];
          if (!result) return null;

          return (
            <div
              key={lift}
              className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {liftNames[lift]}
                  </h3>
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                      {weights[lift]} lbs
                    </p>
                    <p className="text-base sm:text-lg text-gray-600">
                      {result.ratio}x bodyweight
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-5 gap-1 sm:gap-3 mb-4">
                  {(
                    Object.entries(standards[gender][lift]) as [
                      StrengthLevel,
                      number
                    ][]
                  ).map(([level, ratio]) => {
                    const weight = Math.round(ratio * bodyWeight);
                    const isCurrentLevel = result.level === level;
                    const isAchieved = weights[lift] >= weight;

                    const mobileLabel: Record<StrengthLevel, string> = {
                      untrained: 'UN',
                      novice: 'NO',
                      intermediate: 'IN',
                      advanced: 'AD',
                      elite: 'EL',
                    };

                    return (
                      <div
                        key={level}
                        className={`p-1 rounded-lg text-center border-2 transition-all relative ${
                          isCurrentLevel
                            ? 'border-green-500 bg-green-100 scale-105 shadow-lg'
                            : isAchieved
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        {isCurrentLevel && (
                          <div className="absolute -top-1 -right-1 sm:hidden">
                            <div className="w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                          </div>
                        )}

                        <div className="sm:hidden">
                          <div
                            className={`font-bold text-xs leading-none mb-1 ${
                              isCurrentLevel
                                ? 'text-green-700'
                                : 'text-gray-700'
                            }`}
                          >
                            {mobileLabel[level]}
                          </div>
                          <div
                            className={`font-bold text-xs leading-none mb-1 ${
                              isCurrentLevel
                                ? 'text-green-800'
                                : 'text-gray-800'
                            }`}
                          >
                            {weight}
                          </div>
                          <div
                            className={`text-xs leading-none ${
                              isCurrentLevel
                                ? 'text-green-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {ratio.toFixed(1)}x
                          </div>
                        </div>

                        <div className="hidden sm:block p-2">
                          <div
                            className={`font-bold text-sm capitalize mb-1 ${
                              isCurrentLevel
                                ? 'text-green-700'
                                : 'text-gray-700'
                            }`}
                          >
                            {level}
                            {isCurrentLevel && (
                              <div className="text-xs bg-green-500 text-white px-1 py-0.5 rounded-full mt-1">
                                YOUR LEVEL
                              </div>
                            )}
                          </div>
                          <div
                            className={`font-bold text-base ${
                              isCurrentLevel
                                ? 'text-green-800'
                                : 'text-gray-800'
                            }`}
                          >
                            {weight}
                          </div>
                          <div
                            className={`text-xs ${
                              isCurrentLevel
                                ? 'text-green-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {ratio.toFixed(1)}x
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress to {result.progress.nextLevel}</span>
                    <span>{result.progress.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-out"
                      style={{
                        width: `${Math.min(100, result.progress.progress)}%`,
                      }}
                    />
                  </div>
                </div>

                {result.progress.nextLevel !== 'elite' && (
                  <p className="text-sm text-gray-600">
                    Next goal: <strong>{result.progress.nextWeight} lbs</strong>{' '}
                    for {result.progress.nextLevel} level (
                    {result.progress.nextWeight - weights[lift]} lbs to go)
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleGetAnalysis}
          className="bg-gradient-to-r from-blue-500 to-slate-600 hover:from-blue-600 hover:to-slate-700 text-white font-semibold py-4 px-8 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105"
        >
          <Bot className="w-5 h-5 mr-2" />
          Get AI Analysis & Recommendations
        </button>
      </div>

      {showAnalysis && (
        <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-slate-600 text-white rounded-xl p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">
              <Bot className="w-6 h-6 mr-2 inline" />
              AI Analysis & Insights
            </h3>

            <div className="mb-6">
              <h4 className="font-semibold text-base sm:text-lg mb-3">
                <BarChart3 className="w-5 h-5 mr-2 inline" />
                What Your Numbers Tell Me
              </h4>
              <div className="space-y-2">
                {aiAnalysis.insights && aiAnalysis.insights.length > 0 ? (
                  aiAnalysis.insights.map((insight, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-3">
                      <p className="text-sm sm:text-base">{insight}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm sm:text-base">
                      Let me analyze your strength profile...
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-base sm:text-lg mb-3">
                <Target className="w-5 h-5 mr-2 inline" />
                My Recommendations
              </h4>
              <div className="space-y-2">
                {aiAnalysis.recommendations &&
                aiAnalysis.recommendations.length > 0 ? (
                  aiAnalysis.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-lg p-3 border-l-4 border-yellow-300"
                    >
                      <p className="text-sm sm:text-base">{rec}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/10 rounded-lg p-3 border-l-4 border-yellow-300">
                    <p className="text-sm sm:text-base">
                      Working on personalized recommendations for you...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-slate-600 text-white rounded-xl p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">
              <BarChart3 className="w-6 h-6 mr-2 inline" />
              Quick Stats
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 className="font-semibold text-base sm:text-lg mb-2">
                  Current Standing
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    Overall level:{' '}
                    <strong className="capitalize">
                      {analysis.overallLevel}
                    </strong>
                  </li>
                  <li>
                    Strongest lift: <strong>{analysis.strongestLift}</strong>
                  </li>
                  <li>
                    Lifts at{' '}
                    {analysis.overallLevel === 'elite'
                      ? 'elite'
                      : analysis.nextLevel}
                    +:
                    <strong>
                      {' '}
                      {analysis.intermediateLifts}/{analysis.totalLifts}
                    </strong>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-base sm:text-lg mb-2">
                  Next Steps
                </h4>
                <ul className="space-y-1 text-sm">
                  {(Object.keys(weights) as LiftType[]).map((lift) => {
                    const result = results[lift];
                    if (!result || result.progress.nextLevel === 'elite')
                      return null;

                    return (
                      <li key={lift}>
                        <strong>{liftNames[lift]}:</strong>{' '}
                        {result.progress.nextWeight - weights[lift]} lbs to{' '}
                        {result.progress.nextLevel}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 sm:p-4 bg-white/10 rounded-lg">
              <p className="text-xs sm:text-sm">
                <strong>Note:</strong> These standards are based on working set
                weights (5-8 rep range), not 1RM estimates. This gives you a
                realistic view of your current training strength.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrengthCalculator;
