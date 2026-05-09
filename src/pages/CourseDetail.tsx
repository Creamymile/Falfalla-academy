import { Award, BookOpen, Check, Clock, GraduationCap, KeyRound, Play, Wrench, Users } from "lucide-react";
import { useState } from "react";
import { go } from "../router";
import { Course, CourseReview, StudentState } from "../types";
import { courseLessonCount, courseProgress, findCourseBySlug, flattenLessons } from "../utils";
import { isBestSeller, ratingSummary } from "../constants";
import { NotFound, Progress, StarIcon } from "../components/Shared";
import { accessTimeRemaining, hasValidAccess } from "../services/access";

export function CourseDetail({
  slug,
  courses,
  student,
  updateStudent,
  updateCourses,
}: {
  slug: string;
  courses: Course[];
  student: StudentState;
  updateStudent: (s: StudentState) => void;
  updateCourses: (c: Course[]) => void;
}) {
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const course = findCourseBySlug(courses, slug);
  if (!course) return <NotFound />;

  const enrolled = student.enrolledCourseIds.includes(course.id);
  const progress = courseProgress(course, student.completedLessonIds);
  const firstLesson = flattenLessons(course)[0];
  const rating = ratingSummary(course);

  const enroll = () =>
    updateStudent({
      ...student,
      enrolledCourseIds: enrolled ? student.enrolledCourseIds : [...student.enrolledCourseIds, course.id],
    });

  const submitReview = () => {
    if (!reviewTitle.trim() || !reviewComment.trim()) return;
    const review: CourseReview = {
      id: `review-${course.id}-${course.reviews.length + 1}`,
      author: student.name,
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      createdAt: "Today",
    };
    updateCourses(courses.map((c) => c.id === course.id ? { ...c, reviews: [review, ...(c.reviews ?? [])] } : c));
    setReviewTitle("");
    setReviewComment("");
    setReviewRating(5);
  };

  return (
    <section className="page">
      <div className="detail-hero animate-fade-in">
        <img src={course.thumbnailUrl} alt="" />
        <div>
          <span className={`badge ${course.level}`}>{course.level}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="meta">
            <span><StarIcon /> {rating.average ? rating.average.toFixed(1) : "New"} rating</span>
            <span><Users size={16} /> {course.enrollmentCount} students</span>
            <span><GraduationCap size={16} /> {course.instructor}</span>
            <span><BookOpen size={16} /> {courseLessonCount(course)} lessons</span>
            <span><Clock size={16} /> {course.duration} min</span>
          </div>
          {isBestSeller(course, courses) && <span className="badge bestseller">Best seller</span>}
          {enrolled && <Progress value={progress} />}
          {enrolled && student.role !== "admin" && hasValidAccess(student, course.id) && (
            <div className="access-remaining">
              <Clock size={14} /> {accessTimeRemaining(student, course.id)}
            </div>
          )}
          <div className="hero-actions">
            {!enrolled && (
              <>
                <button className="primary" onClick={() => go({ name: "redeem" })}>
                  <KeyRound size={17} /> Redeem access code
                </button>
                <button className="secondary" onClick={() => go({ name: "pricing" })}>
                  Purchase access
                </button>
              </>
            )}
            {enrolled && hasValidAccess(student, course.id) && firstLesson && (
              <button className="primary" onClick={() => go({ name: "lesson", slug: course.slug, lessonId: student.lastLessonId ?? firstLesson.id })}>
                Continue learning
              </button>
            )}
            {enrolled && !hasValidAccess(student, course.id) && (
              <button className="primary" onClick={() => go({ name: "redeem" })}>
                <KeyRound size={17} /> Renew access
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="two-column">
        <section>
          <h2>What you will learn</h2>
          <div className="outcomes">
            {course.outcomes.map((o) => (
              <span key={o}><Check size={16} /> {o}</span>
            ))}
          </div>
          <h2>Curriculum</h2>
          <div className="module-list">
            {course.modules.map((mod) => (
              <article key={mod.id} className="module">
                <h3>{mod.title}</h3>
                <p>{mod.description}</p>
                {mod.lessons.map((lesson) => {
                  const complete = student.completedLessonIds.includes(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      className="lesson-row"
                      onClick={() => enrolled ? go({ name: "lesson", slug: course.slug, lessonId: lesson.id }) : enroll()}
                    >
                      <span className={complete ? "status complete" : "status"}>
                        {complete ? <Check size={15} /> : <Play size={15} />}
                      </span>
                      <span>{lesson.title}</span>
                      <small>{Math.floor(lesson.duration / 60)}m</small>
                    </button>
                  );
                })}
              </article>
            ))}
          </div>
        </section>
        <aside>
          <div className="instructor-card">
            <Award size={28} />
            <h3>{course.instructor}</h3>
            <p>{course.instructorBio}</p>
          </div>
          {course.equipment && course.equipment.length > 0 && (
            <div className="equipment-card">
              <Wrench size={22} />
              <h3>Tools & equipment</h3>
              <ul>
                {course.equipment.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <section className="reviews-section">
        <div className="section-heading compact">
          <p className="eyebrow">Reviews</p>
          <h2>Student feedback</h2>
        </div>
        <div className="review-summary">
          <strong>{rating.average ? rating.average.toFixed(1) : "New"}</strong>
          <span>{rating.count} review(s)</span>
          <small>{course.enrollmentCount} enrolled students</small>
        </div>
        <div className="reviews-grid">
          {course.reviews.map((r) => (
            <article className="review-card" key={r.id}>
              <div><StarIcon /> <strong>{r.rating}.0</strong></div>
              <h3>{r.title}</h3>
              <p>{r.comment}</p>
              <small>{r.author} &middot; {r.createdAt}</small>
            </article>
          ))}
        </div>
        {student.isAuthenticated && (
          <div className="review-form">
            <h3>Add your review</h3>
            <label>
              Rating
              <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
              </select>
            </label>
            <input value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} placeholder="Short review title" />
            <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Tell future students who this course is best for." />
            <button className="primary" onClick={submitReview}>Publish review</button>
          </div>
        )}
      </section>
    </section>
  );
}
