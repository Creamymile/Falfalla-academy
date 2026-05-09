import { Coffee, ExternalLink, Globe, Mail } from "lucide-react";
import { go } from "../router";

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
            <a href="#" aria-label="Website"><Globe size={18} /></a>
            <a href="#" aria-label="Resources"><ExternalLink size={18} /></a>
            <a href="#" aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>
        <div>
          <h4>Learn</h4>
          <button onClick={() => go({ name: "courses" })}>All courses</button>
          <button onClick={() => go({ name: "pricing" })}>Pricing</button>
          <button onClick={() => go({ name: "gallery" })}>Community gallery</button>
        </div>
        <div>
          <h4>Resources</h4>
          <button onClick={() => go({ name: "home" })}>FAQ</button>
          <button onClick={() => go({ name: "terms" })}>Terms of service</button>
          <button onClick={() => go({ name: "privacy" })}>Privacy policy</button>
        </div>
        <div>
          <h4>Platform</h4>
          <button onClick={() => go({ name: "dashboard" })}>Student dashboard</button>
          <button onClick={() => go({ name: "profile" })}>My profile</button>
          <button onClick={() => go({ name: "upload" })}>Upload practice</button>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 Falfalla Academy. Built for barista education.</span>
      </div>
    </footer>
  );
}
