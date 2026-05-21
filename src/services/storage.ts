import { supabase } from "../lib/supabase";

// ── Bucket Names ───────────────────────────────────────────
const BUCKETS = {
  videos: "lesson-videos",
  resources: "lesson-resources",
  subtitles: "lesson-subtitles",
  gallery: "gallery-uploads",
} as const;

// ── Upload Helpers ─────────────────────────────────────────

/** Upload a lesson video (admin only) */
export async function uploadVideo(
  courseId: string,
  lessonId: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const ext = file.name.split(".").pop() ?? "mp4";
  const path = `${courseId}/${lessonId}/video.${ext}`;
  return uploadFile(BUCKETS.videos, path, file, onProgress);
}

/** Upload a lesson resource (admin only) */
export async function uploadResource(
  courseId: string,
  lessonId: string,
  resourceId: string,
  file: File,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${courseId}/${lessonId}/${resourceId}-${safeName}`;
  return uploadFile(BUCKETS.resources, path, file);
}

/** Upload a subtitle file (admin only) */
export async function uploadSubtitle(
  courseId: string,
  lessonId: string,
  subtitleId: string,
  file: File,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${courseId}/${lessonId}/${subtitleId}-${safeName}`;
  return uploadFile(BUCKETS.subtitles, path, file);
}

/** Upload a student gallery image */
export async function uploadGalleryImage(
  userId: string,
  file: File,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const timestamp = Date.now();
  const path = `${userId}/${timestamp}.${ext}`;
  return uploadFile(BUCKETS.gallery, path, file);
}

// ── Core Upload Function ───────────────────────────────────

async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  // Start progress
  onProgress?.(10);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true, // Overwrite if exists (e.g. re-uploading a video)
    });

  if (error) {
    return { ok: false, error: error.message };
  }

  onProgress?.(90);

  // Get public URL
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  onProgress?.(100);

  return { ok: true, url: data.publicUrl };
}

// ── Delete Helper ──────────────────────────────────────────

export async function deleteFile(
  bucket: keyof typeof BUCKETS,
  path: string,
): Promise<void> {
  await supabase.storage.from(BUCKETS[bucket]).remove([path]);
}
