import { BookOpen, Clock, Users } from "lucide-react";
import { go } from "../router";
import { Course, StudentState } from "../types";
import { courseLessonCount, courseProgress, flattenLessons } from "../utils";
import { isBestSeller, ratingSummary } from "../constants";
import { Progress, StarIcon } from "./Shared";

export function CourseCard({
  course,
  courses,
  student,
  onEnroll,
}: {
  course: Course;
  courses?: Course[];
  student: StudentState;
  onEnroll?: () => void;
}) {
  const enrolled = student.enrolledCourseIds.includes(course.id);
  const progress = courseProgress(course, student.completedLessonIds);
  const firstLesson = flattenLessons(course)[0];
  const rating = ratingSummary(course);
  const bestSeller = courses ? isBestSeller(course, courses) : false;

  const thumbnailGradient: Record<string, string> = {
    beginner: "linear-gradient(135deg, #3a5a35 0%, #5C7A56 50%, #8aad84 100%)",
    intermediate: "linear-gradient(135deg, #6B4423 0%, #D4A574 60%, #e8c99a 100%)",
    advanced: "linear-gradient(135deg, #1A0E08 0%, #3D2817 50%, #6B4423 100%)",
  };

  return (
    <article className="course-card">
      {course.thumbnailUrl ? (
        <img src={course.thumbnailUrl} alt={course.title} loading="lazy" />
      ) : (
        <div className="course-thumb-placeholder" style={{ background: thumbnailGradient[course.level] ?? thumbnailGradient.beginner }} aria-hidden="true">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="26" stroke="rgba(255,251,247,0.2)" strokeWidth="1.5"/>
            <circle cx="28" cy="28" r="18" stroke="rgba(255,251,247,0.15)" strokeWidth="1"/>
            <ellipse cx="28" cy="34" rx="14" ry="4" fill="rgba(255,251,247,0.1)" stroke="rgba(255,251,247,0.2)" strokeWidth="1"/>
            <path d="M22 24 Q24 18 28 16 Q32 18 34 24" stroke="rgba(255,251,247,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="28" cy="30" r="4" fill="rgba(255,251,247,0.12)" stroke="rgba(255,251,247,0.25)" strokeWidth="1"/>
          </svg>
        </div>
      )}
      <div>
        <div className="badge-row">
          <span className={`badge ${course.level}`}>{course.level}</span>
          {bestSeller && <span className="badge bestseller">Best seller</span>}
        </div>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="meta">
          <span><StarIcon /> {rating.average ? rating.average.toFixed(1) : "New"} ({rating.count})</span>
          <span><Users size={15} /> {course.enrollmentCount} students</span>
          <span><BookOpen size={15} /> {courseLessonCount(course)} lessons</span>
          <span><Clock size={15} /> {course.duration} min</span>
        </div>
        {enrolled && <Progress value={progress} />}
      </div>
      <div className="card-actions">
        <button className="secondary" onClick={() => go({ name: "course", slug: course.slug })}>Details</button>
        {enrolled ? (
          <button
            className="primary"
            onClick={() =>
              firstLesson && go({ name: "lesson", slug: course.slug, lessonId: student.lastLessonId ?? firstLesson.id })
            }
          >
            Continue
          </button>
        ) : (
          <button className="primary" onClick={onEnroll}>Enroll</button>
        )}
      </div>
    </article>
  );
}
