-- Create Compatibility Rating Enum
DO $$ BEGIN
    CREATE TYPE compatibility_level AS ENUM ('BORKED', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'NATIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Apps Table
CREATE TABLE IF NOT EXISTS public.apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  category TEXT,
  version TEXT,
  recommended_version TEXT,
  author TEXT,
  license TEXT,
  release_date DATE,
  score NUMERIC(3,2) DEFAULT 0, -- 1.00 to 5.00
  popularity INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE RESTRICT, -- Keep hardware info even if device is deleted from profile? Or CASCADE? 
                                                                           -- Usually, we want to keep the review's context. 
  rating compatibility_level NOT NULL,
  numerical_score INTEGER CHECK (numerical_score >= 1 AND numerical_score <= 5),
  content TEXT,
  app_version_tested TEXT,
  wine_proton_version TEXT,
  is_verified_report BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Apps
CREATE POLICY "Apps are viewable by everyone" ON public.apps
  FOR SELECT USING (true);

-- RLS Policies for Reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update app average score
CREATE OR REPLACE FUNCTION update_app_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.apps
  SET score = (
    SELECT AVG(numerical_score)::NUMERIC(3,2)
    FROM public.reviews
    WHERE app_id = NEW.app_id
  )
  WHERE id = NEW.app_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for score updates
CREATE TRIGGER on_review_submitted
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_app_score();

-- Trigger for updated_at
CREATE TRIGGER update_apps_updated_at
BEFORE UPDATE ON public.apps
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
