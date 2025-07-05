import React from 'react';
import { type Analysis } from '../types/strengthTypes';

interface StrengthStatsGridProps {
  analysis: Analysis;
  bodyWeight: number;
}

const StrengthStatsGrid: React.FC<StrengthStatsGridProps> = ({
  analysis,
  bodyWeight,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="bg-gradient-to-r from-[#8B9A5B] to-[#2C2C2C] text-white p-3 sm:p-6 rounded-xl text-center">
        <h3 className="text-xs sm:text-sm font-medium opacity-90">
          Overall Level
        </h3>
        <p className="text-lg sm:text-2xl font-bold capitalize">
          {analysis.overallLevel}
        </p>
      </div>
      <div className="bg-gradient-to-r from-[#8B9A5B] to-[#2C2C2C] text-white p-3 sm:p-6 rounded-xl text-center">
        <h3 className="text-xs sm:text-sm font-medium opacity-90">
          Strongest Lift
        </h3>
        <p className="text-sm sm:text-xl font-bold">{analysis.strongestLift}</p>
      </div>
      <div className="bg-gradient-to-r from-[#8B9A5B] to-[#2C2C2C] text-white p-3 sm:p-6 rounded-xl text-center">
        <h3 className="text-xs sm:text-sm font-medium opacity-90">
          Body Weight
        </h3>
        <p className="text-lg sm:text-2xl font-bold">{bodyWeight} lbs</p>
      </div>
      <div className="bg-gradient-to-r from-[#8B9A5B] to-[#2C2C2C] text-white p-3 sm:p-6 rounded-xl text-center">
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
  );
};

export default StrengthStatsGrid;
