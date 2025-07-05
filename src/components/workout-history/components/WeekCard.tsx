import React from 'react';
import WorkoutCard from './WorkoutCard';

interface WeekCardProps {
  week: WeekData;
  isExpanded: boolean;
  isCurrentWeek: boolean;
  weekStats: {
    totalWorkouts: number;
    totalVolume: number;
    avgDuration: number;
  };
  formatDateRange: (date: Date) => string;
  onToggleWeek: (weekKey: string) => void;
  expandedWorkouts: Set<string>;
  dayTitles: Record<WorkoutDay, string>;
  onToggleWorkout: (workoutId: string) => void;
  calculateWorkoutVolume: (workout: WorkoutSession) => number;
}

const WeekCard: React.FC<WeekCardProps> = ({
  week,
  isExpanded,
  isCurrentWeek,
  weekStats,
  formatDateRange,
  onToggleWeek,
  expandedWorkouts,
  dayTitles,
  onToggleWorkout,
  calculateWorkoutVolume,
}) => {
  const weekKey = week.weekStartDate.toISOString();

  return (
    <div
      className={`bg-[#FAF7F2] shadow-lg border-2 rounded-xl transition-all ${
        isCurrentWeek
          ? 'border-[#8B9A5B]'
          : 'border-[#E8D7C3] hover:border-[#8B9A5B]/50'
      }`}
    >
      <div
        className="p-4 sm:p-6 cursor-pointer hover:bg-[#E8D7C3]/50 transition-colors rounded-xl"
        onClick={() => onToggleWeek(weekKey)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-bold text-[#2C2C2C]">
                  Week of {formatDateRange(week.weekStartDate)}
                </h3>
                {isCurrentWeek && (
                  <span className="bg-[#F0E6D6] text-[#8B9A5B] px-2 py-1 rounded-full text-xs font-medium">
                    Current Week
                  </span>
                )}
              </div>
              <p className="text-sm text-[#2C2C2C]/70">
                {weekStats.totalWorkouts} workouts •{' '}
                {Math.round(weekStats.totalVolume).toLocaleString()} lbs
                total volume
                {weekStats.avgDuration > 0 &&
                  ` • ${Math.round(weekStats.avgDuration)} min avg`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm text-[#2C2C2C]/60">Consistency</div>
              <div className="text-lg font-bold text-[#2C2C2C]">
                {weekStats.totalWorkouts}/3 days
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-[#2C2C2C]/60 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-[#E8D7C3] p-4 sm:p-6 bg-[#E8D7C3]/30">
          <div className="space-y-4">
            {week.workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                isExpanded={expandedWorkouts.has(workout.id)}
                dayTitles={dayTitles}
                onToggleWorkout={onToggleWorkout}
                calculateWorkoutVolume={calculateWorkoutVolume}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekCard;