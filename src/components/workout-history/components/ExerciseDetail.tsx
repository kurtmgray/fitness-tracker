import React from 'react';
import { calculateTotalWeight, getExerciseTrackingType } from '@/utils/exerciseUtils';
import { calculateTimeVolume } from '@/utils/timeUtils';
import WeightDisplay from '@/components/shared/WeightDisplay';
import TimeDisplay from '@/components/shared/TimeDisplay';

interface ExerciseDetailProps {
  exercise: ExerciseEntry;
}

const ExerciseDetail: React.FC<ExerciseDetailProps> = ({ exercise }) => {
  return (
    <div className="bg-[#FAF7F2] rounded-lg p-3 border border-[#E8D7C3]">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h5 className="font-medium text-[#2C2C2C] flex items-center">
            {exercise.exerciseName}
            {exercise.useBosoBall && (
              <span className="ml-2 text-xs bg-[#F0E6D6] text-[#8B9A5B] px-2 py-1 rounded-full">
                Bosu Ball
              </span>
            )}
          </h5>
          {exercise.notes && (
            <p className="text-xs text-[#2C2C2C]/70 italic mt-1">
              {exercise.notes}
            </p>
          )}
        </div>
        <div className="text-right text-sm text-[#2C2C2C]/60">
          <div>{exercise.sets.length} sets</div>
          <div>
            {(() => {
              // Only calculate volume for completed sets
              const completedSets = exercise.sets.filter(set => set.completed !== false);
              
              const totalVolume = completedSets.reduce((sum, set) => {
                const trackingType = getExerciseTrackingType(exercise.exerciseName);
                
                if (trackingType === 'time') {
                  const volume = calculateTimeVolume(
                    exercise.exerciseName,
                    set.timeSeconds || 0,
                    set.weight,
                    set.weightLeft,
                    set.weightRight
                  );
                  return sum + volume;
                } else {
                  const weight = calculateTotalWeight(
                    exercise.exerciseName,
                    set.weight,
                    set.weightLeft,
                    set.weightRight
                  );
                  const setVolume = weight * (set.reps || 0);
                  return sum + setVolume;
                }
              }, 0);
              
              return totalVolume > 0 ? Math.round(totalVolume) : '0';
            })()}{' '}
            {getExerciseTrackingType(exercise.exerciseName) === 'time' ? 'lb-minutes' : 'lbs'} total
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {exercise.sets.map((set, setIdx) => (
          <div
            key={setIdx}
            className="text-center p-3 bg-white rounded-lg border border-[#E8D7C3] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="font-medium text-[#2C2C2C] mb-1">Set {setIdx + 1}</div>
            <div className="text-[#2C2C2C] text-xs">
              {getExerciseTrackingType(exercise.exerciseName) === 'time' ? (
                <TimeDisplay seconds={set.timeSeconds} />
              ) : (
                <>
                  <WeightDisplay
                    exerciseName={exercise.exerciseName}
                    weight={set.weight}
                    weightLeft={set.weightLeft}
                    weightRight={set.weightRight}
                  />
                  {' '} × {set.reps || 0}
                  {set.isFailure && ' (failure)'}
                </>
              )}
            </div>
            {set.rpe && (
              <div className="text-xs text-[#2C2C2C]/60 mt-1">RPE {set.rpe}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseDetail;