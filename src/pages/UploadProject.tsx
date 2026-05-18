import { Camera, Upload } from "lucide-react";
import { useState } from "react";
import { Course, ProjectUpload, StudentState } from "../types";

export function UploadProject({
  courses,
  student,
  uploads,
  updateUploads,
}: {
  courses: Course[];
  student: StudentState;
  uploads: ProjectUpload[];
  updateUploads: (u: ProjectUpload[]) => void;
}) {
  const [title, setTitle] = useState("");
  const [pattern, setPattern] = useState<ProjectUpload["pattern"]>("Heart");
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [success, setSuccess] = useState(false);

  const upload = () => {
    if (!title.trim() || !imageUrl) return;
    updateUploads([
      { id: `upload-${uploads.length + 1}`, user: student.name, title: title.trim(), pattern, courseId, imageUrl, notes, likes: 0, createdAt: "Today", comments: [] },
      ...uploads,
    ]);
    setTitle(""); setNotes(""); setImageUrl(""); setSuccess(true);
  };

  return (
    <section className="page upload-page">
      <div className="toolbar">
        <div><p className="eyebrow">Practice upload</p><h1>Share your latte art attempt</h1></div>
      </div>
      <div className="upload-layout">
        <section className="editor-panel">
          <label>Project title<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label>
            Pattern
            <select value={pattern} onChange={(e) => setPattern(e.target.value as ProjectUpload["pattern"])}>
              {["Heart", "Tulip", "Rosetta", "Swan", "Free Pour"].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label>
            Related course
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </label>
          <label>Practice notes<textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
          <label className="upload-box">
            <Upload size={18} /> Choose latte art image
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setImageUrl(URL.createObjectURL(f)); }} />
          </label>
          <button className="primary" onClick={upload}>Publish to gallery</button>
          {success && <p className="success-message" role="alert">Upload added to the community gallery.</p>}
        </section>
        <aside className="preview-panel">
          {imageUrl ? <img src={imageUrl} alt={title || "Latte art preview"} loading="lazy" /> : <Camera size={44} />}
          <h3>{title || "Project preview"}</h3>
          <p>{notes || "Your photo and practice notes will appear here before publishing."}</p>
        </aside>
      </div>
    </section>
  );
}
