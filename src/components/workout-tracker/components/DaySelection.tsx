import React from 'react';
import { Play } from 'lucide-react';

interface DaySelectionProps {
  workoutTemplates: Record<WorkoutDay, ExerciseTemplate[]>;
  dayTitles: Record<WorkoutDay, string>;
  getLastWorkout: (day: WorkoutDay) => WorkoutSession | null;
  onSelectDay: (day: WorkoutDay) => void;
}

const DaySelection: React.FC<DaySelectionProps> = ({
  workoutTemplates,
  dayTitles,
  getLastWorkout,
  onSelectDay,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-slate-800 mb-4">
          Select Your Workout
        </h2>
        <p className="text-lg text-slate-600">
          Choose which day you're training today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(workoutTemplates) as WorkoutDay[]).map((day) => {
          const template = workoutTemplates[day];
          const lastWorkout = getLastWorkout(day);
          const daysSince = lastWorkout
            ? Math.floor(
                (new Date().getTime() - new Date(lastWorkout.date).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : null;

          return (
            <div
              key={day}
              onClick={() => onSelectDay(day)}
              className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-medium group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600">
                  Day {day.slice(-1)}: {dayTitles[day]}
                </h3>
                {lastWorkout && (
                  <span className="text-sm text-gray-500">
                    {daysSince === 0
                      ? 'Today'
                      : daysSince === 1
                      ? 'Yesterday'
                      : `${daysSince} days ago`}
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4 flex-1">
                {template.slice(0, 6).map((exercise, idx) => (
                  <div key={idx} className="text-sm text-gray-600">
                    • {exercise.name} ({exercise.sets}x{exercise.reps})
                  </div>
                ))}
                {template.length > 6 && (
                  <div className="text-sm text-gray-500">
                    + {template.length - 6} more exercises
                  </div>
                )}
              </div>

              <div className="flex justify-center items-center mt-auto">
                <button className="flex gap-2 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center">
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

export default DaySelection;
