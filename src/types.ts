export type Level = "beginner" | "intermediate" | "advanced";

export type Resource = {
  id: string;
  title: string;
  language: string;
  type: "pdf" | "checklist" | "worksheet";
  url: string;
};

export type SubtitleTrack = {
  id: string;
  language: string;
  label: string;
  src: string;
  isDefault?: boolean;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  theory: string;
  practice: string[];
  assessment: string;
  duration: number;
  videoUrl: string;
  subtitles: SubtitleTrack[];
  resources: Resource[];
};

export type CourseModule = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: Level;
  instructor: string;
  instructorBio: string;
  duration: number;
  thumbnailUrl: string;
  outcomes: string[];
  equipment: string[];
  enrollmentCount: number;
  reviews: CourseReview[];
  modules: CourseModule[];
};

export type CourseReview = {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
};

export type LessonRequest = {
  id: string;
  courseId: string;
  lessonId: string;
  author: string;
  type: "next" | "upcoming" | "material";
  comment: string;
  status: "new" | "reviewing" | "planned" | "done";
  createdAt: string;
};

export type ProjectUpload = {
  id: string;
  user: string;
  title: string;
  pattern: "Heart" | "Tulip" | "Rosetta" | "Swan" | "Free Pour";
  courseId: string;
  lessonId?: string;
  imageUrl: string;
  notes: string;
  likes: number;
  createdAt: string;
  featured?: boolean;
  comments: GalleryComment[];
};

export type GalleryComment = {
  id: string;
  author: string;
  comment: string;
  createdAt: string;
};

export type Badge = {
  id: string;
  title: string;
  description: string;
  requirement: string;
};

export type StudentState = {
  isAuthenticated: boolean;
  role: "student" | "admin";
  name: string;
  email: string;
  preferredLanguage: string;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  lessonNotes: Record<string, string>;
  lastLessonId?: string;
  watchedSeconds: number;
  streakDays: number;
  lastActivityDate: string;
  lessonPositions: Record<string, number>;
  likedUploadIds: string[];
  courseAccess: CourseAccess[];
  deviceId: string;
  sessionToken: string;
};

export type AccessCode = {
  id: string;
  code: string;
  courseId: string;
  durationDays: number;
  redeemedBy: string | null;
  redeemedAt: string | null;
  isActive: boolean;
  createdAt: string;
};

export type CourseAccess = {
  courseId: string;
  grantedAt: string;
  expiresAt: string;
  accessCodeId?: string;
  source: "code" | "purchase" | "admin";
};
