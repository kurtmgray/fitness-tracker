#!/usr/bin/env tsx
// Migration script to load normalized workout data into the database
// Run with: tsx scripts/migrateWorkoutData.ts

import { db } from '../src/api/db/connection';
import { readFileSync } from 'fs';
import { join } from 'path';

interface NormalizedSet {
  weight?: number;
  weightLeft?: number;
  weightRight?: number;
  reps?: number;
  timeSeconds?: number;
  isFailure?: boolean;
  completed: boolean;
}

interface NormalizedExercise {
  exerciseName: string;
  equipment: string; // legacy string format
  hasBosuOption?: boolean;
  bandConfiguration?: {
    name: string;
    colors: string[];
  };
  sets: NormalizedSet[];
}

interface NormalizedDay {
  date: string;
  dayType: 'day1' | 'day2' | 'day3';
  exercises: NormalizedExercise[];
  equipmentPreferences: Record<string, string>;
}

interface NormalizedWorkoutData {
  [weekKey: string]: {
    [dayKey: string]: NormalizedDay;
  };
}

// Mapping from legacy equipment strings to database equipment type names
const EQUIPMENT_MAPPING: Record<string, string> = {
  'barbell': 'Olympic Barbell',
  'dumbbell': 'Adjustable Dumbbell',
  'kettlebell': 'Adjustable Kettlebell',
  'bodyweight': 'Bodyweight',
  'plate': 'Weight Plate',
  'band': 'Resistance Band',
  'cable': 'Cable Machine',
  'machine': 'Leg Press Machine',
};

// Standard exercise name mapping for consistency
const EXERCISE_NAME_MAPPING: Record<string, string> = {
  'Barbell Back Squat': 'Barbell Back Squat',
  'Barbell Romanian Deadlift': 'Romanian Deadlift',
  'Russian Twist': 'Russian Twist',
  'Dumbbell Overhead Press': 'Overhead Press',
  'Pull-Ups with Bands': 'Pull-ups',
  'Bear Pos w/ Sliding Weight': 'Bear Crawl',
  'Barbell Deadlift': 'Deadlift',
  'Dumbbell Incline Press': 'Incline Dumbbell Press',
  'Deficit Pushups': 'Deficit Push-ups',
  'Bulgarian Split Squats': 'Bulgarian Split Squats',
  'Farmer\'s Carry': 'Farmer\'s Carry',
  'Glute Bridge Pullover': 'Glute Bridge Pullover',
  'Goblet Squat (Pause)': 'Goblet Squat',
  'Barbell Bench Press': 'Bench Press',
  'Dumbbell Lateral Raises': 'Lateral Raise',
  'KB Halo / Chop': 'Kettlebell Halo',
  'Barbell Rows': 'Bent-over Row',
  'Palloff Press': 'Palloff Press',
};

async function loadWorkoutData(): Promise<NormalizedWorkoutData> {
  const dataPath = join(process.cwd(), 'src/data/normalizedWorkoutData.json');
  const rawData = readFileSync(dataPath, 'utf-8');
  return JSON.parse(rawData);
}

