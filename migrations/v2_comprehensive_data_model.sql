-- Migration: Comprehensive Data Model v2.0
-- Date: 2025-01-19
-- Description: Complete database schema update for Fitness Tracker v2.0
-- Implements dual weight support, time-based exercises, equipment preferences, and band configurations

-- ============================================================================
-- PHASE 1: Update session_sets table for new data model
-- ============================================================================

-- Add new columns to session_sets table (if not already present)
DO $$ 
BEGIN
    -- Add dual weight columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session_sets' AND column_name = 'weight_left') THEN
        ALTER TABLE session_sets ADD COLUMN weight_left DECIMAL(6,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session_sets' AND column_name = 'weight_right') THEN
        ALTER TABLE session_sets ADD COLUMN weight_right DECIMAL(6,2);
    END IF;
    
    -- Add calculated total weight column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session_sets' AND column_name = 'total_weight') THEN
        ALTER TABLE session_sets ADD COLUMN total_weight DECIMAL(6,2);
    END IF;
    
    -- Add time-based exercise support
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session_sets' AND column_name = 'time_seconds') THEN
        ALTER TABLE session_sets ADD COLUMN time_seconds INTEGER;
    END IF;
    
    -- Add failure set tracking
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session_sets' AND column_name = 'is_failure') THEN
        ALTER TABLE session_sets ADD COLUMN is_failure BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add comments to document the usage
COMMENT ON COLUMN session_sets.weight IS 'Primary weight for symmetric exercises (both hands same weight)';
COMMENT ON COLUMN session_sets.weight_left IS 'Left hand weight for dual-weight exercises';
COMMENT ON COLUMN session_sets.weight_right IS 'Right hand weight for dual-weight exercises';
COMMENT ON COLUMN session_sets.total_weight IS 'Calculated total weight: weight OR (weight_left + weight_right)';
COMMENT ON COLUMN session_sets.time_seconds IS 'Time duration for time-based exercises (stored as seconds)';
COMMENT ON COLUMN session_sets.is_failure IS 'Flag indicating if this set was performed to failure';

-- ============================================================================
-- PHASE 2: Update exercises table with new metadata
-- ============================================================================

DO $$ 
BEGIN
    -- Add dual weight support flag
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exercises' AND column_name = 'supports_dual_weights') THEN
        ALTER TABLE exercises ADD COLUMN supports_dual_weights BOOLEAN DEFAULT false;
    END IF;
    
    -- Add bosu ball option flag
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exercises' AND column_name = 'has_bosu_option') THEN
        ALTER TABLE exercises ADD COLUMN has_bosu_option BOOLEAN DEFAULT false;
    END IF;
    
    -- Add abbreviation for UI
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exercises' AND column_name = 'abbreviation') THEN
        ALTER TABLE exercises ADD COLUMN abbreviation VARCHAR(50);
    END IF;
    
    -- Add alternative equipment support
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exercises' AND column_name = 'alternative_equipment') THEN
        ALTER TABLE exercises ADD COLUMN alternative_equipment TEXT[];
    END IF;
END $$;

-- ============================================================================
-- PHASE 3: Create new tables for equipment preferences and band configurations
-- ============================================================================

-- Equipment preferences per workout session
CREATE TABLE IF NOT EXISTS workout_equipment_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    equipment_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(session_id, exercise_id)
);

-- Band configurations
CREATE TABLE IF NOT EXISTS band_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    colors TEXT[] NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- PHASE 4: Add constraints and indexes
-- ============================================================================

-- Drop existing constraint if it exists and add updated one
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'chk_weight_provided') THEN
        ALTER TABLE session_sets DROP CONSTRAINT chk_weight_provided;
    END IF;
END $$;

-- Add comprehensive weight constraint
ALTER TABLE session_sets 
ADD CONSTRAINT chk_weight_provided 
CHECK (
    weight IS NOT NULL OR 
    (weight_left IS NOT NULL OR weight_right IS NOT NULL) OR
    time_seconds IS NOT NULL
);

