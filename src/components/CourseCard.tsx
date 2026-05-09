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

  return (
    <article className="course-card">
      <img src={course.thumbnailUrl} alt="" loading="lazy" />
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