async function getOrCreateExercise(exerciseName: string): Promise<string> {
  const standardName = EXERCISE_NAME_MAPPING[exerciseName] || exerciseName;
  
  // Check if exercise exists
  let exercise = await db
    .selectFrom('exercises')
    .selectAll()
    .where('name', '=', standardName)
    .executeTakeFirst();

  if (!exercise) {
    console.log(`Creating new exercise: ${standardName}`);
    exercise = await db
      .insertInto('exercises')
      .values({
        name: standardName,
        weight_type: 'lbs',
        tracking_type: 'reps',
        is_active: true,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  return exercise.id;
}

async function getEquipmentTypeId(legacyEquipment: string): Promise<string> {
  const equipmentTypeName = EQUIPMENT_MAPPING[legacyEquipment.toLowerCase()] || 'Adjustable Dumbbell';
  
  const equipmentType = await db
    .selectFrom('equipment_types')
    .select('id')
    .where('name', '=', equipmentTypeName)
    .executeTakeFirst();

  if (!equipmentType) {
    throw new Error(`Equipment type not found: ${equipmentTypeName} (from ${legacyEquipment})`);
  }

  return equipmentType.id;
}

async function createWorkoutSession(day: NormalizedDay, userId: string): Promise<string> {
  const session = await db
    .insertInto('workout_sessions')
    .values({
      user_id: userId,
      date: new Date(day.date),
      day_type: day.dayType,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  console.log(`Created workout session for ${day.date} (${day.dayType})`);
  return session.id;
}

async function createSessionExercise(
  sessionId: string,
  exerciseId: string,
  orderIndex: number,
  exerciseData: NormalizedExercise
): Promise<string> {
  const sessionExercise = await db
    .insertInto('session_exercises')
    .values({
      session_id: sessionId,
      exercise_id: exerciseId,
      order_index: orderIndex,
      use_bosu_ball: exerciseData.hasBosuOption || false,
      band_type: exerciseData.bandConfiguration?.name || null,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return sessionExercise.id;
}

async function createSessionSets(sessionExerciseId: string, sets: NormalizedSet[]): Promise<void> {
  for (let i = 0; i < sets.length; i++) {
    const set = sets[i];
    
    // Calculate total weight for dual weight exercises
    let totalWeight: number | null = null;
    if (set.weightLeft && set.weightRight) {
      totalWeight = set.weightLeft + set.weightRight;
    } else if (set.weight !== undefined && set.weight !== null) {
      totalWeight = set.weight;
    }

    // Handle the weight constraint - ensure at least one weight field or time_seconds is provided
    let weight = set.weight;
    let weightLeft = set.weightLeft;
    let weightRight = set.weightRight;
    
    // If no weight fields are provided and it's not a time-based exercise, set weight to 0
    if ((weight === undefined || weight === null) && 
        (weightLeft === undefined || weightLeft === null) && 
        (weightRight === undefined || weightRight === null) && 
        (set.timeSeconds === undefined || set.timeSeconds === null)) {
      weight = 0;
      totalWeight = 0;
    }

    await db
      .insertInto('session_sets')
      .values({
        session_exercise_id: sessionExerciseId,
        set_number: i + 1,
        weight: weight !== undefined ? weight : null,
        weight_left: weightLeft || null,
        weight_right: weightRight || null,
        total_weight: totalWeight,
        reps: set.reps || 0,
        time_seconds: set.timeSeconds || null,
        is_failure: set.isFailure || false,
        completed: set.completed,
      })
      .execute();
  }
}

async function createEquipmentPreferences(
  sessionId: string,
  exerciseId: string,
  legacyEquipment: string
): Promise<void> {
  const equipmentTypeId = await getEquipmentTypeId(legacyEquipment);
  
  await db
    .insertInto('workout_equipment_preferences_new')
    .values({
      session_id: sessionId,
      exercise_id: exerciseId,
      equipment_type_id: equipmentTypeId,
    })
    .execute();
}

async function cleanupPartialMigration(userId: string): Promise<void> {
  console.log('🧹 Cleaning up any partial migration data...');
  
  // Delete in reverse order of dependencies
  await db.deleteFrom('session_sets')
    .where('session_exercise_id', 'in', 
      db.selectFrom('session_exercises')
        .select('id')
        .where('session_id', 'in',
          db.selectFrom('workout_sessions')
            .select('id')
            .where('user_id', '=', userId)
        )
    ).execute();
    
  await db.deleteFrom('workout_equipment_preferences_new')
    .where('session_id', 'in',
      db.selectFrom('workout_sessions')
        .select('id')
        .where('user_id', '=', userId)
    ).execute();
    
  await db.deleteFrom('session_exercises')
    .where('session_id', 'in',
      db.selectFrom('workout_sessions')
        .select('id')
        .where('user_id', '=', userId)
    ).execute();
    
  await db.deleteFrom('workout_sessions')
    .where('user_id', '=', userId)
    .execute();
    
  console.log('✅ Cleanup complete');
}

async function migrateWorkoutData(userId: string = 'default-user-id'): Promise<void> {
  console.log('🚀 Starting workout data migration...');
  
  // Clean up any existing data first
  await cleanupPartialMigration(userId);
  
  // Load the normalized data
  const workoutData = await loadWorkoutData();
  
  let totalSessions = 0;
  let totalExercises = 0;
  let totalSets = 0;

  // Process each week
  for (const [weekKey, week] of Object.entries(workoutData)) {
    console.log(`\n📅 Processing ${weekKey}...`);
    
    // Process each day in the week
    for (const [dayKey, day] of Object.entries(week)) {
      console.log(`  📋 Processing ${dayKey} (${day.date})...`);
      
      // Create workout session
      const sessionId = await createWorkoutSession(day, userId);
      totalSessions++;
      
      // Process each exercise
      for (let exerciseIndex = 0; exerciseIndex < day.exercises.length; exerciseIndex++) {
        const exercise = day.exercises[exerciseIndex];
        
        // Get or create exercise
        const exerciseId = await getOrCreateExercise(exercise.exerciseName);
        
        // Create session exercise
        const sessionExerciseId = await createSessionExercise(
          sessionId,
          exerciseId,
          exerciseIndex,
          exercise
        );
        
        // Create sets
        await createSessionSets(sessionExerciseId, exercise.sets);
        
        // Create equipment preference
        await createEquipmentPreferences(sessionId, exerciseId, exercise.equipment);
        
        totalExercises++;
        totalSets += exercise.sets.length;
        
        console.log(`    ✅ ${exercise.exerciseName}: ${exercise.sets.length} sets`);
      }
    }
  }
  
  console.log('\n🎉 Migration completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`  - ${totalSessions} workout sessions`);
  console.log(`  - ${totalExercises} exercise entries`);
  console.log(`  - ${totalSets} total sets`);
}

// Main execution
async function main() {
  try {
    // You can pass a specific user ID as a command line argument
    const userId = process.argv[2] || 'default-user-id';
    
    console.log(`Migrating workout data for user: ${userId}`);
    console.log('⚠️  Make sure you have a backup of your database!\n');
    
    await migrateWorkoutData(userId);
    
    console.log('\n✨ All done! Your normalized workout data is now in the database.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.destroy();
  }
}

// Run the migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { migrateWorkoutData };