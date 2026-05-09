import { LogIn, UserPlus, AlertCircle } from "lucide-react";
import { useState } from "react";
import { go } from "../router";
import { StudentState } from "../types";
import { generateDeviceId, generateSessionToken, registerSession } from "../services/access";

type Mode = "login" | "register";

export function Login({
  student,
  updateStudent,
}: {
  student: StudentState;
  updateStudent: (s: StudentState) => void;
}) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (student.isAuthenticated) {
    return (
      <section className="gate">
        <LogIn size={36} />
        <h1>Already signed in</h1>
        <p>You are signed in as {student.name}.</p>
        <button className="primary" onClick={() => go({ name: "dashboard" })}>
          Go to Dashboard
        </button>
      </section>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    // NOTE: This is a localStorage-based mock login.
    // Will be replaced by Supabase Auth in production.
    const deviceId = generateDeviceId();
    const sessionToken = generateSessionToken();

    const displayName = mode === "register" ? name.trim() : (email.split("@")[0] ?? "Student");

    const updatedStudent: StudentState = {
      ...student,
      isAuthenticated: true,
      role: "student",
      name: displayName,
      email: email.trim().toLowerCase(),
      deviceId,
      sessionToken,
    };

    registerSession(updatedStudent.email, sessionToken);
    updateStudent(updatedStudent);
    go({ name: "dashboard" });
  };

  return (
    <section className="page login-page">
      <div className="login-container animate-fade-in">
        <div className="login-header">
          {mode === "login" ? <LogIn size={36} /> : <UserPlus size={36} />}
          <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p>
            {mode === "login"
              ? "Sign in to continue learning latte art."
              : "Join Falfalla Academy and start your latte art journey."}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Full name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </label>
          )}
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
          </label>

          {error && (
            <div className="login-error" role="alert">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button type="submit" className="primary">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="login-switch">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button className="link-button" onClick={() => { setMode("register"); setError(""); }}>
                Create one
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button className="link-button" onClick={() => { setMode("login"); setError(""); }}>
                Sign in
              </button>
            </p>
          )}
        </div>

        <div className="login-notice">
          <small>
            By signing in, your device will be linked to your account for security.
            Course access is personal and cannot be shared.
          </small>
        </div>
      </div>
    </section>
  );
}
