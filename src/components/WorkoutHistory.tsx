import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { generateMockData } from '../utils/workoutMocks';

const WorkoutHistory: React.FC = () => {
  const [mockData] = useState<WeekData[]>(generateMockData());
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<string>>(
    new Set()
  );

  const dayTitles: Record<WorkoutDay, string> = {
    day1: 'Pull & Lower Focus',
    day2: 'Push & Functional Focus',
    day3: 'Balanced Hypertrophy & Stability',
  };

  const toggleWeek = (weekKey: string) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekKey)) {
      newExpanded.delete(weekKey);
    } else {
      newExpanded.add(weekKey);
    }
    setExpandedWeeks(newExpanded);
  };

  const toggleWorkout = (workoutId: string) => {
    const newExpanded = new Set(expandedWorkouts);
    if (newExpanded.has(workoutId)) {
      newExpanded.delete(workoutId);
    } else {
      newExpanded.add(workoutId);
    }
    setExpandedWorkouts(newExpanded);
  };

  const formatDateRange = (weekStart: Date): string => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const formatOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    const start = weekStart.toLocaleDateString('en-US', formatOptions);
    const end = weekEnd.toLocaleDateString('en-US', formatOptions);

    return `${start} - ${end}`;
  };

  const getWeekStats = (workouts: WorkoutSession[]) => {
    const totalWorkouts = workouts.length;
    const totalVolume = workouts.reduce((sum, workout) => {
      return (
        sum +
        workout.exercises.reduce((exerciseSum, exercise) => {
          return (
            exerciseSum +
            exercise.sets.reduce((setSum, set) => {
              return setSum + Number(set.weight) * set.reps;
            }, 0)
          );
        }, 0)
      );
    }, 0);

    const avgDuration =
      workouts.reduce((sum, w) => sum + (w.duration || 0), 0) / workouts.length;

    return { totalWorkouts, totalVolume, avgDuration };
  };

  const calculateWorkoutVolume = (workout: WorkoutSession): number => {
    return workout.exercises.reduce((sum, exercise) => {
      return (
        sum +
        exercise.sets.reduce((setSum, set) => {
          return setSum + Number(set.weight) * set.reps;
        }, 0)
      );
    }, 0);
  };

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
          const stats = getWeekStats(week.workouts);
          const isCurrentWeek = index === 0;

          return (
            <div
              key={weekKey}
              className={`bg-white shadow-lg border-2 rounded-xl transition-all ${
                isCurrentWeek
                  ? 'border-blue-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-xl"
                onClick={() => toggleWeek(weekKey)}
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
                        {stats.totalWorkouts} workouts •{' '}
                        {Math.round(stats.totalVolume).toLocaleString()} lbs
                        total volume
                        {stats.avgDuration > 0 &&
                          ` • ${Math.round(stats.avgDuration)} min avg`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm text-gray-500">Consistency</div>
                      <div className="text-lg font-bold text-gray-800">
                        {stats.totalWorkouts}/3 days
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
                    {week.workouts.map((workout) => {
                      const isWorkoutExpanded = expandedWorkouts.has(
                        workout.id
                      );
                      const workoutVolume = calculateWorkoutVolume(workout);

                      return (
                        <div
                          key={workout.id}
                          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                        >
                          <div
                            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleWorkout(workout.id)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="flex items-center space-x-3">
                                  <h4 className="font-bold text-gray-800">
                                    Day {workout.day.slice(-1)}:{' '}
                                    {dayTitles[workout.day]}
                                  </h4>
                                  <span className="text-sm text-gray-500">
                                    {workout.date.toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-sm text-gray-600">
                                    {workout.exercises.length} exercises
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {workoutVolume.toLocaleString()} lbs volume
                                  </span>
                                  {workout.duration && (
                                    <span className="text-sm text-gray-600">
                                      {workout.duration} min
                                    </span>
                                  )}
                                </div>
                                {workout.notes && (
                                  <p className="text-sm text-blue-600 mt-1 italic">
                                    "{workout.notes}"
                                  </p>
                                )}
                              </div>
                              <svg
                                className={`w-4 h-4 text-gray-400 transition-transform ${
                                  isWorkoutExpanded ? 'rotate-180' : ''
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

                          {isWorkoutExpanded && (
                            <div className="border-t border-gray-200 p-4 bg-gray-50">
                              <div className="space-y-3">
                                {workout.exercises.map((exercise, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-white rounded-lg p-3 border border-gray-200"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <h5 className="font-medium text-gray-800 flex items-center">
                                          {exercise.exerciseName}
                                          {exercise.useBosoBall && (
                                            <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                              Bosu Ball
                                            </span>
                                          )}
                                        </h5>
                                        {exercise.notes && (
                                          <p className="text-xs text-gray-600 italic mt-1">
                                            {exercise.notes}
                                          </p>
                                        )}
                                      </div>
                                      <div className="text-right text-sm text-gray-500">
                                        <div>{exercise.sets.length} sets</div>
                                        <div>
                                          {exercise.sets.reduce(
                                            (sum, set) =>
                                              sum +
                                              Number(set.weight) * set.reps,
                                            0
                                          )}{' '}
                                          lbs
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                      {exercise.sets.map((set, setIdx) => (
                                        <div
                                          key={setIdx}
                                          className="text-center p-2 bg-gray-50 rounded text-sm"
                                        >
                                          <div className="font-medium">
                                            Set {setIdx + 1}
                                          </div>
                                          <div className="text-gray-700">
                                            {set.weight}lbs × {set.reps}
                                          </div>
                                          {set.rpe && (
                                            <div className="text-xs text-gray-500">
                                              RPE {set.rpe}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">
          8-Week Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {mockData.reduce((sum, week) => sum + week.workouts.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Workouts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(
                mockData.reduce(
                  (sum, week) => sum + getWeekStats(week.workouts).totalVolume,
                  0
                ) / 1000
              )}
              k
            </div>
            <div className="text-sm text-gray-600">Total Volume (lbs)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(
                mockData.reduce(
                  (sum, week) =>
                    sum +
                    getWeekStats(week.workouts).avgDuration *
                      week.workouts.length,
                  0
                ) /
                  mockData.reduce((sum, week) => sum + week.workouts.length, 0)
              )}
            </div>
            <div className="text-sm text-gray-600">Avg Duration (min)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(
                (mockData.reduce((sum, week) => sum + week.workouts.length, 0) /
                  (8 * 3)) *
                  100
              )}
              %
            </div>
            <div className="text-sm text-gray-600">Consistency</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutHistory;
