import React from 'react';
import { Dumbbell } from 'lucide-react';
import { useParams, useLocation, useRouter } from '@tanstack/react-router';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import DaySelection from './components/DaySelection';
import WorkoutSetup from './components/WorkoutSetup';
import WorkoutTracking from './components/WorkoutTracking';
import WorkoutComplete from './components/WorkoutComplete';

const WorkoutTracker: React.FC = () => {
  const params = useParams({ strict: false });
  const location = useLocation();
  const router = useRouter();
  
  // Determine current phase from route
  const getCurrentPhase = (): WorkoutPhase => {
    const path = location.pathname;
    if (path === '/workout') return 'selection';
    if (path.includes('/track')) return 'tracking';
    if (path.includes('/complete')) return 'complete';
    if (path.includes('/workout/')) return 'setup';
    return 'selection';
  };
  
  // Extract day from URL params
  const selectedDay = (params as any)?.day as WorkoutDay | null;
  const currentPhase = getCurrentPhase();
  
  const {
    // State  
    currentSession,
    currentExerciseIndex,
    exerciseSetProgress,
    
    // Data
    workoutTemplate,
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
    
    // Loading states
    isLoadingTemplate,
  } = useWorkoutSession(selectedDay, currentPhase);
  
  // Route protection: redirect to setup if trying to access tracking without an active session
  React.useEffect(() => {
    if (currentPhase === 'tracking' && selectedDay && !currentSession && !isLoadingTemplate) {
      // No active session found, redirect to setup
      router.navigate({ to: `/workout/${selectedDay}` });
    }
  }, [currentPhase, selectedDay, currentSession, isLoadingTemplate, router]);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/20 p-4 sm:p-6">

      {currentPhase === 'selection' && (
        <DaySelection
          workoutTemplate={workoutTemplate}
          dayTitles={dayTitles}
          getLastWorkout={getLastWorkout}
          onSelectDay={selectDay}
        />
      )}

      {currentPhase === 'setup' && selectedDay && currentSession && (
        <WorkoutSetup
          selectedDay={selectedDay}
          currentSession={currentSession}
          workoutTemplate={workoutTemplate}
          dayTitles={dayTitles}
          getLastWorkout={getLastWorkout}
          suggestNextWeight={suggestNextWeight}
          onGoBack={goBack}
          onStartWorkout={startWorkout}
          onUpdateSession={updateSession}
          isLoadingTemplate={isLoadingTemplate}
        />
      )}

      {currentPhase === 'tracking' && currentSession && selectedDay && (
        <WorkoutTracking
          currentSession={currentSession}
          currentExerciseIndex={currentExerciseIndex}
          exerciseSetProgress={exerciseSetProgress}
          workoutTemplate={workoutTemplate}
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