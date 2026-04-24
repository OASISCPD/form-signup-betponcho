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

type ProvinceNotSaltaModalProps = {
  message: string;
  onBackToStart: () => void;
};

export function ProvinceNotSaltaModal({
  message,
  onBackToStart,
}: ProvinceNotSaltaModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Registro no disponible"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1001,
        background: "rgba(6, 6, 10, 0.46)",
        paddingTop: "max(14px, calc(env(safe-area-inset-top) + 10px))",
        paddingRight: "max(12px, calc(env(safe-area-inset-right) + 8px))",
        paddingBottom: "max(20px, calc(env(safe-area-inset-bottom) + 16px))",
        paddingLeft: "max(12px, calc(env(safe-area-inset-left) + 8px))",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: "min(540px, 100%)",
          borderRadius: 18,
          border: "1px solid rgba(255, 117, 117, 0.34)",
          background:
            "linear-gradient(165deg, rgba(18, 24, 40, 0.95) 0%, rgba(12, 16, 30, 0.97) 100%)",
          boxShadow: "0 30px 50px -30px rgba(0,0,0,0.9)",
          padding: "22px 20px",
          display: "grid",
          gap: 12,
          justifyItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            border: "1px solid rgba(255, 160, 160, 0.45)",
            background: "rgba(152, 0, 0, 0.24)",
            color: "rgba(255, 218, 218, 0.98)",
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          !
        </div>
        <h3
          className="font-display"
          style={{ margin: 0, fontSize: "clamp(24px, 5vw, 30px)" }}
        >
          Registro no disponible
        </h3>
        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.88)",
            lineHeight: 1.5,
            maxWidth: 440,
          }}
        >
          {message.includes("PROVINCE_NOT_SALTA")
            ? "Solo se permiten registros con domicilio en la provincia de Salta."
            : message}
        </p>
        <div style={{ marginTop: 4 }}>
          <button
            type="button"
            onClick={onBackToStart}
            style={{
              ...secondaryButton,
              minWidth: 180,
              justifyContent: "center",
            }}
          >
            Volver a inicio
          </button>
        </div>
      </div>
    </div>
  );
}
