import { LogIn, UserPlus, AlertCircle, Loader, KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { go } from "../router";
import { StudentState } from "../types";
import { signIn, signUp, resetPassword } from "../services/auth";

type Mode = "login" | "register" | "forgot";

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
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    // Forgot password flow
    if (mode === "forgot") {
      setLoading(true);
      try {
        const result = await resetPassword(email.trim());
        if (!result.ok) {
          setError(result.error ?? "Failed to send reset email.");
          return;
        }
        setResetSent(true);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password.trim() || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (mode === "register" && !/(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError("Password must include at least one uppercase letter and one number.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        const result = await signUp(email.trim(), password, name.trim());
        if (!result.ok) {
          setError(result.error);
          return;
        }
        // Supabase may require email confirmation
        setConfirmationSent(true);
      } else {
        const result = await signIn(email.trim(), password);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        updateStudent({ ...student, ...result.student });
        go({ name: "dashboard" });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Confirmation email sent screen
  if (confirmationSent) {
    return (
      <section className="page login-page">
        <div className="login-container animate-fade-in">
          <div className="login-header">
            <UserPlus size={36} />
            <h1>Check your email</h1>
            <p>
              We sent a confirmation link to <strong>{email}</strong>.
              Click the link to activate your account, then come back and sign in.
            </p>
          </div>
          <button
            className="primary"
            onClick={() => { setConfirmationSent(false); setMode("login"); }}
            style={{ marginTop: "1rem" }}
          >
            Back to sign in
          </button>
        </div>
      </section>
    );
  }

  // Password reset email sent screen
  if (resetSent) {
    return (
      <section className="page login-page">
        <div className="login-container animate-fade-in">
          <div className="login-header">
            <Mail size={36} />
            <h1>Reset link sent</h1>
            <p>
              We sent a password reset link to <strong>{email}</strong>.
              Check your inbox and click the link to set a new password.
            </p>
          </div>
          <button
            className="primary"
            onClick={() => { setResetSent(false); setMode("login"); setError(""); }}
            style={{ marginTop: "1rem" }}
          >
            Back to sign in
          </button>
        </div>
      </section>
    );
  }

  const modeIcon = mode === "login" ? <LogIn size={36} /> : mode === "register" ? <UserPlus size={36} /> : <KeyRound size={36} />;
  const modeTitle = mode === "login" ? "Welcome back" : mode === "register" ? "Create your account" : "Reset your password";
  const modeSubtitle = mode === "login"
    ? "Sign in to continue learning latte art."
    : mode === "register"
    ? "Join Falfalla Academy and start your latte art journey."
    : "Enter your email and we'll send you a link to reset your password.";

  return (
    <section className="page login-page">
      <div className="login-container animate-fade-in">
        <div className="login-header">
          {modeIcon}
          <h1>{modeTitle}</h1>
          <p>{modeSubtitle}</p>
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
                disabled={loading}
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
              disabled={loading}
            />
          </label>
          {mode !== "forgot" && (
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={8}
                required
                disabled={loading}
              />
            </label>
          )}

          {mode === "login" && (
            <div className="forgot-password-link">
              <button
                type="button"
                className="link-button"
                onClick={() => { setMode("forgot"); setError(""); }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {error && (
            <div className="login-error" role="alert">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button type="submit" className="primary" disabled={loading}>
            {loading ? (
              <><Loader size={16} className="spin" /> {mode === "forgot" ? "Sending..." : mode === "login" ? "Signing in..." : "Creating account..."}</>
            ) : (
              mode === "forgot" ? "Send reset link" : mode === "login" ? "Sign in" : "Create account"
            )}
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
              {mode === "forgot" ? "Remember your password?" : "Already have an account?"}{" "}
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
