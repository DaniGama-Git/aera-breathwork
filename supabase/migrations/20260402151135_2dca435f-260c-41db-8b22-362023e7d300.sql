
CREATE TABLE public.onboarding_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  goals TEXT[] NOT NULL DEFAULT '{}',
  moments TEXT[] NOT NULL DEFAULT '{}',
  calendar_keywords TEXT[] NOT NULL DEFAULT '{}',
  scheduled_enabled BOOLEAN NOT NULL DEFAULT false,
  scheduled_practice TEXT,
  scheduled_length TEXT,
  scheduled_times TEXT[] NOT NULL DEFAULT '{}',
  scheduled_frequency TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.onboarding_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
ON public.onboarding_preferences
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences"
ON public.onboarding_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.onboarding_preferences
FOR UPDATE
USING (auth.uid() = user_id);
