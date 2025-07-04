import React from 'react';
import { Play, Calendar, Clock } from 'lucide-react';

interface WorkoutDaySelectorProps {
  dayTitles: Record<WorkoutDay, string>;
  workoutTemplates: Record<WorkoutDay, ExerciseTemplate[]>;
  getLastWorkout: (day: WorkoutDay) => WorkoutSession | null;
  onSelectDay: (day: WorkoutDay) => void;
}

const WorkoutDaySelector: React.FC<WorkoutDaySelectorProps> = ({
  dayTitles,
  workoutTemplates,
  getLastWorkout,
  onSelectDay,
}) => {
  const formatLastWorkoutDate = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
          Choose Your Workout
        </h2>
        <p className="text-slate-600">Select a workout day to get started</p>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {(Object.keys(workoutTemplates) as WorkoutDay[]).map((day) => {
          const lastWorkout = getLastWorkout(day);
          const template = workoutTemplates[day];

          return (
            <div
              key={day}
              className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-medium group flex flex-col h-full"
              onClick={() => onSelectDay(day)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                    {dayTitles[day]}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    {template.length} exercises
                  </p>
                  
                  {lastWorkout && (
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Last: {formatLastWorkoutDate(lastWorkout.date)}
                      </div>
                      {lastWorkout.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lastWorkout.duration} min
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4 flex-1">
                <div className="grid grid-cols-1 gap-1">
                  {template.slice(0, 4).map((exercise, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-slate-600 bg-slate-50 rounded px-2 py-1"
                    >
                      {exercise.name} - {exercise.sets}x{exercise.reps}
                    </div>
                  ))}
                  {template.length > 4 && (
                    <div className="text-xs text-slate-500 italic">
                      +{template.length - 4} more exercises
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center">
                  <Play className="w-4 h-4 mr-2" />
                  Start Workout
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutDaySelector;