import { KeyRound, AlertCircle, Loader, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { go } from "../router";
import { updatePassword } from "../services/auth";
import { supabase } from "../lib/supabase";

export function ResetPassword({ recoveryReady }: { recoveryReady: boolean }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(recoveryReady);

  // Wait for the auth session to be established (code exchange may still be in progress)
  useEffect(() => {
    if (sessionReady) return;

    let cancelled = false;

    // Poll for session — the PKCE code exchange or implicit token exchange
    // may still be completing when this component mounts.
    async function waitForSession() {
      // Try immediately
      const { data } = await supabase.auth.getSession();
      if (data.session && !cancelled) {
        setSessionReady(true);
        return;
      }

      // Listen for it
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session && !cancelled) {
          setSessionReady(true);
          subscription.unsubscribe();
        }
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!cancelled) {
          subscription.unsubscribe();
          setError("Could not establish a session. The reset link may have expired. Please request a new one.");
        }
      }, 10000);

      return () => { cancelled = true; subscription.unsubscribe(); };
    }

    waitForSession();
    return () => { cancelled = true; };
  }, [sessionReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!sessionReady) {
      setError("Session is not ready yet. Please wait a moment and try again.");
      return;
    }

    if (!password.trim() || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!/(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError("Password must include at least one uppercase letter and one number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = await updatePassword(password);
      if (!result.ok) {
        setError(result.error ?? "Failed to update password.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="page login-page">
        <div className="login-container animate-fade-in">
          <div className="login-header">
            <CheckCircle size={36} />
            <h1>Password updated</h1>
            <p>Your password has been reset successfully. You can now sign in with your new password.</p>
          </div>
          <button
            className="primary"
            onClick={() => go({ name: "login" })}
            style={{ marginTop: "1rem" }}
          >
            Go to sign in
          </button>
        </div>
      </section>
    );
  }

  // Loading state while session is being established
  if (!sessionReady && !error) {
    return (
      <section className="page login-page">
        <div className="login-container animate-fade-in">
          <div className="login-header">
            <Loader size={36} className="spin" />
            <h1>Verifying reset link...</h1>
            <p>Please wait while we verify your password reset link.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page login-page">
      <div className="login-container animate-fade-in">
        <div className="login-header">
          <KeyRound size={36} />
          <h1>Set new password</h1>
          <p>Enter your new password below.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            New password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={loading}
            />
          </label>
          <label>
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              minLength={6}
              required
              disabled={loading}
            />
          </label>

          {error && (
            <div className="login-error" role="alert">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button type="submit" className="primary" disabled={loading}>
            {loading ? (
              <><Loader size={16} className="spin" /> Updating...</>
            ) : (
              "Update password"
            )}
          </button>
        </form>

        <div className="login-switch">
          <p>
            <button className="link-button" onClick={() => go({ name: "login" })}>
              Back to sign in
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
