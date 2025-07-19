-- v3_equipment_system.sql
-- Migration to enhance equipment system from strings to relational database design
-- This migration adds equipment types and instances tables with foreign key relationships

-- Create equipment_types table
CREATE TABLE equipment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('barbell', 'dumbbell', 'kettlebell', 'bodyweight', 'plate', 'band', 'cable', 'machine')),
  description TEXT,
  supports_dual_weights BOOLEAN DEFAULT FALSE,
  supports_variable_resistance BOOLEAN DEFAULT FALSE, -- for bands, cables
  specifications JSONB, -- weight ranges, resistance levels, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create equipment_instances table
CREATE TABLE equipment_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_type_id UUID NOT NULL REFERENCES equipment_types(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  specifications JSONB, -- actual weight, resistance level, condition, location
  user_id UUID REFERENCES users(id), -- null for gym equipment
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update exercises table to reference equipment types (check if columns exist first)
DO $$ 
BEGIN
  -- Add primary_equipment_type_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exercises' AND column_name = 'primary_equipment_type_id') THEN
    ALTER TABLE exercises ADD COLUMN primary_equipment_type_id UUID REFERENCES equipment_types(id);
  END IF;
  
  -- Add alternative_equipment_type_ids if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exercises' AND column_name = 'alternative_equipment_type_ids') THEN
    ALTER TABLE exercises ADD COLUMN alternative_equipment_type_ids UUID[]; -- array of equipment type IDs
  END IF;
  
  -- supports_dual_weights already exists, skip
  
  -- has_bosu_option already exists, skip
  
  -- Add abbreviation if it doesn't exist  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exercises' AND column_name = 'abbreviation') THEN
    ALTER TABLE exercises ADD COLUMN abbreviation VARCHAR(50);
  END IF;
END $$;

-- Create workout_equipment_preferences table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workout_equipment_preferences_new') THEN
    CREATE TABLE workout_equipment_preferences_new (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
      exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
      equipment_type_id UUID NOT NULL REFERENCES equipment_types(id),
      equipment_instance_id UUID REFERENCES equipment_instances(id), -- optional specific equipment
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(session_id, exercise_id) -- one equipment preference per exercise per session
    );
  END IF;
END $$;

-- Note: band_configurations table already exists, skip creation

