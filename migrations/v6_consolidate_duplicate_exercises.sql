-- Migration: Consolidate duplicate exercises to canonical 18 exercises
-- This ensures we have only one exercise record per actual exercise

-- Step 1: Map all duplicate exercise IDs to canonical exercise IDs
-- Create a mapping of duplicates -> canonical

-- Update session_exercises to use canonical exercise IDs
UPDATE session_exercises 
SET exercise_id = CASE 
    -- Deadlift duplicates -> Barbell Deadlift (e45bb281-0666-4b6b-b8bf-c7f0dbf37b9f)
    WHEN exercise_id = 'b8d734d6-e9df-46a7-ae12-eeab155fafa5' THEN 'e45bb281-0666-4b6b-b8bf-c7f0dbf37b9f' -- Deadlift
    
    -- Incline Press duplicates -> Dumbbell Incline Press (69a6f942-d109-4c91-a5cd-b1fe4e532590)
    WHEN exercise_id = '8c69c858-d4ed-48b4-9f4a-8bcc36f58fe3' THEN '69a6f942-d109-4c91-a5cd-b1fe4e532590' -- Incline Dumbbell Press
    
    -- Deficit Pushups duplicates -> Deficit Pushups (96795efe-202f-4cda-984d-58d15fa3278d)
    WHEN exercise_id = '704a8df5-7545-402f-9f90-8a8fd0f40fde' THEN '96795efe-202f-4cda-984d-58d15fa3278d' -- Deficit Push-ups
    
    -- Farmers Carry duplicates -> Farmer's Carry (74dae024-de5e-4517-925e-addce23d79d0) 
    WHEN exercise_id = 'd137553e-76fd-45ae-b43c-2e91f56bfac3' THEN '74dae024-de5e-4517-925e-addce23d79d0' -- Farmers Carry
    
    -- Overhead Press duplicates -> Dumbbell Overhead Press (dc787215-87b3-428e-93c9-57cec853cdfd)
    WHEN exercise_id = '0af1f47d-5d0e-4c5c-a922-a6a05a79d174' THEN 'dc787215-87b3-428e-93c9-57cec853cdfd' -- Overhead Press
    
    -- Pull-ups duplicates -> Pull-Ups with Bands (05c15c10-dda4-4405-b981-8217b3ecdb91)
    WHEN exercise_id = '40cedb51-96a1-4e56-bda5-b7d7b36952ce' THEN '05c15c10-dda4-4405-b981-8217b3ecdb91' -- Pull-ups
    
    -- Bear exercise duplicates -> Bear Pos w/ Sliding Weight (cb4f78f4-6203-406c-8e3e-df14d4c7236b)
    WHEN exercise_id = 'fe93653f-82af-4573-a46a-58fa203c7c7b' THEN 'cb4f78f4-6203-406c-8e3e-df14d4c7236b' -- Bear Crawl
    
    -- Romanian Deadlift duplicates -> Barbell Romanian Deadlift (7c37b01f-6c6c-4968-a7d7-c0167e40e25e)
    WHEN exercise_id = 'de20458e-b559-4ddd-9c62-874db7f1b245' THEN '7c37b01f-6c6c-4968-a7d7-c0167e40e25e' -- Romanian Deadlift
    
    -- Bench Press duplicates -> Barbell Bench Press (04686f53-7225-44bd-b4c5-734fa5e0e563)
    WHEN exercise_id = '5b5a090d-a688-44b6-851f-5fcebe0e533c' THEN '04686f53-7225-44bd-b4c5-734fa5e0e563' -- Bench Press
    
    -- Lateral Raise duplicates -> Dumbbell Lateral Raises (f102b02b-9ac0-495f-a8e2-cd5cf6c992bd)
    WHEN exercise_id = '747ffe63-10b3-4bf3-ba6f-fa9479ca647d' THEN 'f102b02b-9ac0-495f-a8e2-cd5cf6c992bd' -- Lateral Raise
    
    -- Halo duplicates -> KB Halo / Chop (db496217-1598-4b51-9759-a195c2dcf9fd)
    WHEN exercise_id = '4aaf30ac-c06f-422b-b362-0135cc30b4b7' THEN 'db496217-1598-4b51-9759-a195c2dcf9fd' -- Kettlebell Halo
    
    -- Row duplicates -> Barbell Rows (edd43650-e34b-4acd-81df-198b9387c3cb)
    WHEN exercise_id = '3aae3456-1a21-49a3-a5af-0d5836d2327c' THEN 'edd43650-e34b-4acd-81df-198b9387c3cb' -- Bent-over Row
    WHEN exercise_id = '1fc164f9-3c8b-404d-acc9-86fcab88c833' THEN 'edd43650-e34b-4acd-81df-198b9387c3cb' -- Chest Supported DB Rows
    
    -- Goblet Squat duplicates -> Goblet Squat (Pause) (a66cab0c-7cee-4f66-aefc-addae56da858)
    WHEN exercise_id = '3cf9dca2-0c2f-4d54-bd95-aed214c55278' THEN 'a66cab0c-7cee-4f66-aefc-addae56da858' -- Goblet Squat
    
    ELSE exercise_id -- Keep canonical IDs as-is
