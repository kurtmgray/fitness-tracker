import React, { useState, useRef, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Watch,
  ChevronDown,
  Flag,
  X
} from 'lucide-react';
import { useTimer, type TimerMode } from './hooks/useTimer';

interface FloatingTimerProps {
  isVisible: boolean;
  onClose?: () => void;
}

interface DragState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
}

interface ResizeState {
  isResizing: boolean;
  startSize: { width: number; height: number };
  startPos: { x: number; y: number };
}

const FloatingTimer: React.FC<FloatingTimerProps> = ({ isVisible, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [timerInput, setTimerInput] = useState('120');
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 320, height: 'auto' as const });
  const [dragState, setDragState] = useState<DragState>({ isDragging: false, dragOffset: { x: 0, y: 0 } });
  const [resizeState, setResizeState] = useState<ResizeState>({ 
    isResizing: false, 
    startSize: { width: 320, height: 0 }, 
    startPos: { x: 0, y: 0 } 
  });
  
  const timerRef = useRef<HTMLDivElement>(null);
  const {
    timerState,
    start,
    pause,
    reset,
    lap,
    setMode,
    setCountdownTime,
    formatTime
  } = useTimer();

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging) {
        setPosition({
          x: e.clientX - dragState.dragOffset.x,
          y: e.clientY - dragState.dragOffset.y
        });
      }
      
      if (resizeState.isResizing) {
        const deltaX = e.clientX - resizeState.startPos.x;
        const newWidth = Math.max(280, resizeState.startSize.width + deltaX);
        setSize(prev => ({ ...prev, width: newWidth }));
      }
    };

    const handleMouseUp = () => {
      setDragState(prev => ({ ...prev, isDragging: false }));
      setResizeState(prev => ({ ...prev, isResizing: false }));
    };

    if (dragState.isDragging || resizeState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, resizeState]);

  const handleDragStart = (e: React.MouseEvent) => {
    if (timerRef.current) {
      const rect = timerRef.current.getBoundingClientRect();
      setDragState({
        isDragging: true,
        dragOffset: {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
      });
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizeState({
      isResizing: true,
      startSize: { width: size.width, height: 0 },
      startPos: { x: e.clientX, y: e.clientY }
    });
  };

  if (!isVisible) return null;

  const handleModeChange = (mode: TimerMode) => {
    if (mode === 'timer') {
      const seconds = parseInt(timerInput) || 120;
      setMode(mode, seconds);
    } else {
      setMode(mode);
    }
    setShowSettings(false);
  };

  const handleTimerSet = (seconds: number) => {
    setCountdownTime(seconds);
  };

  // Collapsed floating button
  if (!isExpanded) {
    return (
      <div 
        ref={timerRef}
        className="fixed z-[9999] cursor-move"
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleDragStart}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
          className="bg-[#8B9A5B] hover:bg-[#6B7A4B] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 pointer-events-auto"
        >
          <Timer className="w-6 h-6" />
        </button>
      </div>
    );
  }

  // Expanded timer widget
  return (
    <div 
      ref={timerRef}
      className="fixed z-[9999] pointer-events-auto"
      style={{ 
        left: position.x, 
        top: position.y,
        width: size.width
      }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#E8D7C3] overflow-hidden">
        {/* Draggable Header */}
        <div 
          className="flex items-center justify-between p-4 cursor-move bg-gradient-to-r from-[#F0E6D6] to-[#E8D7C3] border-b border-[#E8D7C3]"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-[#8B9A5B]" />
            <span className="font-semibold text-[#2C2C2C]">
              {timerState.mode === 'stopwatch' ? 'Stopwatch' : 'Timer'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(!showSettings);
              }}
              className="p-1 hover:bg-[#E8D7C3] rounded transition-colors"
            >
              <Clock className="w-4 h-4 text-[#2C2C2C]/60" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="p-1 hover:bg-[#E8D7C3] rounded transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-[#2C2C2C]/60" />
            </button>
            {onClose && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1 hover:bg-[#E8D7C3] rounded transition-colors"
              >
                <X className="w-4 h-4 text-[#2C2C2C]/60" />
              </button>
            )}
          </div>
        </div>

        <div className="p-4">
          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-4 p-3 bg-[#FAF7F2] rounded-lg border border-[#E8D7C3]">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => handleModeChange('stopwatch')}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    timerState.mode === 'stopwatch'
                      ? 'bg-[#8B9A5B] text-white'
                      : 'bg-[#E8D7C3] text-[#2C2C2C] hover:bg-[#F0E6D6]'
                  }`}
                >
                  <Watch className="w-4 h-4" />
                  Stopwatch
                </button>
                <button
                  onClick={() => handleModeChange('timer')}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    timerState.mode === 'timer'
                      ? 'bg-[#8B9A5B] text-white'
                      : 'bg-[#E8D7C3] text-[#2C2C2C] hover:bg-[#F0E6D6]'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Timer
                </button>
              </div>

            </div>
          )}

          {/* Timer Display */}
          <div className="text-center mb-4">
            {timerState.mode === 'timer' ? (
              <input
                type="text"
                value={formatTime(timerState.time)}
                onChange={(e) => {
                  const value = e.target.value;
                  // Parse MM:SS format
                  const parts = value.split(':');
                  if (parts.length === 2) {
                    const minutes = parseInt(parts[0]) || 0;
                    const seconds = parseInt(parts[1]) || 0;
                    const totalSeconds = minutes * 60 + seconds;
                    if (totalSeconds > 0) {
                      handleTimerSet(totalSeconds);
                    }
                  }
                }}
                className={`text-4xl font-bold font-mono text-center bg-transparent border-none outline-none w-full ${
                  timerState.time <= 10 && timerState.time > 0
                    ? 'text-red-600'
                    : 'text-[#2C2C2C]'
                }`}
                style={{ caretColor: 'transparent' }}
              />
            ) : (
              <div className="text-4xl font-bold font-mono text-[#2C2C2C]">
                {formatTime(timerState.time)}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={timerState.isRunning ? pause : start}
              className={`p-3 rounded-xl text-white font-medium transition-all duration-200 transform hover:scale-105 ${
                timerState.isRunning
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : 'bg-[#8B9A5B] hover:bg-[#6B7A4B]'
              }`}
            >
              {timerState.isRunning ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={reset}
              className="p-3 rounded-xl bg-[#2C2C2C] hover:bg-[#2C2C2C]/80 text-white font-medium transition-all duration-200 transform hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {timerState.mode === 'stopwatch' && (
              <button
                onClick={lap}
                disabled={!timerState.isRunning}
                className="p-3 rounded-xl bg-[#8B9A5B] hover:bg-[#6B7A4B] disabled:bg-[#E8D7C3] disabled:cursor-not-allowed text-white font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              >
                <Flag className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Lap Times */}
          {timerState.mode === 'stopwatch' && timerState.laps.length > 0 && (
            <div className="max-h-32 overflow-y-auto">
              <div className="text-sm font-medium text-[#2C2C2C] mb-2">Laps:</div>
              <div className="space-y-1">
                {timerState.laps.map((lapTime, index) => (
                  <div key={index} className="flex justify-between text-sm bg-[#FAF7F2] rounded px-2 py-1 border border-[#E8D7C3]">
                    <span>Lap {index + 1}</span>
                    <span className="font-mono">{formatTime(lapTime)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timer finished alert */}
          {timerState.mode === 'timer' && timerState.time === 0 && (
            <div className="text-center text-red-600 font-semibold">
              ⏰ Time's Up!
            </div>
          )}
        </div>

        {/* Resize Handle */}
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-[#E8D7C3] hover:bg-[#8B9A5B] transition-colors"
          onMouseDown={handleResizeStart}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-[#2C2C2C]/40"></div>
        </div>
      </div>
    </div>
  );
};

export default FloatingTimer;