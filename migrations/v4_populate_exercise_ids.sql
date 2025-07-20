-- Migration: Populate exercise_id in session_exercises based on exercise names
-- This replaces name-based exercise matching with proper ID-based relationships

-- First, let's see what exercise names we have in session_exercises that need mapping
-- UPDATE session_exercises SET exercise_id = 'f228a3dc-772d-410e-925c-88d375601d9e' WHERE exercise_name = 'Barbell Back Squat';

-- Map all known exercise names to their IDs from our normalized data
UPDATE session_exercises 
SET exercise_id = CASE 
    -- Day 1 Exercises
    WHEN exercise_name = 'Barbell Back Squat' THEN 'f228a3dc-772d-410e-925c-88d375601d9e'
    WHEN exercise_name = 'Back Squat' THEN 'f228a3dc-772d-410e-925c-88d375601d9e'
    WHEN exercise_name = 'Barbell Romanian Deadlift' THEN '7c37b01f-6c6c-4968-a7d7-c0167e40e25e'
    WHEN exercise_name = 'Romanian Deadlift' THEN '7c37b01f-6c6c-4968-a7d7-c0167e40e25e'
    WHEN exercise_name = 'Russian Twist' THEN '310fc57e-e082-4b3e-ac9d-a9faced278d1'
    WHEN exercise_name = 'Dumbbell Overhead Press' THEN 'dc787215-87b3-428e-93c9-57cec853cdfd'
    WHEN exercise_name = 'Overhead Press' THEN 'dc787215-87b3-428e-93c9-57cec853cdfd'
    WHEN exercise_name = 'Pull-Ups with Bands' THEN '05c15c10-dda4-4405-b981-8217b3ecdb91'
    WHEN exercise_name = 'Pull-ups' THEN '05c15c10-dda4-4405-b981-8217b3ecdb91'
    WHEN exercise_name = 'Bear Pos w/ Sliding Weight' THEN 'cb4f78f4-6203-406c-8e3e-df14d4c7236b'
    WHEN exercise_name = 'Bear Crawl' THEN 'cb4f78f4-6203-406c-8e3e-df14d4c7236b'
    
    -- Day 2 Exercises
    WHEN exercise_name = 'Barbell Deadlift' THEN 'e45bb281-0666-4b6b-b8bf-c7f0dbf37b9f'
    WHEN exercise_name = 'Deadlift' THEN 'e45bb281-0666-4b6b-b8bf-c7f0dbf37b9f'
    WHEN exercise_name = 'Dumbbell Incline Press' THEN '69a6f942-d109-4c91-a5cd-b1fe4e532590'
    WHEN exercise_name = 'Incline Dumbbell Press' THEN '69a6f942-d109-4c91-a5cd-b1fe4e532590'
    WHEN exercise_name = 'Deficit Pushups' THEN '96795efe-202f-4cda-984d-58d15fa3278d'
    WHEN exercise_name = 'Deficit Push-ups' THEN '96795efe-202f-4cda-984d-58d15fa3278d'
    WHEN exercise_name = 'Bulgarian Split Squats' THEN 'b2fe0201-2c63-498d-9300-4eb09174b7c8'
    WHEN exercise_name = 'Farmers Carry' THEN 'd137553e-76fd-45ae-b43c-2e91f56bfac3'
    WHEN exercise_name = 'Farmer''s Carry' THEN 'd137553e-76fd-45ae-b43c-2e91f56bfac3'
    WHEN exercise_name = 'Glute Bridge Pullover' THEN '7e8abf3e-9fcf-44cd-8e01-ed71b566f1ee'
    
    -- Day 3 Exercises
    WHEN exercise_name = 'Goblet Squat (Pause)' THEN 'a66cab0c-7cee-4f66-aefc-addae56da858'
    WHEN exercise_name = 'Barbell Bench Press' THEN '04686f53-7225-44bd-b4c5-734fa5e0e563'
    WHEN exercise_name = 'Bench Press' THEN '04686f53-7225-44bd-b4c5-734fa5e0e563'
    WHEN exercise_name = 'Dumbbell Lateral Raises' THEN 'f102b02b-9ac0-495f-a8e2-cd5cf6c992bd'
    WHEN exercise_name = 'Lateral Raise' THEN 'f102b02b-9ac0-495f-a8e2-cd5cf6c992bd'
    WHEN exercise_name = 'KB Halo / Chop' THEN 'db496217-1598-4b51-9759-a195c2dcf9fd'
    WHEN exercise_name = 'Kettlebell Halo' THEN 'db496217-1598-4b51-9759-a195c2dcf9fd'
    WHEN exercise_name = 'Chest Supported DB Rows' THEN '1fc164f9-3c8b-404d-acc9-86fcab88c833'
    WHEN exercise_name = 'Chest Supported Dumbbell Rows' THEN '1fc164f9-3c8b-404d-acc9-86fcab88c833'
    WHEN exercise_name = 'Bent-over Row' THEN '1fc164f9-3c8b-404d-acc9-86fcab88c833'
    WHEN exercise_name = 'Barbell Rows' THEN '1fc164f9-3c8b-404d-acc9-86fcab88c833'
    WHEN exercise_name = 'Palloff Press' THEN 'eac59be5-3dd6-4683-8045-96927f3389c6'
    
    ELSE exercise_id -- Keep existing exercise_id if already populated
END
WHERE exercise_id IS NULL;

-- Verify that all session_exercises now have exercise_id populated
-- Any rows with NULL exercise_id after this migration need manual review

-- Optional: Add a constraint to ensure exercise_id is always populated going forward
-- ALTER TABLE session_exercises ALTER COLUMN exercise_id SET NOT NULL;

-- Check for any unmapped exercises
-- SELECT DISTINCT exercise_name, exercise_id FROM session_exercises WHERE exercise_id IS NULL;