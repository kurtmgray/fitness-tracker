import React, { useState } from 'react';
import { getRepsLabel, getRepsUnit, supportsDualWeights, formatDualWeight } from '../../../utils/exerciseUtils';

interface Suggestion {
  suggestedWeight: number;
  lastWeight: number;
  avgRpe: number;
}

interface ExerciseSetupCardProps {
  exercise: ExerciseTemplate;
  currentExercise: ExerciseEntry;
  lastExercise?: ExerciseEntry;
  suggestion?: Suggestion | null;
  onUpdateExercise: (updates: Partial<ExerciseEntry>) => void;
}

const ExerciseSetupCard: React.FC<ExerciseSetupCardProps> = ({
  exercise,
  currentExercise,
  lastExercise,
  suggestion,
  onUpdateExercise,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-[#E8D7C3] overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-[#FAF7F2] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-[#2C2C2C] flex items-center">
              {exercise.name}
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </h4>
            <p className="text-sm text-[#2C2C2C]/70">
              {exercise.sets} sets × {exercise.reps} {exercise.isTimeBased ? 'seconds' : 'reps'}
            </p>

            <div className="mt-2 space-y-1">
              {lastExercise && (
                <p className="text-sm text-[#2C2C2C]/80">
                  📊 Last performed: <span className="font-medium">{suggestion?.lastWeight || lastExercise.sets[0]?.weight || 0} lbs</span>
                  {lastExercise.sets[0]?.reps && ` × ${lastExercise.sets[0].reps} ${exercise.isTimeBased ? 'seconds' : 'reps'}`}
                </p>
              )}
              
              {suggestion && (
                <p className="text-sm text-[#8B9A5B]">
                  💡 AI Suggested: <span className="font-medium">{suggestion.suggestedWeight} lbs</span>
                  {suggestion.avgRpe && ` (RPE ${suggestion.avgRpe.toFixed(1)})`}
                </p>
              )}
            </div>

            {currentExercise.useBosoBall && (
              <span className="inline-block bg-[#8B9A5B]/20 text-[#6B7A4B] px-2 py-1 rounded-full text-xs font-medium mt-1">
                Using Bosu Ball
              </span>
            )}
          </div>
          {lastExercise && !isExpanded && (
            <div className="text-right text-sm text-[#2C2C2C]/60">
              <div>Last: {lastExercise.sets[0]?.weight || 0} lbs</div>
              <div>{lastExercise.sets[0]?.reps || 0} {exercise.isTimeBased ? 'seconds' : 'reps'}</div>
            </div>
          )}
        </div>

        {!isExpanded && (
          <div className="grid grid-cols-4 gap-2 text-sm mt-3">
            {currentExercise.sets.map((set, setIdx) => (
              <div
                key={setIdx}
                className="text-center p-2 bg-[#F0E6D6] rounded"
              >
                <div className="font-medium text-[#2C2C2C]">Set {setIdx + 1}</div>
                <div className="text-[#2C2C2C]/80">
                  {supportsDualWeights(exercise.name) && (set.weightLeft || set.weightRight) 
                    ? formatDualWeight(exercise.name, set.weightLeft, set.weightRight)
                    : `${set.weight || 0} lbs`
                  }
                </div>
                <div className="text-[#2C2C2C]/80">{set.reps} {exercise.isTimeBased ? 'seconds' : 'reps'}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="border-t border-[#E8D7C3] p-4 bg-[#F0E6D6]">
          {exercise.hasBosoBallOption && (
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={currentExercise.useBosoBall}
                  onChange={(e) =>
                    onUpdateExercise({ useBosoBall: e.target.checked })
                  }
                  className="rounded border-[#E8D7C3] text-[#8B9A5B] focus:ring-[#8B9A5B]"
                />
                <span className="text-sm text-[#2C2C2C]">Use Bosu Ball</span>
              </label>
            </div>
          )}

          <div className="space-y-3">
            <h5 className="font-medium text-[#2C2C2C]">Adjust Sets:</h5>
            {currentExercise.sets.map((set, setIdx) => (
              <div
                key={setIdx}
                className="bg-white rounded-lg p-3 border border-[#E8D7C3]"
              >
                <div className="space-y-4">
                  {supportsDualWeights(exercise.name) ? (
                    <div>
                      <label className="block text-xs font-medium text-[#2C2C2C] mb-2">
                        Set {setIdx + 1} Weights (lbs)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={set.weightLeft || set.weight || ''}
                          onChange={(e) => {
                            const updatedSets = [...currentExercise.sets];
                            updatedSets[setIdx] = {
                              ...updatedSets[setIdx],
                              weightLeft: Number(e.target.value) || null,
                              weight: null, // Clear primary weight when using dual weights
                            };
                            onUpdateExercise({ sets: updatedSets });
                          }}
                          className="w-full px-3 py-2 text-sm border border-[#E8D7C3] rounded focus:ring-2 focus:ring-[#8B9A5B] focus:border-transparent"
                          min="0"
                          step="2.5"
                          placeholder="Left hand"
                        />
                        <input
                          type="number"
                          value={set.weightRight || set.weight || ''}
                          onChange={(e) => {
                            const updatedSets = [...currentExercise.sets];
                            updatedSets[setIdx] = {
                              ...updatedSets[setIdx],
                              weightRight: Number(e.target.value) || null,
                              weight: null, // Clear primary weight when using dual weights
                            };
                            onUpdateExercise({ sets: updatedSets });
                          }}
                          className="w-full px-3 py-2 text-sm border border-[#E8D7C3] rounded focus:ring-2 focus:ring-[#8B9A5B] focus:border-transparent"
                          min="0"
                          step="2.5"
                          placeholder="Right hand"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-medium text-[#2C2C2C] mb-1">
                        Set {setIdx + 1} Weight (lbs)
                      </label>
                      <input
                        type="number"
                        value={set.weight || ''}
                        onChange={(e) => {
                          const updatedSets = [...currentExercise.sets];
                          updatedSets[setIdx] = {
                            ...updatedSets[setIdx],
                            weight: Number(e.target.value) || null,
                          };
                          onUpdateExercise({ sets: updatedSets });
                        }}
                        className="w-full px-3 py-2 text-sm border border-[#E8D7C3] rounded focus:ring-2 focus:ring-[#8B9A5B] focus:border-transparent"
                        min="0"
                        step="2.5"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-[#2C2C2C] mb-1">
                      {exercise.isTimeBased ? 'Target Time (seconds)' : 'Target Reps'}
                    </label>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => {
                        const updatedSets = [...currentExercise.sets];
                        updatedSets[setIdx] = {
                          ...updatedSets[setIdx],
                          reps: Number(e.target.value),
                        };
                        onUpdateExercise({ sets: updatedSets });
                      }}
                      className="w-full px-3 py-2 text-sm border border-[#E8D7C3] rounded focus:ring-2 focus:ring-[#8B9A5B] focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseSetupCard;