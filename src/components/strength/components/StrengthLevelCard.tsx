import React from 'react';
import {
  type LiftType,
  type LiftResult,
  type Weights,
  type Gender,
  type StrengthLevel,
} from '../types/strengthTypes';
import { useStrengthStandards } from '../hooks/useStrengthStandards';

interface StrengthLevelCardProps {
  lift: LiftType;
  result: LiftResult;
  weights: Weights;
  bodyWeight: number;
  gender: Gender;
}

const StrengthLevelCard: React.FC<StrengthLevelCardProps> = ({
  lift,
  result,
  weights,
  bodyWeight,
  gender,
}) => {
  const { standards, liftNames } = useStrengthStandards();

  const mobileLabel: Record<StrengthLevel, string> = {
    untrained: 'UN',
    novice: 'NO',
    intermediate: 'IN',
    advanced: 'AD',
    elite: 'EL',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
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
            Object.entries(standards[gender][lift]) as [StrengthLevel, number][]
          ).map(([level, ratio]) => {
            const weight = Math.round(ratio * bodyWeight);
            const isCurrentLevel = result.level === level;
            const isAchieved = weights[lift] >= weight;

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
                      isCurrentLevel ? 'text-green-700' : 'text-gray-700'
                    }`}
                  >
                    {mobileLabel[level]}
                  </div>
                  <div
                    className={`font-bold text-xs leading-none mb-1 ${
                      isCurrentLevel ? 'text-green-800' : 'text-gray-800'
                    }`}
                  >
                    {weight}
                  </div>
                  <div
                    className={`text-xs leading-none ${
                      isCurrentLevel ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {ratio.toFixed(1)}x
                  </div>
                </div>

                <div className="hidden sm:block p-2">
                  <div
                    className={`font-bold text-sm capitalize mb-1 ${
                      isCurrentLevel ? 'text-green-700' : 'text-gray-700'
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
                      isCurrentLevel ? 'text-green-800' : 'text-gray-800'
                    }`}
                  >
                    {weight}
                  </div>
                  <div
                    className={`text-xs ${
                      isCurrentLevel ? 'text-green-600' : 'text-gray-500'
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
            Next goal: <strong>{result.progress.nextWeight} lbs</strong> for{' '}
            {result.progress.nextLevel} level (
            {result.progress.nextWeight - weights[lift]} lbs to go)
          </p>
        )}
      </div>
    </div>
  );
};

export default StrengthLevelCard;
