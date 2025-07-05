import { useState, useEffect, useRef } from 'react';

export type TimerMode = 'stopwatch' | 'timer';

export interface TimerState {
  time: number; // seconds
  isRunning: boolean;
  mode: TimerMode;
  targetTime?: number; // for countdown mode
  laps: number[];
}

export const useTimer = () => {
  const [timerState, setTimerState] = useState<TimerState>({
    time: 120, // 2 minutes default
    isRunning: false,
    mode: 'timer',
    targetTime: 120,
    laps: [],
  });

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          if (prev.mode === 'stopwatch') {
            return { ...prev, time: prev.time + 1 };
          } else {
            // Timer mode
            const newTime = prev.time - 1;
            if (newTime <= 0) {
              // Timer finished
              return { ...prev, time: 0, isRunning: false };
            }
            return { ...prev, time: newTime };
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.mode]);

  const start = () => {
    setTimerState(prev => ({ ...prev, isRunning: true }));
  };

  const pause = () => {
    setTimerState(prev => ({ ...prev, isRunning: false }));
  };

  const reset = () => {
    setTimerState(prev => ({
      ...prev,
      time: prev.mode === 'timer' ? prev.targetTime || 0 : 0,
      isRunning: false,
      laps: [],
    }));
  };

  const lap = () => {
    if (timerState.mode === 'stopwatch') {
      setTimerState(prev => ({
        ...prev,
        laps: [...prev.laps, prev.time],
      }));
    }
  };

  const setMode = (mode: TimerMode, targetTime?: number) => {
    setTimerState(prev => ({
      ...prev,
      mode,
      targetTime,
      time: mode === 'timer' ? targetTime || 0 : 0,
      isRunning: false,
      laps: [],
    }));
  };

  const setCountdownTime = (seconds: number) => {
    setTimerState(prev => ({
      ...prev,
      targetTime: seconds,
      time: seconds,
      isRunning: false,
    }));
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timerState,
    start,
    pause,
    reset,
    lap,
    setMode,
    setCountdownTime,
    formatTime,
  };
};