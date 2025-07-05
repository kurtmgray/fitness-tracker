import { parseWeightString } from './workoutDataTransform';
import { clearWorkoutData, loadWorkoutDataToLocalStorage } from './loadWorkoutData';

// Test the transformation on the browser console
export const testWeightParsing = () => {
  const testCases = [
    195,          // Barbell
    "45# DB",     // Dumbbell per hand  
    "44# KB",     // Kettlebell
    "BW",         // Bodyweight
    "25/44# KB"   // Complex
  ];

  console.log('Testing weight parsing:');
  testCases.forEach(weight => {
    const result = parseWeightString(weight);
    console.log(`Input: ${weight} -> Weight: ${result.weight}, Equipment:`, result.equipment);
  });
};

// Clear and reload data with new structure
export const reloadWithNewStructure = () => {
  console.log('Clearing old data and loading new structure...');
  clearWorkoutData();
  const newData = loadWorkoutDataToLocalStorage();
  console.log('New data loaded:', newData);
  window.location.reload(); // Refresh to see changes
};

// Make it available globally for console testing
(window as any).testWeightParsing = testWeightParsing;
(window as any).reloadWithNewStructure = reloadWithNewStructure;