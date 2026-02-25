-- Add alternatives and extra fields to apps table
ALTER TABLE public.apps 
ADD COLUMN IF NOT EXISTS native_alternatives TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS recommended_alternatives TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gpu_compatibility JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS instructions JSONB DEFAULT '{}';
