import React from 'react';
import ExerciseDetail from './ExerciseDetail';

interface WorkoutCardProps {
  workout: WorkoutSession;
  isExpanded: boolean;
  dayTitles: Record<WorkoutDay, string>;
  onToggleWorkout: (workoutId: string) => void;
  calculateWorkoutVolume: (workout: WorkoutSession) => number;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  isExpanded,
  dayTitles,
  onToggleWorkout,
  calculateWorkoutVolume,
}) => {
  const workoutVolume = calculateWorkoutVolume(workout);

  return (
    <div className="bg-[#FAF7F2] rounded-lg border border-[#E8D7C3] overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-[#E8D7C3]/50 transition-colors"
        onClick={() => onToggleWorkout(workout.id)}
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-3">
              <h4 className="font-bold text-[#2C2C2C]">
                Day {workout.day.slice(-1)}: {dayTitles[workout.day]}
              </h4>
              <span className="text-sm text-[#2C2C2C]/60">
                {workout.date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-sm text-[#2C2C2C]/70">
                {workout.exercises.length} exercises
              </span>
              <span className="text-sm text-[#2C2C2C]/70">
                {workoutVolume.toLocaleString()} lbs volume
              </span>
              {workout.duration && (
                <span className="text-sm text-[#2C2C2C]/70">
                  {workout.duration} min
                </span>
              )}
            </div>
            {workout.notes && (
              <p className="text-sm text-[#8B9A5B] mt-1 italic">
                "{workout.notes}"
              </p>
            )}
          </div>
          <svg
            className={`w-4 h-4 text-[#2C2C2C]/60 transition-transform ${
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
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-[#E8D7C3] p-4 bg-[#E8D7C3]/30">
          <div className="space-y-3">
            {workout.exercises.map((exercise, idx) => (
              <ExerciseDetail key={idx} exercise={exercise} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutCard;