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
    <div className="bg-[#FAF7F2] border border-[#E8D7C3] rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#F0E6D6] to-[#E8D7C3] p-4 sm:p-6 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-xl sm:text-2xl font-bold text-[#2C2C2C]">
            {liftNames[lift]}
          </h3>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-[#2C2C2C]">
              {weights[lift]} lbs
            </p>
            <p className="text-base sm:text-lg text-[#2C2C2C]">
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
                    ? 'border-[#8B9A5B] bg-[#8B9A5B]/20 scale-105 shadow-lg'
                    : isAchieved
                    ? 'border-[#8B9A5B] bg-[#8B9A5B]/10'
                    : 'border-[#E8D7C3] bg-[#F0E6D6]'
                }`}
              >
                {isCurrentLevel && (
                  <div className="absolute -top-1 -right-1 sm:hidden">
                    <div className="w-2 h-2 bg-[#8B9A5B] rounded-full border border-white"></div>
                  </div>
                )}

                <div className="sm:hidden">
                  <div
                    className={`font-bold text-xs leading-none mb-1 ${
                      isCurrentLevel ? 'text-[#8B9A5B]' : 'text-[#2C2C2C]'
                    }`}
                  >
                    {mobileLabel[level]}
                  </div>
                  <div
                    className={`font-bold text-xs leading-none mb-1 ${
                      isCurrentLevel ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]'
                    }`}
                  >
                    {weight}
                  </div>
                  <div
                    className={`text-xs leading-none ${
                      isCurrentLevel ? 'text-[#8B9A5B]' : 'text-[#2C2C2C]'
                    }`}
                  >
                    {ratio.toFixed(1)}x
                  </div>
                </div>

                <div className="hidden sm:block p-2">
                  <div
                    className={`font-bold text-sm capitalize mb-1 ${
                      isCurrentLevel ? 'text-[#8B9A5B]' : 'text-[#2C2C2C]'
                    }`}
                  >
                    {level}
                    {isCurrentLevel && (
                      <div className="text-xs bg-[#8B9A5B] text-white px-1 py-0.5 rounded-full mt-1">
                        YOUR LEVEL
                      </div>
                    )}
                  </div>
                  <div
                    className={`font-bold text-base ${
                      isCurrentLevel ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]'
                    }`}
                  >
                    {weight}
                  </div>
                  <div
                    className={`text-xs ${
                      isCurrentLevel ? 'text-[#8B9A5B]' : 'text-[#2C2C2C]'
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
          <div className="flex justify-between text-sm text-[#2C2C2C] mb-1">
            <span>Progress to {result.progress.nextLevel}</span>
            <span>{result.progress.progress}%</span>
          </div>
          <div className="w-full bg-[#E8D7C3] rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8B9A5B] to-[#8B9A5B] transition-all duration-300 ease-out"
              style={{
                width: `${Math.min(100, result.progress.progress)}%`,
              }}
            />
          </div>
        </div>

        {result.progress.nextLevel !== 'elite' && (
          <p className="text-sm text-[#2C2C2C]">
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
