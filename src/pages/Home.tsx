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
            Barista skills.<br />
            <em>Latte art.</em>
          </h1>
          <p>
            A cinematic, structured learning platform for espresso fundamentals,
            milk steaming, free-pour latte art, cafe workflow, and project feedback.
          </p>
          <div className="hero-actions">
            <button className="primary large" onClick={startLearning}>
              <Play size={18} /> Start Learning Latte Art
            </button>
            <button className="secondary hero-secondary" onClick={() => go({ name: "courses" })}>
              Browse courses <ChevronRight size={18} />
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span>3</span><small>Courses</small></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span>SCA</span><small>Aligned</small></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span>6</span><small>Languages</small></div>
          </div>
        </div>
        <div className="hero-visual">
          <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* Outer ring */}
            <circle cx="160" cy="160" r="148" stroke="rgba(212,165,116,0.15)" strokeWidth="1"/>
            <circle cx="160" cy="160" r="120" stroke="rgba(212,165,116,0.1)" strokeWidth="1"/>
            {/* Cup saucer */}
            <ellipse cx="160" cy="240" rx="90" ry="14" fill="rgba(212,165,116,0.08)" stroke="rgba(212,165,116,0.2)" strokeWidth="1.5"/>
            {/* Cup body */}
            <path d="M85 170 Q88 238 160 242 Q232 238 235 170Z" fill="rgba(26,14,8,0.6)" stroke="rgba(212,165,116,0.3)" strokeWidth="1.5"/>
            {/* Coffee surface */}
            <ellipse cx="160" cy="170" rx="75" ry="18" fill="rgba(107,68,35,0.5)" stroke="rgba(212,165,116,0.25)" strokeWidth="1.5"/>
            {/* Latte art - rosetta leaves */}
            <path d="M160 162 Q148 152 136 158 Q130 164 138 172 Q148 178 160 182 Q172 178 182 172 Q190 164 184 158 Q172 152 160 162Z" fill="rgba(245,230,211,0.18)" stroke="rgba(245,230,211,0.3)" strokeWidth="1"/>
            <path d="M160 155 Q152 145 144 150 Q140 154 144 160" stroke="rgba(245,230,211,0.2)" strokeWidth="1" strokeLinecap="round"/>
            <path d="M160 155 Q168 145 176 150 Q180 154 176 160" stroke="rgba(245,230,211,0.2)" strokeWidth="1" strokeLinecap="round"/>
            {/* Center dot */}
            <circle cx="160" cy="168" r="3" fill="rgba(212,165,116,0.4)"/>
            {/* Steam */}
            <path d="M135 162 Q130 140 138 122 Q146 104 138 88" stroke="rgba(212,165,116,0.25)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M160 158 Q155 132 163 114 Q171 96 163 76" stroke="rgba(212,165,116,0.35)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M185 162 Q180 140 188 122 Q196 104 188 88" stroke="rgba(212,165,116,0.25)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            {/* Decorative dots */}
            <circle cx="42" cy="100" r="3" fill="rgba(212,165,116,0.2)"/>
            <circle cx="278" cy="220" r="4" fill="rgba(212,165,116,0.15)"/>
            <circle cx="60" cy="260" r="2" fill="rgba(212,165,116,0.12)"/>
            <circle cx="290" cy="80" r="2.5" fill="rgba(212,165,116,0.18)"/>
          </svg>
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
        <Value icon={<Gauge />} title="SCA-aligned pathway" text="Lessons follow SCA Coffee Skills Program themes and professional barista competencies." accent="gold" />
        <Value icon={<ShieldCheck />} title="Gated content" text="Lesson playback stays behind authentication and enrollment checks." accent="green" />
        <Value icon={<BarChart3 />} title="Multilingual learning" text="Video lessons can support subtitle tracks and materials by language." accent="brown" />
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

      <section className="band dark-band">
        <div className="section-heading">
          <p className="eyebrow" style={{ color: "var(--golden-crema)" }}>Course paths</p>
          <h2 style={{ color: "var(--cream-white)" }}>Three focused courses for the complete latte art journey.</h2>
        </div>
        <div className="progression-grid">
          {[
            { num: "01", title: "Barista Foundations", text: "Coffee basics, espresso workflow, safety, cleaning, and milk drinks.", level: "Beginner" },
            { num: "02", title: "Latte Art Fundamentals", text: "Microfoam, canvas building, hearts, and basic tulip foundation.", level: "Intermediate" },
            { num: "03", title: "Latte Art Advanced", text: "Free-pour rosetta, ripple control, winged tulip, and composition.", level: "Advanced" },
          ].map(({ num, title, text, level }) => (
            <article key={title} className="progression-card">
              <div className="progression-num">{num}</div>
              <span className="progression-level">{level}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <button className="progression-cta" onClick={() => go({ name: "courses" })}>
                View course <ChevronRight size={14} />
              </button>
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
