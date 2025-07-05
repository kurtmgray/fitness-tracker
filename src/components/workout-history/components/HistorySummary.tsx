import React from 'react';

interface HistorySummaryProps {
  mockData: WeekData[];
  getWeekStats: (workouts: WorkoutSession[]) => {
    totalWorkouts: number;
    totalVolume: number;
    avgDuration: number;
  };
}

const HistorySummary: React.FC<HistorySummaryProps> = ({
  mockData,
  getWeekStats,
}) => {
  const totalWorkouts = mockData.reduce((sum, week) => sum + week.workouts.length, 0);
  const totalVolumeK = Math.round(
    mockData.reduce(
      (sum, week) => sum + getWeekStats(week.workouts).totalVolume,
      0
    ) / 1000
  );
  const avgDuration = Math.round(
    mockData.reduce(
      (sum, week) =>
        sum +
        getWeekStats(week.workouts).avgDuration * week.workouts.length,
      0
    ) / totalWorkouts
  );
  const consistencyPercentage = Math.round((totalWorkouts / (8 * 3)) * 100);

  return (
    <div className="mt-8 bg-gradient-to-r from-[#F0E6D6] to-[#E8D7C3] rounded-2xl p-6 border border-[#E8D7C3]">
      <h3 className="text-xl font-semibold text-[#2C2C2C] mb-4">
        8-Week Summary
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#8B9A5B]">{totalWorkouts}</div>
          <div className="text-sm text-[#2C2C2C]/70">Total Workouts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#8B9A5B]">{totalVolumeK}k</div>
          <div className="text-sm text-[#2C2C2C]/70">Total Volume (lbs)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#8B9A5B]">{avgDuration}</div>
          <div className="text-sm text-[#2C2C2C]/70">Avg Duration (min)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#8B9A5B]">
            {consistencyPercentage}%
          </div>
          <div className="text-sm text-[#2C2C2C]/70">Consistency</div>
        </div>
      </div>
    </div>
  );
};

export default HistorySummary;