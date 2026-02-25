-- Update Reviews RLS: Banned users should not be able to submit or delete reviews
DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.reviews;
CREATE POLICY "Users can insert their own reviews" ON public.reviews 
  FOR INSERT WITH CHECK (auth.uid() = user_id AND (SELECT is_banned FROM public.profiles WHERE id = auth.uid()) = false);

DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
CREATE POLICY "Users can delete their own reviews" ON public.reviews 
  FOR DELETE USING (auth.uid() = user_id AND (SELECT is_banned FROM public.profiles WHERE id = auth.uid()) = false);
