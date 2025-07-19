import React from 'react';

interface EquipmentBadgeProps {
  equipmentType: {
    id: string;
    name: string;
    category: string;
  };
  equipmentInstance?: {
    id: string;
    name: string;
    specifications?: any;
  } | null;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const EquipmentBadge: React.FC<EquipmentBadgeProps> = ({
  equipmentType,
  equipmentInstance,
  size = 'md',
  showDetails = false,
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const categoryColors = {
    barbell: 'bg-blue-100 text-blue-800',
    dumbbell: 'bg-green-100 text-green-800',
    kettlebell: 'bg-purple-100 text-purple-800',
    bodyweight: 'bg-gray-100 text-gray-800',
    plate: 'bg-yellow-100 text-yellow-800',
    band: 'bg-red-100 text-red-800',
    cable: 'bg-indigo-100 text-indigo-800',
    machine: 'bg-pink-100 text-pink-800',
  };

  const bgColor = categoryColors[equipmentType.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';

  return (
    <div className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${bgColor}`}>
      <span>{equipmentInstance ? equipmentInstance.name : equipmentType.name}</span>
      {showDetails && equipmentInstance?.specifications && (
        <span className="ml-1 text-xs opacity-75">
          {equipmentInstance.specifications.weight && `${equipmentInstance.specifications.weight}lbs`}
          {equipmentInstance.specifications.resistanceLevel && `${equipmentInstance.specifications.resistanceLevel}`}
        </span>
      )}
    </div>
  );
};