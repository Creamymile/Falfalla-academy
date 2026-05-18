import { Course, ProjectUpload } from "../types";

export function GalleryCard({ upload, courses }: { upload: ProjectUpload; courses: Course[] }) {
  const course = courses.find((c) => c.id === upload.courseId);
  return (
    <div className="gallery-card-inner">
      <img src={upload.imageUrl} alt={upload.title || "Student latte art upload"} loading="lazy" />
      <div>
        <span className="badge">{upload.pattern}</span>
        {upload.featured && <span className="badge bestseller">Featured</span>}
        <h3>{upload.title}</h3>
        <p>{upload.notes}</p>
        <small>{upload.user} &middot; {course?.title ?? "Practice"} &middot; {upload.createdAt}</small>
      </div>
    </div>
  );
}
