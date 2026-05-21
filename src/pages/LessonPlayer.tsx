import { Bookmark, Camera, Check, ChevronRight, Download, Lock, Play, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { go } from "../router";
import { Course, LessonRequest, StudentState } from "../types";
import { findLesson, nextLesson } from "../utils";
import { supportedLanguages, updateStreak } from "../constants";
import { LanguageSelect, NotFound } from "../components/Shared";
import { AccessGate } from "../components/AccessGate";

export function LessonPlayer({
  slug,
  lessonId,
  courses,
  student,
  updateStudent,
  updateCourses,
  requests,
  updateRequests,
}: {
  slug: string;
  lessonId: string;
  courses: Course[];
  student: StudentState;
  updateStudent: (s: StudentState) => void;
  updateCourses: (c: Course[]) => void;
  requests: LessonRequest[];
  updateRequests: (r: LessonRequest[]) => void;
}) {
  const { course, lesson } = findLesson(courses, slug, lessonId);
  const [captionLanguage, setCaptionLanguage] = useState(
    student.preferredLanguage ?? lesson?.subtitles.find((t) => t.isDefault)?.language ?? "en",
  );
  const [requestType, setRequestType] = useState<LessonRequest["type"]>("next");
  const [requestComment, setRequestComment] = useState("");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoCompletedRef = useRef(false);

  // All hooks must be called before any early return
  useEffect(() => {
    autoCompletedRef.current = false;
  }, [lessonId]);

  useEffect(() => {
    if (!course || !lesson) return;
    const up = nextLesson(course, lesson.id);
    const handler = (e: KeyboardEvent) => {
      const v = videoRef.current;
      if (!v) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.code === "Space") { e.preventDefault(); v.paused ? v.play() : v.pause(); }
      if (e.code === "ArrowRight") { v.currentTime = Math.min(v.duration, v.currentTime + 10); }
      if (e.code === "ArrowLeft") { v.currentTime = Math.max(0, v.currentTime - 10); }
      if (e.code === "KeyN" && up) { go({ name: "lesson", slug, lessonId: up.id }); }
      if (e.code === "KeyF") { document.fullscreenElement ? document.exitFullscreen() : v.requestFullscreen(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [lessonId, slug, course, lesson]);

  // Early returns after all hooks
  if (!course || !lesson) return <NotFound />;

  const enrolled = student.enrolledCourseIds.includes(course.id);
  if (!enrolled)
    return (
      <section className="gate">
        <Lock size={36} />
        <h1>Enrollment required</h1>
        <p>Enroll in {course.title} to access this lesson.</p>
        <button className="primary" onClick={() => go({ name: "course", slug })}>View course</button>
      </section>
    );

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
  };

  const markComplete = () => {
    const alreadyComplete = student.completedLessonIds.includes(lesson.id);
    updateStudent({
      ...student,
      completedLessonIds: alreadyComplete
        ? student.completedLessonIds
        : [...student.completedLessonIds, lesson.id],
      lastLessonId: lesson.id,
      watchedSeconds: alreadyComplete ? student.watchedSeconds : student.watchedSeconds + lesson.duration,
      ...updateStreak(student),
    });
  };

  const markIncomplete = () =>
    updateStudent({ ...student, completedLessonIds: student.completedLessonIds.filter((id) => id !== lesson.id) });

  const bookmarked = student.bookmarkedLessonIds.includes(lesson.id);
  const toggleBookmark = () =>
    updateStudent({
      ...student,
      bookmarkedLessonIds: bookmarked
        ? student.bookmarkedLessonIds.filter((id) => id !== lesson.id)
        : [...student.bookmarkedLessonIds, lesson.id],
    });

  const updateNote = (v: string) =>
    updateStudent({ ...student, lessonNotes: { ...student.lessonNotes, [lesson.id]: v } });

  const updatePreferredLanguage = (lang: string) => {
    setCaptionLanguage(lang);
    updateStudent({ ...student, preferredLanguage: lang });
  };

  const attachQuickMaterial = (file?: File) => {
    if (!file) return;
    updateCourses(
      courses.map((c) =>
        c.id !== course.id ? c : {
          ...c,
          modules: c.modules.map((m) => ({
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lesson.id
                ? { ...l, resources: [...l.resources, { id: `resource-${Date.now()}`, title: file.name, language: student.preferredLanguage, type: file.name.toLowerCase().endsWith(".pdf") ? "pdf" as const : "worksheet" as const, url: URL.createObjectURL(file) }] }
                : l,
            ),
          })),
        },
      ),
    );
  };

  const upcoming = nextLesson(course, lesson.id);
  const lessonRequests = requests.filter((r) => r.lessonId === lesson.id);

  // Access gate wraps the return below
  const accessGateProps = {
    student,
    courseId: course.id,
    courseTitle: course.title,
    courseSlug: slug,
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v && v.duration && v.currentTime / v.duration >= 0.8 && !autoCompletedRef.current && !student.completedLessonIds.includes(lesson.id)) {
      autoCompletedRef.current = true;
      markComplete();
    }
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    const saved = student.lessonPositions[lesson.id];
    if (v && saved && saved > 0) v.currentTime = saved;
  };

  const savePosition = () => {
    const v = videoRef.current;
    if (v && v.currentTime > 0) {
      updateStudent({ ...student, lessonPositions: { ...student.lessonPositions, [lesson.id]: v.currentTime } });
    }
  };

  const submitLessonRequest = () => {
    if (!requestComment.trim()) return;
    updateRequests([
      { id: `request-${course.id}-${lesson.id}-${requests.length + 1}`, courseId: course.id, lessonId: lesson.id, author: student.name, type: requestType, comment: requestComment.trim(), status: "new", createdAt: "Today" },
      ...requests,
    ]);
    setRequestComment("");
    setRequestType("next");
  };

  return (
    <AccessGate {...accessGateProps}>
    <section className="lesson-layout">
      <aside className="lesson-sidebar">
        <button className="back-link" onClick={() => go({ name: "course", slug })}>{course.title}</button>
        {course.modules.map((mod) => (
          <div key={mod.id}>
            <h3>{mod.title}</h3>
            {mod.lessons.map((item) => (
              <button
                key={item.id}
                className={`sidebar-lesson ${item.id === lesson.id ? "active" : ""}`}
                onClick={() => go({ name: "lesson", slug, lessonId: item.id })}
              >
                <span>{student.completedLessonIds.includes(item.id) ? <Check size={15} /> : <Play size={15} />}</span>
                {item.title}
              </button>
            ))}
          </div>
        ))}
      </aside>

      <div className="player-pane">
        <div className="video-shell">
          {lesson.videoUrl ? (
            <video ref={videoRef} controls poster={course.thumbnailUrl} onEnded={markComplete} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onPause={savePosition}>
              <source src={lesson.videoUrl} type="video/mp4" />
              {lesson.subtitles.filter((t) => t.src && t.src !== "#").map((t) => (
                <track key={t.id} src={t.src} kind="subtitles" srcLang={t.language} label={t.label} default={t.language === captionLanguage} />
              ))}
            </video>
          ) : (
            <div className="video-empty">
              <Play size={40} />
              <h3>Video coming soon</h3>
              <p>This lesson's video is being prepared. Check back soon or read the lesson content below.</p>
            </div>
          )}
          <div className="speed-controls">
            {[0.5, 1, 1.5, 2].map((s) => (
              <button key={s} className={playbackSpeed === s ? "active" : ""} onClick={() => changeSpeed(s)}>{s}x</button>
            ))}
          </div>
          <div className="caption-bar">
            <label>
              Subtitle language
              <LanguageSelect value={captionLanguage} onChange={updatePreferredLanguage} />
            </label>
            <span>{lesson.subtitles.length ? `${lesson.subtitles.length} caption track(s)` : "Upload captions in admin"}</span>
          </div>
        </div>

        <div className="lesson-copy">
          <div>
            <p className="eyebrow">Lesson</p>
            <h1>{lesson.title}</h1>
            <p>{lesson.description}</p>
          </div>
          <button className="primary" onClick={markComplete}><Check size={18} /> Mark complete</button>
          <button className="secondary" onClick={toggleBookmark} aria-label={bookmarked ? "Remove bookmark" : "Bookmark this lesson"}><Bookmark size={18} /> {bookmarked ? "Saved" : "Save lesson"}</button>
          {student.completedLessonIds.includes(lesson.id) && (
            <button className="secondary" onClick={markIncomplete}>Mark incomplete</button>
          )}
        </div>

        <div className="resource-panel">
          <h2>Learning material</h2>
          <div className="lesson-material">
            <h3>Theory</h3>
            <p>{lesson.theory}</p>
            <h3>Practice drills</h3>
            <ul>{lesson.practice.map((p) => <li key={p}>{p}</li>)}</ul>
            <h3>Assessment target</h3>
            <p>{lesson.assessment}</p>
          </div>
          <h2>Downloads</h2>
          {lesson.resources.length ? (
            lesson.resources.map((r) => (
              <a key={r.id} href={r.url} className="resource">
                <Download size={17} />
                <span>{r.title}</span>
                <small>{r.language.toUpperCase()} &middot; {r.type}</small>
              </a>
            ))
          ) : (
            <p>No downloadable resources for this lesson yet.</p>
          )}
          <label className="inline-upload">
            <Upload size={17} /> Attach local material
            <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(e) => attachQuickMaterial(e.target.files?.[0])} />
          </label>
        </div>

        <div className="resource-panel">
          <h2>Private notes</h2>
          <textarea
            className="notes-area"
            value={student.lessonNotes[lesson.id] ?? ""}
            onChange={(e) => updateNote(e.target.value)}
            placeholder="Write practice notes, taste observations, or questions for this lesson."
          />
        </div>

        <div className="resource-panel practice-upload-cta">
          <h2>Practice task</h2>
          <p>{lesson.practice[0] ?? "Upload a practice attempt for feedback."}</p>
          <button className="primary" onClick={() => go({ name: "upload" })}>
            <Camera size={18} /> Upload latte art attempt
          </button>
        </div>

        <div className="resource-panel">
          <h2>Request next content</h2>
          <p>Tell the instructor what you need next.</p>
          <div className="request-form">
            <select value={requestType} onChange={(e) => setRequestType(e.target.value as LessonRequest["type"])}>
              <option value="next">Next lesson request</option>
              <option value="upcoming">Upcoming lesson idea</option>
              <option value="material">Need more material</option>
            </select>
            <textarea value={requestComment} onChange={(e) => setRequestComment(e.target.value)} placeholder="Example: Please add a slow-motion close-up for cup tilt before the heart pour." />
            <button className="primary" onClick={submitLessonRequest}>Send request</button>
          </div>
          {lessonRequests.length > 0 && (
            <div className="request-list">
              {lessonRequests.slice(0, 4).map((r) => (
                <article key={r.id} className="request-card">
                  <span className={`request-status ${r.status}`}>{r.status}</span>
                  <strong>{r.type}</strong>
                  <p>{r.comment}</p>
                  <small>{r.author} &middot; {r.createdAt}</small>
                </article>
              ))}
            </div>
          )}
        </div>

        {upcoming && (
          <button className="next-lesson" onClick={() => go({ name: "lesson", slug, lessonId: upcoming.id })}>
            Next lesson: {upcoming.title} <ChevronRight size={18} />
          </button>
        )}
      </div>
    </section>
    </AccessGate>
  );
}
