-- Add is_banned column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;

-- Update RLS: Banned users should not be able to update their profile or devices
-- (Select is still okay so we can check status in middleware/actions)

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id AND is_banned = false);

DROP POLICY IF EXISTS "Users can insert their own devices" ON public.devices;
CREATE POLICY "Users can insert their own devices" ON public.devices 
  FOR INSERT WITH CHECK (auth.uid() = user_id AND (SELECT is_banned FROM public.profiles WHERE id = auth.uid()) = false);

DROP POLICY IF EXISTS "Users can update own devices" ON public.devices;
CREATE POLICY "Users can update own devices" ON public.devices 
  FOR UPDATE USING (auth.uid() = user_id AND (SELECT is_banned FROM public.profiles WHERE id = auth.uid()) = false);
