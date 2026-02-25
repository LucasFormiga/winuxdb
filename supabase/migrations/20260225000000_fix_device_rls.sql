-- Fix RLS policies for devices to allow public viewing
-- Hardware info needs to be public so it can be shown on reviews

-- Drop existing restricted select policy if it exists
DROP POLICY IF EXISTS "Users can view own devices" ON public.devices;

-- Create new public select policy
CREATE POLICY "Devices are viewable by everyone" ON public.devices
  FOR SELECT USING (true);

-- Ensure other policies still exist and are correct
-- (They should already be there from previous migrations, but we re-assert them for clarity)
DROP POLICY IF EXISTS "Users can insert own devices" ON public.devices;
CREATE POLICY "Users can insert own devices" ON public.devices 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own devices" ON public.devices;
CREATE POLICY "Users can update own devices" ON public.devices 
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own devices" ON public.devices;
CREATE POLICY "Users can delete own devices" ON public.devices 
  FOR DELETE USING (auth.uid() = user_id);
