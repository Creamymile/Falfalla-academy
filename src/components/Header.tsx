import { KeyRound, LogIn, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { go, Route } from "../router";
import { initialState } from "../state";
import { StudentState } from "../types";
import { clearSession } from "../services/access";

export function Header({
  route,
  student,
  updateStudent,
}: {
  route: Route;
  student: StudentState;
  updateStudent: (s: StudentState) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const login = () => {
    if (route.name === "admin") {
      // Quick admin sign-in (dev convenience — will be removed in production)
      updateStudent({
        ...student,
        isAuthenticated: true,
        role: "admin",
        name: "Admin",
        email: "admin@falfalla-academy.com",
      });
    } else {
      go({ name: "login" });
    }
  };

  const logout = () => {
    if (student.email) clearSession(student.email);
    updateStudent(initialState);
    go({ name: "home" });
  };

  const nav = (r: Parameters<typeof go>[0]) => {
    go(r);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <button className="brand" onClick={() => nav({ name: "home" })}>
        <span className="brand-wordmark">Falfalla Academy</span>
        <small>Latte Art Mastery</small>
      </button>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className={menuOpen ? "open" : ""} aria-label="Main navigation">
        <button onClick={() => nav({ name: "courses" })} aria-current={route.name === "courses" ? "page" : undefined}>Courses</button>
        <button onClick={() => nav({ name: "gallery" })} aria-current={route.name === "gallery" ? "page" : undefined}>Gallery</button>
        <button onClick={() => nav({ name: "pricing" })} aria-current={route.name === "pricing" ? "page" : undefined}>Pricing</button>
        {student.isAuthenticated && (
          <button onClick={() => nav({ name: "dashboard" })} aria-current={route.name === "dashboard" ? "page" : undefined}>Dashboard</button>
        )}
        {student.isAuthenticated && (
          <button onClick={() => nav({ name: "upload" })} aria-current={route.name === "upload" ? "page" : undefined}>Upload</button>
        )}
        {student.isAuthenticated && (
          <button onClick={() => nav({ name: "redeem" })} aria-current={route.name === "redeem" ? "page" : undefined}><KeyRound size={15} /> Redeem</button>
        )}
        {student.isAuthenticated && (
          <button onClick={() => nav({ name: "profile" })} aria-current={route.name === "profile" ? "page" : undefined}>Profile</button>
        )}
        {student.isAuthenticated && student.role === "admin" && (
          <button onClick={() => nav({ name: "admin" })} aria-current={route.name === "admin" ? "page" : undefined}>Admin</button>
        )}
      </nav>
      {student.isAuthenticated ? (
        <button className="icon-button" onClick={logout} title="Log out">
          <LogOut size={18} />
        </button>
      ) : (
        <button className="primary small" onClick={login}>
          <LogIn size={17} /> {route.name === "admin" ? "Admin sign in" : "Sign in"}
        </button>
      )}
    </header>
  );
}
