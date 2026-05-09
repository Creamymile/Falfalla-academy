import { Trophy } from "lucide-react";

interface CelebrationProps {
  show: boolean;
  courseName: string;
  onClose: () => void;
}

export function Celebration({ show, courseName, onClose }: CelebrationProps) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(26,14,8,0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "3rem",
          textAlign: "center",
          maxWidth: "480px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎉🎉🎉</div>
        <Trophy size={56} style={{ color: "#d4a017", marginBottom: "1rem" }} />
        <h2 style={{ marginBottom: "0.5rem" }}>Congratulations!</h2>
        <p style={{ color: "#6b5e50", marginBottom: "1.5rem" }}>
          You have completed <strong>{courseName}</strong>. Well done on finishing the
          course — your barista skills are leveling up!
        </p>
        <div style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>🎉🎉🎉</div>
        <button className="primary" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
}
