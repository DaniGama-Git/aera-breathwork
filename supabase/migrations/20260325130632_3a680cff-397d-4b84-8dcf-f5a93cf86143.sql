-- Reset onboarding for all users (for testing)
UPDATE profiles SET onboarding_completed = false, recommended_session = null, recommended_time = null;
DELETE FROM onboarding_answers;