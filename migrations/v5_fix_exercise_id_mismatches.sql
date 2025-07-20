-- Migration: Fix exercise ID mismatches between session_exercises and template_exercises
-- This ensures both use the same exercise IDs for proper matching

-- Update session_exercises to use the same exercise IDs that templates use
UPDATE session_exercises 
SET exercise_id = CASE 
    -- Map session exercise IDs to template exercise IDs
    WHEN exercise_id = 'b8d734d6-e9df-46a7-ae12-eeab155fafa5' THEN 'e45bb281-0666-4b6b-b8bf-c7f0dbf37b9f' -- Deadlift -> Barbell Deadlift
    WHEN exercise_id = '8c69c858-d4ed-48b4-9f4a-8bcc36f58fe3' THEN '69a6f942-d109-4c91-a5cd-b1fe4e532590' -- Incline Dumbbell Press -> Dumbbell Incline Press
    WHEN exercise_id = '704a8df5-7545-402f-9f90-8a8fd0f40fde' THEN '96795efe-202f-4cda-984d-58d15fa3278d' -- Deficit Push-ups -> Deficit Pushups
    WHEN exercise_id = '74dae024-de5e-4517-925e-addce23d79d0' THEN 'd137553e-76fd-45ae-b43c-2e91f56bfac3' -- Farmer's Carry -> Farmers Carry
    WHEN exercise_id = '0af1f47d-5d0e-4c5c-a922-a6a05a79d174' THEN 'dc787215-87b3-428e-93c9-57cec853cdfd' -- Overhead Press -> Dumbbell Overhead Press
    WHEN exercise_id = '40cedb51-96a1-4e56-bda5-b7d7b36952ce' THEN '05c15c10-dda4-4405-b981-8217b3ecdb91' -- Pull-ups -> Pull-Ups with Bands
    WHEN exercise_id = 'fe93653f-82af-4573-a46a-58fa203c7c7b' THEN 'cb4f78f4-6203-406c-8e3e-df14d4c7236b' -- Bear Crawl -> Bear Pos w/ Sliding Weight
    WHEN exercise_id = 'de20458e-b559-4ddd-9c62-874db7f1b245' THEN '7c37b01f-6c6c-4968-a7d7-c0167e40e25e' -- Romanian Deadlift -> Barbell Romanian Deadlift
    WHEN exercise_id = '5b5a090d-a688-44b6-851f-5fcebe0e533c' THEN '04686f53-7225-44bd-b4c5-734fa5e0e563' -- Bench Press -> Barbell Bench Press
    WHEN exercise_id = '747ffe63-10b3-4bf3-ba6f-fa9479ca647d' THEN 'f102b02b-9ac0-495f-a8e2-cd5cf6c992bd' -- Lateral Raise -> Dumbbell Lateral Raises
    WHEN exercise_id = '4aaf30ac-c06f-422b-b362-0135cc30b4b7' THEN 'db496217-1598-4b51-9759-a195c2dcf9fd' -- Kettlebell Halo -> KB Halo / Chop
    WHEN exercise_id = '3aae3456-1a21-49a3-a5af-0d5836d2327c' THEN '1fc164f9-3c8b-404d-acc9-86fcab88c833' -- Bent-over Row -> Chest Supported DB Rows
    WHEN exercise_id = '3cf9dca2-0c2f-4d54-bd95-aed214c55278' THEN 'a66cab0c-7cee-4f66-aefc-addae56da858' -- Goblet Squat -> Goblet Squat (Pause)
    
    ELSE exercise_id -- Keep exercise_id if no mapping needed
END;

-- Verify the mapping worked
-- SELECT DISTINCT se.exercise_id, e.name FROM session_exercises se JOIN exercises e ON se.exercise_id = e.id ORDER BY e.name;