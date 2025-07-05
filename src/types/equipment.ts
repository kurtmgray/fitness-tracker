export type EquipmentType = 
  | 'barbell'
  | 'dumbbell' 
  | 'kettlebell'
  | 'bodyweight'
  | 'plate'
  | 'band';

export type EquipmentModifier = 'per_hand' | 'total';

export interface Equipment {
  type: EquipmentType;
  modifier?: EquipmentModifier;
  note?: string;
}

export interface EnhancedSetData {
  weight: number | null;
  reps: number;
  completed: boolean;
  rpe?: number;
  equipment?: Equipment;
}

// Helper functions for equipment handling
export const getEquipmentDisplay = (equipment?: Equipment): string => {
  if (!equipment) return '';
  
  switch (equipment.type) {
    case 'barbell':
      return 'BB';
    case 'dumbbell':
      return 'DB';
    case 'kettlebell':
      return 'KB';
    case 'bodyweight':
      return 'BW';
    case 'plate':
      return 'PL';
    case 'band':
      return 'BD';
    default:
      return '';
  }
};

export const getWeightDisplay = (weight: number | null, equipment?: Equipment): string => {
  if (weight === null) {
    return equipment?.type === 'bodyweight' ? 'BW' : '0';
  }
  
  const weightStr = weight.toString();
  const equipmentDisplay = getEquipmentDisplay(equipment);
  
  if (equipment?.type === 'dumbbell' && equipment?.modifier === 'per_hand') {
    return `${weightStr} lbs × 2 (${equipmentDisplay})`;
  }
  
  return equipmentDisplay ? `${weightStr} lbs (${equipmentDisplay})` : `${weightStr} lbs`;
};

export const calculateTotalWeight = (weight: number | null, equipment?: Equipment): number => {
  if (weight === null) return 0;
  
  if (equipment?.type === 'dumbbell' && equipment?.modifier === 'per_hand') {
    return weight * 2;
  }
  
  return weight;
};