END;

-- Step 2: Update template_exercises to use canonical exercise IDs
UPDATE template_exercises 
SET exercise_id = CASE 
    -- Apply same mappings as above
    WHEN exercise_id = 'b8d734d6-e9df-46a7-ae12-eeab155fafa5' THEN 'e45bb281-0666-4b6b-b8bf-c7f0dbf37b9f'
    WHEN exercise_id = '8c69c858-d4ed-48b4-9f4a-8bcc36f58fe3' THEN '69a6f942-d109-4c91-a5cd-b1fe4e532590'
    WHEN exercise_id = '704a8df5-7545-402f-9f90-8a8fd0f40fde' THEN '96795efe-202f-4cda-984d-58d15fa3278d'
    WHEN exercise_id = 'd137553e-76fd-45ae-b43c-2e91f56bfac3' THEN '74dae024-de5e-4517-925e-addce23d79d0'
    WHEN exercise_id = '0af1f47d-5d0e-4c5c-a922-a6a05a79d174' THEN 'dc787215-87b3-428e-93c9-57cec853cdfd'
    WHEN exercise_id = '40cedb51-96a1-4e56-bda5-b7d7b36952ce' THEN '05c15c10-dda4-4405-b981-8217b3ecdb91'
    WHEN exercise_id = 'fe93653f-82af-4573-a46a-58fa203c7c7b' THEN 'cb4f78f4-6203-406c-8e3e-df14d4c7236b'
    WHEN exercise_id = 'de20458e-b559-4ddd-9c62-874db7f1b245' THEN '7c37b01f-6c6c-4968-a7d7-c0167e40e25e'
    WHEN exercise_id = '5b5a090d-a688-44b6-851f-5fcebe0e533c' THEN '04686f53-7225-44bd-b4c5-734fa5e0e563'
    WHEN exercise_id = '747ffe63-10b3-4bf3-ba6f-fa9479ca647d' THEN 'f102b02b-9ac0-495f-a8e2-cd5cf6c992bd'
    WHEN exercise_id = '4aaf30ac-c06f-422b-b362-0135cc30b4b7' THEN 'db496217-1598-4b51-9759-a195c2dcf9fd'
    WHEN exercise_id = '3aae3456-1a21-49a3-a5af-0d5836d2327c' THEN 'edd43650-e34b-4acd-81df-198b9387c3cb'
    WHEN exercise_id = '1fc164f9-3c8b-404d-acc9-86fcab88c833' THEN 'edd43650-e34b-4acd-81df-198b9387c3cb'
    WHEN exercise_id = '3cf9dca2-0c2f-4d54-bd95-aed214c55278' THEN 'a66cab0c-7cee-4f66-aefc-addae56da858'
    ELSE exercise_id
END;

-- Step 3: Delete duplicate exercise records (keeping only canonical ones)
DELETE FROM exercises WHERE id IN (
    'b8d734d6-e9df-46a7-ae12-eeab155fafa5', -- Deadlift (duplicate)
    '8c69c858-d4ed-48b4-9f4a-8bcc36f58fe3', -- Incline Dumbbell Press (duplicate)
    '704a8df5-7545-402f-9f90-8a8fd0f40fde', -- Deficit Push-ups (duplicate)
    'd137553e-76fd-45ae-b43c-2e91f56bfac3', -- Farmers Carry (duplicate)
    '0af1f47d-5d0e-4c5c-a922-a6a05a79d174', -- Overhead Press (duplicate)
    '40cedb51-96a1-4e56-bda5-b7d7b36952ce', -- Pull-ups (duplicate)
    'fe93653f-82af-4573-a46a-58fa203c7c7b', -- Bear Crawl (duplicate)
    'de20458e-b559-4ddd-9c62-874db7f1b245', -- Romanian Deadlift (duplicate)
    '5b5a090d-a688-44b6-851f-5fcebe0e533c', -- Bench Press (duplicate)
    '747ffe63-10b3-4bf3-ba6f-fa9479ca647d', -- Lateral Raise (duplicate)
    '4aaf30ac-c06f-422b-b362-0135cc30b4b7', -- Kettlebell Halo (duplicate)
    '3aae3456-1a21-49a3-a5af-0d5836d2327c', -- Bent-over Row (duplicate)
    '1fc164f9-3c8b-404d-acc9-86fcab88c833', -- Chest Supported DB Rows (duplicate)
    '3cf9dca2-0c2f-4d54-bd95-aed214c55278'  -- Goblet Squat (duplicate)
);

-- Step 4: Verify we now have exactly 18 exercises
-- SELECT COUNT(*) as exercise_count FROM exercises;
-- SELECT name FROM exercises ORDER BY name;