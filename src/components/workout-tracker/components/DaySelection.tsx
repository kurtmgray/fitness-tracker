import React from 'react';
import { Play, Calendar } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import { UnifiedHeader } from '@/components/shared/UnifiedHeader';
import { trpc } from '@/lib/trpc';

interface DaySelectionProps {
  workoutTemplate?: any; // Database workout template (not used in selection)
  dayTitles: Record<WorkoutDay, string>;
  getLastWorkout: (day: WorkoutDay) => WorkoutSession | null;
  onSelectDay: (day: WorkoutDay) => void;
}

const DaySelection: React.FC<DaySelectionProps> = ({
  workoutTemplate, // Not used in selection phase
  dayTitles,
  getLastWorkout,
  onSelectDay,
}) => {
  const router = useRouter();
  // Hardcoded days for selection - templates will be loaded after selection
  const availableDays: WorkoutDay[] = ['day1', 'day2', 'day3'];
  
  // Fetch workout templates for each day to show exercise lists
  const { data: day1Template } = trpc.workouts.getWorkoutTemplate.useQuery({ dayType: 'day1' });
  const { data: day2Template } = trpc.workouts.getWorkoutTemplate.useQuery({ dayType: 'day2' });
  const { data: day3Template } = trpc.workouts.getWorkoutTemplate.useQuery({ dayType: 'day3' });
  
  const getTemplateForDay = (day: WorkoutDay) => {
    switch (day) {
      case 'day1': return day1Template;
      case 'day2': return day2Template;
      case 'day3': return day3Template;
      default: return null;
    }
  };
  return (
    <div className="space-y-4">
      <UnifiedHeader
        title="Select Your Workout"
        icon={Calendar}
        compact={true}
        rightContent={
          <div className="text-right text-sm">
            <div className="text-[#2C2C2C]/70">Choose training day</div>
            <div className="text-[#8B9A5B] font-medium">3 workouts available</div>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availableDays.map((day) => {
          const lastWorkout = getLastWorkout(day);
          const daysSince = lastWorkout
            ? Math.floor(
                (new Date().getTime() - new Date(lastWorkout.date).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : null;

          return (
            <div
              key={day}
              onClick={() => {
                onSelectDay(day);
                router.navigate({ to: `/workout/${day}` });
              }}
              className="bg-white border-2 border-[#E8D7C3] hover:border-[#8B9A5B] rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-medium group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-[#2C2C2C] group-hover:text-[#8B9A5B]">
                  Day {day.slice(-1)}: {dayTitles[day]}
                </h3>
                {lastWorkout && (
                  <span className="text-sm text-[#2C2C2C]/60">
                    {daysSince === 0
                      ? 'Today'
                      : daysSince === 1
                      ? 'Yesterday'
                      : `${daysSince} days ago`}
                  </span>
                )}
              </div>

              <div className="flex-1 mb-3">
                <div className="space-y-1">
                  {(() => {
                    const template = getTemplateForDay(day);
                    if (template?.exercises) {
                      return template.exercises.slice(0, 4).map((exercise: any, idx: number) => (
                        <div key={idx} className="text-xs text-[#2C2C2C]/70">
                          • {exercise.name}
                        </div>
                      ));
                    }
                    return (
                      <div className="text-xs text-[#2C2C2C]/60">
                        {lastWorkout ? 'Ready to continue progress' : 'Start fresh workout'}
                      </div>
                    );
                  })()}
                  {(() => {
                    const template = getTemplateForDay(day);
                    if (template?.exercises && template.exercises.length > 4) {
                      return (
                        <div className="text-xs text-[#2C2C2C]/50">
                          +{template.exercises.length - 4} more exercises
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              <div className="flex justify-center items-center mt-auto">
                <button className="flex gap-2 w-full bg-gradient-to-r from-[#8B9A5B] to-[#6B7A4B] hover:from-[#6B7A4B] hover:to-[#5A6940] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center">
                  <Play className="w-4 h-4 mr-2" />
                  Start Workout
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DaySelection;
