-- Add overall_rating to apps table
ALTER TABLE public.apps 
ADD COLUMN IF NOT EXISTS overall_rating compatibility_level;

-- Update the update_app_score function to also update the overall_rating
-- based on the most frequent rating (mode) or highest? 
-- Usually, we want a "consensus" rating. For simplicity, let's just keep the column for now
-- and we can update it via the seed script or a more complex trigger later.
