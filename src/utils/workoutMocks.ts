
import { loadWorkoutDataToLocalStorage, getWorkoutDataFromLocalStorage } from './loadWorkoutData';

export const generateMockData = (): WeekData[] => {
  // First try to load real workout data from localStorage
  const realData = getWorkoutDataFromLocalStorage();
  
  if (realData && realData.length > 0) {
    console.log(`Using ${realData.length} weeks of real workout data from localStorage`);
    return realData;
  }
  
  // If no real data exists, load it from JSON and return it
  const loadedData = loadWorkoutDataToLocalStorage();
  if (loadedData && loadedData.length > 0) {
    console.log(`Loaded and using ${loadedData.length} weeks of real workout data`);
    return loadedData;
  }
  
  // Fallback to generated mock data if real data fails to load
  console.log('Falling back to generated mock data');
  return generateFallbackMockData();
};

const generateFallbackMockData = (): WeekData[] => {
  const weeks: WeekData[] = [];
  const today = new Date();

  for (let weekOffset = 0; weekOffset < 8; weekOffset++) {
    const weekStart = new Date(today);
    weekStart.setDate(
      today.getDate() - (today.getDay() - 1) - weekOffset * 7
    );
    weekStart.setHours(0, 0, 0, 0);

    const workouts: WorkoutSession[] = [];

    const workoutsThisWeek = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < workoutsThisWeek; i++) {
      const workoutDate = new Date(weekStart);
      workoutDate.setDate(
        weekStart.getDate() + Math.floor(Math.random() * 7)
      );

      const dayTypes: WorkoutDay[] = ['day1', 'day2', 'day3'];
      const randomDay = dayTypes[Math.floor(Math.random() * dayTypes.length)];

      const exercises: ExerciseEntry[] = getExercisesForDay(
        randomDay,
        weekOffset
      );

      workouts.push({
        id: `workout-${weekOffset}-${i}`,
        date: workoutDate,
        day: randomDay,
        exercises,
        duration: Math.floor(Math.random() * 30) + 45,
        notes: Math.random() > 0.7 ? getRandomNote() : undefined,
      });
    }

    workouts.sort((a, b) => a.date.getTime() - b.date.getTime());

    weeks.push({
      weekStartDate: weekStart,
      workouts,
    });
  }

  return weeks;
};

const getExercisesForDay = (
    day: WorkoutDay,
    weekOffset: number
  ): ExerciseEntry[] => {
    const baseWeight = (weekNum: number) => Math.max(0, 200 - weekNum * 5);

    const exerciseTemplates = {
      day1: [
        {
          name: 'Barbell Back Squat',
          sets: 4,
          baseWeight: baseWeight(weekOffset),
        },
        {
          name: 'Barbell Romanian Deadlift',
          sets: 3,
          baseWeight: baseWeight(weekOffset) - 20,
        },
        { name: 'Russian Twist', sets: 3, baseWeight: 44 },
        { name: 'Dumbbell Overhead Press', sets: 3, baseWeight: 45 },
        { name: 'Pull-Ups with Bands', sets: 3, baseWeight: 0 },
        { name: 'Bear Pos w/ Sliding Weight', sets: 3, baseWeight: 35 },
      ],
      day2: [
        {
          name: 'Barbell Deadlift',
          sets: 4,
          baseWeight: baseWeight(weekOffset) + 30,
        },
        { name: 'Dumbbell Incline Press', sets: 3, baseWeight: 50 },
        { name: 'Deficit Pushups', sets: 2, baseWeight: 0 },
        { name: 'Bulgarian Split Squats', sets: 3, baseWeight: 25 },
        { name: "Farmer's Carry", sets: 3, baseWeight: 53 },
        { name: 'Glute Bridge Pullover', sets: 3, baseWeight: 44 },
      ],
      day3: [
        { name: 'Goblet Squat (Pause)', sets: 3, baseWeight: 44 },
        {
          name: 'Barbell Bench Press',
          sets: 4,
          baseWeight: baseWeight(weekOffset) - 25,
        },
        { name: 'Dumbbell Lateral Raises', sets: 3, baseWeight: 20 },
        { name: 'KB Halo / Chop', sets: 3, baseWeight: 44 },
        { name: 'Chest Supported DB Rows', sets: 3, baseWeight: 53 },
        { name: 'Palloff Press', sets: 3, baseWeight: 0 },
      ],
    };

    return exerciseTemplates[day].map((template) => ({
      exerciseName: template.name,
      sets: Array(template.sets)
        .fill(null)
        .map(() => ({
          weight: template.baseWeight + Math.floor(Math.random() * 10 - 5),
          reps: Math.floor(Math.random() * 3) + 6,
          completed: true,
          rpe:
            Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 7 : undefined,
        })),
      useBosoBall: template.name.includes('Goblet')
        ? Math.random() > 0.5
        : false,
      notes: Math.random() > 0.8 ? 'Felt strong today' : undefined,
    }));
  };

  const getRandomNote = (): string => {
    const notes = [
      'Great workout, felt strong!',
      'Lower back a bit tight',
      'New PR on deadlifts!',
      'Form felt dialed in today',
      'Shoulders feeling good',
      'Tired but pushed through',
      'Best squat session yet',
      'Need more sleep',
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  };