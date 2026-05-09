import { Clock, Lock, ShieldAlert } from "lucide-react";
import { go } from "../router";
import { StudentState } from "../types";
import { accessTimeRemaining, hasValidAccess, validateSession } from "../services/access";

export function AccessGate({
  student,
  courseId,
  courseTitle,
  courseSlug,
  children,
}: {
  student: StudentState;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  children: React.ReactNode;
}) {
  // Check session validity (anti-sharing)
  if (!validateSession(student)) {
    return (
      <section className="gate access-gate">
        <ShieldAlert size={40} />
        <h1>Session conflict detected</h1>
        <p>
          Your account appears to be active on another device. For security,
          course access is limited to one device at a time.
        </p>
        <p className="access-hint">
          If this is your device, please sign out on other devices and sign in again.
        </p>
        <button className="primary" onClick={() => go({ name: "login" })}>
          Sign in again
        </button>
      </section>
    );
  }

  // Check course access expiry
  if (!hasValidAccess(student, courseId)) {
    const hasExpiredAccess = student.courseAccess.some((a) => a.courseId === courseId);

    return (
      <section className="gate access-gate">
        <Lock size={40} />
        <h1>{hasExpiredAccess ? "Access expired" : "Access required"}</h1>
        <p>
          {hasExpiredAccess
            ? `Your access to ${courseTitle} has expired. Redeem a new code or purchase access to continue learning.`
            : `You need an active access code or purchase to view lessons in ${courseTitle}.`}
        </p>
        <div className="access-gate-actions">
          <button className="primary" onClick={() => go({ name: "redeem" })}>
            Redeem access code
          </button>
          <button className="secondary" onClick={() => go({ name: "pricing" })}>
            View pricing
          </button>
          <button className="secondary" onClick={() => go({ name: "course", slug: courseSlug })}>
            Back to course
          </button>
        </div>
      </section>
    );
  }

  // Show remaining time banner + content
  const remaining = accessTimeRemaining(student, courseId);
  const expiry = student.courseAccess.find((a) => a.courseId === courseId);
  const expiresDate = expiry ? new Date(expiry.expiresAt) : null;
  const isExpiringSoon = expiresDate
    ? expiresDate.getTime() - Date.now() < 24 * 60 * 60 * 1000
    : false;

  return (
    <>
      {isExpiringSoon && (
        <div className={`access-banner ${isExpiringSoon ? "urgent" : ""}`} role="status">
          <Clock size={16} />
          <span>
            <strong>{remaining}</strong> — your access to {courseTitle} expires soon.
          </span>
          <button className="small" onClick={() => go({ name: "redeem" })}>
            Extend access
          </button>
        </div>
      )}
      {children}
    </>
  );
}
