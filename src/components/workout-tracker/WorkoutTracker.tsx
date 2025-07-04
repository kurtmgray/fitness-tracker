import React from 'react';
import { Dumbbell } from 'lucide-react';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import WorkoutDaySelector from './components/WorkoutDaySelector';
import WorkoutSetup from './components/WorkoutSetup';
import WorkoutTracking from './components/WorkoutTracking';
import WorkoutComplete from './components/WorkoutComplete';

const WorkoutTracker: React.FC = () => {
  const {
    currentPhase,
    selectedDay,
    currentSession,
    currentExerciseIndex,
    currentSetIndex,
    exerciseSetProgress,
    workoutTemplates,
    dayTitles,
    selectDay,
    startWorkout,
    resetSession,
    updateCurrentSet,
    nextSet,
    setCurrentPhase,
    getLastWorkout,
  } = useWorkoutSession();

  const renderContent = () => {
    switch (currentPhase) {
      case 'selection':
        return (
          <WorkoutDaySelector
            dayTitles={dayTitles}
            workoutTemplates={workoutTemplates}
            getLastWorkout={getLastWorkout}
            onSelectDay={selectDay}
          />
        );

      case 'setup':
        if (!selectedDay || !currentSession) return null;
        return (
          <WorkoutSetup
            selectedDay={selectedDay}
            dayTitles={dayTitles}
            currentSession={currentSession}
            getLastWorkout={getLastWorkout}
            onStartWorkout={startWorkout}
            onGoBack={() => setCurrentPhase('selection')}
          />
        );

      case 'tracking':
        if (!currentSession) return null;
        return (
          <WorkoutTracking
            currentSession={currentSession}
            currentExerciseIndex={currentExerciseIndex}
            currentSetIndex={currentSetIndex}
            exerciseSetProgress={exerciseSetProgress}
            onUpdateSet={updateCurrentSet}
            onNextSet={nextSet}
            onGoBack={() => setCurrentPhase('setup')}
          />
        );

      case 'complete':
        if (!currentSession) return null;
        return (
          <WorkoutComplete
            currentSession={currentSession}
            dayTitles={dayTitles}
            onStartAnother={resetSession}
          />
        );

      default:
        return null;
    }
  };

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

      {renderContent()}
    </div>
  );
};

export default WorkoutTracker;