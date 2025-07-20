-- Script to delete today's workout data for testing cleanup
-- Run this after testing to remove any workout sessions created today

-- First, let's see what we're about to delete (uncomment to preview):
-- SELECT 
--   ws.id as session_id, 
--   ws.date, 
--   ws.day_type,
--   COUNT(se.id) as num_exercises,
--   COUNT(ss.id) as num_sets
-- FROM workout_sessions ws
-- LEFT JOIN session_exercises se ON ws.id = se.session_id  
-- LEFT JOIN session_sets ss ON se.id = ss.session_exercise_id
-- WHERE DATE(ws.date) = CURRENT_DATE
-- GROUP BY ws.id, ws.date, ws.day_type
-- ORDER BY ws.date DESC;

-- Delete today's workout data (cascading deletes will handle related records)
-- This will automatically delete:
-- 1. session_sets (via foreign key cascade)
-- 2. session_exercises (via foreign key cascade) 
-- 3. workout_equipment_preferences (via foreign key cascade)
-- 4. workout_sessions (main table)

DELETE FROM workout_sessions 
WHERE DATE(date) = CURRENT_DATE;

-- Verify deletion (should return 0 rows):
SELECT COUNT(*) as remaining_todays_workouts 
FROM workout_sessions 
WHERE DATE(date) = CURRENT_DATE;

-- Optional: Show remaining recent workouts to confirm we only deleted today's
-- SELECT date, day_type, duration_minutes 
-- FROM workout_sessions 
-- WHERE date >= CURRENT_DATE - INTERVAL '7 days'
-- ORDER BY date DESC
-- LIMIT 10;