import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface WorkoutTrackingProps {
  currentSession: WorkoutSession;
  currentExerciseIndex: number;
  exerciseSetProgress: Record<number, number>;
  workoutTemplates: Record<WorkoutDay, ExerciseTemplate[]>;
  selectedDay: WorkoutDay;
  onUpdateSession: (session: WorkoutSession) => void;
  onCompleteSet: (weight: number, reps: number, rpe?: number) => void;
  onGoBack: () => void;
  onSetCurrentExerciseIndex: (index: number) => void;
}

const WorkoutTracking: React.FC<WorkoutTrackingProps> = ({
  currentSession,
  currentExerciseIndex,
  exerciseSetProgress,
  workoutTemplates,
  selectedDay,
  onUpdateSession,
  onCompleteSet,
  onGoBack,
  onSetCurrentExerciseIndex,
}) => {
  const currentExercise = currentSession.exercises[currentExerciseIndex];
  const currentSetForExercise = exerciseSetProgress[currentExerciseIndex] || 0;
  const currentSet = currentExercise.sets[currentSetForExercise];
  const template = workoutTemplates[selectedDay][currentExerciseIndex];

  const isCurrentExerciseComplete = currentSetForExercise >= currentExercise.sets.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <button
          onClick={onGoBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Setup</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Exercise {currentExerciseIndex + 1} of {currentSession.exercises.length}
        </h2>
        <h3 className="text-3xl font-bold text-blue-600 mb-2">
          {currentExercise.exerciseName}
        </h3>
        {isCurrentExerciseComplete ? (
          <div className="space-y-2">
            <p className="text-lg text-green-600 font-medium">
              <CheckCircle className="w-5 h-5 mr-1 inline" />
              All sets complete for this exercise!
            </p>
            <p className="text-sm text-gray-600">
              Move to the next exercise or review other exercises
            </p>
          </div>
        ) : (
          <p className="text-lg text-gray-600">
            Set {currentSetForExercise + 1} of {currentExercise.sets.length}
          </p>
        )}
        {currentExercise.useBosoBall && (
          <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
            Using Bosu Ball
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Workout Progress</h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {currentSession.exercises.map((exercise, idx) => {
            const setsCompleted = exerciseSetProgress[idx] || 0;
            const totalSets = exercise.sets.length;
            const isCurrentEx = idx === currentExerciseIndex;

            return (
              <button
                key={idx}
                onClick={() => onSetCurrentExerciseIndex(idx)}
                className={`p-2 rounded-lg text-xs text-center transition-all ${
                  isCurrentEx
                    ? 'bg-blue-500 text-white border-2 border-blue-600'
                    : setsCompleted >= totalSets
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : setsCompleted > 0
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                <div className="font-medium truncate">
                  {exercise.exerciseName.split(' ')[0]}
                </div>
                <div>
                  {setsCompleted}/{totalSets}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {!isCurrentExerciseComplete ? (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={currentSet.weight}
                  onChange={(e) => {
                    const updatedSession = { ...currentSession };
                    updatedSession.exercises[currentExerciseIndex].sets[currentSetForExercise].weight = Number(e.target.value);
                    onUpdateSession(updatedSession);
                  }}
                  className="w-full px-4 py-3 text-xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="2.5"
                />
                <div className="flex justify-center space-x-2 mt-2">
                  <button
                    onClick={() => {
                      const updatedSession = { ...currentSession };
                      updatedSession.exercises[currentExerciseIndex].sets[currentSetForExercise].weight = Number(currentSet.weight) - 2.5;
                      onUpdateSession(updatedSession);
                    }}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded font-medium"
                  >
                    -2.5
                  </button>
                  <button
                    onClick={() => {
                      const updatedSession = { ...currentSession };
                      updatedSession.exercises[currentExerciseIndex].sets[currentSetForExercise].weight = Number(currentSet.weight) + 2.5;
                      onUpdateSession(updatedSession);
                    }}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded font-medium"
                  >
                    +2.5
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reps{' '}
                  {template.isFailure
                    ? '(to failure)'
                    : `(target: ${template.reps})`}
                </label>
                <input
                  type="number"
                  value={currentSet.reps}
                  onChange={(e) => {
                    const updatedSession = { ...currentSession };
                    updatedSession.exercises[currentExerciseIndex].sets[currentSetForExercise].reps = Number(e.target.value);
                    onUpdateSession(updatedSession);
                  }}
                  className="w-full px-4 py-3 text-xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RPE (1-10, optional)
                </label>
                <select
                  value={currentSet.rpe || ''}
                  onChange={(e) => {
                    const updatedSession = { ...currentSession };
                    updatedSession.exercises[currentExerciseIndex].sets[currentSetForExercise].rpe = e.target.value ? Number(e.target.value) : undefined;
                    onUpdateSession(updatedSession);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select RPE</option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} - {num <= 6 ? 'Easy' : num <= 8 ? 'Moderate' : 'Hard'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Set Progress</h4>
                <div className="grid grid-cols-4 gap-2">
                  {currentExercise.sets.map((set, idx) => (
                    <div
                      key={idx}
                      className={`text-center p-2 rounded text-sm ${
                        idx < currentSetForExercise
                          ? 'bg-green-100 text-green-800'
                          : idx === currentSetForExercise
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <div className="font-medium">Set {idx + 1}</div>
                      {set.completed && (
                        <div className="text-xs">
                          {set.weight} × {set.reps}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() =>
                onCompleteSet(
                  Number(currentSet.weight),
                  Number(currentSet.reps),
                  currentSet.rpe
                )
              }
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Set
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-green-600 text-lg font-medium mb-2">
            <CheckCircle className="w-5 h-5 mr-2 inline" />
            {currentExercise.exerciseName} Complete!
          </div>
          <p className="text-green-700 text-sm">
            Select another exercise above or continue with the workout flow
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkoutTracking;