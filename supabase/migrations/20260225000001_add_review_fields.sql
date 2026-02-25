-- Add missing fields to reviews table for better compatibility reporting
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS stability TEXT,
ADD COLUMN IF NOT EXISTS performance TEXT,
ADD COLUMN IF NOT EXISTS installation TEXT,
ADD COLUMN IF NOT EXISTS tinker_steps TEXT[] DEFAULT '{}';
