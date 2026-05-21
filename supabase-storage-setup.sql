-- ═══════════════════════════════════════════════════════════════
-- Falfalla Academy — Supabase Storage Setup
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-videos', 'lesson-videos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-resources', 'lesson-resources', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-subtitles', 'lesson-subtitles', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-uploads', 'gallery-uploads', true);

-- 2. lesson-videos: admins can upload/update/delete, everyone can read
CREATE POLICY "Anyone can view lesson videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lesson-videos');

CREATE POLICY "Admins can upload lesson videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'lesson-videos'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update lesson videos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'lesson-videos'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete lesson videos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'lesson-videos'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. lesson-resources: admins can upload/update/delete, everyone can read
CREATE POLICY "Anyone can view lesson resources"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lesson-resources');

CREATE POLICY "Admins can upload lesson resources"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'lesson-resources'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update lesson resources"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'lesson-resources'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete lesson resources"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'lesson-resources'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. lesson-subtitles: admins can upload/update/delete, everyone can read
CREATE POLICY "Anyone can view lesson subtitles"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lesson-subtitles');

CREATE POLICY "Admins can upload lesson subtitles"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'lesson-subtitles'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update lesson subtitles"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'lesson-subtitles'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete lesson subtitles"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'lesson-subtitles'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 5. gallery-uploads: authenticated users can upload, everyone can read
CREATE POLICY "Anyone can view gallery uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery-uploads');

CREATE POLICY "Authenticated users can upload gallery images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gallery-uploads'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own gallery uploads"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'gallery-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own gallery uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gallery-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
