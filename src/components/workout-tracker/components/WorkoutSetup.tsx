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
          className="flex items-center space-x-2 text-[#2C2C2C]/70 hover:text-[#2C2C2C] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Day Selection</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-[#2C2C2C] mb-2">
          Day {selectedDay.slice(-1)}: {dayTitles[selectedDay]}
        </h2>
        <p className="text-lg text-[#2C2C2C]/80">
          Review and adjust your workout plan
        </p>
        {lastWorkout && (
          <p className="text-sm text-[#2C2C2C]/60 mt-2">
            Last performed: {new Date(lastWorkout.date).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="bg-gradient-to-r from-[#FAF7F2] to-[#F0E6D6] rounded-2xl p-6 mb-6 border border-[#E8D7C3]">
        <h3 className="text-xl font-semibold text-[#2C2C2C] mb-4">
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
          className="flex gap-2 bg-gradient-to-r from-[#8B9A5B] to-[#6B7A4B] hover:from-[#6B7A4B] hover:to-[#5A6940] text-white font-semibold py-4 px-8 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutSetup;
