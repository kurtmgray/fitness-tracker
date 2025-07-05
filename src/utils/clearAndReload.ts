import { clearWorkoutData, loadWorkoutDataToLocalStorage } from './loadWorkoutData';

export const clearAndReloadData = () => {
  console.log('Clearing existing workout data...');
  clearWorkoutData();
  
  console.log('Loading new transformed workout data...');
  const newData = loadWorkoutDataToLocalStorage();
  
  if (newData) {
    console.log('Successfully loaded transformed data:', newData.length, 'weeks');
    console.log('Sample set from new data:', newData[0]?.workouts[0]?.exercises[0]?.sets[0]);
  } else {
    console.error('Failed to load new data');
  }
  
  return newData;
};

// For testing the transformation directly
import { testTransformation } from './transformWorkoutData';

export const testDataTransformation = () => {
  console.log('Testing data transformation...');
  return testTransformation();
};