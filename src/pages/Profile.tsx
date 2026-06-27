import { Medal, Printer, Trophy, User } from "lucide-react";
import { Course, ProjectUpload, StudentState } from "../types";
import { courseProgress } from "../utils";
import { badges, getEarnedBadges } from "../constants";
import { LanguageSelect } from "../components/Shared";

export function Profile({
  student,
  updateStudent,
  courses,
  uploads,
}: {
  student: StudentState;
  updateStudent: (s: StudentState) => void;
  courses: Course[];
  uploads: ProjectUpload[];
}) {
  const earned = getEarnedBadges(courses, student, uploads);
  return (
    <section className="page">
      <div className="profile-hero">
        <User size={42} />
        <div>
          <p className="eyebrow">Profile</p>
          <h1>{student.name}</h1>
        </div>
      </div>
      <div className="editor-panel profile-panel">
        <label>Display name<input value={student.name} onChange={(e) => updateStudent({ ...student, name: e.target.value })} /></label>
        <label>Preferred subtitle language<LanguageSelect value={student.preferredLanguage} onChange={(l) => updateStudent({ ...student, preferredLanguage: l })} /></label>
      </div>
      <div className="badge-grid">
        {badges.map((b) => (
          <article key={b.id} className={`badge-card ${earned.some((e) => e.id === b.id) ? "earned" : ""}`}>
            <Medal size={20} /><h3>{b.title}</h3><p>{b.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

// ── Certificate emblem SVGs per level ──────────────────────────

function CoffeeCupEmblem() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="cert-emblem-svg">
      <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.35"/>
      <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      {/* Saucer */}
      <ellipse cx="60" cy="92" rx="34" ry="6" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.06"/>
      {/* Cup */}
      <path d="M28 62 Q30 90 60 93 Q90 90 92 62Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
      {/* Coffee surface */}
      <ellipse cx="60" cy="62" rx="32" ry="8" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12"/>
      {/* Rosetta art on surface */}
      <path d="M60 58 Q50 50 40 55 Q36 61 44 67 Q52 72 60 74 Q68 72 76 67 Q84 61 80 55 Q70 50 60 58Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.08"/>
      <path d="M60 53 Q54 45 48 49 Q45 53 49 58" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M60 53 Q66 45 72 49 Q75 53 71 58" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
      <circle cx="60" cy="65" r="2.5" fill="currentColor" opacity="0.4"/>
      {/* Handle */}
      <path d="M92 65 Q105 65 105 75 Q105 85 92 82" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Steam */}
      <path d="M46 56 Q43 44 48 34" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M60 52 Q57 38 62 26" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M74 56 Q71 44 76 34" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

function RosettaEmblem() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="cert-emblem-svg">
      <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.35"/>
      <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      <ellipse cx="60" cy="92" rx="34" ry="6" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.06"/>
      <path d="M28 62 Q30 90 60 93 Q90 90 92 62Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
      <ellipse cx="60" cy="62" rx="32" ry="8" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12"/>
      {/* Rosetta leaves */}
      {[0,1,2,3,4,5,6].map((i) => (
        <ellipse key={i} cx="60" cy="52" rx="4" ry="9"
          transform={`rotate(${i * 25 - 75} 60 62)`}
          stroke="currentColor" strokeWidth="0.8" fill="currentColor" fillOpacity="0.07" opacity="0.6"/>
      ))}
      <circle cx="60" cy="62" r="4" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15"/>
      <path d="M60 58 Q60 48 60 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M92 65 Q105 65 105 75 Q105 85 92 82" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M60 52 Q57 38 62 26" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

function StarEmblem() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="cert-emblem-svg">
      <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.35"/>
      <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      {/* Star / compass rose */}
      {[0,45,90,135].map((deg) => (
        <line key={deg} x1="60" y1="28" x2="60" y2="92"
          transform={`rotate(${deg} 60 60)`}
          stroke="currentColor" strokeWidth="1" opacity="0.25"/>
      ))}
      <polygon points="60,30 65,55 90,60 65,65 60,90 55,65 30,60 55,55"
        stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.08" opacity="0.7"/>
      <polygon points="60,38 63,52 78,60 63,68 60,82 57,68 42,60 57,52"
        stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.12" opacity="0.6"/>
      <circle cx="60" cy="60" r="8" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
      <circle cx="60" cy="60" r="3" fill="currentColor" opacity="0.5"/>
      {/* Corner dots */}
      <circle cx="20" cy="20" r="2.5" fill="currentColor" opacity="0.25"/>
      <circle cx="100" cy="20" r="2.5" fill="currentColor" opacity="0.25"/>
      <circle cx="20" cy="100" r="2.5" fill="currentColor" opacity="0.25"/>
      <circle cx="100" cy="100" r="2.5" fill="currentColor" opacity="0.25"/>
    </svg>
  );
}

// ── Decorative border corner ──────────────────────────────────

function CornerOrnament({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="cert-corner"
      style={{ transform: flip ? "rotate(180deg)" : undefined }}>
      <path d="M4 4 L4 56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <path d="M4 4 L56 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <path d="M4 4 L28 28" stroke="currentColor" strokeWidth="0.8" opacity="0.25"/>
      <circle cx="4" cy="4" r="3" fill="currentColor" opacity="0.4"/>
      <circle cx="18" cy="4" r="1.5" fill="currentColor" opacity="0.2"/>
      <circle cx="4" cy="18" r="1.5" fill="currentColor" opacity="0.2"/>
      <path d="M14 14 Q20 10 28 14 Q32 20 28 28 Q20 32 14 28 Q10 20 14 14Z"
        stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.2"/>
    </svg>
  );
}

// ── Level config ──────────────────────────────────────────────

const LEVEL_CONFIG: Record<string, { label: string; color: string; emblem: React.ReactNode; tagline: string }> = {
  beginner: {
    label: "Beginner",
    color: "#4a7a44",
    emblem: <CoffeeCupEmblem />,
    tagline: "Espresso Foundations & Professional Bar Skills",
  },
  intermediate: {
    label: "Intermediate",
    color: "#b8732a",
    emblem: <CoffeeCupEmblem />,
    tagline: "Milk Texture, Pour Control & Latte Art Foundations",
  },
  advanced: {
    label: "Advanced",
    color: "#3D2817",
    emblem: <RosettaEmblem />,
    tagline: "Free-Pour Mastery, Rosetta & Advanced Composition",
  },
};

function getCourseEmblem(level: string, courseId: string) {
  if (courseId.includes("sensory") || courseId.includes("brewing") || courseId.includes("business") || courseId.includes("machine")) {
    return <StarEmblem />;
  }
  return LEVEL_CONFIG[level]?.emblem ?? <CoffeeCupEmblem />;
}

// ── Certificate card ──────────────────────────────────────────

function CertificateCard({ course, student }: { course: Course; student: StudentState }) {
  const cfg = LEVEL_CONFIG[course.level] ?? LEVEL_CONFIG.beginner;
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const color = cfg.color;

  return (
    <div className="cert-wrap no-print-break">
      <div className="cert-card" style={{ "--cert-color": color } as React.CSSProperties}>
        {/* Outer border frame */}
        <div className="cert-frame">
          <CornerOrnament />
          <CornerOrnament flip />
          <div className="cert-frame-top" />
          <div className="cert-frame-bottom" />

          {/* Content */}
          <div className="cert-inner">
            {/* Academy name */}
            <p className="cert-academy">Falfalla Academy</p>

            {/* Title */}
            <h1 className="cert-title">Certificate of Completion</h1>

            {/* Divider line with emblem */}
            <div className="cert-emblem-row">
              <div className="cert-line" />
              <div className="cert-emblem">{getCourseEmblem(course.level, course.id)}</div>
              <div className="cert-line" />
            </div>

            {/* Body text */}
            <p className="cert-presented">This is to certify that</p>
            <h2 className="cert-name">{student.name}</h2>
            <p className="cert-completed">has successfully completed</p>
            <h3 className="cert-course">{course.title}</h3>
            <p className="cert-tagline">{LEVEL_CONFIG[course.level]?.tagline ?? course.description}</p>

            {/* Level badge */}
            <div className="cert-level-row">
              <span className="cert-level-badge">{cfg.label} Level</span>
              <span className="cert-dot">·</span>
              <span className="cert-duration">{Math.round(course.duration / 60)} hours of instruction</span>
            </div>

            {/* Bottom rule */}
            <div className="cert-bottom-rule" />

            {/* Footer signatures */}
            <div className="cert-footer">
              <div className="cert-sig">
                <div className="cert-sig-line" />
                <p className="cert-sig-name">Falfalla Academy</p>
                <p className="cert-sig-role">Course Instructor</p>
              </div>
              <div className="cert-seal">
                <svg viewBox="0 0 72 72" fill="none" className="cert-seal-svg">
                  <circle cx="36" cy="36" r="33" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2.5" opacity="0.4"/>
                  <circle cx="36" cy="36" r="26" stroke="currentColor" strokeWidth="1" opacity="0.25"/>
                  <text x="36" y="32" textAnchor="middle" fontSize="6" fontWeight="700" fill="currentColor" opacity="0.6" fontFamily="serif" letterSpacing="1">FALFALLA</text>
                  <text x="36" y="40" textAnchor="middle" fontSize="5.5" fill="currentColor" opacity="0.5" fontFamily="serif" letterSpacing="0.5">ACADEMY</text>
                  <text x="36" y="49" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.4" fontFamily="serif">✦ {new Date().getFullYear()} ✦</text>
                  <path d="M36 10 L37.5 14 L42 14 L38.5 16.5 L40 21 L36 18 L32 21 L33.5 16.5 L30 14 L34.5 14Z"
                    fill="currentColor" opacity="0.35"/>
                </svg>
              </div>
              <div className="cert-sig cert-sig-right">
                <div className="cert-sig-line" />
                <p className="cert-sig-name">{today}</p>
                <p className="cert-sig-role">Date of Completion</p>
              </div>
            </div>

            <p className="cert-disclaimer">SCA-aligned professional education · Not an official SCA certificate</p>
          </div>
        </div>
      </div>

      {/* Print button — hidden during printing */}
      <div className="cert-actions no-print">
        <button className="primary" onClick={() => window.print()}>
          <Printer size={16} /> Print Certificate
        </button>
      </div>
    </div>
  );
}

// ── Certificate page ──────────────────────────────────────────

export function Certificate({ courses, student }: { courses: Course[]; student: StudentState }) {
  const completedCourses = courses.filter((c) => courseProgress(c, student.completedLessonIds) === 100);
  const inProgressCourses = courses.filter((c) => {
    const p = courseProgress(c, student.completedLessonIds);
    return p > 0 && p < 100;
  });

  if (completedCourses.length === 0) {
    return (
      <section className="page">
        <div className="certificate cert-locked">
          <Trophy size={48} style={{ color: "var(--golden-crema)", opacity: 0.5 }} />
          <p className="eyebrow" style={{ marginTop: "1rem" }}>Certificates</p>
          <h1>No certificates yet</h1>
          <p>Complete every lesson in a course to unlock your certificate.</p>
          {inProgressCourses.length > 0 && (
            <div className="cert-progress-list">
              {inProgressCourses.map((c) => (
                <div key={c.id} className="cert-progress-item">
                  <span>{c.title}</span>
                  <strong>{courseProgress(c, student.completedLessonIds)}% complete</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="page cert-page">
      {completedCourses.length > 1 && (
        <div className="section-heading no-print" style={{ marginBottom: "2rem" }}>
          <p className="eyebrow">Certificates</p>
          <h1>Your {completedCourses.length} certificates</h1>
          <p>Each certificate can be printed individually.</p>
        </div>
      )}
      {completedCourses.map((course) => (
        <CertificateCard key={course.id} course={course} student={student} />
      ))}
    </section>
  );
}
