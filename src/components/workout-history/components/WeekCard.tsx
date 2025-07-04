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
      className={`bg-white shadow-lg border-2 rounded-xl transition-all ${
        isCurrentWeek
          ? 'border-blue-500'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div
        className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-xl"
        onClick={() => onToggleWeek(weekKey)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  Week of {formatDateRange(week.weekStartDate)}
                </h3>
                {isCurrentWeek && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    Current Week
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
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
              <div className="text-sm text-gray-500">Consistency</div>
              <div className="text-lg font-bold text-gray-800">
                {weekStats.totalWorkouts}/3 days
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
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
        <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
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