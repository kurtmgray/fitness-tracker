import React from 'react';
import { formatTime, formatTimeVerbose } from '@/utils/timeUtils';

interface TimeDisplayProps {
  seconds: number | null;
  format?: 'mm:ss' | 'verbose';
  showSeconds?: boolean;
  className?: string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  seconds,
  format = 'mm:ss',
  showSeconds = true,
  className = '',
}) => {
  if (seconds === null || seconds === undefined) {
    return <span className={className}>--:--</span>;
  }

  const displayText = format === 'verbose' 
    ? formatTimeVerbose(seconds)
    : formatTime(seconds);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
};

export default TimeDisplay;