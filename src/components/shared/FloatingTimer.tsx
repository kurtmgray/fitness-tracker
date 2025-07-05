// import React, { useState } from 'react';
// // import {
// //   Timer,
// //   Play,
// //   Pause,
// //   RotateCcw,
// //   Clock,
// //   Watch,
// //   ChevronUp,
// //   ChevronDown,
// //   Flag,
// //   X
// // } from 'lucide-react';
// // import { useTimer, TimerMode } from './hooks/useTimer';

// interface FloatingTimerProps {
//   isVisible: boolean;
//   onClose?: () => void;
// }

// const FloatingTimer: React.FC<FloatingTimerProps> = ({ isVisible, onClose }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const [countdownInput, setCountdownInput] = useState('60');
//   const {
//     timerState,
//     start,
//     pause,
//     reset,
//     lap,
//     setMode,
//     setCountdownTime,
//     formatTime
//   } = useTimer();

//   if (!isVisible) return null;

//   const handleModeChange = (mode: TimerMode) => {
//     if (mode === 'countdown') {
//       const seconds = parseInt(countdownInput) || 60;
//       setMode(mode, seconds);
//     } else {
//       setMode(mode);
//     }
//     setShowSettings(false);
//   };

//   const handleCountdownSet = () => {
//     const seconds = parseInt(countdownInput) || 60;
//     setCountdownTime(seconds);
//     setShowSettings(false);
//   };

//   // Collapsed floating button
//   if (!isExpanded) {
//     return (
//       <div className="fixed bottom-4 right-4 z-50">
//         <button
//           onClick={() => setIsExpanded(true)}
//           className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//         >
//           <Timer className="w-6 h-6" />
//         </button>
//       </div>
//     );
//   }

//   // Expanded timer widget
//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-80 max-w-[calc(100vw-2rem)]">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center gap-2">
//             <Timer className="w-5 h-5 text-blue-600" />
//             <span className="font-semibold text-gray-800">
//               {timerState.mode === 'stopwatch' ? 'Stopwatch' : 'Countdown'}
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setShowSettings(!showSettings)}
//               className="p-1 hover:bg-gray-100 rounded transition-colors"
//             >
//               <Clock className="w-4 h-4 text-gray-600" />
//             </button>
//             <button
//               onClick={() => setIsExpanded(false)}
//               className="p-1 hover:bg-gray-100 rounded transition-colors"
//             >
//               <ChevronDown className="w-4 h-4 text-gray-600" />
//             </button>
//             {onClose && (
//               <button
//                 onClick={onClose}
//                 className="p-1 hover:bg-gray-100 rounded transition-colors"
//               >
//                 <X className="w-4 h-4 text-gray-600" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Settings Panel */}
//         {showSettings && (
//           <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//             <div className="grid grid-cols-2 gap-2 mb-3">
//               <button
//                 onClick={() => handleModeChange('stopwatch')}
//                 className={`p-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
//                   timerState.mode === 'stopwatch'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 <Watch className="w-4 h-4" />
//                 Stopwatch
//               </button>
//               <button
//                 onClick={() => handleModeChange('countdown')}
//                 className={`p-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
//                   timerState.mode === 'countdown'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 <Clock className="w-4 h-4" />
//                 Countdown
//               </button>
//             </div>

//             {timerState.mode === 'countdown' && (
//               <div className="flex gap-2">
//                 <input
//                   type="number"
//                   value={countdownInput}
//                   onChange={(e) => setCountdownInput(e.target.value)}
//                   placeholder="Seconds"
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   min="1"
//                 />
//                 <button
//                   onClick={handleCountdownSet}
//                   className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
//                 >
//                   Set
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Timer Display */}
//         <div className="text-center mb-4">
//           <div
//             className={`text-4xl font-bold font-mono ${
//               timerState.mode === 'countdown' && timerState.time <= 10 && timerState.time > 0
//                 ? 'text-red-600'
//                 : 'text-gray-800'
//             }`}
//           >
//             {formatTime(timerState.time)}
//           </div>
//           {timerState.mode === 'countdown' && timerState.targetTime && (
//             <div className="text-sm text-gray-500 mt-1">
//               Target: {formatTime(timerState.targetTime)}
//             </div>
//           )}
//         </div>

//         {/* Controls */}
//         <div className="flex items-center justify-center gap-3 mb-4">
//           <button
//             onClick={timerState.isRunning ? pause : start}
//             className={`p-3 rounded-xl text-white font-medium transition-all duration-200 transform hover:scale-105 ${
//               timerState.isRunning
//                 ? 'bg-orange-500 hover:bg-orange-600'
//                 : 'bg-green-500 hover:bg-green-600'
//             }`}
//           >
//             {timerState.isRunning ? (
//               <Pause className="w-5 h-5" />
//             ) : (
//               <Play className="w-5 h-5" />
//             )}
//           </button>

//           <button
//             onClick={reset}
//             className="p-3 rounded-xl bg-gray-500 hover:bg-gray-600 text-white font-medium transition-all duration-200 transform hover:scale-105"
//           >
//             <RotateCcw className="w-5 h-5" />
//           </button>

//           {timerState.mode === 'stopwatch' && (
//             <button
//               onClick={lap}
//               disabled={!timerState.isRunning}
//               className="p-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none"
//             >
//               <Flag className="w-5 h-5" />
//             </button>
//           )}
//         </div>

//         {/* Lap Times */}
//         {timerState.mode === 'stopwatch' && timerState.laps.length > 0 && (
//           <div className="max-h-32 overflow-y-auto">
//             <div className="text-sm font-medium text-gray-700 mb-2">Laps:</div>
//             <div className="space-y-1">
//               {timerState.laps.map((lapTime, index) => (
//                 <div key={index} className="flex justify-between text-sm bg-gray-50 rounded px-2 py-1">
//                   <span>Lap {index + 1}</span>
//                   <span className="font-mono">{formatTime(lapTime)}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Countdown finished alert */}
//         {timerState.mode === 'countdown' && timerState.time === 0 && (
//           <div className="text-center text-red-600 font-semibold">
//             ⏰ Time's Up!
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FloatingTimer;
