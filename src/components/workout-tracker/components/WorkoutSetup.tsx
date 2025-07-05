import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import ExerciseSetupCard from './ExerciseSetupCard';

interface WorkoutSetupProps {
  selectedDay: WorkoutDay;
  currentSession: WorkoutSession;
  workoutTemplates: Record<WorkoutDay, ExerciseTemplate[]>;
  dayTitles: Record<WorkoutDay, string>;
  getLastWorkout: (day: WorkoutDay) => WorkoutSession | null;
  suggestNextWeight: (
    lastWeight: number,
    lastRpe: number,
    weightType: string
  ) => number;
  onGoBack: () => void;
  onStartWorkout: () => void;
  onUpdateSession: (session: WorkoutSession) => void;
}

const WorkoutSetup: React.FC<WorkoutSetupProps> = ({
  selectedDay,
  currentSession,
  workoutTemplates,
  dayTitles,
  getLastWorkout,
  suggestNextWeight,
  onGoBack,
  onStartWorkout,
  onUpdateSession,
}) => {
  const template = workoutTemplates[selectedDay];
  const lastWorkout = getLastWorkout(selectedDay);

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <button
          onClick={onGoBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Day Selection</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-slate-800 mb-2">
          Day {selectedDay.slice(-1)}: {dayTitles[selectedDay]}
        </h2>
        <p className="text-lg text-slate-600">
          Review and adjust your workout plan
        </p>
        {lastWorkout && (
          <p className="text-sm text-gray-500 mt-2">
            Last performed: {new Date(lastWorkout.date).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-6 mb-6 border border-blue-100">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">
          Today's Workout
        </h3>

        <div className="space-y-4">
          {template.map((exercise, idx) => {
            const lastExercise = lastWorkout?.exercises.find(
              (ex) => ex.exerciseName === exercise.name
            );
            const currentExercise = currentSession.exercises[idx];

            const suggestion = (() => {
              if (!lastExercise) return null;

              const completedSets = lastExercise.sets.filter(
                (s) => s.completed
              );
              const lastWeight = Number(
                completedSets[0]?.weight ?? lastExercise.sets[0]?.weight ?? 0
              );
              const avgRpe =
                completedSets.length > 0
                  ? completedSets.reduce((sum, s) => sum + (s.rpe ?? 8), 0) /
                    completedSets.length
                  : undefined;
              const suggestedWeight =
                avgRpe !== undefined
                  ? suggestNextWeight(lastWeight, avgRpe, exercise.weightType)
                  : lastWeight;

              return avgRpe !== undefined
                ? { suggestedWeight, lastWeight, avgRpe }
                : null;
            })();

            return (
              <ExerciseSetupCard
                key={idx}
                exercise={exercise}
                currentExercise={currentExercise}
                lastExercise={lastExercise}
                suggestion={suggestion}
                onUpdateExercise={(updates) => {
                  const updatedSession = { ...currentSession };
                  Object.assign(updatedSession.exercises[idx], updates);
                  onUpdateSession(updatedSession);
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="flex justify-center text-center">
        <button
          onClick={onStartWorkout}
          className="flex gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutSetup;
