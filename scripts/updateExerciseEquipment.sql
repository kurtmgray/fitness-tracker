-- Update exercises with proper equipment type relationships
-- Based on the hardcoded workout templates

-- Get equipment type IDs for reference
-- Olympic Barbell: 531e1dcb-48d2-4c86-b339-bf8ca592e98d
-- Adjustable Dumbbell: dc4d99de-b33f-4c03-913d-f05451abf5d1
-- Adjustable Kettlebell: bcdc524e-08f6-47f8-8397-1d279bf9d466
-- Bodyweight: acc269a4-ddcd-4667-84fa-eee3d4a13cee
-- Weight Plate: 30e9891e-3678-443a-895b-f4db6275473e
-- Resistance Band: 8664e805-393c-4605-bb32-61170e4f5ace

-- Update barbell exercises
UPDATE exercises 
SET primary_equipment_type_id = '531e1dcb-48d2-4c86-b339-bf8ca592e98d'
WHERE name IN (
    'Barbell Back Squat',
    'Barbell Romanian Deadlift', 
    'Barbell Deadlift',
    'Barbell Bench Press',
    'Barbell Rows'
);

-- Update dumbbell exercises
UPDATE exercises 
SET primary_equipment_type_id = 'dc4d99de-b33f-4c03-913d-f05451abf5d1'
WHERE name IN (
    'Dumbbell Overhead Press',
    'Dumbbell Incline Press', 
    'Dumbbell Lateral Raises',
    'Chest Supported DB Rows'
);

-- Update kettlebell exercises
UPDATE exercises 
SET primary_equipment_type_id = 'bcdc524e-08f6-47f8-8397-1d279bf9d466'
WHERE name IN (
    'Russian Twist',
    'Bulgarian Split Squats',
    'Farmers Carry',
    'Goblet Squat (Pause)',
    'KB Halo / Chop'
);

-- Update bodyweight exercises
UPDATE exercises 
SET primary_equipment_type_id = 'acc269a4-ddcd-4667-84fa-eee3d4a13cee'
WHERE name IN (
    'Pull-Ups with Bands',
    'Deficit Pushups'
);

-- Update plate exercises
UPDATE exercises 
SET primary_equipment_type_id = '30e9891e-3678-443a-895b-f4db6275473e'
WHERE name IN (
    'Bear Pos w/ Sliding Weight',
    'Glute Bridge Pullover'
);

-- Update band exercises
UPDATE exercises 
SET primary_equipment_type_id = '8664e805-393c-4605-bb32-61170e4f5ace'
WHERE name = 'Palloff Press';

-- Update tracking types to match current data model
UPDATE exercises SET tracking_type = 'time' WHERE name = 'Farmers Carry';
UPDATE exercises SET tracking_type = 'failure' WHERE name = 'Deficit Pushups';

-- Update dual weight support
UPDATE exercises SET supports_dual_weights = true 
WHERE name IN ('Bulgarian Split Squats', 'Farmers Carry');

-- Update bosu ball option
UPDATE exercises SET has_bosu_option = true 
WHERE name = 'Goblet Squat (Pause)';

-- Verify the updates
SELECT 
    e.name,
    e.abbreviation,
    e.tracking_type,
    e.supports_dual_weights,
    e.has_bosu_option,
    et.name as equipment_type,
    et.category
FROM exercises e
LEFT JOIN equipment_types et ON e.primary_equipment_type_id = et.id
WHERE e.name IN (
    'Barbell Back Squat', 'Barbell Romanian Deadlift', 'Russian Twist',
    'Dumbbell Overhead Press', 'Pull-Ups with Bands', 'Bear Pos w/ Sliding Weight',
    'Barbell Deadlift', 'Dumbbell Incline Press', 'Deficit Pushups',
    'Bulgarian Split Squats', 'Farmers Carry', 'Glute Bridge Pullover',
    'Goblet Squat (Pause)', 'Barbell Bench Press', 'Dumbbell Lateral Raises',
    'KB Halo / Chop', 'Chest Supported DB Rows', 'Palloff Press'
)
ORDER BY e.name;