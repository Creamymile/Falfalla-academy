import { BookOpen, Bookmark, Camera, Check, Clock, Flame, Medal } from "lucide-react";
import { go } from "../router";
import { Course, ProjectUpload, StudentState } from "../types";
import { courseProgress, flattenLessons } from "../utils";
import { badges, getEarnedBadges } from "../constants";
import { CourseCard } from "../components/CourseCard";
import { GalleryCard } from "../components/GalleryCard";
import { Progress, Stat } from "../components/Shared";

export function Dashboard({
  courses,
  student,
  uploads,
}: {
  courses: Course[];
  student: StudentState;
  uploads: ProjectUpload[];
}) {
  const enrolled = courses.filter((c) => student.enrolledCourseIds.includes(c.id));
  const available = courses.filter((c) => !student.enrolledCourseIds.includes(c.id));
  const completedCount = student.completedLessonIds.length;
  const bookmarkedLessons = courses.flatMap((c) =>
    flattenLessons(c).filter((l) => student.bookmarkedLessonIds.includes(l.id)).map((l) => ({ course: c, lesson: l })),
  );
  const earnedBadges = getEarnedBadges(courses, student, uploads);
  const userUploads = uploads.filter((u) => u.user === student.name);
  const lastCourse = courses.find((c) => flattenLessons(c).some((l) => l.id === student.lastLessonId));
  const lastLesson = lastCourse ? flattenLessons(lastCourse).find((l) => l.id === student.lastLessonId) : undefined;

  return (
    <section className="page">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>{student.name}</h1>
        </div>
        {lastCourse && lastLesson && (
          <button className="primary" onClick={() => go({ name: "lesson", slug: lastCourse.slug, lessonId: lastLesson.id })}>
            Resume: {lastLesson.title}
          </button>
        )}
      </div>

      <div className="stats">
        <Stat icon={<BookOpen />} label="Courses enrolled" value={enrolled.length} />
        <Stat icon={<Check />} label="Lessons completed" value={completedCount} />
        <Stat icon={<Clock />} label="Watch time" value={`${Math.round(student.watchedSeconds / 360) / 10}h`} />
        <Stat icon={<Flame />} label="Day streak" value={student.streakDays} />
        <Stat icon={<Bookmark />} label="Saved lessons" value={bookmarkedLessons.length} />
      </div>

      <div className="dashboard-section">
        <div className="section-heading compact"><p className="eyebrow">Achievements</p><h2>Badges earned</h2></div>
        <div className="badge-grid">
          {badges.map((b) => (
            <article key={b.id} className={`badge-card ${earnedBadges.some((e) => e.id === b.id) ? "earned" : ""}`}>
              <Medal size={20} />
              <h3>{b.title}</h3>
              <p>{b.description}</p>
              <small>{b.requirement}</small>
            </article>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-heading compact"><p className="eyebrow">Projects</p><h2>Your uploaded practice</h2></div>
        {userUploads.length ? (
          <div className="gallery-grid compact-gallery">
            {userUploads.map((u) => <GalleryCard key={u.id} upload={u} courses={courses} />)}
          </div>
        ) : (
          <button className="secondary" onClick={() => go({ name: "upload" })}><Camera size={17} /> Upload your first attempt</button>
        )}
      </div>

      <div className="dashboard-section">
        <div className="section-heading compact"><p className="eyebrow">Saved</p><h2>Practice bookmarks</h2></div>
        {bookmarkedLessons.length ? (
          <div className="saved-list">
            {bookmarkedLessons.map(({ course, lesson }) => (
              <button key={lesson.id} className="saved-row" onClick={() => go({ name: "lesson", slug: course.slug, lessonId: lesson.id })}>
                <Bookmark size={16} /> <span>{lesson.title}</span> <small>{course.title}</small>
              </button>
            ))}
          </div>
        ) : (
          <p className="muted-copy">Save lessons from the player to build a personal practice list.</p>
        )}
      </div>

      <div className="dashboard-section">
        <div className="section-heading compact"><p className="eyebrow">Enrolled</p><h2>Your courses</h2></div>
      </div>
      <div className="course-grid">
        {enrolled.map((c) => <CourseCard key={c.id} course={c} courses={courses} student={student} />)}
      </div>

      {available.length > 0 && (
        <div className="dashboard-section">
          <div className="section-heading compact"><p className="eyebrow">Next</p><h2>Available to enroll</h2></div>
          <div className="course-grid">
            {available.map((c) => <CourseCard key={c.id} course={c} courses={courses} student={student} />)}
          </div>
        </div>
      )}
    </section>
  );
}
