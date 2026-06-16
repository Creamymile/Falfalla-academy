import { Lock, ShieldCheck } from "lucide-react";
import { go } from "../router";
import { StudentState } from "../types";
import { supportedLanguages } from "../constants";

export function Gate({
  student,
  requireAdmin = false,
  children,
}: {
  student: StudentState;
  requireAdmin?: boolean;
  children: React.ReactNode;
}) {
  if (student.isAuthenticated && (!requireAdmin || student.role === "admin"))
    return children;

  if (student.isAuthenticated && requireAdmin)
    return (
      <section className="gate">
        <ShieldCheck size={36} />
        <h1>Admin access only</h1>
        <p>This workspace is reserved for instructors managing course videos, lesson material, and student activity.</p>
        <button className="primary" onClick={() => go({ name: "dashboard" })}>Back to dashboard</button>
      </section>
    );

  return (
    <section className="gate">
      <Lock size={36} />
      <h1>Sign in to continue learning</h1>
      <p>You need to be signed in to access this page.</p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button className="primary" onClick={() => go({ name: "login" })}>Sign in</button>
        <button className="secondary" onClick={() => go({ name: "home" })}>Back to home</button>
      </div>
    </section>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="progress">
      <span style={{ width: `${value}%` }} />
      <small>{value}% complete</small>
    </div>
  );
}

export function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <article className="stat">
      {icon}
      <span>{value}</span>
      <small>{label}</small>
    </article>
  );
}

export function StarIcon() {
  return <span className="star-icon">&#9733;</span>;
}

export function LanguageSelect({ value, onChange }: { value: string; onChange: (l: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {supportedLanguages.map((l) => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}

export function NotFound() {
  return (
    <section className="gate">
      <h1>Page not found</h1>
      <button className="primary" onClick={() => go({ name: "home" })}>Back home</button>
    </section>
  );
}

export function Value({ icon, title, text, accent = "gold" }: { icon: React.ReactNode; title: string; text: string; accent?: "gold" | "green" | "brown" }) {
  return (
    <article className={`value value-accented value-accent-${accent}`}>
      <div className="value-icon-wrap">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
