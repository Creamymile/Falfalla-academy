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

export function Certificate({ courses, student }: { courses: Course[]; student: StudentState }) {
  const completedCourse = courses.find((c) => courseProgress(c, student.completedLessonIds) === 100);
  return (
    <section className="page">
      <div className="certificate">
        <Trophy size={48} />
        <p className="eyebrow">Certificate</p>
        <h1>{completedCourse ? "Certificate of Completion" : "Certificate progress"}</h1>
        <h2>{student.name}</h2>
        <p>
          {completedCourse
            ? `Completed ${completedCourse.title}.`
            : "Complete every lesson in a course to unlock a certificate preview."}
        </p>
        <small>SCA-aligned education. Not an official SCA certificate.</small>
        {completedCourse && (
          <button className="primary" style={{ marginTop: "1.5rem" }} onClick={() => window.print()}>
            <Printer size={18} /> Print certificate
          </button>
        )}
      </div>
    </section>
  );
}
