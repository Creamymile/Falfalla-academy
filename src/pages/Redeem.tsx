import { KeyRound, AlertCircle, CheckCircle, Clock, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { go } from "../router";
import { CourseAccess, Course, StudentState } from "../types";
import { accessTimeRemaining, hasValidAccess } from "../services/access";
import { redeemCodeInDb, loadCourseAccess } from "../services/auth";

export function Redeem({
  courses,
  student,
  updateStudent,
}: {
  courses: Course[];
  student: StudentState;
  updateStudent: (s: StudentState) => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ courseName: string; access: CourseAccess } | null>(null);

  // Load fresh access data from DB on mount
  useEffect(() => {
    if (!student.isAuthenticated) return;
    loadCourseAccess().then((access) => {
      if (access.length > 0) {
        updateStudent({ ...student, courseAccess: access });
      }
    });
  }, []);

  if (!student.isAuthenticated) {
    return (
      <section className="gate">
        <KeyRound size={36} />
        <h1>Sign in required</h1>
        <p>Please sign in to redeem an access code.</p>
        <button className="primary" onClick={() => go({ name: "login" })}>
          Sign in
        </button>
      </section>
    );
  }

  const handleRedeem = async () => {
    setError("");
    setSuccess(null);

    if (!code.trim()) {
      setError("Please enter an access code.");
      return;
    }

    setLoading(true);

    try {
      const result = await redeemCodeInDb(code);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      const newAccess = result.access;
      const courseName = courses.find((c) => c.id === newAccess.courseId)?.title ?? "Course";

      updateStudent({
        ...student,
        courseAccess: [...student.courseAccess.filter((a) => a.courseId !== newAccess.courseId), newAccess],
        enrolledCourseIds: student.enrolledCourseIds.includes(newAccess.courseId)
          ? student.enrolledCourseIds
          : [...student.enrolledCourseIds, newAccess.courseId],
      });

      setSuccess({ courseName, access: newAccess });
      setCode("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const activeAccesses = student.courseAccess.filter((a) => new Date(a.expiresAt) > new Date());

  return (
    <section className="page redeem-page">
      <div className="redeem-container animate-fade-in">
        <KeyRound size={40} className="redeem-icon" />
        <h1>Redeem access code</h1>
        <p>Enter the code you received to unlock course access.</p>

        <div className="redeem-form">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
            placeholder="XXXX-XXXX-XXXX"
            maxLength={14}
            className="code-input"
            onKeyDown={(e) => e.key === "Enter" && !loading && handleRedeem()}
            autoComplete="off"
            spellCheck={false}
            disabled={loading}
          />
          <button className="primary" onClick={handleRedeem} disabled={loading}>
            {loading ? <Loader size={16} className="spin" /> : "Redeem code"}
          </button>
        </div>

        {error && (
          <div className="redeem-message error" role="alert">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div className="redeem-message success" role="alert">
            <CheckCircle size={18} />
            <div>
              <strong>Access granted!</strong>
              <p>You now have access to <strong>{success.courseName}</strong> until {new Date(success.access.expiresAt).toLocaleDateString()}.</p>
              <button className="primary" style={{ marginTop: "0.75rem" }} onClick={() => {
                const course = courses.find((c) => c.id === success.access.courseId);
                if (course) go({ name: "course", slug: course.slug });
              }}>
                Go to course
              </button>
            </div>
          </div>
        )}
      </div>

      {activeAccesses.length > 0 && (
        <div className="active-accesses animate-fade-in">
          <h2>Your active access</h2>
          <div className="access-cards">
            {activeAccesses.map((a) => {
              const course = courses.find((c) => c.id === a.courseId);
              return (
                <article key={a.courseId} className="access-card">
                  <div className="access-card-header">
                    <h3>{course?.title ?? a.courseId}</h3>
                    <span className={`access-badge ${hasValidAccess(student, a.courseId) ? "active" : "expired"}`}>
                      {hasValidAccess(student, a.courseId) ? "Active" : "Expired"}
                    </span>
                  </div>
                  <div className="access-card-meta">
                    <Clock size={15} />
                    <span>{accessTimeRemaining(student, a.courseId)}</span>
                  </div>
                  <small>Source: {a.source} · Granted {new Date(a.grantedAt).toLocaleDateString()}</small>
                  {course && (
                    <button className="secondary" onClick={() => go({ name: "course", slug: course.slug })}>
                      View course
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
