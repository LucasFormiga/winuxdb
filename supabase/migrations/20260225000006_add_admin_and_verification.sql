-- Add is_admin and is_verified to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Update Reviews RLS: Hide reviews from banned users for everyone
-- We modify the SELECT policy to join with profiles and check is_banned
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = reviews.user_id 
      AND profiles.is_banned = false
    )
  );
