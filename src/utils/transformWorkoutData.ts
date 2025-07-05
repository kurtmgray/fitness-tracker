import workoutDataJson from '../data/workoutData.json';
import { transformWorkoutData } from './workoutDataTransform';

// Transform the existing workout data
export const getTransformedWorkoutData = () => {
  try {
    const transformedData = transformWorkoutData(workoutDataJson);
    console.log('Successfully transformed workout data');
    console.log('Sample transformed set:', transformedData[0]?.workouts[0]?.exercises[0]?.sets[0]);
    return transformedData;
  } catch (error) {
    console.error('Error transforming workout data:', error);
    return [];
  }
};

// For testing the transformation
export const testTransformation = () => {
  const sampleData = [
    {
      weekStartDate: "2025-06-29T00:00:00.000Z",
      workouts: [
        {
          id: "test-workout",
          date: "2025-07-01T00:00:00.000Z",
          day: "day1",
          exercises: [
            {
              exerciseName: "Test Exercise",
              sets: [
                { weight: 195, reps: 6, completed: true },
                { weight: "45# DB", reps: 8, completed: true },
                { weight: "44# KB", reps: 15, completed: true },
                { weight: "BW", reps: 10, completed: true },
                { weight: "25/44# KB", reps: 16, completed: true }
              ]
            }
          ]
        }
      ]
    }
  ];

  const transformed = transformWorkoutData(sampleData);
  console.log('Transformation test results:');
  console.log(JSON.stringify(transformed[0].workouts[0].exercises[0].sets, null, 2));
  
  return transformed;
};