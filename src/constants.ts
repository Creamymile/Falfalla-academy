import { Badge, ProjectUpload, StudentState } from "./types";

export const COURSE_IDS = [
  "barista-foundations",
  "latte-art-fundamentals",
  "latte-art-advanced",
];

export const CONTENT_KEY = "falfalla-academy-content-v2";
export const REQUESTS_KEY = "falfalla-academy-lesson-requests";
export const UPLOADS_KEY = "falfalla-academy-gallery-uploads";

export const supportedLanguages = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ar", label: "Arabic" },
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "es", label: "Spanish" },
];

export const badges: Badge[] = [
  { id: "beginner-barista", title: "Beginner Barista", description: "Enroll in Barista Foundations.", requirement: "Enroll in the first course" },
  { id: "milk-texture-master", title: "Milk Texture Master", description: "Complete at least three lessons.", requirement: "Complete 3 lessons" },
  { id: "heart-pour", title: "Heart Pour", description: "Upload one heart pour practice project.", requirement: "Upload a Heart project" },
  { id: "rosetta-master", title: "Rosetta Master", description: "Upload one rosetta practice project.", requirement: "Upload a Rosetta project" },
  { id: "completion-certificate", title: "Completion Certificate", description: "Complete every lesson in an enrolled course.", requirement: "Finish a course" },
];

export const starterUploads: ProjectUpload[] = [];

export function getEarnedBadges(
  courses: { id: string; modules: { lessons: { id: string }[] }[] }[],
  student: { enrolledCourseIds: string[]; completedLessonIds: string[]; name: string },
  uploads: ProjectUpload[],
) {
  const courseProgress = (course: typeof courses[0]) => {
    const lessons = course.modules.flatMap((m) => m.lessons);
    if (!lessons.length) return 0;
    return Math.round(lessons.filter((l) => student.completedLessonIds.includes(l.id)).length / lessons.length * 100);
  };
  const completedCourse = courses.some((c) => courseProgress(c) === 100);

  return badges.filter((badge) => {
    if (badge.id === "beginner-barista") return student.enrolledCourseIds.length > 0;
    if (badge.id === "milk-texture-master") return student.completedLessonIds.length >= 3;
    if (badge.id === "heart-pour") return uploads.some((u) => u.user === student.name && u.pattern === "Heart");
    if (badge.id === "rosetta-master") return uploads.some((u) => u.user === student.name && u.pattern === "Rosetta");
    if (badge.id === "completion-certificate") return completedCourse;
    return false;
  });
}

export function ratingSummary(course: { reviews: { rating: number }[] }) {
  const reviews = course.reviews ?? [];
  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  return { average, count: reviews.length };
}

export function isBestSeller(course: { enrollmentCount?: number }, courses: { enrollmentCount?: number }[]) {
  const max = Math.max(...courses.map((c) => c.enrollmentCount ?? 0));
  if (max === 0) return false; // No best seller when no enrollments yet
  return (course.enrollmentCount ?? 0) === max;
}

export function makeSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function updateStreak(student: StudentState): Pick<StudentState, "streakDays" | "lastActivityDate"> {
  const today = todayISO();
  if (student.lastActivityDate === today) return { streakDays: student.streakDays, lastActivityDate: today };
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streak = student.lastActivityDate === yesterday ? student.streakDays + 1 : 1;
  return { streakDays: streak, lastActivityDate: today };
}
