import { ArrowRight, BarChart3, ChevronRight, Gauge, Play, ShieldCheck } from "lucide-react";
import { go } from "../router";
import { Course, StudentState } from "../types";
import { CourseCard } from "../components/CourseCard";
import { StarIcon, Value } from "../components/Shared";

export function Home({
  courses,
  student,
  updateStudent,
}: {
  courses: Course[];
  student: StudentState;
  updateStudent: (s: StudentState) => void;
}) {
  const startLearning = () => {
    if (student.isAuthenticated) {
      go({ name: "dashboard" });
    } else {
      go({ name: "login" });
    }
  };

  return (
    <>
      <section className="hero">
        <div className="hero-copy animate-fade-up">
          <p className="eyebrow">Falfalla Academy</p>
          <h1>
            Barista skills.
            <br />
            Latte art.
          </h1>
          <p>
            A cinematic, structured learning platform for espresso fundamentals,
            milk steaming, free-pour latte art, cafe workflow, and project feedback.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={startLearning}>
              <Play size={18} /> Start Learning Latte Art
            </button>
            <button className="secondary" onClick={() => go({ name: "courses" })}>
              Browse courses <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="section-heading animate-fade-up">
          <p className="eyebrow">Course paths</p>
          <h2>Built for progression, not random tutorials.</h2>
        </div>
        <div className="course-grid">
          {courses.map((course, i) => (
            <div key={course.id} className={`animate-fade-up delay-${i + 1}`}>
              <CourseCard course={course} courses={courses} student={student} />
            </div>
          ))}
        </div>
      </section>

      <section className="value-grid">
        <Value icon={<Gauge />} title="SCA-aligned pathway" text="Lessons follow SCA Coffee Skills Program themes and professional barista competencies." />
        <Value icon={<ShieldCheck />} title="Gated content" text="Lesson playback stays behind authentication and enrollment checks." />
        <Value icon={<BarChart3 />} title="Multilingual learning" text="Video lessons can support subtitle tracks and materials by language." />
      </section>

      <section className="band before-after-section">
        <div className="section-heading">
          <p className="eyebrow">Transformation</p>
          <h2>From first pour to competition-ready.</h2>
        </div>
        <div className="before-after-grid">
          {[
            { before: "Uneven foam with large bubbles", after: "Glossy, integrated microfoam", stage: "Milk texture" },
            { before: "Washed-out crema, no contrast", after: "Rich canvas with preserved contrast", stage: "Canvas building" },
            { before: "Off-center, inconsistent shapes", after: "Centered, repeatable patterns", stage: "Pour control" },
            { before: "Random practice, slow progress", after: "Structured drills, measurable goals", stage: "Practice method" },
          ].map((item) => (
            <article key={item.stage} className="before-after-card">
              <span className="ba-label">{item.stage}</span>
              <div className="ba-row">
                <span className="ba-before">{item.before}</span>
                <ArrowRight size={16} />
                <span className="ba-after">{item.after}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="section-heading">
          <p className="eyebrow">Course paths</p>
          <h2>Three focused courses for the complete latte art journey.</h2>
        </div>
        <div className="progression-grid">
          {[
            ["Barista Foundations", "Coffee basics, espresso workflow, safety, cleaning, and milk drinks."],
            ["Latte Art Fundamentals", "Microfoam, canvas building, hearts, and basic tulip foundation."],
            ["Latte Art Advanced", "Free-pour rosetta, ripple control, winged tulip, and composition."],
          ].map(([title, text]) => (
            <article key={title} className="value compact-value">
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="band split-band">
        <div>
          <p className="eyebrow">Instructor credibility</p>
          <h2>Professional structure, creative practice.</h2>
          <p>
            Lessons combine SCA-aligned barista skills, measurable practice drills,
            student uploads, reviews, and admin-managed lesson requests.
          </p>
        </div>
        <div className="testimonial-stack">
          {courses.flatMap((c) => c.reviews).slice(0, 2).map((r) => (
            <article className="review-card" key={r.id}>
              <StarIcon /> <strong>{r.rating}.0</strong>
              <h3>{r.title}</h3>
              <p>{r.comment}</p>
              <small>{r.author}</small>
            </article>
          ))}
          {courses.flatMap((c) => c.reviews).length === 0 && (
            <article className="review-card">
              <StarIcon /> <strong>New</strong>
              <h3>Be the first to review</h3>
              <p>Enroll in a course and share your experience with the community.</p>
            </article>
          )}
        </div>
      </section>

      <section className="band faq">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Before students enroll</h2>
        </div>
        <details open>
          <summary>Do I need barista experience?</summary>
          <p>No. Barista Foundations starts with tools, safety, espresso basics, milk drinks, and workflow.</p>
        </details>
        <details>
          <summary>Can I upload my latte art practice?</summary>
          <p>Yes. Students can upload attempts to the community gallery and receive comments.</p>
        </details>
        <details>
          <summary>Will videos support subtitles?</summary>
          <p>Yes. Lessons support WebVTT subtitle tracks for multiple languages.</p>
        </details>
      </section>


    </>
  );
}
