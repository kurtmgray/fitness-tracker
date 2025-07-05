import React, { useState } from 'react';

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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-gray-800 flex items-center">
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
            <p className="text-sm text-gray-600">
              {exercise.sets} sets × {exercise.reps} reps
            </p>

            {suggestion && (
              <p className="text-sm text-muted-foreground mt-1">
                💡 Suggested: {suggestion.suggestedWeight} lbs (based on{' '}
                {suggestion.lastWeight} lbs @ RPE{' '}
                {suggestion.avgRpe.toFixed(1)})
              </p>
            )}

            {currentExercise.useBosoBall && (
              <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium mt-1">
                Using Bosu Ball
              </span>
            )}
          </div>
          {lastExercise && !isExpanded && (
            <div className="text-right text-sm text-gray-500">
              <div>Last: {lastExercise.sets[0]?.weight || 0} lbs</div>
              <div>{lastExercise.sets[0]?.reps || 0} reps</div>
            </div>
          )}
        </div>

        {!isExpanded && (
          <div className="grid grid-cols-4 gap-2 text-sm mt-3">
            {currentExercise.sets.map((set, setIdx) => (
              <div
                key={setIdx}
                className="text-center p-2 bg-gray-50 rounded"
              >
                <div className="font-medium">Set {setIdx + 1}</div>
                <div>{set.weight} lbs</div>
                <div>{set.reps} reps</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {exercise.hasBosoBallOption && (
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={currentExercise.useBosoBall}
                  onChange={(e) =>
                    onUpdateExercise({ useBosoBall: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Use Bosu Ball</span>
              </label>
            </div>
          )}

          <div className="space-y-3">
            <h5 className="font-medium text-gray-800">Adjust Sets:</h5>
            {currentExercise.sets.map((set, setIdx) => (
              <div
                key={setIdx}
                className="bg-white rounded-lg p-3 border border-gray-200"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Set {setIdx + 1} Weight (lbs)
                    </label>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => {
                        const updatedSets = [...currentExercise.sets];
                        updatedSets[setIdx] = {
                          ...updatedSets[setIdx],
                          weight: Number(e.target.value),
                        };
                        onUpdateExercise({ sets: updatedSets });
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Target Reps
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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