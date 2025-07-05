import React from 'react';
import { Trophy, BarChart3 } from 'lucide-react';

interface WorkoutCompleteProps {
  currentSession: WorkoutSession;
  selectedDay: WorkoutDay;
  dayTitles: Record<WorkoutDay, string>;
  onStartAnother: () => void;
}

const WorkoutComplete: React.FC<WorkoutCompleteProps> = ({
  currentSession,
  selectedDay,
  dayTitles,
  onStartAnother,
}) => {
  const totalVolume = currentSession.exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.reduce(
        (exerciseTotal, set) =>
          exerciseTotal + (Number(set.weight) || 0) * set.reps,
        0
      ),
    0
  );

  const totalSets = currentSession.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );

  const averageRpe = (() => {
    const rpeValues = currentSession.exercises.flatMap(exercise =>
      exercise.sets.map(set => set.rpe).filter(rpe => rpe !== undefined)
    ) as number[];
    
    if (rpeValues.length === 0) return null;
    return (rpeValues.reduce((sum, rpe) => sum + rpe, 0) / rpeValues.length).toFixed(1);
  })();

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Workout Complete!
        </h2>
        <p className="text-lg text-gray-600">
          Great job finishing Day {selectedDay?.slice(-1)}:{' '}
          {selectedDay && dayTitles[selectedDay]}
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Workout Summary
        </h3>
        {currentSession && (
          <div className="space-y-3">
            {currentSession.exercises.map((exercise, idx) => {
              const completedSets = exercise.sets.filter(
                (set) => set.completed
              ).length;
              const totalVolume = exercise.sets.reduce(
                (sum, set) => sum + Number(set.weight) * set.reps,
                0
              );

              return (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-white rounded-lg p-3"
                >
                  <div>
                    <span className="font-medium">{exercise.exerciseName}</span>
                    {exercise.useBosoBall && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Bosu Ball
                      </span>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{completedSets} sets completed</div>
                    <div>{totalVolume} lbs total volume</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <button
          onClick={onStartAnother}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Start Another Workout
        </button>

        <div className="text-sm text-gray-500">
          Workout saved to your training history
        </div>
      </div>
    </div>
  );
};

export default WorkoutComplete;