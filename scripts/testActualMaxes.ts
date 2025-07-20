#!/usr/bin/env tsx
// Test script to verify the getActualMaxes endpoint works

import { db } from '../src/api/db/connection';

// Test the exact query logic from getActualMaxes
async function testMaxWeights() {
  console.log('🧪 Testing max weights calculation...');
  
  const userId = '22e0c968-87ce-4428-b601-a36de542e797';
  
  // Standard exercise name mapping for strength assessment
  const STRENGTH_EXERCISE_MAPPING: Record<string, string[]> = {
    squat: ['Barbell Back Squat', 'Back Squat'],
    deadlift: ['Deadlift', 'Barbell Deadlift'],
    bench: ['Bench Press', 'Barbell Bench Press'],
    overheadPress: ['Overhead Press', 'Dumbbell Overhead Press'],
    romanianDeadlift: ['Romanian Deadlift', 'Barbell Romanian Deadlift'],
  };

  const maxWeights: Record<string, number> = {};
  
  // Calculate max weights for each strength exercise
  for (const [liftType, exerciseNames] of Object.entries(STRENGTH_EXERCISE_MAPPING)) {
    console.log(`\n🔍 Checking ${liftType} (${exerciseNames.join(', ')})...`);
    
    const result = await db
      .selectFrom('session_sets as ss')
      .innerJoin('session_exercises as se', 'se.id', 'ss.session_exercise_id')
      .innerJoin('exercises as e', 'e.id', 'se.exercise_id')
      .innerJoin('workout_sessions as ws', 'ws.id', 'se.session_id')
      .select([
        'e.name',
        db.fn.max(
          db.fn.coalesce('ss.total_weight', 'ss.weight')
        ).as('max_weight'),
        db.fn.count('ss.id').as('total_sets')
      ])
      .where('ws.user_id', '=', userId)
      .where('ss.completed', '=', true)
      .where('e.name', 'in', exerciseNames)
      .where((eb) => eb.or([
        eb('ss.weight', '>', 0),
        eb('ss.total_weight', '>', 0)
      ]))
      .groupBy('e.name')
      .execute();
    
    console.log(`   Found ${result.length} matching exercises:`);
    result.forEach(r => {
      console.log(`   - ${r.name}: ${r.max_weight} lbs (${r.total_sets} sets)`);
    });
    
    if (result.length > 0) {
      const maxWeight = Math.max(...result.map(r => Number(r.max_weight)));
      maxWeights[liftType] = maxWeight;
      console.log(`   ✅ Max for ${liftType}: ${maxWeight} lbs`);
    } else {
      console.log(`   ⚠️  No data found for ${liftType}`);
    }
  }
  
  console.log('\n📊 Final Results:');
  console.log(maxWeights);
  
  return maxWeights;
}

async function testWorkoutHistory() {
  console.log('\n📅 Testing workout history...');
  
  const userId = '22e0c968-87ce-4428-b601-a36de542e797';
  
  const sessions = await db
    .selectFrom('workout_sessions')
    .selectAll()
    .where('user_id', '=', userId)
    .orderBy('date', 'desc')
    .execute();
  
  console.log(`Found ${sessions.length} workout sessions:`);
  sessions.forEach(session => {
    console.log(`- ${session.date} (${session.day_type})`);
  });
  
  return sessions;
}

// Main execution
async function main() {
  try {
    await testMaxWeights();
    await testWorkoutHistory();
    
    console.log('\n✨ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.destroy();
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { testMaxWeights, testWorkoutHistory };