import { useEffect, useRef, useState } from "react";
import { courses as seedCourses } from "./data/courses";
import { initialState, loadState, saveState } from "./state";
import { Course, LessonRequest, ProjectUpload, StudentState } from "./types";
import { routeFromHash, Route } from "./router";
import { CONTENT_KEY, COURSE_IDS, REQUESTS_KEY, UPLOADS_KEY, starterUploads } from "./constants";
import { courseProgress } from "./utils";
import { Header } from "./components/Header";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Celebration } from "./components/Celebration";
import { Gate, NotFound } from "./components/Shared";
import { Home } from "./pages/Home";
import { Courses } from "./pages/Courses";
import { CourseDetail } from "./pages/CourseDetail";
import { LessonPlayer } from "./pages/LessonPlayer";
import { Dashboard } from "./pages/Dashboard";
import { Gallery } from "./pages/Gallery";
import { UploadProject } from "./pages/UploadProject";
import { Pricing, Checkout } from "./pages/Pricing";
import { Profile, Certificate } from "./pages/Profile";
import { Admin } from "./pages/Admin";
import { Login } from "./pages/Login";
import { Redeem } from "./pages/Redeem";
import { ResetPassword } from "./pages/ResetPassword";
import { TermsOfService, PrivacyPolicy } from "./pages/Legal";
import { Footer } from "./components/Footer";
import { PageLoader } from "./components/PageLoader";
import { clearSession, startSessionHeartbeat } from "./services/access";
import { getCurrentUser, loadCourseAccess, signOut as supabaseSignOut } from "./services/auth";
import { supabase, supabaseConfigured } from "./lib/supabase";

function normalizeCourses(courses: Course[]): Course[] {
  return courses
    .filter((c) => COURSE_IDS.includes(c.id))
    .sort((a, b) => COURSE_IDS.indexOf(a.id) - COURSE_IDS.indexOf(b.id))
    .map((c) => ({ ...c, enrollmentCount: c.enrollmentCount ?? 0, equipment: c.equipment ?? [], reviews: c.reviews ?? [] }));
}

function loadCourses(): Course[] {
  const saved = window.localStorage.getItem(CONTENT_KEY);
  if (!saved) return normalizeCourses(seedCourses);
  try {
    const parsed = JSON.parse(saved) as Course[];
    return parsed[0]?.modules[0]?.lessons[0]?.theory ? normalizeCourses(parsed) : normalizeCourses(seedCourses);
  } catch { return normalizeCourses(seedCourses); }
}

function loadRequests(): LessonRequest[] {
  try { return JSON.parse(window.localStorage.getItem(REQUESTS_KEY) ?? "[]"); } catch { return []; }
}

function loadUploads(): ProjectUpload[] {
  const saved = window.localStorage.getItem(UPLOADS_KEY);
  if (!saved) return starterUploads;
  try { return JSON.parse(saved); } catch { return starterUploads; }
}

