-- ============================================================
-- Falfalla Academy — Supabase Database Setup
-- Run this in your Supabase SQL Editor (SQL tab in dashboard)
-- ============================================================

-- 1. Profiles table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  device_id TEXT,
  last_sign_in TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Access codes table
CREATE TABLE IF NOT EXISTS access_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  course_id TEXT NOT NULL,
  duration_days INT NOT NULL DEFAULT 7,
  redeemed_by UUID REFERENCES auth.users(id),
  redeemed_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Course access table (tracks who has access to what, with expiry)
CREATE TABLE IF NOT EXISTS course_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  access_code_id UUID REFERENCES access_codes(id),
  source TEXT NOT NULL CHECK (source IN ('code', 'purchase', 'admin')),
  UNIQUE(user_id, course_id)
);

-- 4. Student progress table (optional — syncs localStorage to DB)
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  enrolled_course_ids TEXT[] DEFAULT '{}',
  completed_lesson_ids TEXT[] DEFAULT '{}',
  bookmarked_lesson_ids TEXT[] DEFAULT '{}',
  lesson_notes JSONB DEFAULT '{}',
  watched_seconds INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  last_activity_date DATE,
  lesson_positions JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security (RLS) — CRITICAL for security
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Access codes: anyone authenticated can read active codes (for redemption)
CREATE POLICY "Authenticated users can read active codes"
  ON access_codes FOR SELECT
  USING (auth.role() = 'authenticated');

-- Access codes: admin can do everything
CREATE POLICY "Admin can manage access codes"
  ON access_codes FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Access codes: users can update (redeem) unredeemed codes
CREATE POLICY "Users can redeem codes"
  ON access_codes FOR UPDATE
  USING (
    auth.role() = 'authenticated'
    AND redeemed_by IS NULL
  )
  WITH CHECK (
    redeemed_by = auth.uid()
  );

-- Course access: users can read their own access
CREATE POLICY "Users can view own access"
  ON course_access FOR SELECT
  USING (auth.uid() = user_id);

-- Course access: users can insert their own access (via redemption)
CREATE POLICY "Users can create own access"
  ON course_access FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Course access: users can update their own access (renewal)
CREATE POLICY "Users can update own access"
  ON course_access FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin can manage all course access
CREATE POLICY "Admin can manage all access"
  ON course_access FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Student progress: users can manage their own progress
CREATE POLICY "Users can manage own progress"
  ON student_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Auto-create profile on signup (trigger)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists (safe re-run)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Create your admin account
-- After running this SQL:
-- 1. Sign up on the website with your email
-- 2. Then run this to make yourself admin:
--    UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
-- ============================================================
