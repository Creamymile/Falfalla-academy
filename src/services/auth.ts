import { supabase } from "../lib/supabase";
import type { StudentState } from "../types";
import { initialState } from "../state";
import { generateDeviceId, generateSessionToken, registerSession } from "./access";

export type AuthResult =
  | { ok: true; student: Partial<StudentState> }
  | { ok: false; error: string };

// ── Sign Up ─────────────────────────────────────────────────
export async function signUp(
  email: string,
  password: string,
  name: string,
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role: "student" },
    },
  });

  if (error) return { ok: false, error: error.message };
  if (!data.user) return { ok: false, error: "Sign up failed. Please try again." };

  // Check if email confirmation is required
  if (data.user.identities?.length === 0) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const deviceId = generateDeviceId();
  const sessionToken = generateSessionToken();
  registerSession(email, sessionToken);

  // Upsert profile in our profiles table
  await supabase.from("profiles").upsert({
    id: data.user.id,
    email,
    name,
    role: "student",
    device_id: deviceId,
  });

  return {
    ok: true,
    student: {
      isAuthenticated: true,
      role: "student",
      name,
      email,
      deviceId,
      sessionToken,
    },
  };
}

// ── Sign In ─────────────────────────────────────────────────
export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login")) {
      return { ok: false, error: "Incorrect email or password." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { ok: false, error: "Please check your email and confirm your account first." };
    }
    return { ok: false, error: error.message };
  }

  if (!data.user) return { ok: false, error: "Sign in failed." };

  const deviceId = generateDeviceId();
  const sessionToken = generateSessionToken();
  registerSession(email, sessionToken);

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", data.user.id)
    .single();

  // Update device_id on login
  await supabase
    .from("profiles")
    .update({ device_id: deviceId, last_sign_in: new Date().toISOString() })
    .eq("id", data.user.id);

  return {
    ok: true,
    student: {
      isAuthenticated: true,
      role: (profile?.role as "student" | "admin") ?? "student",
      name: profile?.name ?? data.user.user_metadata?.name ?? email.split("@")[0],
      email,
      deviceId,
      sessionToken,
    },
  };
}

// ── Forgot Password (send reset email) ─────────────────────
export async function resetPassword(email: string): Promise<{ ok: boolean; error?: string }> {
  // Redirect to plain origin — NOT a hash route.
  // Supabase appends tokens as query params (?code=xxx) or hash fragments (#access_token=xxx).
  // If we put /#/reset-password here, those tokens land inside the hash and the
  // Supabase client can't detect them. Instead we redirect to the origin and let
  // the PASSWORD_RECOVERY event in App.tsx navigate to #/reset-password.
  const siteUrl = import.meta.env.VITE_SITE_URL ?? window.location.origin;
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: siteUrl,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ── Update Password (after reset link clicked) ─────────────
export async function updatePassword(newPassword: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ── Sign Out ────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Supabase signOut failed:", err);
  }
}

// ── Get Current Session ─────────────────────────────────────
export async function getCurrentUser(): Promise<AuthResult> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { ok: false, error: "Not authenticated" };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("name, role, device_id")
      .eq("id", user.id)
      .single();

    return {
      ok: true,
      student: {
        isAuthenticated: true,
        role: (profile?.role as "student" | "admin") ?? "student",
        name: profile?.name ?? user.user_metadata?.name ?? "",
        email: user.email ?? "",
        deviceId: profile?.device_id ?? "",
      },
    };
  } catch (err) {
    console.warn("getCurrentUser failed:", err);
    return { ok: false, error: "Connection failed" };
  }
}

// ── Load Course Access from DB ──────────────────────────────
export async function loadCourseAccess() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("course_access")
    .select("*")
    .eq("user_id", user.id);

  if (error || !data) return [];

  return data.map((row: any) => ({
    courseId: row.course_id,
    grantedAt: row.granted_at,
    expiresAt: row.expires_at,
    accessCodeId: row.access_code_id,
    source: row.source as "code" | "purchase" | "admin",
  }));
}

// ── Redeem Access Code via DB ───────────────────────────────
export async function redeemCodeInDb(code: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Not authenticated" };

  const trimmed = code.trim().toUpperCase().replace(/[\s-]/g, "");

  // Server-side code lookup via RPC (secure — no client-side code exposure)
  const { data: match, error: rpcError } = await supabase.rpc("redeem_access_code", {
    code_input: trimmed,
  });

  if (rpcError) return { ok: false as const, error: "Failed to redeem. Please try again." };

  if (!match || !match.success) {
    return { ok: false as const, error: match?.error ?? "Invalid or already used access code." };
  }

  return {
    ok: true as const,
    access: {
      courseId: match.course_id,
      grantedAt: match.granted_at,
      expiresAt: match.expires_at,
      accessCodeId: match.access_code_id,
      source: "code" as const,
    },
  };
}

// ── Admin: Generate Access Code in DB ───────────────────────
export async function createAccessCodeInDb(courseId: string, durationDays: number) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const randomBytes = new Uint8Array(12);
  crypto.getRandomValues(randomBytes);
  let code = "";
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars[randomBytes[i] % chars.length];
  }

  const { data, error } = await supabase
    .from("access_codes")
    .insert({
      code,
      course_id: courseId,
      duration_days: durationDays,
      is_active: true,
    })
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };

  return {
    ok: true as const,
    accessCode: {
      id: data.id,
      code: data.code,
      courseId: data.course_id,
      durationDays: data.duration_days,
      redeemedBy: data.redeemed_by,
      redeemedAt: data.redeemed_at,
      isActive: data.is_active,
      createdAt: data.created_at?.slice(0, 10) ?? "",
    },
  };
}

// ── Admin: Toggle Access Code Active State ──────────────────
export async function toggleAccessCodeInDb(id: string, isActive: boolean) {
  await supabase.from("access_codes").update({ is_active: isActive }).eq("id", id);
}

// ── Admin: Load All Access Codes ────────────────────────────
export async function loadAccessCodesFromDb() {
  const { data, error } = await supabase
    .from("access_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    code: row.code,
    courseId: row.course_id,
    durationDays: row.duration_days,
    redeemedBy: row.redeemed_by,
    redeemedAt: row.redeemed_at,
    isActive: row.is_active,
    createdAt: row.created_at?.slice(0, 10) ?? "",
  }));
}
