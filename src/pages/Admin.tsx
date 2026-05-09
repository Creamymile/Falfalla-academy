import {
  BookOpen, Clock, Copy, CreditCard, Download, FileDown, FileUp,
  Image, KeyRound, Languages, MessageCircle, Play, Plus, RotateCcw, Search, Settings,
  Trash2, Upload, Users, Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Course, LessonRequest, ProjectUpload, AccessCode } from "../types";
import { courseLessonCount, flattenLessons } from "../utils";
import { makeSlug, supportedLanguages } from "../constants";
import { Stat } from "../components/Shared";
import { courses as seedCourses } from "../data/courses";
import { generateAccessCode, loadAccessCodes, saveAccessCodes } from "../services/access";

export function Admin({
  courses,
  updateCourses,
  requests,
  updateRequests,
  uploads,
}: {
  courses: Course[];
  updateCourses: (c: Course[]) => void;
  requests: LessonRequest[];
  updateRequests: (r: LessonRequest[]) => void;
  uploads: ProjectUpload[];
}) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id ?? "");
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) ?? courses[0];
  const firstLesson = selectedCourse ? flattenLessons(selectedCourse)[0] : undefined;
  const [selectedLessonId, setSelectedLessonId] = useState(firstLesson?.id ?? "");
  const [selectedModuleId, setSelectedModuleId] = useState(selectedCourse?.modules[0]?.id ?? "");
  const [importMessage, setImportMessage] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>(loadAccessCodes);
  const [newCodeCourseId, setNewCodeCourseId] = useState(courses[0]?.id ?? "");
  const [newCodeDays, setNewCodeDays] = useState(7);
  const [copiedCodeId, setCopiedCodeId] = useState("");

  const mockStudents = [
    { name: "Maya R.", email: "maya@example.com", enrolled: ["Barista Foundations", "Latte Art Fundamentals"], watchHours: 12.4, lastActive: "2026-05-06", joinDate: "2026-04-10" },
    { name: "Ari S.", email: "ari@example.com", enrolled: ["Latte Art Fundamentals", "Latte Art Advanced"], watchHours: 18.7, lastActive: "2026-05-07", joinDate: "2026-04-15" },
    { name: "Daniel K.", email: "daniel@example.com", enrolled: ["Barista Foundations"], watchHours: 4.2, lastActive: "2026-05-03", joinDate: "2026-04-20" },
    { name: "Lina P.", email: "lina@example.com", enrolled: ["Latte Art Fundamentals"], watchHours: 8.9, lastActive: "2026-05-05", joinDate: "2026-04-22" },
    { name: "Priya M.", email: "priya@example.com", enrolled: ["Coffee Sensory & Tasting", "Brewing Methods"], watchHours: 6.1, lastActive: "2026-05-07", joinDate: "2026-04-28" },
    { name: "Noah T.", email: "noah@example.com", enrolled: ["Latte Art Advanced"], watchHours: 15.3, lastActive: "2026-05-06", joinDate: "2026-04-12" },
  ];

  const selectedLesson =
    selectedCourse && flattenLessons(selectedCourse).find((l) => l.id === selectedLessonId)
      ? flattenLessons(selectedCourse).find((l) => l.id === selectedLessonId)
      : firstLesson;
  const selectedModule = selectedCourse?.modules.find((m) => m.id === selectedModuleId) ?? selectedCourse?.modules[0];

  const missingVideos = courses.reduce((t, c) => t + flattenLessons(c).filter((l) => !l.videoUrl || l.videoUrl === "#").length, 0);
  const missingMaterials = courses.reduce((t, c) => t + flattenLessons(c).filter((l) => l.resources.length === 0).length, 0);
  const missingSubtitleSources = courses.reduce(
    (t, c) => t + flattenLessons(c).filter((l) => l.subtitles.every((s) => !s.src || s.src === "#")).length, 0,
  );

  const totals = useMemo(() => ({
    courses: courses.length,
    lessons: courses.reduce((t, c) => t + courseLessonCount(c), 0),
    students: Math.max(128, courses.reduce((s, c) => s + c.enrollmentCount, 0)),
    uploads: uploads.length,
  }), [courses, uploads]);

  const patchCourse = (id: string, patch: Partial<Course>) =>
    updateCourses(courses.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const patchLesson = (courseId: string, lessonId: string, patch: Partial<NonNullable<typeof selectedLesson>>) =>
    updateCourses(courses.map((c) =>
      c.id !== courseId ? c : {
        ...c,
        modules: c.modules.map((m) => ({ ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)) })),
      },
    ));

  const addModule = () => {
    if (!selectedCourse) return;
    const id = `module-${Date.now()}`;
    patchCourse(selectedCourse.id, {
      modules: [...selectedCourse.modules, { id, title: `New Training Module ${selectedCourse.modules.length + 1}`, description: "Add the module objective.", lessons: [] }],
    });
    setSelectedModuleId(id);
  };

  const patchModule = (moduleId: string, patch: Partial<NonNullable<typeof selectedModule>>) => {
    if (!selectedCourse) return;
    patchCourse(selectedCourse.id, { modules: selectedCourse.modules.map((m) => (m.id === moduleId ? { ...m, ...patch } : m)) });
  };

  const deleteModule = (moduleId: string) => {
    if (!selectedCourse || selectedCourse.modules.length <= 1) return;
    const next = selectedCourse.modules.filter((m) => m.id !== moduleId);
    patchCourse(selectedCourse.id, { modules: next });
    setSelectedModuleId(next[0]?.id ?? "");
    setSelectedLessonId(flattenLessons({ ...selectedCourse, modules: next })[0]?.id ?? "");
  };

  const addLesson = () => {
    if (!selectedCourse || !selectedModule) return;
    const newLesson = {
      id: `lesson-${Date.now()}`, title: "New Latte Art Lesson", description: "Add the lesson summary.",
      theory: "Add SCA-aligned theory.", practice: ["Add a practical drill."], assessment: "Add a completion target.",
      duration: 600, videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      subtitles: [{ id: `subtitle-${Date.now()}`, language: "en", label: "English", src: "#", isDefault: true }],
      resources: [],
    };
    updateCourses(courses.map((c) =>
      c.id !== selectedCourse.id ? c : {
        ...c,
        modules: c.modules.map((m) => m.id === selectedModule.id ? { ...m, lessons: [...m.lessons, newLesson] } : m),
      },
    ));
    setSelectedLessonId(newLesson.id);
  };

  const deleteLesson = (lessonId: string) => {
    if (!selectedCourse) return;
    const updated = selectedCourse.modules.map((m) => ({ ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }));
    updateCourses(courses.map((c) => (c.id === selectedCourse.id ? { ...c, modules: updated } : c)));
    setSelectedLessonId(flattenLessons({ ...selectedCourse, modules: updated })[0]?.id ?? "");
  };

  const addResource = () => {
    if (!selectedCourse || !selectedLesson) return;
    patchLesson(selectedCourse.id, selectedLesson.id, {
      resources: [...selectedLesson.resources, { id: `resource-${Date.now()}`, title: "New material", language: "en", type: "pdf", url: "#" }],
    });
  };

  const handleVideoUpload = (file?: File) => {
    if (!file || !selectedCourse || !selectedLesson) return;
    patchLesson(selectedCourse.id, selectedLesson.id, { videoUrl: URL.createObjectURL(file) });
  };

  const handleResourceUpload = (resourceId: string, file?: File) => {
    if (!file || !selectedCourse || !selectedLesson) return;
    patchLesson(selectedCourse.id, selectedLesson.id, {
      resources: selectedLesson.resources.map((r) => (r.id === resourceId ? { ...r, title: file.name, url: URL.createObjectURL(file) } : r)),
    });
  };

  const addSubtitle = () => {
    if (!selectedCourse || !selectedLesson) return;
    patchLesson(selectedCourse.id, selectedLesson.id, {
      subtitles: [...selectedLesson.subtitles, { id: `subtitle-${Date.now()}`, language: "en", label: "English", src: "#", isDefault: selectedLesson.subtitles.length === 0 }],
    });
  };

  const handleSubtitleUpload = (subtitleId: string, file?: File) => {
    if (!file || !selectedCourse || !selectedLesson) return;
    patchLesson(selectedCourse.id, selectedLesson.id, {
      subtitles: selectedLesson.subtitles.map((s) => (s.id === subtitleId ? { ...s, src: URL.createObjectURL(file) } : s)),
    });
  };

  const deleteResource = (resourceId: string) => {
    if (!selectedCourse || !selectedLesson) return;
    patchLesson(selectedCourse.id, selectedLesson.id, { resources: selectedLesson.resources.filter((r) => r.id !== resourceId) });
  };

  const deleteSubtitle = (subtitleId: string) => {
    if (!selectedCourse || !selectedLesson) return;
    patchLesson(selectedCourse.id, selectedLesson.id, { subtitles: selectedLesson.subtitles.filter((s) => s.id !== subtitleId) });
  };

  const duplicateCourse = () => {
    if (!selectedCourse) return;
    const title = `${selectedCourse.title} Copy`;
    const copy = { ...selectedCourse, id: `course-${Date.now()}`, title, slug: `${makeSlug(title)}-${Date.now()}` };
    updateCourses([...courses, copy]);
    setSelectedCourseId(copy.id);
  };

  const exportContent = () => {
    const blob = new Blob([JSON.stringify(courses, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "falfalla-academy-courses.json";
    link.click();
  };

  const importContent = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Course[];
        if (!Array.isArray(parsed) || !parsed[0]?.modules) throw new Error("Invalid");
        // Sanitize: only keep known fields and strip any prototype pollution keys
        const sanitized = parsed.map((c) => ({
          id: String(c.id ?? ""),
          title: String(c.title ?? ""),
          slug: String(c.slug ?? ""),
          description: String(c.description ?? ""),
          level: (["beginner", "intermediate", "advanced"].includes(c.level) ? c.level : "beginner") as Course["level"],
          instructor: String(c.instructor ?? ""),
          instructorBio: String(c.instructorBio ?? ""),
          duration: Number(c.duration) || 0,
          thumbnailUrl: String(c.thumbnailUrl ?? ""),
          outcomes: Array.isArray(c.outcomes) ? c.outcomes.map(String) : [],
          equipment: Array.isArray(c.equipment) ? c.equipment.map(String) : [],
          enrollmentCount: Number(c.enrollmentCount) || 0,
          reviews: Array.isArray(c.reviews) ? c.reviews : [],
          modules: Array.isArray(c.modules) ? c.modules : [],
        }));
        if (!sanitized[0]?.id || !sanitized[0]?.modules.length) throw new Error("Invalid structure");
        updateCourses(sanitized);
        setSelectedCourseId(parsed[0]?.id ?? "");
        setSelectedModuleId(parsed[0]?.modules[0]?.id ?? "");
        setSelectedLessonId(flattenLessons(parsed[0])[0]?.id ?? "");
        setImportMessage("Course content imported.");
      } catch {
        setImportMessage("Import failed. Use a valid export.");
      }
    };
    reader.readAsText(file);
  };

  if (!selectedCourse)
    return (
      <section className="page">
        <h1>Admin</h1>
        <button className="primary" onClick={() => updateCourses(seedCourses)}>Restore starter curriculum</button>
      </section>
    );

  return (
    <section className="page">
      <div className="toolbar">
        <div><p className="eyebrow">Admin</p><h1>Content operations</h1></div>
        <span className="admin-mode"><Settings size={16} /> Admin access</span>
      </div>

      <div className="stats">
        <Stat icon={<BookOpen />} label="Courses" value={totals.courses} />
        <Stat icon={<Play />} label="Lessons" value={totals.lessons} />
        <Stat icon={<Users />} label="Students" value={totals.students} />
        <Stat icon={<Clock />} label="Open requests" value={requests.filter((r) => r.status !== "done").length} />
      </div>

      <section className="editor-panel analytics-panel">
        <div className="editor-heading"><h2>Instructor analytics</h2><span className="admin-mode">Mock revenue</span></div>
        <div className="analytics-grid">
          <Stat icon={<CreditCard />} label="Projected revenue" value="$8.4k" />
          <Stat icon={<Image />} label="Project uploads" value={totals.uploads} />
          <Stat icon={<MessageCircle />} label="Requests" value={requests.length} />
        </div>
      </section>

      <section className="editor-panel request-admin">
        <div className="editor-heading"><h2>Student lesson requests</h2><span className="admin-mode">{requests.length} total</span></div>
        {requests.length ? (
          <div className="request-admin-list">
            {requests.map((r) => {
              const c = courses.find((x) => x.id === r.courseId);
              const l = c ? flattenLessons(c).find((x) => x.id === r.lessonId) : undefined;
              return (
                <article key={r.id} className="request-admin-card">
                  <div>
                    <span className={`request-status ${r.status}`}>{r.status}</span>
                    <strong>{r.type}</strong>
                    <p>{r.comment}</p>
                    <small>{r.author} &middot; {c?.title ?? "Unknown"} &middot; {l?.title ?? "Unknown"}</small>
                  </div>
                  <select value={r.status} onChange={(e) => updateRequests(requests.map((x) => (x.id === r.id ? { ...x, status: e.target.value as LessonRequest["status"] } : x)))}>
                    <option value="new">New</option><option value="reviewing">Reviewing</option><option value="planned">Planned</option><option value="done">Done</option>
                  </select>
                  <button className="danger" onClick={() => updateRequests(requests.filter((x) => x.id !== r.id))}><Trash2 size={16} /> Delete</button>
                </article>
              );
            })}
          </div>
        ) : <p>No student lesson requests yet.</p>}
      </section>

      <div className="readiness-grid">
        <article><Video size={20} /><strong>{missingVideos}</strong><span>lessons need final videos</span></article>
        <article><Languages size={20} /><strong>{missingSubtitleSources}</strong><span>lessons need subtitle files</span></article>
        <article><Download size={20} /><strong>{missingMaterials}</strong><span>lessons need materials</span></article>
      </div>

      <section className="editor-panel access-code-panel">
        <div className="editor-heading">
          <h2><KeyRound size={20} /> Access codes</h2>
          <span className="admin-mode">{accessCodes.length} total</span>
        </div>
        <div className="access-code-generator">
          <label>
            Course
            <select value={newCodeCourseId} onChange={(e) => setNewCodeCourseId(e.target.value)}>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </label>
          <label>
            Duration (days)
            <input type="number" min={1} max={90} value={newCodeDays} onChange={(e) => setNewCodeDays(Number(e.target.value) || 7)} />
          </label>
          <button className="primary" onClick={() => {
            const code = generateAccessCode(newCodeCourseId, newCodeDays);
            const updated = [code, ...accessCodes];
            setAccessCodes(updated);
            saveAccessCodes(updated);
          }}>
            <Plus size={16} /> Generate code
          </button>
        </div>
        {accessCodes.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="student-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Course</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Redeemed by</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accessCodes.map((ac) => {
                  const courseName = courses.find((c) => c.id === ac.courseId)?.title ?? ac.courseId;
                  const isExpired = ac.redeemedAt
                    ? new Date(new Date(ac.redeemedAt).getTime() + ac.durationDays * 86400000) < new Date()
                    : false;
                  return (
                    <tr key={ac.id}>
                      <td>
                        <code className="access-code-display">{ac.code}</code>
                        <button
                          className="icon-button"
                          title="Copy code"
                          onClick={() => { navigator.clipboard.writeText(ac.code); setCopiedCodeId(ac.id); setTimeout(() => setCopiedCodeId(""), 2000); }}
                        >
                          {copiedCodeId === ac.id ? "✓" : <Copy size={14} />}
                        </button>
                      </td>
                      <td>{courseName}</td>
                      <td>{ac.durationDays}d</td>
                      <td>
                        <span className={`request-status ${ac.redeemedBy ? (isExpired ? "done" : "reviewing") : ac.isActive ? "new" : "done"}`}>
                          {ac.redeemedBy ? (isExpired ? "Expired" : "Active") : ac.isActive ? "Available" : "Disabled"}
                        </span>
                      </td>
                      <td>{ac.redeemedBy ?? "—"}</td>
                      <td>{ac.createdAt}</td>
                      <td>
                        <button
                          className="danger small"
                          onClick={() => {
                            const updated = accessCodes.map((c) => c.id === ac.id ? { ...c, isActive: !c.isActive } : c);
                            setAccessCodes(updated);
                            saveAccessCodes(updated);
                          }}
                        >
                          {ac.isActive ? "Disable" : "Enable"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="editor-panel">
        <div className="editor-heading">
          <h2>Student management</h2>
          <label className="search" style={{ minWidth: 220 }}>
            <Search size={16} />
            <input value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="Search students" />
          </label>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="student-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Courses</th><th>Watch hours</th><th>Last active</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {mockStudents
                .filter((s) => `${s.name} ${s.email}`.toLowerCase().includes(studentSearch.toLowerCase()))
                .map((s) => (
                  <tr key={s.email}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.email}</td>
                    <td>{s.enrolled.join(", ")}</td>
                    <td>{s.watchHours}h</td>
                    <td>{s.lastActive}</td>
                    <td>{s.joinDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="admin-shell">
        <aside className="admin-list">
          <div className="admin-actions">
            <button className="secondary" onClick={addModule}><Plus size={16} /> Module</button>
            <button className="secondary" onClick={addLesson}><Plus size={16} /> Lesson</button>
          </div>
          <div className="admin-actions">
            <button className="secondary" onClick={duplicateCourse}><Copy size={16} /> Duplicate</button>
            <button className="secondary" onClick={() => updateCourses(seedCourses)}><RotateCcw size={16} /> Reset</button>
          </div>
          <div className="admin-actions">
            <button className="secondary" onClick={exportContent}><FileDown size={16} /> Export</button>
            <label className="secondary file-button"><FileUp size={16} /> Import<input type="file" accept="application/json,.json" onChange={(e) => importContent(e.target.files?.[0])} /></label>
          </div>
          {importMessage && <p className="admin-message" role="alert">{importMessage}</p>}
          {courses.map((c) => (
            <button
              className={`admin-row ${c.id === selectedCourse.id ? "active" : ""}`}
              key={c.id}
              onClick={() => { setSelectedCourseId(c.id); setSelectedModuleId(c.modules[0]?.id ?? ""); setSelectedLessonId(flattenLessons(c)[0]?.id ?? ""); }}
            >
              <img src={c.thumbnailUrl} alt="" />
              <span><strong>{c.title}</strong><small>{c.modules.length} modules, {courseLessonCount(c)} lessons</small></span>
            </button>
          ))}
        </aside>

        <div className="admin-editor">
          <section className="editor-panel">
            <h2>Course details</h2>
            <label>Course title<input value={selectedCourse.title} onChange={(e) => patchCourse(selectedCourse.id, { title: e.target.value })} /></label>
            <label>Description<textarea value={selectedCourse.description} onChange={(e) => patchCourse(selectedCourse.id, { description: e.target.value })} /></label>
            <label>Slug<input value={selectedCourse.slug} onChange={(e) => patchCourse(selectedCourse.id, { slug: makeSlug(e.target.value) })} /></label>
            <label>Thumbnail URL<input value={selectedCourse.thumbnailUrl} onChange={(e) => patchCourse(selectedCourse.id, { thumbnailUrl: e.target.value })} /></label>
            <label>
              Level
              <select value={selectedCourse.level} onChange={(e) => patchCourse(selectedCourse.id, { level: e.target.value as Course["level"] })}>
                <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
              </select>
            </label>
            <label>Learning outcomes<textarea value={selectedCourse.outcomes.join("\n")} onChange={(e) => patchCourse(selectedCourse.id, { outcomes: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} /></label>
          </section>

          <section className="editor-panel">
            <div className="editor-heading">
              <h2>Modules</h2>
              <select value={selectedModule?.id ?? ""} onChange={(e) => setSelectedModuleId(e.target.value)}>
                {selectedCourse.modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
            {selectedModule && (
              <>
                <label>Module title<input value={selectedModule.title} onChange={(e) => patchModule(selectedModule.id, { title: e.target.value })} /></label>
                <label>Module description<textarea value={selectedModule.description} onChange={(e) => patchModule(selectedModule.id, { description: e.target.value })} /></label>
                <button className="danger" onClick={() => deleteModule(selectedModule.id)} disabled={selectedCourse.modules.length <= 1}><Trash2 size={16} /> Delete module</button>
              </>
            )}
          </section>

          <section className="editor-panel">
            <div className="editor-heading">
              <h2>Lesson materials</h2>
              <div className="editor-selects">
                <select value={selectedModule?.id ?? ""} onChange={(e) => setSelectedModuleId(e.target.value)}>
                  {selectedCourse.modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
                <select value={selectedLesson?.id ?? ""} onChange={(e) => setSelectedLessonId(e.target.value)}>
                  {selectedCourse.modules.map((m) => m.lessons.map((l) => <option key={l.id} value={l.id}>{m.title}: {l.title}</option>))}
                </select>
              </div>
            </div>
            {selectedLesson ? (
              <>
                <label>Lesson title<input value={selectedLesson.title} onChange={(e) => patchLesson(selectedCourse.id, selectedLesson.id, { title: e.target.value })} /></label>
                <label>Duration (seconds)<input type="number" min="0" value={selectedLesson.duration} onChange={(e) => patchLesson(selectedCourse.id, selectedLesson.id, { duration: Number(e.target.value) })} /></label>
                <label>Video URL<input value={selectedLesson.videoUrl} onChange={(e) => patchLesson(selectedCourse.id, selectedLesson.id, { videoUrl: e.target.value })} /></label>
                <label>Summary<textarea value={selectedLesson.description} onChange={(e) => patchLesson(selectedCourse.id, selectedLesson.id, { description: e.target.value })} /></label>
                <label>Theory<textarea value={selectedLesson.theory} onChange={(e) => patchLesson(selectedCourse.id, selectedLesson.id, { theory: e.target.value })} /></label>
                <label>Practice drills<textarea value={selectedLesson.practice.join("\n")} onChange={(e) => patchLesson(selectedCourse.id, selectedLesson.id, { practice: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} /></label>
                <label>Assessment<textarea value={selectedLesson.assessment} onChange={(e) => patchLesson(selectedCourse.id, selectedLesson.id, { assessment: e.target.value })} /></label>
                <div className="upload-box">
                  <Upload size={18} /><span>Upload lesson video</span>
                  <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(e.target.files?.[0])} />
                </div>
                <button className="danger" onClick={() => deleteLesson(selectedLesson.id)}><Trash2 size={16} /> Delete lesson</button>

                <div className="resource-editor">
                  <div className="editor-heading"><h3>Subtitle tracks</h3><button className="secondary small" onClick={addSubtitle}>Add subtitle</button></div>
                  {selectedLesson.subtitles.map((sub) => (
                    <div className="subtitle-edit-row" key={sub.id}>
                      <select value={sub.language} onChange={(e) => patchLesson(selectedCourse.id, selectedLesson.id, { subtitles: selectedLesson.subtitles.map((s) => s.id === sub.id ? { ...s, language: e.target.value, label: supportedLanguages.find((l) => l.code === e.target.value)?.label ?? s.label } : s) })}>
                        {supportedLanguages.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                      </select>
                      <input value={sub.label} onChange={(e) => patchLesson(selectedCourse.id, selectedLesson.id, { subtitles: selectedLesson.subtitles.map((s) => s.id === sub.id ? { ...s, label: e.target.value } : s) })} />
                      <input value={sub.src} onChange={(e) => patchLesson(selectedCourse.id, selectedLesson.id, { subtitles: selectedLesson.subtitles.map((s) => s.id === sub.id ? { ...s, src: e.target.value } : s) })} />
                      <input type="file" accept=".vtt" onChange={(e) => handleSubtitleUpload(sub.id, e.target.files?.[0])} />
                      <button className="danger" onClick={() => deleteSubtitle(sub.id)}><Trash2 size={16} /> Remove</button>
                    </div>
                  ))}
                </div>

                <div className="resource-editor">
                  <div className="editor-heading"><h3>Downloadable materials</h3><button className="secondary small" onClick={addResource}>Add material</button></div>
                  {selectedLesson.resources.map((res) => (
                    <div className="resource-edit-row" key={res.id}>
                      <input value={res.title} onChange={(e) => patchLesson(selectedCourse.id, selectedLesson.id, { resources: selectedLesson.resources.map((r) => r.id === res.id ? { ...r, title: e.target.value } : r) })} />
                      <input value={res.url} onChange={(e) => patchLesson(selectedCourse.id, selectedLesson.id, { resources: selectedLesson.resources.map((r) => r.id === res.id ? { ...r, url: e.target.value } : r) })} />
                      <select value={res.language} onChange={(e) => patchLesson(selectedCourse.id, selectedLesson.id, { resources: selectedLesson.resources.map((r) => r.id === res.id ? { ...r, language: e.target.value } : r) })}>
                        {supportedLanguages.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                      </select>
                      <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(e) => handleResourceUpload(res.id, e.target.files?.[0])} />
                      <button className="danger" onClick={() => deleteResource(res.id)}><Trash2 size={16} /> Remove</button>
                    </div>
                  ))}
                </div>
              </>
            ) : <p>Add a lesson to start editing materials.</p>}
          </section>
        </div>
      </div>
    </section>
  );
}
