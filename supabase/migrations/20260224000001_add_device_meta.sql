-- Add name and is_primary columns to devices table
ALTER TABLE public.devices 
ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'My Device',
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS de TEXT;

-- Ensure only one primary device per user
CREATE UNIQUE INDEX IF NOT EXISTS unique_primary_device_per_user 
ON public.devices (user_id) 
WHERE (is_primary = true);
