import { Course, Lesson } from "./types";

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

export function courseLessonCount(course: Course) {
  return course.modules.reduce((total, module) => total + module.lessons.length, 0);
}

export function flattenLessons(course: Course): Lesson[] {
  return course.modules.flatMap((module) => module.lessons);
}

export function courseProgress(course: Course, completedLessonIds: string[]) {
  const lessons = flattenLessons(course);
  if (lessons.length === 0) return 0;
  const completed = lessons.filter((lesson) =>
    completedLessonIds.includes(lesson.id),
  ).length;
  return Math.round((completed / lessons.length) * 100);
}

export function findCourseBySlug(courses: Course[], slug: string) {
  return courses.find((course) => course.slug === slug);
}

export function findLesson(
  courses: Course[],
  courseSlug: string,
  lessonId: string,
) {
  const course = findCourseBySlug(courses, courseSlug);
  const lesson = course ? flattenLessons(course).find((item) => item.id === lessonId) : undefined;
  return { course, lesson };
}

export function nextLesson(course: Course, lessonId: string) {
  const lessons = flattenLessons(course);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return index >= 0 ? lessons[index + 1] : undefined;
}
