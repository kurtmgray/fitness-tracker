import { useState } from 'react';
import type { Equipment, EquipmentType } from '../../types/equipment';
import { calculateTotalWeight } from '../../types/equipment';

interface WeightInputProps {
  weight: number | null;
  equipment?: Equipment;
  onChange: (weight: number | null, equipment?: Equipment) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function WeightInput({ 
  weight, 
  equipment, 
  onChange, 
  placeholder = "Weight",
  className = "",
  disabled = false 
}: WeightInputProps) {
  const [showEquipmentSelector, setShowEquipmentSelector] = useState(false);

  const handleWeightChange = (value: string) => {
    const numericValue = value === '' ? null : parseFloat(value);
    onChange(numericValue, equipment);
  };

  const handleEquipmentChange = (newEquipment: Equipment) => {
    onChange(weight, newEquipment);
  };

  const getTotalWeightDisplay = () => {
    if (weight === null) return equipment?.type === 'bodyweight' ? 'BW' : '';
    
    const total = calculateTotalWeight(weight, equipment);
    const isDumbbell = equipment?.type === 'dumbbell' && equipment?.modifier === 'per_hand';
    
    if (isDumbbell) {
      return `${weight} lbs × 2 = ${total} lbs`;
    }
    
    return `${weight} lbs`;
  };

  const getEquipmentLabel = (type: EquipmentType): string => {
    const labels: Record<EquipmentType, string> = {
      barbell: 'Barbell (BB)',
      dumbbell: 'Dumbbell (DB)', 
      kettlebell: 'Kettlebell (KB)',
      bodyweight: 'Bodyweight (BW)',
      plate: 'Plate (PL)',
      band: 'Band (BD)'
    };
    return labels[type];
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        {/* Weight Input */}
        <input
          type="number"
          value={weight || ''}
          onChange={(e) => handleWeightChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || equipment?.type === 'bodyweight'}
          className={`flex-1 px-3 py-2 border border-[#E8D7C3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9A5B] focus:border-transparent ${disabled ? 'bg-gray-100' : ''} ${className}`}
        />
        
        {/* Equipment Type Button */}
        <button
          type="button"
          onClick={() => setShowEquipmentSelector(!showEquipmentSelector)}
          disabled={disabled}
          className="px-3 py-2 bg-[#F0E6D6] text-[#2C2C2C] rounded-lg hover:bg-[#E8D7C3] transition-colors disabled:opacity-50 min-w-[60px] text-sm font-medium"
        >
          {equipment ? getEquipmentLabel(equipment.type).split(' ')[1].replace(/[()]/g, '') : 'BB'}
        </button>
      </div>

      {/* Total Weight Display */}
      {weight !== null && (
        <div className="text-xs text-[#2C2C2C]/60 mt-1">
          Total: {getTotalWeightDisplay()}
        </div>
      )}

      {/* Equipment Selector Dropdown */}
      {showEquipmentSelector && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E8D7C3] rounded-lg shadow-lg z-50">
          <div className="p-2 space-y-1">
            {(['barbell', 'dumbbell', 'kettlebell', 'bodyweight', 'plate', 'band'] as EquipmentType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  const newEquipment: Equipment = {
                    type,
                    modifier: type === 'dumbbell' ? 'per_hand' : undefined
                  };
                  
                  // If switching to bodyweight, clear weight
                  if (type === 'bodyweight') {
                    onChange(null, newEquipment);
                  } else {
                    handleEquipmentChange(newEquipment);
                  }
                  setShowEquipmentSelector(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-[#F0E6D6] transition-colors ${
                  equipment?.type === type ? 'bg-[#8B9A5B] text-white' : 'text-[#2C2C2C]'
                }`}
              >
                {getEquipmentLabel(type)}
              </button>
            ))}
          </div>
          
          {/* Dumbbell Modifier */}
          {equipment?.type === 'dumbbell' && (
            <div className="border-t border-[#E8D7C3] p-2">
              <div className="text-xs font-medium text-[#2C2C2C]/70 mb-1">Dumbbell Weight</div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleEquipmentChange({ ...equipment, modifier: 'per_hand' })}
                  className={`w-full text-left px-3 py-1 rounded text-xs ${
                    equipment.modifier === 'per_hand' ? 'bg-[#8B9A5B] text-white' : 'hover:bg-[#F0E6D6]'
                  }`}
                >
                  Per hand (shows total)
                </button>
                <button
                  type="button"
                  onClick={() => handleEquipmentChange({ ...equipment, modifier: 'total' })}
                  className={`w-full text-left px-3 py-1 rounded text-xs ${
                    equipment.modifier === 'total' ? 'bg-[#8B9A5B] text-white' : 'hover:bg-[#F0E6D6]'
                  }`}
                >
                  Total weight
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showEquipmentSelector && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowEquipmentSelector(false)}
        />
      )}
    </div>
  );
}