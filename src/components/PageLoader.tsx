import { useEffect, useState } from "react";

/** Slim top progress bar + fade overlay for page transitions */
export function PageLoader({ loading }: { loading: boolean }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      setVisible(true);
      setProgress(30);
      const t1 = setTimeout(() => setProgress(60), 100);
      const t2 = setTimeout(() => setProgress(85), 300);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      setProgress(100);
      const t = setTimeout(() => { setVisible(false); setProgress(0); }, 300);
      return () => clearTimeout(t);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div className="page-loader" aria-hidden="true">
      <div className="page-loader-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}

/** Inline spinner for buttons and sections */
export function Spinner({ size = 20, label }: { size?: number; label?: string }) {
  return (
    <span className="spinner-inline" role="status">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity="0.25" />
        <path d="M12 2v4" className="spinner-arm" />
      </svg>
      {label && <span>{label}</span>}
    </span>
  );
}
