import { Camera, Heart, MessageCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { go } from "../router";
import { Course, ProjectUpload, StudentState } from "../types";
import { GalleryCard } from "../components/GalleryCard";

export function Gallery({
  courses,
  student,
  updateStudent,
  uploads,
  updateUploads,
}: {
  courses: Course[];
  student: StudentState;
  updateStudent: (s: StudentState) => void;
  uploads: ProjectUpload[];
  updateUploads: (u: ProjectUpload[]) => void;
}) {
  const [pattern, setPattern] = useState<ProjectUpload["pattern"] | "All">("All");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const filtered = uploads.filter((u) => pattern === "All" || u.pattern === pattern);

  const like = (id: string) => {
    if (student.likedUploadIds.includes(id)) return;
    updateUploads(uploads.map((u) => (u.id === id ? { ...u, likes: u.likes + 1 } : u)));
    updateStudent({ ...student, likedUploadIds: [...student.likedUploadIds, id] });
  };

  const comment = (id: string) => {
    const draft = commentDrafts[id]?.trim();
    if (!draft || !student.isAuthenticated) return;
    updateUploads(
      uploads.map((u) =>
        u.id === id
          ? { ...u, comments: [...u.comments, { id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, author: student.name, comment: draft, createdAt: "Today" }] }
          : u,
      ),
    );
    setCommentDrafts({ ...commentDrafts, [id]: "" });
  };

  const canDelete = (upload: ProjectUpload) =>
    student.isAuthenticated && (upload.userEmail === student.email || student.role === "admin");

  const deleteUpload = (id: string) => {
    if (!confirm("Delete this upload? This cannot be undone.")) return;
    updateUploads(uploads.filter((u) => u.id !== id));
  };

  return (
    <section className="page">
      <div className="toolbar">
        <div><p className="eyebrow">Community</p><h1>Latte art gallery</h1></div>
        <button className="primary" onClick={() => go({ name: "upload" })}><Camera size={18} /> Upload attempt</button>
      </div>
      <div className="segmented gallery-filters">
        {(["All", "Heart", "Tulip", "Rosetta", "Swan", "Free Pour"] as const).map((item) => (
          <button key={item} className={pattern === item ? "active" : ""} onClick={() => setPattern(item)}>{item}</button>
        ))}
      </div>
      <div className="gallery-grid">
        {filtered.map((upload) => (
          <article className={`gallery-card ${upload.featured ? "featured" : ""}`} key={upload.id}>
            <GalleryCard upload={upload} courses={courses} />
            <div className="gallery-actions">
              <button className={`secondary ${student.likedUploadIds.includes(upload.id) ? "liked" : ""}`} onClick={() => like(upload.id)} aria-label={`Like, ${upload.likes} likes`} disabled={student.likedUploadIds.includes(upload.id)}><Heart size={16} /> {upload.likes}</button>
              {student.isAuthenticated && (
                <>
                  <input
                    value={commentDrafts[upload.id] ?? ""}
                    onChange={(e) => setCommentDrafts({ ...commentDrafts, [upload.id]: e.target.value })}
                    placeholder="Add a comment"
                  />
                  <button className="secondary" onClick={() => comment(upload.id)} aria-label="Post comment"><MessageCircle size={16} /> Comment</button>
                </>
              )}
              {canDelete(upload) && (
                <button className="secondary danger" onClick={() => deleteUpload(upload.id)} aria-label="Delete upload" title="Delete upload"><Trash2 size={16} /></button>
              )}
            </div>
            {upload.comments.length > 0 && (
              <div className="comment-list">
                {upload.comments.slice(-2).map((c) => (
                  <p key={c.id}><strong>{c.author}:</strong> {c.comment}</p>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
