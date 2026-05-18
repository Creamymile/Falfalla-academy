import { Coffee, Globe, Mail } from "lucide-react";
import { go, pathFor } from "../router";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <Coffee size={20} />
            <strong>Falfalla Academy</strong>
          </div>
          <p>Premium barista and latte art education. SCA-aligned training for aspiring and working baristas.</p>
          <div className="footer-social">
            <a href="https://falfalla-academy.com" aria-label="Website" rel="noopener noreferrer"><Globe size={18} /></a>
            <a href="mailto:support@falfalla-academy.com" aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>
        <div>
          <h4>Learn</h4>
          <a href={pathFor({ name: "courses" })} onClick={(e) => { e.preventDefault(); go({ name: "courses" }); }}>All courses</a>
          <a href={pathFor({ name: "pricing" })} onClick={(e) => { e.preventDefault(); go({ name: "pricing" }); }}>Pricing</a>
          <a href={pathFor({ name: "gallery" })} onClick={(e) => { e.preventDefault(); go({ name: "gallery" }); }}>Community gallery</a>
        </div>
        <div>
          <h4>Resources</h4>
          <a href={pathFor({ name: "home" })} onClick={(e) => { e.preventDefault(); go({ name: "home" }); }}>FAQ</a>
          <a href={pathFor({ name: "terms" })} onClick={(e) => { e.preventDefault(); go({ name: "terms" }); }}>Terms of service</a>
          <a href={pathFor({ name: "privacy" })} onClick={(e) => { e.preventDefault(); go({ name: "privacy" }); }}>Privacy policy</a>
        </div>
        <div>
          <h4>Platform</h4>
          <a href={pathFor({ name: "dashboard" })} onClick={(e) => { e.preventDefault(); go({ name: "dashboard" }); }}>Student dashboard</a>
          <a href={pathFor({ name: "profile" })} onClick={(e) => { e.preventDefault(); go({ name: "profile" }); }}>My profile</a>
          <a href={pathFor({ name: "upload" })} onClick={(e) => { e.preventDefault(); go({ name: "upload" }); }}>Upload practice</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 Falfalla Academy. Built for barista education.</span>
      </div>
    </footer>
  );
}