-- Create indexes for performance (with checks for existing indexes)
DO $$
BEGIN
  -- Equipment instances indexes
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_equipment_instances_type') THEN
    CREATE INDEX idx_equipment_instances_type ON equipment_instances(equipment_type_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_equipment_instances_user') THEN
    CREATE INDEX idx_equipment_instances_user ON equipment_instances(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_equipment_instances_available') THEN
    CREATE INDEX idx_equipment_instances_available ON equipment_instances(is_available);
  END IF;
  
  -- Workout equipment preferences indexes (for new table)
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_workout_equipment_prefs_new_session') THEN
    CREATE INDEX idx_workout_equipment_prefs_new_session ON workout_equipment_preferences_new(session_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_workout_equipment_prefs_new_exercise') THEN
    CREATE INDEX idx_workout_equipment_prefs_new_exercise ON workout_equipment_preferences_new(exercise_id);
  END IF;
  
  -- Exercises primary equipment index
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_exercises_primary_equipment') THEN
    CREATE INDEX idx_exercises_primary_equipment ON exercises(primary_equipment_type_id);
  END IF;
END $$;

-- Seed data: Create standard equipment types
INSERT INTO equipment_types (name, category, supports_dual_weights, supports_variable_resistance, specifications) VALUES
-- Barbells
('Olympic Barbell', 'barbell', false, false, '{"weightRange": {"min": 45, "max": 45}, "fixedWeight": 45}'),
('EZ Curl Bar', 'barbell', false, false, '{"weightRange": {"min": 25, "max": 25}, "fixedWeight": 25}'),
('Safety Squat Bar', 'barbell', false, false, '{"weightRange": {"min": 65, "max": 65}, "fixedWeight": 65}'),

-- Dumbbells
('Adjustable Dumbbell', 'dumbbell', true, false, '{"weightRange": {"min": 5, "max": 50}}'),
('Fixed Weight Dumbbell', 'dumbbell', true, false, '{"weightRange": {"min": 5, "max": 100}}'),

-- Kettlebells
('Adjustable Kettlebell', 'kettlebell', true, false, '{"weightRange": {"min": 12, "max": 53}}'),
('Fixed Weight Kettlebell', 'kettlebell', true, false, '{"weightRange": {"min": 8, "max": 106}}'),

-- Plates
('Weight Plate', 'plate', true, false, '{"weightRange": {"min": 2.5, "max": 45}}'),
('Bumper Plate', 'plate', true, false, '{"weightRange": {"min": 10, "max": 55}}'),

-- Bands
('Resistance Band', 'band', false, true, '{"resistanceLevels": ["light", "medium", "heavy", "extra-heavy"], "bandColors": ["red", "blue", "yellow", "black", "green"]}'),
('Loop Band', 'band', false, true, '{"resistanceLevels": ["light", "medium", "heavy"]}'),

-- Bodyweight
('Bodyweight', 'bodyweight', false, false, '{}'),

-- Cables
('Cable Machine', 'cable', false, true, '{"weightRange": {"min": 5, "max": 200}}'),

-- Machines
('Leg Press Machine', 'machine', false, false, '{"weightRange": {"min": 45, "max": 1000}}'),
('Smith Machine', 'machine', false, false, '{"weightRange": {"min": 15, "max": 500}}');

-- Seed data: Create some common equipment instances
INSERT INTO equipment_instances (equipment_type_id, name, specifications, is_available) 
SELECT 
  et.id,
  et.name || ' #1',
  CASE 
    WHEN et.name = 'Olympic Barbell' THEN '{"weight": 45, "condition": "excellent", "location": "Rack A"}'
    WHEN et.name = 'Adjustable Dumbbell' THEN '{"weightRange": {"min": 5, "max": 50}, "condition": "good", "location": "Dumbbell Area"}'
    WHEN et.name = 'Adjustable Kettlebell' THEN '{"weightRange": {"min": 12, "max": 53}, "condition": "excellent", "location": "Kettlebell Area"}'
    WHEN et.name = 'Resistance Band' THEN '{"resistanceLevel": "medium", "colors": ["red", "blue"], "condition": "good"}'
    ELSE '{}'
  END::jsonb,
  true
FROM equipment_types et
WHERE et.name IN ('Olympic Barbell', 'Adjustable Dumbbell', 'Adjustable Kettlebell', 'Resistance Band', 'Bodyweight');

-- Create a mapping function to convert legacy equipment strings to equipment type IDs
CREATE OR REPLACE FUNCTION get_equipment_type_id(legacy_equipment TEXT)
RETURNS UUID AS $$
DECLARE
  type_id UUID;
BEGIN
  -- Convert legacy equipment strings to equipment type IDs
  SELECT id INTO type_id
  FROM equipment_types
  WHERE 
    CASE LOWER(legacy_equipment)
      WHEN 'barbell' THEN name = 'Olympic Barbell'
      WHEN 'dumbbell' THEN name = 'Adjustable Dumbbell'
      WHEN 'kettlebell' THEN name = 'Adjustable Kettlebell'
      WHEN 'bodyweight' THEN name = 'Bodyweight'
      WHEN 'plate' THEN name = 'Weight Plate'
      WHEN 'band' THEN name = 'Resistance Band'
      WHEN 'cable' THEN name = 'Cable Machine'
      WHEN 'machine' THEN name = 'Leg Press Machine'
      ELSE name = 'Adjustable Dumbbell' -- fallback
    END;
    
  RETURN type_id;
END;
$$ LANGUAGE plpgsql;

-- Migrate existing exercises if they have equipment data
-- This assumes your exercises table has some equipment field to migrate from
-- UPDATE exercises 
-- SET primary_equipment_type_id = get_equipment_type_id(equipment)
-- WHERE equipment IS NOT NULL;

-- Create equipment preference migration for existing workout sessions
-- This would need to be customized based on your existing data structure
-- INSERT INTO workout_equipment_preferences (session_id, exercise_id, equipment_type_id)
-- SELECT DISTINCT ws.id, e.id, get_equipment_type_id(se.equipment)
-- FROM workout_sessions ws
-- JOIN session_exercises se ON se.session_id = ws.id
-- JOIN exercises e ON e.id = se.exercise_id
-- WHERE se.equipment IS NOT NULL;

-- Create updated trigger for equipment_types
CREATE OR REPLACE FUNCTION update_equipment_types_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_equipment_types_timestamp
  BEFORE UPDATE ON equipment_types
  FOR EACH ROW
  EXECUTE FUNCTION update_equipment_types_timestamp();

-- Create updated trigger for equipment_instances
CREATE OR REPLACE FUNCTION update_equipment_instances_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_equipment_instances_timestamp
  BEFORE UPDATE ON equipment_instances
  FOR EACH ROW
  EXECUTE FUNCTION update_equipment_instances_timestamp();

-- Add comments for documentation
COMMENT ON TABLE equipment_types IS 'Master table for equipment types (e.g., Olympic Barbell, Adjustable Dumbbell)';
COMMENT ON TABLE equipment_instances IS 'Specific instances of equipment types with individual specifications';
COMMENT ON TABLE workout_equipment_preferences IS 'Per-workout equipment preferences replacing legacy string-based equipment field';
COMMENT ON TABLE band_configurations IS 'User-defined resistance band combinations for advanced band exercises';

COMMENT ON COLUMN equipment_types.supports_dual_weights IS 'Whether this equipment type can have different weights per hand (dumbbells, kettlebells)';
COMMENT ON COLUMN equipment_types.supports_variable_resistance IS 'Whether resistance varies through range of motion (bands, cables)';
COMMENT ON COLUMN equipment_types.specifications IS 'JSON specifications: weightRange {min, max}, fixedWeight, resistanceLevels[], bandColors[]';

COMMENT ON COLUMN equipment_instances.specifications IS 'JSON specs for this instance: weight, resistanceLevel, condition, location, etc.';
COMMENT ON COLUMN equipment_instances.user_id IS 'NULL for gym equipment, UUID for user-owned equipment';

-- Create view for easy equipment lookup with type information
CREATE VIEW equipment_with_types AS
SELECT 
  ei.id as instance_id,
  ei.name as instance_name,
  ei.specifications as instance_specs,
  ei.is_available,
  ei.user_id,
  et.id as type_id,
  et.name as type_name,
  et.category,
  et.supports_dual_weights,
  et.supports_variable_resistance,
  et.specifications as type_specs
FROM equipment_instances ei
JOIN equipment_types et ON et.id = ei.equipment_type_id;

COMMENT ON VIEW equipment_with_types IS 'Convenient view combining equipment instances with their type information';