export function App() {
  const [route, setRoute] = useState<Route>(routeFromHash);
  const [student, setStudent] = useState<StudentState>(loadState);
  const [courseContent, setCourseContent] = useState<Course[]>(loadCourses);
  const [lessonRequests, setLessonRequests] = useState<LessonRequest[]>(loadRequests);
  const [uploads, setUploads] = useState<ProjectUpload[]>(loadUploads);
  const [celebration, setCelebration] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const prevCompletedRef = useRef(student.completedLessonIds.length);

  useEffect(() => {
    const sync = () => {
      setPageLoading(true);
      setRoute(routeFromHash());
      window.scrollTo({ top: 0 });
      // Brief loading to allow render
      setTimeout(() => setPageLoading(false), 150);
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // Per-page document.title for SEO and browser tabs
  useEffect(() => {
    const base = "Falfalla Academy";
    const titles: Record<string, string> = {
      home: `${base} | Latte Art Mastery`,
      courses: `Courses | ${base}`,
      dashboard: `Dashboard | ${base}`,
      gallery: `Community Gallery | ${base}`,
      upload: `Upload Practice | ${base}`,
      pricing: `Pricing | ${base}`,
      profile: `Profile | ${base}`,
      certificate: `Certificate | ${base}`,
      checkout: `Checkout | ${base}`,
      admin: `Admin | ${base}`,
      login: `Sign In | ${base}`,
      redeem: `Redeem Code | ${base}`,
      "reset-password": `Reset Password | ${base}`,
      terms: `Terms of Service | ${base}`,
      privacy: `Privacy Policy | ${base}`,
      notFound: `Page Not Found | ${base}`,
    };
    if (route.name === "course" && "slug" in route) {
      const c = courseContent.find((c) => c.slug === route.slug);
      document.title = c ? `${c.title} | ${base}` : titles.courses;
    } else if (route.name === "lesson" && "slug" in route) {
      const c = courseContent.find((c) => c.slug === route.slug);
      document.title = c ? `${c.title} — Lesson | ${base}` : titles.courses;
    } else {
      document.title = titles[route.name] ?? titles.home;
    }
  }, [route, courseContent]);

  useEffect(() => saveState(student), [student]);
  useEffect(() => window.localStorage.setItem(CONTENT_KEY, JSON.stringify(normalizeCourses(courseContent))), [courseContent]);
  useEffect(() => window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(lessonRequests)), [lessonRequests]);
  useEffect(() => window.localStorage.setItem(UPLOADS_KEY, JSON.stringify(uploads)), [uploads]);

  // Track whether the current page load is a password-recovery redirect
  const [recoveryReady, setRecoveryReady] = useState(false);

  // Restore Supabase session on load
  useEffect(() => {
    let isRecoveryRedirect = false;

    async function init() {
      if (!supabaseConfigured) return; // Skip auth if Supabase not configured

      try {
        // ── 1. Detect PKCE recovery code in the URL ──
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error && data.session) {
              isRecoveryRedirect = true;
              setRecoveryReady(true);
              window.location.hash = "#/reset-password";
              window.history.replaceState({}, "", window.location.pathname + window.location.hash);
              return;
            }
          } catch {
            // Code exchange failed — fall through to normal init
          }
          window.history.replaceState({}, "", window.location.pathname + window.location.hash);
        }

        // ── 2. Also detect implicit-flow recovery tokens in the hash ──
        const hashStr = window.location.hash.replace(/^#/, "");
        if (hashStr.includes("access_token=") && hashStr.includes("type=recovery")) {
          isRecoveryRedirect = true;
        }

        // ── 3. Normal session restore ──
        const result = await getCurrentUser();
        if (result.ok && result.student) {
          const access = await loadCourseAccess();
          setStudent((prev) => ({
            ...prev,
            ...result.student,
            courseAccess: access.length > 0 ? access : prev.courseAccess,
          }));
        }
      } catch (err) {
        console.warn("Init failed, continuing without auth:", err);
      }
    }

    // Timeout: if init takes longer than 5s, load the app anyway
    const timeout = setTimeout(() => setAppReady(true), 5000);
    init().finally(() => { clearTimeout(timeout); setAppReady(true); });

    // Listen for auth state changes (e.g. email confirmation redirect)
    if (!supabaseConfigured) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        if (isRecoveryRedirect) return;
        try {
          const result = await getCurrentUser();
          if (result.ok && result.student) {
            const access = await loadCourseAccess();
            setStudent((prev) => ({
              ...prev,
              ...result.student,
              courseAccess: access.length > 0 ? access : prev.courseAccess,
            }));
          }
        } catch (err) {
          console.warn("Auth state change handler failed:", err);
        }
      }
      if (event === "PASSWORD_RECOVERY") {
        isRecoveryRedirect = true;
        setRecoveryReady(true);
        window.location.hash = "#/reset-password";
      }
      if (event === "SIGNED_OUT") {
        setStudent(initialState);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Session heartbeat for anti-sharing
  useEffect(() => {
    if (!student.isAuthenticated) return;
    return startSessionHeartbeat(student, () => {
      setStudent((prev) => ({ ...prev, isAuthenticated: false, sessionToken: "" }));
    });
  }, [student.isAuthenticated, student.sessionToken]);

  // Detect course completion for celebration
  useEffect(() => {
    if (student.completedLessonIds.length > prevCompletedRef.current) {
      const justCompleted = courseContent.find(
        (c) => student.enrolledCourseIds.includes(c.id) && courseProgress(c, student.completedLessonIds) === 100,
      );
      if (justCompleted && !celebration) setCelebration(justCompleted.title);
    }
    prevCompletedRef.current = student.completedLessonIds.length;
  }, [student.completedLessonIds]);

  // Enrollment with count increment
  const handleUpdateStudent = (s: StudentState) => {
    const newEnrollments = s.enrolledCourseIds.filter((id) => !student.enrolledCourseIds.includes(id));
    if (newEnrollments.length > 0) {
      setCourseContent((prev) =>
        prev.map((c) => newEnrollments.includes(c.id) ? { ...c, enrollmentCount: c.enrollmentCount + 1 } : c),
      );
    }
    setStudent(s);
  };

  // App splash screen while restoring session
  if (!appReady) {
    return (
      <div className="app-splash">
        <div className="splash-content">
          <h1 className="brand-wordmark">Falfalla Academy</h1>
          <div className="splash-spinner" />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <PageLoader loading={pageLoading} />
        <Header route={route} student={student} updateStudent={handleUpdateStudent} />
        <main id="main-content" className={pageLoading ? "page-transitioning" : ""}>
          {route.name === "home" && <Home courses={courseContent} student={student} updateStudent={handleUpdateStudent} />}
          {route.name === "courses" && <Courses courses={courseContent} student={student} updateStudent={handleUpdateStudent} />}
          {route.name === "dashboard" && <Gate student={student}><Dashboard courses={courseContent} student={student} uploads={uploads} /></Gate>}
          {route.name === "gallery" && <Gallery courses={courseContent} student={student} updateStudent={handleUpdateStudent} uploads={uploads} updateUploads={setUploads} />}
          {route.name === "upload" && <Gate student={student}><UploadProject courses={courseContent} student={student} uploads={uploads} updateUploads={setUploads} /></Gate>}
          {route.name === "pricing" && <Pricing />}
          {route.name === "checkout" && <Checkout />}
          {route.name === "profile" && <Gate student={student}><Profile student={student} updateStudent={handleUpdateStudent} courses={courseContent} uploads={uploads} /></Gate>}
          {route.name === "certificate" && <Gate student={student}><Certificate courses={courseContent} student={student} /></Gate>}
          {route.name === "course" && <Gate student={student}><CourseDetail slug={route.slug} courses={courseContent} student={student} updateStudent={handleUpdateStudent} updateCourses={setCourseContent} /></Gate>}
          {route.name === "lesson" && <Gate student={student}><LessonPlayer slug={route.slug} lessonId={route.lessonId} courses={courseContent} student={student} updateStudent={handleUpdateStudent} updateCourses={setCourseContent} requests={lessonRequests} updateRequests={setLessonRequests} /></Gate>}
          {route.name === "admin" && <Gate student={student} requireAdmin><Admin courses={courseContent} updateCourses={setCourseContent} requests={lessonRequests} updateRequests={setLessonRequests} uploads={uploads} /></Gate>}
          {route.name === "login" && <Login student={student} updateStudent={handleUpdateStudent} />}
          {route.name === "redeem" && <Redeem courses={courseContent} student={student} updateStudent={handleUpdateStudent} />}
          {route.name === "reset-password" && <ResetPassword recoveryReady={recoveryReady} />}
          {route.name === "terms" && <TermsOfService />}
          {route.name === "privacy" && <PrivacyPolicy />}
          {route.name === "notFound" && <NotFound />}
        </main>
        <Footer />
        <Celebration show={!!celebration} courseName={celebration ?? ""} onClose={() => setCelebration(null)} />
      </div>
    </ErrorBoundary>
  );
}
