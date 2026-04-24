const secondaryButton: React.CSSProperties = {
  border: "1px solid rgba(226, 90, 90, 0.4)",
  borderRadius: 12,
  background: "rgba(90, 14, 26, 0.44)",
  color: "rgba(255,255,255,0.97)",
  fontWeight: 700,
  padding: "9px 12px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
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
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(6, 6, 10, 0.72)",
        paddingTop: "max(14px, calc(env(safe-area-inset-top) + 10px))",
        paddingRight: "max(12px, calc(env(safe-area-inset-right) + 8px))",
        paddingBottom: "max(20px, calc(env(safe-area-inset-bottom) + 16px))",
        paddingLeft: "max(12px, calc(env(safe-area-inset-left) + 8px))",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(880px, 100%)",
          maxHeight: "88dvh",
          borderRadius: 18,
          border: "1px solid rgba(255, 117, 117, 0.34)",
          background:
            "linear-gradient(165deg, rgba(13, 17, 30, 0.98) 0%, rgba(10, 12, 22, 0.99) 100%)",
          boxShadow: "0 30px 50px -30px rgba(0,0,0,0.9)",
          overflow: "hidden",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <div style={{ padding: "16px 16px 0" }}>
          <h3
            className="font-display"
            style={{ margin: 0, fontSize: "clamp(24px, 5vw, 30px)" }}
          >
            {title}
          </h3>
        </div>
        <div
          style={{
            padding: "14px 16px 8px",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.9)",
            fontSize: 14,
          }}
        >
          {content}
        </div>
        <div style={{ padding: 16 }}>
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
