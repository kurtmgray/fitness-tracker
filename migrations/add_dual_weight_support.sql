-- Migration: Add dual weight support for asymmetric exercises
-- Date: 2025-07-05
-- Description: Add weight_left and weight_right columns to session_sets table for exercises like Farmer's Carry and Bulgarian Split Squats

-- Add new columns to session_sets table
ALTER TABLE session_sets 
ADD COLUMN weight_left DECIMAL(6,2),
ADD COLUMN weight_right DECIMAL(6,2);

-- Add comment to document the usage
COMMENT ON COLUMN session_sets.weight IS 'Primary weight for symmetric exercises (both hands same weight)';
COMMENT ON COLUMN session_sets.weight_left IS 'Left hand weight for asymmetric exercises';
COMMENT ON COLUMN session_sets.weight_right IS 'Right hand weight for asymmetric exercises';

-- Add check constraint to ensure at least one weight is provided
ALTER TABLE session_sets 
ADD CONSTRAINT chk_weight_provided 
CHECK (
  weight IS NOT NULL OR 
  (weight_left IS NOT NULL OR weight_right IS NOT NULL)
);

-- Update exercises table to track which exercises support dual weights
ALTER TABLE exercises 
ADD COLUMN supports_dual_weights BOOLEAN DEFAULT false;

-- Update specific exercises that support dual weights
UPDATE exercises 
SET supports_dual_weights = true 
WHERE name IN ('Farmers Carry', 'Bulgarian Split Squats');

-- Add index for performance on new columns
CREATE INDEX idx_session_sets_dual_weights ON session_sets(weight_left, weight_right) 
WHERE weight_left IS NOT NULL OR weight_right IS NOT NULL;