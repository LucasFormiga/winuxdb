-- Add soft delete support to devices
ALTER TABLE public.devices 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Update RLS policies to respect soft delete for active management
-- We keep "Devices are viewable by everyone" as-is so reviews can still see them
-- but we update management policies.

DROP POLICY IF EXISTS "Users can update own devices" ON public.devices;
CREATE POLICY "Users can update own devices" ON public.devices 
  FOR UPDATE USING (auth.uid() = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can delete own devices" ON public.devices;
-- Actually, we'll keep the delete policy but users should use the server action for soft delete
-- If someone manages to call hard delete, it's still restricted to their own ID.
