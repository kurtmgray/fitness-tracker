import React from 'react';
import { Check, X, RotateCcw } from 'lucide-react';

interface EnhancedWorkoutTrackingProps {
  currentExercise: ExerciseEntry;
  exerciseName: string;
  exerciseIndex: number;
  setIndex: number;
  totalSets: number;
  onCompleteSet: (
    weight: number | null,
    reps: number,
    rpe?: number,
    weightLeft?: number | null,
    weightRight?: number | null,
    timeSeconds?: number,
    isFailure?: boolean
  ) => Promise<void>;
  onSkipSet: () => void;
  isLastSet: boolean;
  isLastExercise: boolean;
  exerciseConfig?: {
    supportsDualWeights?: boolean;
    isTimeBased?: boolean;
    trackingType?: string;
  };
}

export const EnhancedWorkoutTracking: React.FC<EnhancedWorkoutTrackingProps> = ({
  currentExercise,
  exerciseName,
  exerciseIndex,
  setIndex,
  totalSets,
  onCompleteSet,
  onSkipSet,
  isLastSet,
  isLastExercise,
  exerciseConfig,
}) => {
  const [weight, setWeight] = React.useState<number | null>(null);
  const [weightLeft, setWeightLeft] = React.useState<number | null>(null);
  const [weightRight, setWeightRight] = React.useState<number | null>(null);
  const [reps, setReps] = React.useState<number>(8);
  const [timeSeconds, setTimeSeconds] = React.useState<number | null>(null);
  const [rpe, setRpe] = React.useState<number | undefined>();
  const [isFailure, setIsFailure] = React.useState(false);

  const handleCompleteSet = async () => {
    await onCompleteSet(
      weight,
      reps,
      rpe,
      exerciseConfig?.supportsDualWeights ? weightLeft : undefined,
      exerciseConfig?.supportsDualWeights ? weightRight : undefined,
      exerciseConfig?.isTimeBased ? timeSeconds : undefined,
      isFailure
    );

    // Reset form for next set
    setRpe(undefined);
    setIsFailure(false);
  };

  const isDualWeight = exerciseConfig?.supportsDualWeights;
  const isTimeBased = exerciseConfig?.isTimeBased;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-[#E8D7C3]">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">{exerciseName}</h2>
        <div className="text-[#8B9A5B] font-medium">
          Set {setIndex + 1} of {totalSets} • Exercise {exerciseIndex + 1} of {currentExercise.sets.length}
        </div>
      </div>

      <div className="space-y-4">
        {/* Weight and Reps/Time Input - Side-by-side on all screen sizes */}
        <div className="grid grid-cols-2 gap-4">
          {/* Weight Input */}
          {!isTimeBased && (
            <div className="space-y-3">
              {isDualWeight ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
                      Left Weight (lbs)
                    </label>
                    <input
                      type="number"
                      value={weightLeft || ''}
                      onChange={(e) => setWeightLeft(Number(e.target.value) || null)}
                      className="w-full p-3 border border-[#E8D7C3] rounded-lg focus:ring-2 focus:ring-[#8B9A5B] focus:border-[#8B9A5B]"
                      placeholder="0"
                      step="2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
                      Right Weight (lbs)
                    </label>
                    <input
                      type="number"
                      value={weightRight || ''}
                      onChange={(e) => setWeightRight(Number(e.target.value) || null)}
                      className="w-full p-3 border border-[#E8D7C3] rounded-lg focus:ring-2 focus:ring-[#8B9A5B] focus:border-[#8B9A5B]"
                      placeholder="0"
                      step="2.5"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={weight || ''}
                    onChange={(e) => setWeight(Number(e.target.value) || null)}
                    className="w-full p-3 border border-[#E8D7C3] rounded-lg focus:ring-2 focus:ring-[#8B9A5B] focus:border-[#8B9A5B]"
                    placeholder="0"
                    step="2.5"
                  />
                </div>
              )}
            </div>
          )}

          {/* Reps or Time Input */}
          <div>
          {isTimeBased ? (
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
                Time (seconds)
              </label>
              <input
                type="number"
                value={timeSeconds || ''}
                onChange={(e) => setTimeSeconds(Number(e.target.value) || null)}
                className="w-full p-3 border border-[#E8D7C3] rounded-lg focus:ring-2 focus:ring-[#8B9A5B] focus:border-[#8B9A5B]"
                placeholder="0"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
                Reps
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value) || 0)}
                className="w-full p-3 border border-[#E8D7C3] rounded-lg focus:ring-2 focus:ring-[#8B9A5B] focus:border-[#8B9A5B]"
                placeholder="0"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
              RPE (1-10)
            </label>
            <input
              type="number"
              value={rpe || ''}
              onChange={(e) => setRpe(Number(e.target.value) || undefined)}
              className="w-full p-3 border border-[#E8D7C3] rounded-lg focus:ring-2 focus:ring-[#8B9A5B] focus:border-[#8B9A5B]"
              placeholder="Optional"
              min="1"
              max="10"
            />
          </div>
        </div>
      </div>

        {/* Failure Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="failure"
            checked={isFailure}
            onChange={(e) => setIsFailure(e.target.checked)}
            className="rounded border-[#E8D7C3] text-[#8B9A5B] focus:ring-[#8B9A5B]"
          />
          <label htmlFor="failure" className="text-sm text-[#2C2C2C]">
            To failure
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onSkipSet}
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-[#F0E6D6] text-[#2C2C2C] rounded-lg hover:bg-[#E8D7C3] transition-colors"
          >
            <X className="w-4 h-4" />
            Skip Set
          </button>
          
          <button
            onClick={handleCompleteSet}
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-[#8B9A5B] text-white rounded-lg hover:bg-[#6B7A4B] transition-colors"
          >
            <Check className="w-4 h-4" />
            {isLastSet && isLastExercise ? 'Complete Workout' : 'Complete Set'}
          </button>
        </div>
      </div>
    </div>
  );
};