import React from 'react';
import { trpc } from '@/lib/trpc';

interface EquipmentInstanceSelectorProps {
  equipmentTypeId: string;
  value?: string; // equipmentInstanceId
  onChange: (equipmentInstanceId: string | null) => void;
  showAvailableOnly?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const EquipmentInstanceSelector: React.FC<EquipmentInstanceSelectorProps> = ({
  equipmentTypeId,
  value,
  onChange,
  showAvailableOnly = true,
  placeholder = "Select specific equipment...",
  disabled = false,
}) => {
  const { data: instances, isLoading } = trpc.equipment.getEquipmentInstances.useQuery(
    {
      equipmentTypeId,
      isAvailable: showAvailableOnly ? true : undefined,
    },
    {
      enabled: !!equipmentTypeId,
    }
  );

  if (!equipmentTypeId) {
    return (
      <select disabled className="w-full p-2 border rounded-md bg-gray-100">
        <option>Select equipment type first</option>
      </select>
    );
  }

  if (isLoading) {
    return (
      <select disabled className="w-full p-2 border rounded-md bg-gray-100">
        <option>Loading equipment instances...</option>
      </select>
    );
  }

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={disabled}
      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">{placeholder}</option>
      {instances?.map((instance) => (
        <option key={instance.instance_id} value={instance.instance_id || ''}>
          {instance.instance_name}
          {instance.instance_specs && 
            typeof instance.instance_specs === 'object' && 
            'weight' in instance.instance_specs &&
            ` (${instance.instance_specs.weight}lbs)`
          }
          {!instance.is_available && ' (Unavailable)'}
        </option>
      ))}
    </select>
  );
};