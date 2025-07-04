import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface WorkoutTrackingProps {
  currentSession: WorkoutSession;
  currentExerciseIndex: number;
  currentSetIndex: number;
  exerciseSetProgress: Record<number, number>;
  onUpdateSet: (weight: number, reps: number, rpe?: number) => void;
  onNextSet: () => void;
  onGoBack: () => void;
}

const WorkoutTracking: React.FC<WorkoutTrackingProps> = ({
  currentSession,
  currentExerciseIndex,
  currentSetIndex,
  exerciseSetProgress,
  onUpdateSet,
  onNextSet,
  onGoBack,
}) => {
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [currentReps, setCurrentReps] = useState<number>(8);
  const [currentRpe, setCurrentRpe] = useState<number | undefined>(undefined);

  const currentExercise = currentSession.exercises[currentExerciseIndex];
  const currentSet = currentExercise?.sets[currentSetIndex];
  const totalSets = currentExercise?.sets.length || 0;
  const isLastSet = currentSetIndex === totalSets - 1;
  const isLastExercise = currentExerciseIndex === currentSession.exercises.length - 1;

  React.useEffect(() => {
    if (currentSet) {
      setCurrentWeight(Number(currentSet.weight) || 0);
      setCurrentReps(currentSet.reps || 8);
      setCurrentRpe(currentSet.rpe);
    }
  }, [currentSet]);

  const handleCompleteSet = () => {
    onUpdateSet(currentWeight, currentReps, currentRpe);
    onNextSet();
  };

  const completedExercises = Object.keys(exerciseSetProgress).length;
  const totalExercises = currentSession.exercises.length;
  const progressPercentage = Math.round(
    ((completedExercises + (currentSetIndex + 1) / totalSets) / totalExercises) * 100
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onGoBack}
          className="flex items-center text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Setup
        </button>
        <div className="text-sm text-slate-600">
          Exercise {currentExerciseIndex + 1} of {totalExercises}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>Workout Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {currentExercise?.exerciseName}
          </h2>
          <p className="text-slate-600">
            Set {currentSetIndex + 1} of {totalSets}
          </p>
          {currentExercise?.useBosoBall && (
            <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
              Using Bosu Ball
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Weight (lbs)
            </label>
            <input
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center"
              step="2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Reps
            </label>
            <input
              type="number"
              value={currentReps}
              onChange={(e) => setCurrentReps(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              RPE (1-10)
            </label>
            <input
              type="number"
              value={currentRpe || ''}
              onChange={(e) => setCurrentRpe(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Optional"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center"
              min="1"
              max="10"
              step="0.5"
            />
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleCompleteSet}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {isLastSet && isLastExercise
              ? 'Complete Workout'
              : isLastSet
              ? 'Next Exercise'
              : 'Next Set'}
          </button>

          <div className="text-center text-sm text-slate-500">
            <p>Volume this set: {(currentWeight * currentReps).toLocaleString()} lbs</p>
          </div>
        </div>
      </div>

      {/* Previous sets display */}
      {currentSetIndex > 0 && (
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-semibold text-slate-800 mb-3">Previous Sets</h3>
          <div className="space-y-2">
            {currentExercise.sets.slice(0, currentSetIndex).map((set, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-white rounded-lg p-3"
              >
                <span className="text-sm text-slate-600">Set {idx + 1}</span>
                <span className="font-medium">
                  {set.weight} lbs × {set.reps} reps
                  {set.rpe && <span className="text-slate-500 ml-2">RPE {set.rpe}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutTracking;