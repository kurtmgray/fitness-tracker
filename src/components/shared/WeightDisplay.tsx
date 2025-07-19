import React from 'react';
import { formatSetWeight } from '@/utils/exerciseUtils';

interface WeightDisplayProps {
  exerciseName: string;
  weight?: number | null;
  weightLeft?: number | null;
  weightRight?: number | null;
  className?: string;
  showLabel?: boolean;
}

const WeightDisplay: React.FC<WeightDisplayProps> = ({
  exerciseName,
  weight,
  weightLeft,
  weightRight,
  className = '',
  showLabel = false,
}) => {
  const displayText = formatSetWeight(exerciseName, weight, weightLeft, weightRight);

  return (
    <span className={className}>
      {showLabel && <span className="text-[#2C2C2C]/60 text-xs mr-1">Weight:</span>}
      {displayText}
    </span>
  );
};

export default WeightDisplay;