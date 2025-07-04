import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useWorkoutHistoryData } from './hooks/useWorkoutHistoryData';
import WeekCard from './components/WeekCard';
import HistorySummary from './components/HistorySummary';

const WorkoutHistory: React.FC = () => {
  const {
    mockData,
    expandedWeeks,
    expandedWorkouts,
    dayTitles,
    toggleWeek,
    toggleWorkout,
    getWeekStats,
    calculateWorkoutVolume,
    formatDateRange,
  } = useWorkoutHistoryData();

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/20 p-4 sm:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-semibold text-slate-800 mb-2 sm:mb-4">
          <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 mr-3 inline" />
          Workout History
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          Track your progress and review past training sessions
        </p>
      </div>

      <div className="space-y-4">
        {mockData.map((week, index) => {
          const weekKey = week.weekStartDate.toISOString();
          const isExpanded = expandedWeeks.has(weekKey);
          const weekStats = getWeekStats(week.workouts);
          const isCurrentWeek = index === 0;

          return (
            <WeekCard
              key={weekKey}
              week={week}
              isExpanded={isExpanded}
              isCurrentWeek={isCurrentWeek}
              weekStats={weekStats}
              formatDateRange={formatDateRange}
              onToggleWeek={toggleWeek}
              expandedWorkouts={expandedWorkouts}
              dayTitles={dayTitles}
              onToggleWorkout={toggleWorkout}
              calculateWorkoutVolume={calculateWorkoutVolume}
            />
          );
        })}
      </div>

      <HistorySummary mockData={mockData} getWeekStats={getWeekStats} />
    </div>
  );
};

export default WorkoutHistory;