const secondaryButton: React.CSSProperties = {
  border: "1px solid rgba(255, 22, 10, 0.75)",
  borderRadius: 999,
  background: "#c50000",
  color: "rgba(255,255,255,0.97)",
  fontWeight: 700,
  padding: "11px 18px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 20,
  background: "rgba(0, 0, 0, 0.78)",
  paddingTop: "max(14px, calc(env(safe-area-inset-top) + 10px))",
  paddingRight: "max(12px, calc(env(safe-area-inset-right) + 8px))",
  paddingBottom: "max(20px, calc(env(safe-area-inset-bottom) + 16px))",
  paddingLeft: "max(12px, calc(env(safe-area-inset-left) + 8px))",
  display: "grid",
  placeItems: "center",
};

const cardStyle: React.CSSProperties = {
  width: "min(880px, 100%)",
  maxHeight: "88dvh",
  borderRadius: 26,
  border: "1px solid rgba(255, 22, 10, 0.9)",
  background: "#000",
  boxShadow: "0 30px 50px -30px rgba(0,0,0,0.9)",
  overflow: "hidden",
  display: "grid",
  gridTemplateRows: "auto 1fr auto",
};

type LegalModalProps = {
  title: string;
  content: string;
  onClose: () => void;
};

export function LegalModal({ title, content, onClose }: LegalModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={overlayStyle}
    >
      <div style={cardStyle}>
        <div style={{ padding: "20px 20px 0" }}>
          <h3
            className="font-display"
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "clamp(26px, 6vw, 34px)",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {title}
          </h3>
        </div>
        <div
          style={{
            padding: "16px 20px 10px",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.86)",
            fontSize: 14,
          }}
        >
          {content}
        </div>
        <div style={{ padding: 20 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              ...secondaryButton,
              minWidth: 120,
              justifyContent: "center",
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
