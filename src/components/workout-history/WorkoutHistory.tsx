import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useWorkoutHistoryData } from './hooks/useWorkoutHistoryData';
import WeekCard from './components/WeekCard';
import HistorySummary from './components/HistorySummary';
import { UnifiedHeader } from '@/components/shared/UnifiedHeader';

const WorkoutHistory: React.FC = () => {
  const {
    mockData,
    isLoading,
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
    <div className="bg-FAF7F2/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-E8D7C3/20 p-4 sm:p-6">
      <UnifiedHeader
        title="Workout History"
        icon={TrendingUp}
        compact={true}
        rightContent={
          <div className="text-right text-sm">
            <div className="text-[#2C2C2C]/70">Track progress</div>
            <div className="text-[#8B9A5B] font-medium">{mockData.length} weeks</div>
          </div>
        }
      />

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B9A5B] mx-auto"></div>
          <p className="mt-2 text-[#2C2C2C]/70">Loading workout history...</p>
        </div>
      ) : mockData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#2C2C2C]/70">No workout history found. Complete some workouts to see your progress!</p>
        </div>
      ) : (
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
      )}

      {!isLoading && mockData.length > 0 && (
        <HistorySummary mockData={mockData} getWeekStats={getWeekStats} />
      )}
    </div>
  );
};

export default WorkoutHistory;