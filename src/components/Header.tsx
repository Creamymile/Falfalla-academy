import { KeyRound, LogIn, LogOut, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useEffect, useState } from "react";
import { go, pathFor, Route } from "../router";
import { initialState } from "../state";
import { StudentState } from "../types";
import { clearSession } from "../services/access";
import { signOut as supabaseSignOut } from "../services/auth";

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
  const { t } = useTranslation();

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [route]);

  const login = () => {
    go({ name: "login" });
    setMenuOpen(false);
  };

  const logout = async () => {
    if (student.email) clearSession(student.email);
    await supabaseSignOut();
    updateStudent(initialState);
    go({ name: "home" });
  };

  const nav = (r: Parameters<typeof go>[0]) => {
    go(r);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <a className="brand" href={pathFor({ name: "home" })} onClick={(e) => { e.preventDefault(); nav({ name: "home" }); }}>
        <span className="brand-wordmark">Falfalla Academy</span>
        <small>Latte Art Mastery</small>
      </a>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className={menuOpen ? "open" : ""} aria-label="Main navigation">
        <a href={pathFor({ name: "courses" })} onClick={(e) => { e.preventDefault(); nav({ name: "courses" }); }} aria-current={route.name === "courses" ? "page" : undefined}>{t("nav.courses")}</a>
        <a href={pathFor({ name: "gallery" })} onClick={(e) => { e.preventDefault(); nav({ name: "gallery" }); }} aria-current={route.name === "gallery" ? "page" : undefined}>{t("nav.gallery")}</a>
        <a href={pathFor({ name: "pricing" })} onClick={(e) => { e.preventDefault(); nav({ name: "pricing" }); }} aria-current={route.name === "pricing" ? "page" : undefined}>{t("nav.pricing")}</a>
        {student.isAuthenticated && (
          <a href={pathFor({ name: "dashboard" })} onClick={(e) => { e.preventDefault(); nav({ name: "dashboard" }); }} aria-current={route.name === "dashboard" ? "page" : undefined}>{t("nav.dashboard")}</a>
        )}
        {student.isAuthenticated && (
          <a href={pathFor({ name: "upload" })} onClick={(e) => { e.preventDefault(); nav({ name: "upload" }); }} aria-current={route.name === "upload" ? "page" : undefined}>{t("nav.upload")}</a>
        )}
        {student.isAuthenticated && (
          <a href={pathFor({ name: "redeem" })} onClick={(e) => { e.preventDefault(); nav({ name: "redeem" }); }} aria-current={route.name === "redeem" ? "page" : undefined}><KeyRound size={15} /> {t("nav.redeem")}</a>
        )}
        {student.isAuthenticated && (
          <a href={pathFor({ name: "profile" })} onClick={(e) => { e.preventDefault(); nav({ name: "profile" }); }} aria-current={route.name === "profile" ? "page" : undefined}>{t("nav.profile")}</a>
        )}
        {student.isAuthenticated && student.role === "admin" && (
          <a href={pathFor({ name: "admin" })} onClick={(e) => { e.preventDefault(); nav({ name: "admin" }); }} aria-current={route.name === "admin" ? "page" : undefined}>{t("nav.admin")}</a>
        )}
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <LanguageSwitcher />
        {student.isAuthenticated ? (
          <button className="icon-button" onClick={logout} title={t("nav.logOut")}>
            <LogOut size={18} />
          </button>
        ) : (
          <button className="primary small" onClick={login}>
            <LogIn size={17} /> {t("nav.signIn")}
          </button>
        )}
      </div>
    </header>
  );
}
