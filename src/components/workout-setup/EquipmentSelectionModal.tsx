import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { EquipmentTypeSelector } from '@/components/equipment/EquipmentTypeSelector';
import { trpc } from '@/lib/trpc';

interface Exercise {
  id: string;
  name: string;
  primaryEquipmentTypeId: string;
  equipmentTypeName?: string;
  equipmentCategory?: string;
}

interface EquipmentPreference {
  equipmentTypeId: string;
  equipmentInstanceId?: string;
}

interface EquipmentSelectionModalProps {
  isOpen: boolean;
  exercises: Exercise[];
  currentPreferences: Record<string, EquipmentPreference>;
  onSave: (preferences: Record<string, EquipmentPreference>) => void;
  onCancel: () => void;
}

export const EquipmentSelectionModal: React.FC<
  EquipmentSelectionModalProps
> = ({ isOpen, exercises, currentPreferences, onSave, onCancel }) => {
  const [preferences, setPreferences] =
    useState<Record<string, EquipmentPreference>>(currentPreferences);
  const [useDefaults, setUseDefaults] = useState(false);

  // Initialize preferences with exercise defaults when modal opens
  useEffect(() => {
    if (isOpen && exercises.length > 0) {
      const defaultPreferences: Record<string, EquipmentPreference> = {};
      exercises.forEach((exercise) => {
        // Use current preference if it exists, otherwise use exercise default
        defaultPreferences[exercise.id] = currentPreferences[exercise.id] || {
          equipmentTypeId: exercise.primaryEquipmentTypeId,
        };
      });
      setPreferences(defaultPreferences);
    }
  }, [isOpen, exercises, currentPreferences]);

  // Handle "Use Defaults" button
  useEffect(() => {
    if (useDefaults) {
      const defaultPreferences: Record<string, EquipmentPreference> = {};
      exercises.forEach((exercise) => {
        defaultPreferences[exercise.id] = {
          equipmentTypeId: exercise.primaryEquipmentTypeId,
        };
      });
      setPreferences(defaultPreferences);
    }
  }, [useDefaults, exercises]);

  if (!isOpen) return null;

  const handleEquipmentTypeChange = (
    exerciseId: string,
    equipmentTypeId: string
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [exerciseId]: {
        equipmentTypeId,
        // Clear equipment instance when type changes
        equipmentInstanceId: undefined,
      },
    }));
  };

  const handleSave = () => {
    // Ensure all exercises have equipment selected
    const allSelected = exercises.every(
      (exercise) => preferences[exercise.id]?.equipmentTypeId
    );

    if (!allSelected) {
      alert('Please select equipment for all exercises before continuing.');
      return;
    }

    onSave(preferences);
  };

  const allEquipmentSelected = exercises.every(
    (exercise) => preferences[exercise.id]?.equipmentTypeId
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-4 pb-4 px-4 backdrop-blur-[2px] rounded-2xl"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
    >
      <div className="bg-white rounded-xl w-full max-w-2xl h-[calc(100vh-2rem)] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E8D7C3]">
          <div>
            <h2 className="text-xl font-semibold text-[#2C2C2C]">
              Select Equipment
            </h2>
            <p className="text-[#2C2C2C]/70 text-sm">
              Choose equipment for today's workout
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-[#F0E6D6] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#2C2C2C]" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-3 bg-[#FAF7F2] border-b border-[#E8D7C3]">
          <button
            onClick={() => setUseDefaults(!useDefaults)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              useDefaults
                ? 'bg-[#8B9A5B] text-white'
                : 'bg-white text-[#2C2C2C] border border-[#E8D7C3] hover:bg-[#F0E6D6]'
            }`}
          >
            {useDefaults && <Check className="w-4 h-4" />}
            Use Default Equipment
          </button>
        </div>

        {/* Equipment Selection List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {exercises.map((exercise) => {
            const currentPreference = preferences[exercise.id];

            return (
              <div key={exercise.id} className="bg-[#FAF7F2] rounded-lg p-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 flex justify-between">
                    <h3 className="font-semibold text-[#2C2C2C] text-base">
                      {exercise.name}
                    </h3>
                    {exercise.equipmentTypeName && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#F0E6D6] text-[#2C2C2C]">
                          Default: {exercise.equipmentTypeName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
                      Equipment Type
                    </label>
                    <EquipmentTypeSelector
                      value={currentPreference?.equipmentTypeId || ''}
                      exerciseId={exercise.id}
                      onChange={(equipmentTypeId) =>
                        handleEquipmentTypeChange(exercise.id, equipmentTypeId)
                      }
                      placeholder="Select equipment type..."
                    />
                  </div>

                  {/* Equipment Instance Selection - Future Enhancement */}
                  {/* {currentPreference?.equipmentTypeId && (
                    <div>
                      <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                        Specific Equipment (Optional)
                      </label>
                      <EquipmentInstanceSelector
                        equipmentTypeId={currentPreference.equipmentTypeId}
                        value={currentPreference.equipmentInstanceId || ''}
                        onChange={(equipmentInstanceId) => 
                          setPreferences(prev => ({
                            ...prev,
                            [exercise.id]: {
                              ...prev[exercise.id],
                              equipmentInstanceId,
                            },
                          }))
                        }
                        placeholder="Any available equipment"
                      />
                    </div>
                  )} */}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8D7C3] bg-white">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#2C2C2C]/70">
              {allEquipmentSelected ? (
                <span className="text-[#8B9A5B] font-medium">
                  ✓ All equipment selected
                </span>
              ) : (
                <span>
                  {exercises.length -
                    Object.keys(preferences).filter(
                      (id) => preferences[id]?.equipmentTypeId
                    ).length}{' '}
                  exercises need equipment selection
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-[#2C2C2C] bg-white border border-[#E8D7C3] rounded-lg hover:bg-[#F0E6D6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!allEquipmentSelected}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  allEquipmentSelected
                    ? 'bg-[#8B9A5B] text-white hover:bg-[#6B7A4B]'
                    : 'bg-[#E8D7C3] text-[#2C2C2C]/50 cursor-not-allowed'
                }`}
              >
                Continue with Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
