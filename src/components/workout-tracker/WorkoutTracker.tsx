import React from 'react';
import { Dumbbell } from 'lucide-react';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import DaySelection from './components/DaySelection';
import WorkoutSetup from './components/WorkoutSetup';
import WorkoutTracking from './components/WorkoutTracking';
import WorkoutComplete from './components/WorkoutComplete';

const WorkoutTracker: React.FC = () => {
  const {
    // State
    currentPhase,
    selectedDay,
    currentSession,
    currentExerciseIndex,
    exerciseSetProgress,
    
    // Data
    workoutTemplates,
    dayTitles,
    
    // Actions
    selectDay,
    startWorkout,
    resetSession,
    updateSession,
    completeSet,
    goBack,
    setCurrentExerciseIndex,
    
    // Helpers
    getLastWorkout,
    suggestNextWeight,
  } = useWorkoutSession();

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/20 p-4 sm:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center mb-2 sm:mb-4">
          <Dumbbell className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 mr-3" />
          <h1 className="text-2xl sm:text-4xl font-semibold text-slate-800">
            Workout Tracker
          </h1>
        </div>
        <p className="text-base sm:text-lg text-slate-600">
          Track your training sessions and monitor your progress
        </p>
      </div>

      {currentPhase === 'selection' && (
        <DaySelection
          workoutTemplates={workoutTemplates}
          dayTitles={dayTitles}
          getLastWorkout={getLastWorkout}
          onSelectDay={selectDay}
        />
      )}

      {currentPhase === 'setup' && selectedDay && currentSession && (
        <WorkoutSetup
          selectedDay={selectedDay}
          currentSession={currentSession}
          workoutTemplates={workoutTemplates}
          dayTitles={dayTitles}
          getLastWorkout={getLastWorkout}
          suggestNextWeight={suggestNextWeight}
          onGoBack={goBack}
          onStartWorkout={startWorkout}
          onUpdateSession={updateSession}
        />
      )}

      {currentPhase === 'tracking' && currentSession && selectedDay && (
        <WorkoutTracking
          currentSession={currentSession}
          currentExerciseIndex={currentExerciseIndex}
          exerciseSetProgress={exerciseSetProgress}
          workoutTemplates={workoutTemplates}
          selectedDay={selectedDay}
          onUpdateSession={updateSession}
          onCompleteSet={completeSet}
          onGoBack={goBack}
          onSetCurrentExerciseIndex={setCurrentExerciseIndex}
        />
      )}

      {currentPhase === 'complete' && currentSession && selectedDay && (
        <WorkoutComplete
          currentSession={currentSession}
          selectedDay={selectedDay}
          dayTitles={dayTitles}
          onStartAnother={resetSession}
        />
      )}
    </div>
  );
};

export default WorkoutTracker;