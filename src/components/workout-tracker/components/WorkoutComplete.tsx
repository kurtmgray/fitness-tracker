import React from 'react';
import { Trophy, BarChart3 } from 'lucide-react';

interface WorkoutCompleteProps {
  currentSession: WorkoutSession;
  dayTitles: Record<WorkoutDay, string>;
  onStartAnother: () => void;
}

const WorkoutComplete: React.FC<WorkoutCompleteProps> = ({
  currentSession,
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
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Workout Complete!
        </h2>
        <p className="text-lg text-slate-600">
          Great job on completing your {dayTitles[currentSession.day]} workout
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Workout Summary
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">
              {currentSession.exercises.length}
            </div>
            <div className="text-sm text-slate-600">Exercises</div>
          </div>
          
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{totalSets}</div>
            <div className="text-sm text-slate-600">Total Sets</div>
          </div>
          
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-600">
              {totalVolume.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">lbs Volume</div>
          </div>
          
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-600">
              {averageRpe || 'N/A'}
            </div>
            <div className="text-sm text-slate-600">Avg RPE</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="font-semibold text-slate-800 mb-4">Exercise Breakdown</h3>
        <div className="space-y-3">
          {currentSession.exercises.map((exercise, idx) => {
            const completedSets = exercise.sets.filter(set => set.completed).length;
            const exerciseVolume = exercise.sets.reduce(
              (sum, set) => sum + (Number(set.weight) || 0) * set.reps,
              0
            );

            return (
              <div
                key={idx}
                className="flex justify-between items-center bg-slate-50 rounded-lg p-3"
              >
                <div>
                  <span className="font-medium">{exercise.exerciseName}</span>
                  {exercise.useBosoBall && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Bosu Ball
                    </span>
                  )}
                </div>
                <div className="text-right text-sm text-slate-600">
                  <div>{completedSets} sets completed</div>
                  <div>{exerciseVolume.toLocaleString()} lbs total volume</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onStartAnother}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Start Another Workout
        </button>

        <div className="text-sm text-slate-500">
          Workout saved to your training history
        </div>
      </div>
    </div>
  );
};

export default WorkoutComplete;