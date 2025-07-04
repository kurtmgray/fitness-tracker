import React, { useMemo, useState } from 'react';
import { Dumbbell, Play, ArrowLeft, CheckCircle, Trophy } from 'lucide-react';
import { generateMockData } from '../utils/workoutMocks';

const WorkoutTracker: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<WorkoutPhase>('selection');
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(
    null
  );
  const mockData = useMemo(() => generateMockData(), []);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>(
    mockData.flatMap((week) => week.workouts)
  );
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [exerciseSetProgress, setExerciseSetProgress] = useState<
    Record<number, number>
  >({});

  const workoutTemplates: Record<WorkoutDay, ExerciseTemplate[]> = {
    day1: [
      { name: 'Barbell Back Squat', sets: 4, reps: '6', weightType: 'barbell' },
      {
        name: 'Barbell Romanian Deadlift',
        sets: 3,
        reps: '8-10',
        weightType: 'barbell',
      },
      { name: 'Russian Twist', sets: 3, reps: '15', weightType: 'kettlebell' },
      {
        name: 'Dumbbell Overhead Press',
        sets: 3,
        reps: '6-8',
        weightType: 'dumbbell',
      },
      {
        name: 'Pull-Ups with Bands',
        sets: 3,
        reps: '6-8',
        weightType: 'bodyweight',
      },
      {
        name: 'Bear Pos w/ Sliding Weight',
        sets: 3,
        reps: '10x2',
        weightType: 'plate',
      },
    ],
    day2: [
      { name: 'Barbell Deadlift', sets: 4, reps: '5', weightType: 'barbell' },
      {
        name: 'Dumbbell Incline Press',
        sets: 3,
        reps: '6-8',
        weightType: 'dumbbell',
      },
      {
        name: 'Deficit Pushups',
        sets: 2,
        reps: 'Failure',
        weightType: 'bodyweight',
        isFailure: true,
      },
      {
        name: 'Bulgarian Split Squats',
        sets: 3,
        reps: '8 per leg',
        weightType: 'kettlebell',
      },
      {
        name: "Farmer's Carry",
        sets: 3,
        reps: '40 yards',
        weightType: 'kettlebell',
        isTimeBased: true,
      },
      {
        name: 'Glute Bridge Pullover',
        sets: 3,
        reps: '20',
        weightType: 'plate',
      },
    ],
    day3: [
      {
        name: 'Goblet Squat (Pause)',
        sets: 3,
        reps: '6-8',
        weightType: 'kettlebell',
        hasBosoBallOption: true,
      },
      {
        name: 'Barbell Bench Press',
        sets: 4,
        reps: '6',
        weightType: 'barbell',
      },
      {
        name: 'Dumbbell Lateral Raises',
        sets: 3,
        reps: '15',
        weightType: 'dumbbell',
      },
      {
        name: 'KB Halo / Chop',
        sets: 3,
        reps: '10x2',
        weightType: 'kettlebell',
      },
      {
        name: 'Chest Supported DB Rows',
        sets: 3,
        reps: '12',
        weightType: 'dumbbell',
      },
      { name: 'Palloff Press', sets: 3, reps: '10x2', weightType: 'band' },
    ],
  };

  const dayTitles: Record<WorkoutDay, string> = {
    day1: 'Pull & Lower Focus',
    day2: 'Push & Functional Focus',
    day3: 'Balanced Hypertrophy & Stability',
  };

  const getLastWorkout = (day: WorkoutDay): WorkoutSession | null => {
    return (
      workoutHistory
        .filter((session) => session.day === day)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0] || null
    );
  };

  const suggestNextWeight = (
    lastWeight: number,
    lastRpe: number,
    weightType: string
  ): number => {
    let factor: number;

    if (lastRpe <= 6) {
      factor = 1.075;
    } else if (lastRpe <= 7) {
      factor = 1.05;
    } else if (lastRpe <= 8.5) {
      factor = 1.0;
    } else if (lastRpe <= 9) {
      factor = 0.975;
    } else {
      factor = 0.925;
    }

    const suggested = lastWeight * factor;
    const maxIncrease = Math.min(lastWeight * 1.1, lastWeight + 10);
    const minDecrease = Math.max(lastWeight * 0.9, lastWeight - 10);

    let adjusted =
      suggested > lastWeight
        ? Math.min(suggested, maxIncrease)
        : Math.max(suggested, minDecrease);

    if (weightType === 'barbell') {
      return Math.round(adjusted / 5) * 5;
    } else if (weightType === 'dumbbell' || weightType === 'kettlebell') {
      return Math.round(adjusted / 2.5) * 2.5;
    } else {
      return lastWeight;
    }
  };

  const initializeSession = (day: WorkoutDay): void => {
    const template = workoutTemplates[day];
    const lastWorkout = getLastWorkout(day);

    const exercises: ExerciseEntry[] = template.map((exercise) => {
      const lastExercise = lastWorkout?.exercises.find(
        (ex) => ex.exerciseName === exercise.name
      );
      const suggestedWeight = (() => {
        if (!lastExercise) return 0;

        const completedSets = lastExercise.sets.filter(
          (s) => s.completed && typeof s.weight === 'number'
        );
        if (completedSets.length === 0)
          return lastExercise.sets[0]?.weight ?? 0;

        const avgRpe =
          completedSets.reduce((sum, s) => sum + (s.rpe ?? 8), 0) /
          completedSets.length;
        return suggestNextWeight(
          Number(completedSets[0].weight),
          avgRpe,
          exercise.weightType
        );
      })();

      return {
        exerciseName: exercise.name,
        sets: Array(exercise.sets)
          .fill(null)
          .map(() => ({
            weight: suggestedWeight,
            reps: parseInt(exercise.reps) || 0,
            completed: false,
          })),
        useBosoBall: lastExercise?.useBosoBall || false,
        bandType: lastExercise?.bandType || '',
        notes: '',
      };
    });

    const session: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date(),
      day,
      exercises,
    };

    setCurrentSession(session);
  };

  const selectDay = (day: WorkoutDay): void => {
    setSelectedDay(day);
    initializeSession(day);
    setCurrentPhase('setup');
  };

  const startWorkout = (): void => {
    setCurrentPhase('tracking');
    setCurrentExerciseIndex(0);
    setCurrentSetIndex(0);

    const initialProgress: Record<number, number> = {};
    workoutTemplates[selectedDay!].forEach((_, idx) => {
      initialProgress[idx] = 0;
    });
    setExerciseSetProgress(initialProgress);
  };

  const completeSet = (weight: number, reps: number, rpe?: number): void => {
    if (!currentSession) return;

    const updatedSession = { ...currentSession };
    const currentSetForExercise =
      exerciseSetProgress[currentExerciseIndex] || 0;

    updatedSession.exercises[currentExerciseIndex].sets[currentSetForExercise] =
      {
        weight,
        reps,
        completed: true,
        rpe,
      };

    setCurrentSession(updatedSession);

    const newProgress = { ...exerciseSetProgress };
    newProgress[currentExerciseIndex] = currentSetForExercise + 1;
    setExerciseSetProgress(newProgress);

    const nextExerciseIndex =
      (currentExerciseIndex + 1) % updatedSession.exercises.length;
    setCurrentExerciseIndex(nextExerciseIndex);

    const isWorkoutComplete = updatedSession.exercises.every(
      (exercise, idx) => {
        const setsCompleted = newProgress[idx] || 0;
        return setsCompleted >= exercise.sets.length;
      }
    );

    if (isWorkoutComplete) {
      setCurrentPhase('complete');
      setWorkoutHistory((prev) => [...prev, updatedSession]);
    }
  };

  const goBack = (): void => {
    if (currentPhase === 'setup') {
      setCurrentPhase('selection');
      setSelectedDay(null);
      setCurrentSession(null);
    } else if (currentPhase === 'tracking') {
      setCurrentPhase('setup');
      setCurrentExerciseIndex(0);
      setCurrentSetIndex(0);
      setExerciseSetProgress({});
    }
  };

  const ExerciseSetupCard: React.FC<{
    exercise: ExerciseTemplate;
    currentExercise: ExerciseEntry;
    lastExercise?: ExerciseEntry;
    suggestion?: Suggestion | null;
    onUpdateExercise: (updates: Partial<ExerciseEntry>) => void;
  }> = ({
    exercise,
    currentExercise,
    lastExercise,
    suggestion,
    onUpdateExercise,
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div
          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-gray-800 flex items-center">
                {exercise.name}
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </h4>
              <p className="text-sm text-gray-600">
                {exercise.sets} sets × {exercise.reps} reps
              </p>

              {suggestion && (
                <p className="text-sm text-muted-foreground mt-1">
                  💡 Suggested: {suggestion.suggestedWeight} lbs (based on{' '}
                  {suggestion.lastWeight} lbs @ RPE{' '}
                  {suggestion.avgRpe.toFixed(1)})
                </p>
              )}

              {currentExercise.useBosoBall && (
                <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium mt-1">
                  Using Bosu Ball
                </span>
              )}
            </div>
            {lastExercise && !isExpanded && (
              <div className="text-right text-sm text-gray-500">
                <div>Last: {lastExercise.sets[0]?.weight || 0} lbs</div>
                <div>{lastExercise.sets[0]?.reps || 0} reps</div>
              </div>
            )}
          </div>

          {!isExpanded && (
            <div className="grid grid-cols-4 gap-2 text-sm mt-3">
              {currentExercise.sets.map((set, setIdx) => (
                <div
                  key={setIdx}
                  className="text-center p-2 bg-gray-50 rounded"
                >
                  <div className="font-medium">Set {setIdx + 1}</div>
                  <div>{set.weight} lbs</div>
                  <div>{set.reps} reps</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            {exercise.hasBosoBallOption && (
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={currentExercise.useBosoBall}
                    onChange={(e) =>
                      onUpdateExercise({ useBosoBall: e.target.checked })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Use Bosu Ball</span>
                </label>
              </div>
            )}

            <div className="space-y-3">
              <h5 className="font-medium text-gray-800">Adjust Sets:</h5>
              {currentExercise.sets.map((set, setIdx) => (
                <div
                  key={setIdx}
                  className="bg-white rounded-lg p-3 border border-gray-200"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Set {setIdx + 1} Weight (lbs)
                      </label>
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => {
                          const updatedSets = [...currentExercise.sets];
                          updatedSets[setIdx] = {
                            ...updatedSets[setIdx],
                            weight: Number(e.target.value),
                          };
                          onUpdateExercise({ sets: updatedSets });
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Target Reps
                      </label>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => {
                          const updatedSets = [...currentExercise.sets];
                          updatedSets[setIdx] = {
                            ...updatedSets[setIdx],
                            reps: Number(e.target.value),
                          };
                          onUpdateExercise({ sets: updatedSets });
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDaySelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-slate-800 mb-4">
          Select Your Workout
        </h2>
        <p className="text-lg text-slate-600">
          Choose which day you're training today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(workoutTemplates) as WorkoutDay[]).map((day) => {
          const template = workoutTemplates[day];
          const lastWorkout = getLastWorkout(day);
          const daysSince = lastWorkout
            ? Math.floor(
                (new Date().getTime() - new Date(lastWorkout.date).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : null;

          return (
            <div
              key={day}
              onClick={() => selectDay(day)}
              className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-medium group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600">
                  Day {day.slice(-1)}: {dayTitles[day]}
                </h3>
                {lastWorkout && (
                  <span className="text-sm text-gray-500">
                    {daysSince === 0
                      ? 'Today'
                      : daysSince === 1
                      ? 'Yesterday'
                      : `${daysSince} days ago`}
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4 flex-1">
                {template.slice(0, 6).map((exercise, idx) => (
                  <div key={idx} className="text-sm text-gray-600">
                    • {exercise.name} ({exercise.sets}x{exercise.reps})
                  </div>
                ))}
                {template.length > 6 && (
                  <div className="text-sm text-gray-500">
                    + {template.length - 4} more exercises
                  </div>
                )}
              </div>

              <div className="flex justify-center items-center mt-auto">
                {template.length > 6 && (
                  <span className="text-sm font-medium text-blue-600">
                    {template.length} exercises
                  </span>
                )}
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium group-hover:bg-blue-600 transition-colors">
                  Start Workout
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSetup = () => {
    if (!currentSession || !selectedDay) return null;

    const template = workoutTemplates[selectedDay];
    const lastWorkout = getLastWorkout(selectedDay);

    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <button
            onClick={goBack}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Day Selection</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-slate-800 mb-2">
            Day {selectedDay.slice(-1)}: {dayTitles[selectedDay]}
          </h2>
          <p className="text-lg text-slate-600">
            Review and adjust your workout plan
          </p>
          {lastWorkout && (
            <p className="text-sm text-gray-500 mt-2">
              Last performed: {new Date(lastWorkout.date).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-6 mb-6 border border-blue-100">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            Today's Workout
          </h3>

          <div className="space-y-4">
            {template.map((exercise, idx) => {
              const lastExercise = lastWorkout?.exercises.find(
                (ex) => ex.exerciseName === exercise.name
              );
              const currentExercise = currentSession.exercises[idx];

              const suggestion = (() => {
                if (!lastExercise) return null;

                const completedSets = lastExercise.sets.filter(
                  (s) => s.completed
                );
                const lastWeight = Number(
                  completedSets[0]?.weight ?? lastExercise.sets[0]?.weight ?? 0
                );
                const avgRpe =
                  completedSets.length > 0
                    ? completedSets.reduce((sum, s) => sum + (s.rpe ?? 8), 0) /
                      completedSets.length
                    : undefined;
                const suggestedWeight =
                  avgRpe !== undefined
                    ? suggestNextWeight(lastWeight, avgRpe, exercise.weightType)
                    : lastWeight;

                return avgRpe !== undefined
                  ? { suggestedWeight, lastWeight, avgRpe }
                  : null;
              })();

              return (
                <ExerciseSetupCard
                  key={idx}
                  exercise={exercise}
                  currentExercise={currentExercise}
                  lastExercise={lastExercise}
                  suggestion={suggestion}
                  onUpdateExercise={(updates) => {
                    const updatedSession = { ...currentSession };
                    Object.assign(updatedSession.exercises[idx], updates);
                    setCurrentSession(updatedSession);
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={startWorkout}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Workout
          </button>
        </div>
      </div>
    );
  };

  const renderTracking = () => {
    if (!currentSession) return null;

    const currentExercise = currentSession.exercises[currentExerciseIndex];
    const currentSetForExercise =
      exerciseSetProgress[currentExerciseIndex] || 0;
    const currentSet = currentExercise.sets[currentSetForExercise];
    const template = workoutTemplates[selectedDay!][currentExerciseIndex];

    const isCurrentExerciseComplete =
      currentSetForExercise >= currentExercise.sets.length;

    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <button
            onClick={goBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Setup</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Exercise {currentExerciseIndex + 1} of{' '}
            {currentSession.exercises.length}
          </h2>
          <h3 className="text-3xl font-bold text-blue-600 mb-2">
            {currentExercise.exerciseName}
          </h3>
          {isCurrentExerciseComplete ? (
            <div className="space-y-2">
              <p className="text-lg text-green-600 font-medium">
                <CheckCircle className="w-5 h-5 mr-1 inline" />
                All sets complete for this exercise!
              </p>
              <p className="text-sm text-gray-600">
                Move to the next exercise or review other exercises
              </p>
            </div>
          ) : (
            <p className="text-lg text-gray-600">
              Set {currentSetForExercise + 1} of {currentExercise.sets.length}
            </p>
          )}
          {currentExercise.useBosoBall && (
            <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
              Using Bosu Ball
            </span>
          )}
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <h4 className="font-medium text-gray-800 mb-3">Workout Progress</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {currentSession.exercises.map((exercise, idx) => {
              const setsCompleted = exerciseSetProgress[idx] || 0;
              const totalSets = exercise.sets.length;
              const isCurrentEx = idx === currentExerciseIndex;

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentExerciseIndex(idx)}
                  className={`p-2 rounded-lg text-xs text-center transition-all ${
                    isCurrentEx
                      ? 'bg-blue-500 text-white border-2 border-blue-600'
                      : setsCompleted >= totalSets
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : setsCompleted > 0
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  <div className="font-medium truncate">
                    {exercise.exerciseName.split(' ')[0]}
                  </div>
                  <div>
                    {setsCompleted}/{totalSets}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {!isCurrentExerciseComplete ? (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={currentSet.weight}
                    onChange={(e) => {
                      const updatedSession = { ...currentSession };
                      updatedSession.exercises[currentExerciseIndex].sets[
                        currentSetForExercise
                      ].weight = Number(e.target.value);
                      setCurrentSession(updatedSession);
                    }}
                    className="w-full px-4 py-3 text-xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="2.5"
                  />
                  <div className="flex justify-center space-x-2 mt-2">
                    <button
                      onClick={() => {
                        const updatedSession = { ...currentSession };
                        updatedSession.exercises[currentExerciseIndex].sets[
                          currentSetForExercise
                        ].weight = Number(currentSet.weight) - 2.5;
                        setCurrentSession(updatedSession);
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded font-medium"
                    >
                      -2.5
                    </button>
                    <button
                      onClick={() => {
                        const updatedSession = { ...currentSession };
                        updatedSession.exercises[currentExerciseIndex].sets[
                          currentSetForExercise
                        ].weight = Number(currentSet.weight) + 2.5;
                        setCurrentSession(updatedSession);
                      }}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded font-medium"
                    >
                      +2.5
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reps{' '}
                    {template.isFailure
                      ? '(to failure)'
                      : `(target: ${template.reps})`}
                  </label>
                  <input
                    type="number"
                    value={currentSet.reps}
                    onChange={(e) => {
                      const updatedSession = { ...currentSession };
                      updatedSession.exercises[currentExerciseIndex].sets[
                        currentSetForExercise
                      ].reps = Number(e.target.value);
                      setCurrentSession(updatedSession);
                    }}
                    className="w-full px-4 py-3 text-xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RPE (1-10, optional)
                  </label>
                  <select
                    value={currentSet.rpe || ''}
                    onChange={(e) => {
                      const updatedSession = { ...currentSession };
                      updatedSession.exercises[currentExerciseIndex].sets[
                        currentSetForExercise
                      ].rpe = e.target.value
                        ? Number(e.target.value)
                        : undefined;
                      setCurrentSession(updatedSession);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select RPE</option>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} -{' '}
                        {num <= 6 ? 'Easy' : num <= 8 ? 'Moderate' : 'Hard'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Set Progress
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {currentExercise.sets.map((set, idx) => (
                      <div
                        key={idx}
                        className={`text-center p-2 rounded text-sm ${
                          idx < currentSetForExercise
                            ? 'bg-green-100 text-green-800'
                            : idx === currentSetForExercise
                            ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <div className="font-medium">Set {idx + 1}</div>
                        {set.completed && (
                          <div className="text-xs">
                            {set.weight} × {set.reps}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() =>
                  completeSet(
                    Number(currentSet.weight),
                    Number(currentSet.reps),
                    currentSet.rpe
                  )
                }
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Set
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-green-600 text-lg font-medium mb-2">
              <CheckCircle className="w-5 h-5 mr-2 inline" />
              {currentExercise.exerciseName} Complete!
            </div>
            <p className="text-green-700 text-sm">
              Select another exercise above or continue with the workout flow
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderComplete = () => (
    <div className="text-center space-y-6">
      <div className="mb-8">
        <div className="mb-4">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Workout Complete!
        </h2>
        <p className="text-lg text-gray-600">
          Great job finishing Day {selectedDay?.slice(-1)}:{' '}
          {selectedDay && dayTitles[selectedDay]}
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Workout Summary
        </h3>
        {currentSession && (
          <div className="space-y-3">
            {currentSession.exercises.map((exercise, idx) => {
              const completedSets = exercise.sets.filter(
                (set) => set.completed
              ).length;
              const totalVolume = exercise.sets.reduce(
                (sum, set) => sum + Number(set.weight) * set.reps,
                0
              );

              return (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-white rounded-lg p-3"
                >
                  <div>
                    <span className="font-medium">{exercise.exerciseName}</span>
                    {exercise.useBosoBall && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Bosu Ball
                      </span>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{completedSets} sets completed</div>
                    <div>{totalVolume} lbs total volume</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <button
          onClick={() => {
            setCurrentPhase('selection');
            setSelectedDay(null);
            setCurrentSession(null);
            setCurrentExerciseIndex(0);
            setCurrentSetIndex(0);
            setExerciseSetProgress({});
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Start Another Workout
        </button>

        <div className="text-sm text-gray-500">
          Workout saved to your training history
        </div>
      </div>
    </div>
  );

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

      {currentPhase === 'selection' && renderDaySelection()}
      {currentPhase === 'setup' && renderSetup()}
      {currentPhase === 'tracking' && renderTracking()}
      {currentPhase === 'complete' && renderComplete()}
    </div>
  );
};

export default WorkoutTracker;
