import React from 'react';

interface ExerciseDetailProps {
  exercise: ExerciseEntry;
}

const ExerciseDetail: React.FC<ExerciseDetailProps> = ({ exercise }) => {
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h5 className="font-medium text-gray-800 flex items-center">
            {exercise.exerciseName}
            {exercise.useBosoBall && (
              <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Bosu Ball
              </span>
            )}
          </h5>
          {exercise.notes && (
            <p className="text-xs text-gray-600 italic mt-1">
              {exercise.notes}
            </p>
          )}
        </div>
        <div className="text-right text-sm text-gray-500">
          <div>{exercise.sets.length} sets</div>
          <div>
            {exercise.sets.reduce(
              (sum, set) => sum + Number(set.weight) * set.reps,
              0
            )}{' '}
            lbs
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {exercise.sets.map((set, setIdx) => (
          <div
            key={setIdx}
            className="text-center p-2 bg-gray-50 rounded text-sm"
          >
            <div className="font-medium">Set {setIdx + 1}</div>
            <div className="text-gray-700">
              {set.weight}lbs × {set.reps}
            </div>
            {set.rpe && (
              <div className="text-xs text-gray-500">RPE {set.rpe}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseDetail;