import { Search } from "lucide-react";
import { useState } from "react";
import { Course, Level, StudentState } from "../types";
import { CourseCard } from "../components/CourseCard";

export function Courses({
  courses,
  student,
  updateStudent,
}: {
  courses: Course[];
  student: StudentState;
  updateStudent: (s: StudentState) => void;
}) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<Level | "all">("all");

  const filtered = courses.filter((c) => {
    const matchesLevel = level === "all" || c.level === level;
    const haystack = `${c.title} ${c.description}`.toLowerCase();
    return matchesLevel && haystack.includes(query.toLowerCase());
  });

  const enroll = (courseId: string) => {
    if (student.enrolledCourseIds.includes(courseId)) return;
    updateStudent({ ...student, enrolledCourseIds: [...student.enrolledCourseIds, courseId] });
  };

  return (
    <section className="page">
      <div className="toolbar">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Courses</h1>
        </div>
        <label className="search">
          <Search size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses" />
        </label>
      </div>
      <div className="segmented">
        {(["all", "beginner", "intermediate", "advanced"] as const).map((item) => (
          <button key={item} className={level === item ? "active" : ""} onClick={() => setLevel(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="course-grid">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} courses={courses} student={student} onEnroll={() => enroll(course.id)} />
        ))}
      </div>
    </section>
  );
}
