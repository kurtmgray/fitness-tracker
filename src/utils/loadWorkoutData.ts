import { reorganizeWorkoutsByDate } from './reorganizeWorkouts';
import { getTransformedWorkoutData } from './transformWorkoutData';

export const loadWorkoutDataToLocalStorage = (): WeekData[] | null => {
  try {
    // Get transformed workout data with proper equipment structure
    const transformedData = getTransformedWorkoutData();
    
    // Reorganize workouts by their actual dates into correct weeks
    const processedData = reorganizeWorkoutsByDate(transformedData);

    localStorage.setItem('workoutHistory', JSON.stringify(processedData));
    console.log(`Loaded ${processedData.length} weeks of properly organized workout data to localStorage`);
    
    return processedData;
  } catch (error) {
    console.error('Error loading workout data to localStorage:', error);
    return null;
  }
};

export const getWorkoutDataFromLocalStorage = (): WeekData[] | null => {
  try {
    const data = localStorage.getItem('workoutHistory');
    if (!data) return null;
    
    const parsedData = JSON.parse(data);
    
    // Convert date strings back to Date objects when reading and ensure proper typing
    const processedData: WeekData[] = parsedData.map((week: any) => ({
      ...week,
      weekStartDate: new Date(week.weekStartDate),
      workouts: week.workouts.map((workout: any) => ({
        ...workout,
        date: new Date(workout.date),
        day: workout.day as WorkoutDay // Type assertion to match interface
      }))
    }));
    
    return processedData;
  } catch (error) {
    console.error('Error reading workout data from localStorage:', error);
    return null;
  }
};

export const clearWorkoutData = () => {
  localStorage.removeItem('workoutHistory');
  console.log('Cleared workout data from localStorage');
};