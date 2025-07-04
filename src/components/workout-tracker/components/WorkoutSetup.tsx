import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';

interface WorkoutSetupProps {
  selectedDay: WorkoutDay;
  dayTitles: Record<WorkoutDay, string>;
  currentSession: WorkoutSession;
  getLastWorkout: (day: WorkoutDay) => WorkoutSession | null;
  onStartWorkout: () => void;
  onGoBack: () => void;
}

const WorkoutSetup: React.FC<WorkoutSetupProps> = ({
  selectedDay,
  dayTitles,
  currentSession,
  getLastWorkout,
  onStartWorkout,
  onGoBack,
}) => {
  const lastWorkout = getLastWorkout(selectedDay);

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onGoBack}
          className="flex items-center text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Choose Different Day
        </button>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {dayTitles[selectedDay]}
        </h2>
        <p className="text-slate-600">Review your workout and make any adjustments</p>
      </div>

      {lastWorkout && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Last Workout</h3>
          <p className="text-blue-700 text-sm">
            Completed {formatDate(lastWorkout.date)}
            {lastWorkout.duration && ` • ${lastWorkout.duration} minutes`}
          </p>
          <p className="text-blue-600 text-xs mt-1">
            Suggested weights are based on your last performance
          </p>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {currentSession.exercises.map((exercise, exerciseIdx) => {
          const firstSetWeight = exercise.sets[0]?.weight;
          const targetReps = exercise.sets[0]?.reps;

          return (
            <div
              key={exerciseIdx}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-medium transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800 text-base">
                    {exercise.exerciseName}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {exercise.sets.length} sets × {targetReps} reps
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-slate-800">
                    {firstSetWeight} lbs
                  </p>
                  <p className="text-xs text-slate-500">Suggested</p>
                </div>
              </div>

              {exercise.useBosoBall && (
                <div className="mb-2">
                  <span className="inline-block text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    Bosu Ball Option Available
                  </span>
                </div>
              )}

              <div className="grid grid-cols-4 gap-2">
                {exercise.sets.map((set, setIdx) => (
                  <div
                    key={setIdx}
                    className="bg-slate-50 rounded-lg p-2 text-center"
                  >
                    <div className="text-xs text-slate-500 mb-1">Set {setIdx + 1}</div>
                    <div className="text-sm font-medium text-slate-800">
                      {set.weight} × {set.reps}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <button
          onClick={onStartWorkout}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Training
        </button>

        <div className="text-center text-sm text-slate-500">
          <p>You can adjust weights and reps during your workout</p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSetup;