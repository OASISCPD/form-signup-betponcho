import { FaArrowLeftLong } from "react-icons/fa6";
import { NAVBAR_RED, panelBase, secondaryButton, TEXT_PRIMARY, TEXT_SECONDARY } from "../../app/constants";
import type { Stage } from "../../app/types";

const progressStepBadgeBaseStyle: React.CSSProperties = {
  margin: "0 auto",
  width: "clamp(36px, 9vw, 44px)",
  height: "clamp(36px, 9vw, 44px)",
  borderRadius: 14,
  display: "grid",
  placeItems: "center",
  fontWeight: 700,
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.18)",
  transition: "background-color 220ms ease, transform 180ms ease, box-shadow 220ms ease",
};

type FlowHeaderProps = {
  stage: Stage;
  step: number;
  onBack: () => void;
};

export function FlowHeader({ stage, step, onBack }: FlowHeaderProps) {
  return (
    <>
      <button type="button" onClick={onBack} style={{ ...secondaryButton, marginBottom: 14 }}>
        <FaArrowLeftLong size={14} />
        Volver
      </button>

      <header style={{ textAlign: "center", marginBottom: 24 }}>
        <h1
          className="font-display"
          style={{
            margin: "0 0 8px",
            fontSize: "clamp(30px, 7.5vw, 36px)",
            lineHeight: 1.1,
            fontWeight: 600,
            color: TEXT_PRIMARY,
          }}
        >
          Registro BetPoncho
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            color: TEXT_SECONDARY,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Paso {step} de 3
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginBottom: 24,
          ...panelBase,
        }}
      >
        {["Datos", "Confirmar", "Cuenta"].map((label, index) => {
          const current = index + 1;
          const active = stage !== "complete" && step === current;
          const done = step > current || (stage === "complete" && current === 3);
          const progressStepBadgeStyle: React.CSSProperties = {
            ...progressStepBadgeBaseStyle,
            background: done
              ? "#14a44d"
              : active
                ? NAVBAR_RED
                : "rgba(255,255,255,0.14)",
            transform: active ? "translateY(-1px)" : "translateY(0)",
            boxShadow: active ? "0 10px 20px -16px rgba(232,66,66,0.95)" : "none",
          };
          return (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={progressStepBadgeStyle}>{done ? "\u2713" : current}</div>
              <small
                style={{
                  display: "block",
                  marginTop: 8,
                  opacity: active ? 1 : 0.8,
                  letterSpacing: "0.04em",
                  transition: "opacity 180ms ease, color 180ms ease",
                  color: active ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.8)",
                }}
              >
                {label}
              </small>
            </div>
          );
        })}
      </div>
    </>
  );
}
