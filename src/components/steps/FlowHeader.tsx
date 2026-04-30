import { FaArrowLeftLong } from "react-icons/fa6";
import { panelBase, secondaryButton, TEXT_PRIMARY, TEXT_SECONDARY } from "../../app/constants";
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
  const currentStep = Math.max(1, Math.min(3, step));

  return (
    <>
      <button type="button" onClick={onBack} style={{ ...secondaryButton, marginBottom: 16 }}>
        <FaArrowLeftLong size={14} />
        Volver
      </button>

      <header style={{ textAlign: "center", marginBottom: 16 }}>
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
          Paso {currentStep} de 3
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginBottom: 20,
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
              ? "linear-gradient(160deg, rgba(124, 18, 18, 0.9) 0%, rgba(84, 8, 8, 0.95) 100%)"
              : active
                ? "linear-gradient(160deg, rgba(232, 66, 66, 0.98) 0%, rgba(152, 0, 0, 1) 100%)"
                : "rgba(255,255,255,0.14)",
            border: active
              ? "1px solid rgba(255, 198, 198, 0.72)"
              : done
                ? "1px solid rgba(255, 124, 124, 0.34)"
                : "1px solid rgba(255,255,255,0.18)",
            transform: active ? "translateY(-2px) scale(1.04)" : "translateY(0)",
            boxShadow: active
              ? "0 16px 28px -18px rgba(232,66,66,1)"
              : done
                ? "0 8px 18px -18px rgba(152,0,0,0.82)"
                : "none",
          };
          return (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={progressStepBadgeStyle}>{done ? "\u2713" : current}</div>
              <small
                style={{
                  display: "block",
                  marginTop: 8,
                  opacity: active ? 1 : done ? 0.86 : 0.74,
                  letterSpacing: "0.04em",
                  transition: "opacity 180ms ease, color 180ms ease",
                  color: active
                    ? "rgba(255,255,255,0.98)"
                    : done
                      ? "rgba(255,232,232,0.88)"
                      : "rgba(255,255,255,0.76)",
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