-- Add constraint for time-based exercises
ALTER TABLE session_sets 
ADD CONSTRAINT chk_time_or_reps 
CHECK (
    (time_seconds IS NOT NULL AND reps IS NULL) OR
    (time_seconds IS NULL AND reps IS NOT NULL) OR
    (time_seconds IS NOT NULL AND reps IS NOT NULL) -- Allow both for flexibility
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_session_sets_dual_weights 
ON session_sets(weight_left, weight_right) 
WHERE weight_left IS NOT NULL OR weight_right IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_session_sets_total_weight 
ON session_sets(total_weight) 
WHERE total_weight IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_session_sets_time 
ON session_sets(time_seconds) 
WHERE time_seconds IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_workout_equipment_prefs 
ON workout_equipment_preferences(session_id, exercise_id);

CREATE INDEX IF NOT EXISTS idx_band_configs_user 
ON band_configurations(user_id);

-- ============================================================================
-- PHASE 5: Update exercise definitions with new metadata
-- ============================================================================

-- Update existing exercises with dual weight support and abbreviations
-- Note: Exercise names may need to be adjusted based on actual database content

-- Dual weight exercises
UPDATE exercises 
SET supports_dual_weights = true, 
    abbreviation = 'Bulgarian'
WHERE name ILIKE '%bulgarian%split%squat%';

UPDATE exercises 
SET supports_dual_weights = true, 
    abbreviation = 'Farmer''s',
    tracking_type = 'time'
WHERE name ILIKE '%farmer%carry%';

-- Single weight exercises with abbreviations
UPDATE exercises 
SET abbreviation = 'Back Squat'
WHERE name ILIKE '%barbell%back%squat%';

UPDATE exercises 
SET abbreviation = 'Romanian DL'
WHERE name ILIKE '%romanian%deadlift%';

UPDATE exercises 
SET abbreviation = 'Russian'
WHERE name ILIKE '%russian%twist%';

UPDATE exercises 
SET abbreviation = 'DB Overhead'
WHERE name ILIKE '%dumbbell%overhead%press%';

UPDATE exercises 
SET abbreviation = 'Pullups'
WHERE name ILIKE '%pull%up%';

UPDATE exercises 
SET abbreviation = 'Bear'
WHERE name ILIKE '%bear%pos%';

UPDATE exercises 
SET abbreviation = 'Deadlift'
WHERE name ILIKE '%barbell%deadlift%' AND name NOT ILIKE '%romanian%';

UPDATE exercises 
SET abbreviation = 'DB Incline'
WHERE name ILIKE '%dumbbell%incline%press%';

UPDATE exercises 
SET abbreviation = 'Def. Pushups'
WHERE name ILIKE '%deficit%pushup%';

UPDATE exercises 
SET abbreviation = 'Pullover'
WHERE name ILIKE '%glute%bridge%pullover%';

UPDATE exercises 
SET abbreviation = 'Goblet',
    has_bosu_option = true
WHERE name ILIKE '%goblet%squat%';

UPDATE exercises 
SET abbreviation = 'Bench Press'
WHERE name ILIKE '%barbell%bench%press%';

UPDATE exercises 
SET abbreviation = 'Lateral Raise'
WHERE name ILIKE '%lateral%raise%';

UPDATE exercises 
SET abbreviation = 'Halo Chop'
WHERE name ILIKE '%halo%chop%';

UPDATE exercises 
SET abbreviation = 'Rows'
WHERE name ILIKE '%row%';

UPDATE exercises 
SET abbreviation = 'Palloff'
WHERE name ILIKE '%palloff%press%';

-- ============================================================================
-- PHASE 6: Create functions for calculated fields
-- ============================================================================

-- Function to calculate total weight
CREATE OR REPLACE FUNCTION calculate_total_weight(
    p_weight DECIMAL,
    p_weight_left DECIMAL,
    p_weight_right DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
    -- If primary weight is set, use it
    IF p_weight IS NOT NULL THEN
        RETURN p_weight;
    END IF;
    
    -- If dual weights are set, sum them
    IF p_weight_left IS NOT NULL OR p_weight_right IS NOT NULL THEN
        RETURN COALESCE(p_weight_left, 0) + COALESCE(p_weight_right, 0);
    END IF;
    
    -- Return null if no weights are set
    RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to automatically calculate total_weight
CREATE OR REPLACE FUNCTION update_total_weight() RETURNS TRIGGER AS $$
BEGIN
    NEW.total_weight = calculate_total_weight(NEW.weight, NEW.weight_left, NEW.weight_right);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS trigger_update_total_weight ON session_sets;
CREATE TRIGGER trigger_update_total_weight
    BEFORE INSERT OR UPDATE ON session_sets
    FOR EACH ROW
    EXECUTE FUNCTION update_total_weight();

-- ============================================================================
-- PHASE 7: Insert default band configurations
-- ============================================================================

-- Insert default band configurations for system use
-- Note: These will be created for each user or as system defaults

INSERT INTO band_configurations (name, colors, user_id, is_default) 
VALUES 
    ('Red', ARRAY['red'], NULL, true),
    ('Blue', ARRAY['blue'], NULL, true),
    ('Yellow', ARRAY['yellow'], NULL, true),
    ('Black', ARRAY['black'], NULL, true),
    ('Red + Blue', ARRAY['red', 'blue'], NULL, true),
    ('Red + Yellow', ARRAY['red', 'yellow'], NULL, true),
    ('Blue + Yellow', ARRAY['blue', 'yellow'], NULL, true),
    ('Red + Blue + Yellow', ARRAY['red', 'blue', 'yellow'], NULL, true),
    ('All Bands', ARRAY['red', 'blue', 'yellow', 'black'], NULL, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PHASE 8: Data validation and cleanup
-- ============================================================================

-- Update existing session_sets to have proper total_weight calculated
UPDATE session_sets 
SET total_weight = calculate_total_weight(weight, weight_left, weight_right)
WHERE total_weight IS NULL;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify migration success
DO $$
DECLARE
    dual_weight_count INTEGER;
    time_based_count INTEGER;
    exercise_count INTEGER;
BEGIN
    -- Check dual weight columns exist
    SELECT COUNT(*) INTO dual_weight_count
    FROM information_schema.columns 
    WHERE table_name = 'session_sets' 
    AND column_name IN ('weight_left', 'weight_right', 'total_weight');
    
    -- Check time-based columns exist
    SELECT COUNT(*) INTO time_based_count
    FROM information_schema.columns 
    WHERE table_name = 'session_sets' 
    AND column_name IN ('time_seconds', 'is_failure');
    
    -- Check exercise updates
    SELECT COUNT(*) INTO exercise_count
    FROM information_schema.columns 
    WHERE table_name = 'exercises' 
    AND column_name IN ('supports_dual_weights', 'has_bosu_option', 'abbreviation');
    
    RAISE NOTICE 'Migration verification:';
    RAISE NOTICE 'Dual weight columns: % (expected: 3)', dual_weight_count;
    RAISE NOTICE 'Time-based columns: % (expected: 2)', time_based_count;
    RAISE NOTICE 'Exercise metadata columns: % (expected: 3)', exercise_count;
    
    IF dual_weight_count >= 3 AND time_based_count >= 2 AND exercise_count >= 3 THEN
        RAISE NOTICE 'Migration completed successfully!';
    ELSE
        RAISE WARNING 'Migration may be incomplete. Please check manually.';
    END IF;
END $$;