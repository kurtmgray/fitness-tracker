import React from 'react';
import { trpc } from '@/lib/trpc';

interface EquipmentTypeSelectorProps {
  value?: string; // equipmentTypeId
  exerciseId?: string; // to filter compatible equipment types
  onChange: (equipmentTypeId: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const EquipmentTypeSelector: React.FC<EquipmentTypeSelectorProps> = ({
  value,
  exerciseId,
  onChange,
  placeholder = "Select equipment type...",
  disabled = false,
}) => {
  const { data: equipmentTypes, isLoading } = trpc.equipment.getEquipmentTypes.useQuery();

  if (isLoading) {
    return (
      <select disabled className="w-full p-2 border rounded-md bg-gray-100">
        <option>Loading equipment types...</option>
      </select>
    );
  }

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">{placeholder}</option>
      {equipmentTypes?.map((equipmentType) => (
        <option key={equipmentType.id} value={equipmentType.id}>
          {equipmentType.name} ({equipmentType.category})
        </option>
      ))}
    </select>
  );
};