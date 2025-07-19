import React from 'react';

interface DualWeightInputProps {
  exerciseName: string;
  weightLeft: number | null;
  weightRight: number | null;
  onChange: (left: number | null, right: number | null) => void;
  showTotal?: boolean;
  disabled?: boolean;
  className?: string;
}

const DualWeightInput: React.FC<DualWeightInputProps> = ({
  exerciseName,
  weightLeft,
  weightRight,
  onChange,
  showTotal = true,
  disabled = false,
  className = '',
}) => {
  const totalWeight = (weightLeft || 0) + (weightRight || 0);

  const handleLeftChange = (value: string) => {
    const newLeft = value ? Number(value) : null;
    onChange(newLeft, weightRight);
  };

  const handleRightChange = (value: string) => {
    const newRight = value ? Number(value) : null;
    onChange(weightLeft, newRight);
  };

  const adjustWeight = (side: 'left' | 'right', delta: number) => {
    if (side === 'left') {
      const newLeft = Math.max(0, (weightLeft || 0) + delta);
      onChange(newLeft, weightRight);
    } else {
      const newRight = Math.max(0, (weightRight || 0) + delta);
      onChange(weightLeft, newRight);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
            Left Hand (lbs)
          </label>
          <input
            type="number"
            value={weightLeft || ''}
            onChange={(e) => handleLeftChange(e.target.value)}
            disabled={disabled}
            placeholder="0"
            className="w-full px-3 py-2 text-center border border-[#E8D7C3] rounded-lg focus:ring-2 focus:ring-[#8B9A5B] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
            min="0"
            step="2.5"
          />
          {!disabled && (
            <div className="flex justify-center space-x-1 mt-1">
              <button
                onClick={() => adjustWeight('left', -2.5)}
                className="px-2 py-1 text-xs bg-[#2C2C2C]/10 text-[#2C2C2C] rounded hover:bg-[#2C2C2C]/20"
              >
                -2.5
              </button>
              <button
                onClick={() => adjustWeight('left', 2.5)}
                className="px-2 py-1 text-xs bg-[#8B9A5B]/20 text-[#6B7A4B] rounded hover:bg-[#8B9A5B]/30"
              >
                +2.5
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
            Right Hand (lbs)
          </label>
          <input
            type="number"
            value={weightRight || ''}
            onChange={(e) => handleRightChange(e.target.value)}
            disabled={disabled}
            placeholder="0"
            className="w-full px-3 py-2 text-center border border-[#E8D7C3] rounded-lg focus:ring-2 focus:ring-[#8B9A5B] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
            min="0"
            step="2.5"
          />
          {!disabled && (
            <div className="flex justify-center space-x-1 mt-1">
              <button
                onClick={() => adjustWeight('right', -2.5)}
                className="px-2 py-1 text-xs bg-[#2C2C2C]/10 text-[#2C2C2C] rounded hover:bg-[#2C2C2C]/20"
              >
                -2.5
              </button>
              <button
                onClick={() => adjustWeight('right', 2.5)}
                className="px-2 py-1 text-xs bg-[#8B9A5B]/20 text-[#6B7A4B] rounded hover:bg-[#8B9A5B]/30"
              >
                +2.5
              </button>
            </div>
          )}
        </div>
      </div>

      {showTotal && (
        <div className="bg-[#8B9A5B]/10 rounded-lg p-3 text-center">
          <div className="text-sm text-[#6B7A4B] font-medium">
            Total Weight: {(weightLeft || 0)} + {(weightRight || 0)} = {totalWeight} lbs
          </div>
        </div>
      )}
    </div>
  );
};

export default DualWeightInput;