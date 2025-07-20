import React, { useState } from 'react';
import { ArrowLeft, Play, Settings, Dumbbell } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import { findExerciseInWorkoutById } from '@/utils/exerciseIdMapping';
import { EquipmentSelectionModal } from '@/components/workout-setup/EquipmentSelectionModal';
import { UnifiedHeader } from '@/components/shared/UnifiedHeader';

interface WorkoutSetupProps {
  selectedDay: WorkoutDay;
  currentSession: WorkoutSession;
  workoutTemplate: any; // Database workout template
  dayTitles: Record<WorkoutDay, string>;
  getLastWorkout: (day: WorkoutDay) => WorkoutSession | null;
  suggestNextWeight: (
    lastWeight: number,
    lastRpe: number,
    weightType: string
  ) => number;
  onGoBack: () => void;
  onStartWorkout: () => void;
  onUpdateSession: (session: WorkoutSession) => void;
  isLoadingTemplate?: boolean;
}

const WorkoutSetup: React.FC<WorkoutSetupProps> = ({
  selectedDay,
  currentSession,
  workoutTemplate,
  dayTitles,
  getLastWorkout,
  suggestNextWeight,
  onGoBack,
  onStartWorkout,
  onUpdateSession,
  isLoadingTemplate,
}) => {
  const router = useRouter();
  const template = workoutTemplate?.exercises || [];
  const lastWorkout = getLastWorkout(selectedDay);
  
  // Equipment selection state
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [equipmentPreferences, setEquipmentPreferences] = useState<Record<string, { equipmentTypeId: string; equipmentInstanceId?: string }>>({});

  // Initialize equipment preferences with defaults from template
  React.useEffect(() => {
    if (template.length > 0 && Object.keys(equipmentPreferences).length === 0) {
      const defaultPreferences: Record<string, { equipmentTypeId: string }> = {};
      template.forEach((exercise: any) => {
        if (exercise.primaryEquipmentTypeId) {
          defaultPreferences[exercise.id] = {
            equipmentTypeId: exercise.primaryEquipmentTypeId,
          };
        }
      });
      setEquipmentPreferences(defaultPreferences);
    }
  }, [template, equipmentPreferences]);

  const handleEquipmentSave = (preferences: Record<string, { equipmentTypeId: string; equipmentInstanceId?: string }>) => {
    setEquipmentPreferences(preferences);
    setShowEquipmentModal(false);
  };

  if (isLoadingTemplate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <button
            onClick={onGoBack}
            className="flex items-center space-x-2 text-[#2C2C2C]/70 hover:text-[#2C2C2C] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Day Selection</span>
          </button>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-[#2C2C2C] mb-2">
            Loading Workout Template...
          </h2>
          <div className="animate-pulse bg-[#F0E6D6] h-4 w-64 mx-auto rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UnifiedHeader
        title={`Day ${selectedDay.slice(-1)}: ${dayTitles[selectedDay]}`}
        icon={Dumbbell}
        showBackButton={true}
        onBack={() => router.navigate({ to: '/workout' })}
        backText="Back"
        compact={true}
        rightContent={
          lastWorkout ? (
            <div className="text-right text-sm">
              <div className="text-[#2C2C2C]/70">Last workout</div>
              <div className="text-[#8B9A5B] font-medium">
                {new Date(lastWorkout.date).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="text-right text-sm">
              <div className="text-[#2C2C2C]/70">First time</div>
              <div className="text-[#8B9A5B] font-medium">New workout</div>
            </div>
          )
        }
      />

      <div className="bg-gradient-to-r from-[#FAF7F2] to-[#F0E6D6] rounded-xl p-4 border border-[#E8D7C3]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#2C2C2C]">
            Today's Workout
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEquipmentModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#8B9A5B] bg-white border border-[#8B9A5B] rounded-lg hover:bg-[#8B9A5B] hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
              Equipment
            </button>
            <button
              onClick={async () => {
                await onStartWorkout();
                router.navigate({ to: `/workout/${selectedDay}/track` });
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-[#8B9A5B] to-[#6B7A4B] hover:from-[#6B7A4B] hover:to-[#5A6940] text-white font-semibold px-4 py-2 rounded-lg shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-4 h-4" />
              Start Workout
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {template.map((exercise: any, idx: number) => {
            const lastExercise = findExerciseInWorkoutById(lastWorkout, exercise.id);
            const currentExercise = currentSession.exercises[idx];

            // Calculate last workout stats and suggestions
            const lastWorkoutStats = (() => {
              if (!lastExercise) return null;

              const completedSets = lastExercise.sets.filter((s) => s.completed);
              if (completedSets.length === 0) return null;

              const lastWeight = Number(
                completedSets[0]?.weight ?? 
                completedSets[0]?.weightLeft ?? 
                completedSets[0]?.weightRight ?? 
                0
              );
              const lastWeightLeft = completedSets[0]?.weightLeft;
              const lastWeightRight = completedSets[0]?.weightRight;
              const lastReps = completedSets[0]?.reps ?? 0;
              const lastTimeSeconds = completedSets[0]?.timeSeconds;
              
              const avgRpe = completedSets.length > 0
                ? completedSets.reduce((sum, s) => sum + (s.rpe ?? 8), 0) / completedSets.length
                : undefined;
                
              const suggestedWeight = avgRpe !== undefined
                ? suggestNextWeight(lastWeight, avgRpe, exercise.equipmentCategory || 'barbell')
                : lastWeight;

              return {
                lastWeight,
                lastWeightLeft,
                lastWeightRight,
                lastReps,
                lastTimeSeconds,
                avgRpe,
                suggestedWeight
              };
            })();

            return (
              <div key={idx} className="bg-white rounded-lg border border-[#E8D7C3] p-4">
                {/* Exercise Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#2C2C2C] text-lg">{exercise.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-[#2C2C2C]/70 mt-1">
                      <span>{exercise.sets} sets × {exercise.reps} {exercise.isTimeBased ? 'seconds' : 'reps'}</span>
                      {exercise.equipmentTypeName && (
                        <span className="bg-[#8B9A5B]/10 text-[#6B7A4B] px-2 py-1 rounded text-xs">
                          {exercise.equipmentTypeName}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Last Workout Stats */}
                  <div className="text-right text-sm">
                    {lastWorkoutStats ? (
                      <>
                        <div className="text-[#2C2C2C]/80 font-medium">
                          Last: {exercise.supportsDualWeights && lastWorkoutStats.lastWeightLeft && lastWorkoutStats.lastWeightRight
                            ? `${lastWorkoutStats.lastWeightLeft} + ${lastWorkoutStats.lastWeightRight} lbs`
                            : `${lastWorkoutStats.lastWeight} lbs`
                          }
                        </div>
                        <div className="text-[#2C2C2C]/60">
                          {exercise.isTimeBased && lastWorkoutStats.lastTimeSeconds
                            ? `${Math.floor(lastWorkoutStats.lastTimeSeconds / 60)}:${(lastWorkoutStats.lastTimeSeconds % 60).toString().padStart(2, '0')}`
                            : `${lastWorkoutStats.lastReps} reps`
                          }
                          {lastWorkoutStats.avgRpe && (
                            <span className="ml-2 text-[#8B9A5B]">
                              RPE {lastWorkoutStats.avgRpe.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-[#8B9A5B]/80 text-xs">
                        New exercise
                      </div>
                    )}
                  </div>
                </div>

                {/* Sets Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentExercise.sets.map((set, setIdx) => (
                    <div key={setIdx} className="bg-[#F0E6D6] rounded-lg p-3">
                      <div className="text-center mb-2">
                        <div className="font-medium text-[#2C2C2C] text-sm">Set {setIdx + 1}</div>
                      </div>
                      
                      {/* Weight Input */}
                      {!exercise.trackingType || exercise.trackingType === 'reps' ? (
                        exercise.supportsDualWeights ? (
                          <div className="space-y-1">
                            <input
                              type="number"
                              value={set.weightLeft || ''}
                              onChange={(e) => {
                                const updatedSession = { ...currentSession };
                                updatedSession.exercises[idx].sets[setIdx].weightLeft = Number(e.target.value) || null;
                                onUpdateSession(updatedSession);
                              }}
                              className="w-full px-2 py-1 text-xs border border-[#E8D7C3] rounded text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="L"
                              step="2.5"
                              style={{ paddingRight: '8px' }}
                            />
                            <input
                              type="number"
                              value={set.weightRight || ''}
                              onChange={(e) => {
                                const updatedSession = { ...currentSession };
                                updatedSession.exercises[idx].sets[setIdx].weightRight = Number(e.target.value) || null;
                                onUpdateSession(updatedSession);
                              }}
                              className="w-full px-2 py-1 text-xs border border-[#E8D7C3] rounded text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="R"
                              step="2.5"
                              style={{ paddingRight: '8px' }}
                            />
                          </div>
                        ) : (
                          <input
                            type="number"
                            value={set.weight || ''}
                            onChange={(e) => {
                              const updatedSession = { ...currentSession };
                              updatedSession.exercises[idx].sets[setIdx].weight = Number(e.target.value) || null;
                              onUpdateSession(updatedSession);
                            }}
                            className="w-full px-2 py-1 text-xs border border-[#E8D7C3] rounded text-center mb-1 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="lbs"
                            step="2.5"
                            style={{ paddingRight: '8px' }}
                          />
                        )
                      ) : null}
                      
                      {/* Reps/Time Input */}
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => {
                          const updatedSession = { ...currentSession };
                          updatedSession.exercises[idx].sets[setIdx].reps = Number(e.target.value);
                          onUpdateSession(updatedSession);
                        }}
                        className="w-full px-2 py-1 text-xs border border-[#E8D7C3] rounded text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder={exercise.isTimeBased ? 'sec' : 'reps'}
                        style={{ paddingRight: '8px' }}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Bosu Ball Option */}
                {exercise.hasBosoBallOption && (
                  <div className="mt-3">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={currentExercise.useBosoBall}
                        onChange={(e) => {
                          const updatedSession = { ...currentSession };
                          updatedSession.exercises[idx].useBosoBall = e.target.checked;
                          onUpdateSession(updatedSession);
                        }}
                        className="rounded border-[#E8D7C3] text-[#8B9A5B] focus:ring-[#8B9A5B]"
                      />
                      <span className="text-[#2C2C2C]">Use Bosu Ball</span>
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment Selection Modal */}
      <EquipmentSelectionModal
        isOpen={showEquipmentModal}
        exercises={template}
        currentPreferences={equipmentPreferences}
        onSave={handleEquipmentSave}
        onCancel={() => setShowEquipmentModal(false)}
      />
    </div>
  );
};

export default WorkoutSetup;
