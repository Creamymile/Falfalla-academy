import { AccessCode, CourseAccess, StudentState } from "../types";

const ACCESS_CODES_KEY = "falfalla-academy-access-codes";
const SESSION_PREFIX = "falfalla-session-";

// ── Device Fingerprint ──────────────────────────────────────
export function generateDeviceId(): string {
  const nav = window.navigator;
  const raw = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    nav.hardwareConcurrency ?? 0,
  ].join("|");
  // Simple hash for fingerprint
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  }
  return `device-${Math.abs(hash).toString(36)}`;
}

// ── Session Token ───────────────────────────────────────────
export function generateSessionToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `sess-${hex}`;
}

// ── Access Code Storage ─────────────────────────────────────
export function loadAccessCodes(): AccessCode[] {
  try {
    return JSON.parse(window.localStorage.getItem(ACCESS_CODES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveAccessCodes(codes: AccessCode[]) {
  window.localStorage.setItem(ACCESS_CODES_KEY, JSON.stringify(codes));
}

// ── Generate Access Codes (admin) ───────────────────────────
export function generateAccessCode(courseId: string, durationDays: number = 7): AccessCode {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/I/1
  const randomBytes = new Uint8Array(12);
  crypto.getRandomValues(randomBytes);
  let code = "";
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars[randomBytes[i] % chars.length];
  }
  const idBytes = new Uint8Array(4);
  crypto.getRandomValues(idBytes);
  return {
    id: `ac-${Date.now()}-${Array.from(idBytes, (b) => b.toString(36)).join("").slice(0, 6)}`,
    code,
    courseId,
    durationDays,
    redeemedBy: null,
    redeemedAt: null,
    isActive: true,
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

// ── Redeem Access Code ──────────────────────────────────────
export type RedeemResult =
  | { ok: true; access: CourseAccess }
  | { ok: false; error: string };

export function redeemAccessCode(
  code: string,
  student: StudentState,
  codes: AccessCode[],
): RedeemResult {
  const trimmed = code.trim().toUpperCase().replace(/\s+/g, "");
  const found = codes.find((c) => c.code.replace(/-/g, "") === trimmed.replace(/-/g, ""));

  if (!found) return { ok: false, error: "Invalid access code. Please check and try again." };
  if (!found.isActive) return { ok: false, error: "This access code has been deactivated." };
  if (found.redeemedBy && found.redeemedBy !== student.email) {
    return { ok: false, error: "This code has already been used by another account." };
  }
  if (found.redeemedAt) {
    // Already redeemed by this user — check if still valid
    const expires = new Date(found.redeemedAt);
    expires.setDate(expires.getDate() + found.durationDays);
    if (new Date() > expires) {
      return { ok: false, error: "This access code has expired." };
    }
    return { ok: false, error: "You have already redeemed this code." };
  }

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + found.durationDays);

  const access: CourseAccess = {
    courseId: found.courseId,
    grantedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    accessCodeId: found.id,
    source: "code",
  };

  return { ok: true, access };
}

// ── Course Access Checks ────────────────────────────────────
export function hasValidAccess(student: StudentState, courseId: string): boolean {
  // Admin always has access
  if (student.role === "admin") return true;

  const access = student.courseAccess.find((a) => a.courseId === courseId);
  if (!access) return false;

  return new Date(access.expiresAt) > new Date();
}

export function getAccessExpiry(student: StudentState, courseId: string): Date | null {
  const access = student.courseAccess.find((a) => a.courseId === courseId);
  if (!access) return null;
  return new Date(access.expiresAt);
}

export function accessTimeRemaining(student: StudentState, courseId: string): string {
  if (student.role === "admin") return "Unlimited access";
  const expiry = getAccessExpiry(student, courseId);
  if (!expiry) return "No access";

  const now = new Date();
  if (expiry <= now) return "Expired";

  const diffMs = expiry.getTime() - now.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h remaining`;
  const minutes = Math.floor(diffMs / (1000 * 60));
  return `${minutes}m remaining`;
}

// ── Session Management (anti-sharing) ───────────────────────
export function validateSession(student: StudentState): boolean {
  const currentDevice = generateDeviceId();

  // Check device binding
  if (student.deviceId && student.deviceId !== currentDevice) {
    return false;
  }

  // Check active session
  const storedSession = window.localStorage.getItem(`${SESSION_PREFIX}${student.email}`);
  if (storedSession && storedSession !== student.sessionToken) {
    return false;
  }

  return true;
}

export function registerSession(email: string, sessionToken: string) {
  window.localStorage.setItem(`${SESSION_PREFIX}${email}`, sessionToken);
}

export function clearSession(email: string) {
  window.localStorage.removeItem(`${SESSION_PREFIX}${email}`);
}

// ── Session Heartbeat ───────────────────────────────────────
export function startSessionHeartbeat(
  student: StudentState,
  onInvalid: () => void,
): () => void {
  const interval = setInterval(() => {
    if (!student.isAuthenticated) return;
    if (!validateSession(student)) {
      onInvalid();
    }
  }, 30_000); // Check every 30 seconds

  return () => clearInterval(interval);
}
