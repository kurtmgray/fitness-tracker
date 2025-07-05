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
          className="flex items-center space-x-2 text-[#2C2C2C]/70 hover:text-[#2C2C2C] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Setup</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">
          Exercise {currentExerciseIndex + 1} of {currentSession.exercises.length}
        </h2>
        <h3 className="text-3xl font-bold text-[#8B9A5B] mb-2">
          {currentExercise.exerciseName}
        </h3>
        {isCurrentExerciseComplete ? (
          <div className="space-y-2">
            <p className="text-lg text-[#8B9A5B] font-medium">
              <CheckCircle className="w-5 h-5 mr-1 inline" />
              All sets complete for this exercise!
            </p>
            <p className="text-sm text-[#2C2C2C]/70">
              Move to the next exercise or review other exercises
            </p>
          </div>
        ) : (
          <p className="text-lg text-[#2C2C2C]/80">
            Set {currentSetForExercise + 1} of {currentExercise.sets.length}
          </p>
        )}
        {currentExercise.useBosoBall && (
          <span className="inline-block bg-[#8B9A5B]/20 text-[#6B7A4B] px-3 py-1 rounded-full text-sm font-medium mt-2">
            Using Bosu Ball
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 border border-[#E8D7C3] mb-6">
        <h4 className="font-medium text-[#2C2C2C] mb-3">Workout Progress</h4>
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
                    ? 'bg-[#8B9A5B] text-white border-2 border-[#6B7A4B]'
                    : setsCompleted >= totalSets
                    ? 'bg-[#8B9A5B]/20 text-[#6B7A4B] border border-[#8B9A5B]/30'
                    : setsCompleted > 0
                    ? 'bg-[#A4B574]/30 text-[#6B7A4B] border border-[#8B9A5B]/20'
                    : 'bg-[#F0E6D6] text-[#2C2C2C]/60 border border-[#E8D7C3]'
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
        <div className="bg-gradient-to-r from-[#FAF7F2] to-[#F0E6D6] rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
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
                  className="w-full px-4 py-3 text-xl text-center border border-[#E8D7C3] rounded-lg focus:ring-2 focus:ring-[#8B9A5B] focus:border-transparent"
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
                    className="px-3 py-1 bg-[#2C2C2C]/10 text-[#2C2C2C] rounded font-medium hover:bg-[#2C2C2C]/20"
                  >
                    -2.5
                  </button>
                  <button
                    onClick={() => {
                      const updatedSession = { ...currentSession };
                      updatedSession.exercises[currentExerciseIndex].sets[currentSetForExercise].weight = Number(currentSet.weight) + 2.5;
                      onUpdateSession(updatedSession);
                    }}
                    className="px-3 py-1 bg-[#8B9A5B]/20 text-[#6B7A4B] rounded font-medium hover:bg-[#8B9A5B]/30"
                  >
                    +2.5
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
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
                  className="w-full px-4 py-3 text-xl text-center border border-[#E8D7C3] rounded-lg focus:ring-2 focus:ring-[#8B9A5B] focus:border-transparent"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                  RPE (1-10, optional)
                </label>
                <select
                  value={currentSet.rpe || ''}
                  onChange={(e) => {
                    const updatedSession = { ...currentSession };
                    updatedSession.exercises[currentExerciseIndex].sets[currentSetForExercise].rpe = e.target.value ? Number(e.target.value) : undefined;
                    onUpdateSession(updatedSession);
                  }}
                  className="w-full px-4 py-3 border border-[#E8D7C3] rounded-lg focus:ring-2 focus:ring-[#8B9A5B] focus:border-transparent"
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
                <h4 className="font-medium text-[#2C2C2C] mb-2">Set Progress</h4>
                <div className="grid grid-cols-4 gap-2">
                  {currentExercise.sets.map((set, idx) => (
                    <div
                      key={idx}
                      className={`text-center p-2 rounded text-sm ${
                        idx < currentSetForExercise
                          ? 'bg-[#8B9A5B]/20 text-[#6B7A4B]'
                          : idx === currentSetForExercise
                          ? 'bg-[#8B9A5B]/30 text-[#6B7A4B] border-2 border-[#8B9A5B]'
                          : 'bg-[#F0E6D6] text-[#2C2C2C]/60'
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
              className="bg-gradient-to-r from-[#8B9A5B] to-[#6B7A4B] hover:from-[#6B7A4B] hover:to-[#5A6940] text-white font-semibold py-4 px-8 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Set
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#8B9A5B]/10 border border-[#8B9A5B]/30 rounded-xl p-6 text-center">
          <div className="text-[#6B7A4B] text-lg font-medium mb-2">
            <CheckCircle className="w-5 h-5 mr-2 inline" />
            {currentExercise.exerciseName} Complete!
          </div>
          <p className="text-[#6B7A4B] text-sm">
            Select another exercise above or continue with the workout flow
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkoutTracking;