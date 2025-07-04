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
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-6 border border-blue-100">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">
        8-Week Summary
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalWorkouts}</div>
          <div className="text-sm text-gray-600">Total Workouts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{totalVolumeK}k</div>
          <div className="text-sm text-gray-600">Total Volume (lbs)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{avgDuration}</div>
          <div className="text-sm text-gray-600">Avg Duration (min)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {consistencyPercentage}%
          </div>
          <div className="text-sm text-gray-600">Consistency</div>
        </div>
      </div>
    </div>
  );
};

export default HistorySummary;