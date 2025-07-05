import workoutData from '../data/workoutData.json';

// Function to get the Monday of the week for any given date
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const reorganizeWorkoutsByDate = (inputData?: any[]) => {
  // Use provided data or fall back to imported data
  const dataToUse = inputData || workoutData;
  
  // First, collect all workouts from all weeks
  const allWorkouts: any[] = [];
  
  dataToUse.forEach(week => {
    week.workouts.forEach(workout => {
      allWorkouts.push({
        ...workout,
        date: new Date(workout.date),
        day: workout.day as WorkoutDay
      });
    });
  });

  // Group workouts by their actual week start dates
  const workoutsByWeek = new Map<string, any[]>();
  
  allWorkouts.forEach(workout => {
    const weekStart = getWeekStart(workout.date);
    const weekKey = weekStart.toISOString();
    
    if (!workoutsByWeek.has(weekKey)) {
      workoutsByWeek.set(weekKey, []);
    }
    workoutsByWeek.get(weekKey)!.push(workout);
  });

  // Convert map to array and sort by date
  const reorganizedData: WeekData[] = Array.from(workoutsByWeek.entries())
    .map(([weekStartStr, workouts]) => ({
      weekStartDate: new Date(weekStartStr),
      workouts: workouts.sort((a, b) => a.date.getTime() - b.date.getTime())
    }))
    .sort((a, b) => b.weekStartDate.getTime() - a.weekStartDate.getTime()); // Most recent first

  return reorganizedData;
};

// Using global types from types.d.ts