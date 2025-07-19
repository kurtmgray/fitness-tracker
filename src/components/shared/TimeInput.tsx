import React, { useState, useEffect } from 'react';
import { formatTime, parseTimeToSeconds, isValidTimeInput } from '@/utils/timeUtils';

interface TimeInputProps {
  seconds: number | null;
  onChange: (seconds: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({
  seconds,
  onChange,
  placeholder = '2:00',
  disabled = false,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isValid, setIsValid] = useState(true);

  // Update display value when seconds prop changes
  useEffect(() => {
    if (seconds !== null && seconds !== undefined) {
      setDisplayValue(formatTime(seconds));
    } else {
      setDisplayValue('');
    }
  }, [seconds]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayValue(value);

    if (value === '') {
      setIsValid(true);
      onChange(0);
      return;
    }

    const valid = isValidTimeInput(value);
    setIsValid(valid);

    if (valid) {
      const newSeconds = parseTimeToSeconds(value);
      onChange(newSeconds);
    }
  };

  const handleBlur = () => {
    // Format the input on blur if valid
    if (isValid && displayValue) {
      const parsedSeconds = parseTimeToSeconds(displayValue);
      setDisplayValue(formatTime(parsedSeconds));
    }
  };

  const adjustTime = (delta: number) => {
    const currentSeconds = seconds || 0;
    const newSeconds = Math.max(0, currentSeconds + delta);
    onChange(newSeconds);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-3 text-xl text-center border rounded-lg focus:ring-2 focus:ring-[#8B9A5B] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 ${
            isValid 
              ? 'border-[#E8D7C3]' 
              : 'border-red-300 bg-red-50'
          } ${className}`}
        />
        {!isValid && (
          <div className="absolute -bottom-5 left-0 text-xs text-red-600">
            Use MM:SS format (e.g., 2:30)
          </div>
        )}
      </div>

      {!disabled && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => adjustTime(-30)}
            className="px-3 py-1 bg-[#2C2C2C]/10 text-[#2C2C2C] rounded font-medium hover:bg-[#2C2C2C]/20"
          >
            -30s
          </button>
          <button
            onClick={() => adjustTime(30)}
            className="px-3 py-1 bg-[#8B9A5B]/20 text-[#6B7A4B] rounded font-medium hover:bg-[#8B9A5B]/30"
          >
            +30s
          </button>
        </div>
      )}

      <div className="text-xs text-[#2C2C2C]/60 text-center">
        Enter time as MM:SS (e.g., 2:30 for 2 minutes 30 seconds)
      </div>
    </div>
  );
};

export default TimeInput;