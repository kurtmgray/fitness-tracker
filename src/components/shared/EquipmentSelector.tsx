import React from 'react';
import { getExerciseRules } from '@/utils/exerciseUtils';

export type EquipmentType = 'barbell' | 'dumbbell' | 'kettlebell' | 'bodyweight' | 'plate' | 'band';

interface EquipmentSelectorProps {
  exerciseName: string;
  selectedEquipment: EquipmentType;
  onEquipmentChange: (equipment: EquipmentType) => void;
  disabled?: boolean;
  className?: string;
}

const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({
  exerciseName,
  selectedEquipment,
  onEquipmentChange,
  disabled = false,
  className = '',
}) => {
  const rules = getExerciseRules(exerciseName);
  
  // Get available equipment types for this exercise
  const getAvailableEquipment = (): EquipmentType[] => {
    if (!rules) return ['barbell', 'dumbbell', 'kettlebell', 'bodyweight', 'plate'];
    
    const equipment: EquipmentType[] = [rules.defaultEquipment as EquipmentType];
    
    // Add alternative equipment if available
    if (rules.alternativeEquipment) {
      equipment.push(...(rules.alternativeEquipment as EquipmentType[]));
    }
    
    return [...new Set(equipment)]; // Remove duplicates
  };

  const availableEquipment = getAvailableEquipment();

  const equipmentLabels: Record<EquipmentType, string> = {
    barbell: 'Barbell',
    dumbbell: 'Dumbbell',
    kettlebell: 'Kettlebell',
    bodyweight: 'Bodyweight',
    plate: 'Plate',
    band: 'Bands',
  };

  const equipmentIcons: Record<EquipmentType, string> = {
    barbell: '🏋️',
    dumbbell: '💪',
    kettlebell: '⚖️',
    bodyweight: '🤸',
    plate: '🟫',
    band: '🟡',
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-[#2C2C2C]">
        Equipment Choice
      </label>
      
      <div className="grid grid-cols-2 gap-2">
        {availableEquipment.map((equipment) => (
          <button
            key={equipment}
            onClick={() => onEquipmentChange(equipment)}
            disabled={disabled}
            className={`flex items-center justify-center p-3 rounded-lg text-sm font-medium transition-all ${
              selectedEquipment === equipment
                ? 'bg-[#8B9A5B] text-white border-2 border-[#6B7A4B]'
                : 'bg-[#F0E6D6] text-[#2C2C2C] border border-[#E8D7C3] hover:bg-[#E8D7C3]'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="mr-2">{equipmentIcons[equipment]}</span>
            {equipmentLabels[equipment]}
          </button>
        ))}
      </div>
      
      {rules?.defaultEquipment && (
        <div className="text-xs text-[#2C2C2C]/60">
          Default: {equipmentLabels[rules.defaultEquipment as EquipmentType]}
        </div>
      )}
    </div>
  );
};

export default EquipmentSelector;