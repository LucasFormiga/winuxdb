-- Add avatar_url column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update handle_new_user function to include avatar_url from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  initial_nickname TEXT;
  initial_avatar TEXT;
BEGIN
  -- Extract nickname from raw_user_meta_data
  initial_nickname := COALESCE(
    NEW.raw_user_meta_data->>'nickname',
    NEW.raw_user_meta_data->>'full_name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Extract avatar from raw_user_meta_data (Google uses 'picture', GitHub uses 'avatar_url')
  initial_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture'
  );

  INSERT INTO public.profiles (id, nickname, avatar_url, default_language)
  VALUES (
    NEW.id, 
    initial_nickname, 
    initial_avatar, 
    COALESCE(NEW.raw_user_meta_data->>'language', 'en')
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
