import {
  ERROR_TEXT,
  logoContainerBase,
  logoImageBase,
  NAVBAR_RED,
  primaryButton,
  TEXT_SECONDARY,
} from "../../app/constants";
import { LoadingButton } from "../LoadingButton";

type WelcomeStepProps = {
  isCreatingSession: boolean;
  registrationSessionError?: string;
  onStart: () => void;
};

export function WelcomeStep({
  isCreatingSession,
  registrationSessionError,
  onStart,
}: WelcomeStepProps) {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 30,
        }}
      >
        <div style={logoContainerBase}>
          <img src="/images/logo.png" alt="Logo BetPoncho" style={logoImageBase} />
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h1
          className="font-display"
          style={{
            margin: "0 0 12px",
            fontSize: "clamp(33px, 8vw, 44px)",
            lineHeight: 1.05,
            fontWeight: 600,
          }}
        >
          Bienvenido a BetPoncho
        </h1>
        <p
          style={{
            margin: 0,
            color: TEXT_SECONDARY,
            fontSize: 17,
            lineHeight: 1.5,
          }}
        >
          Registrate en pocos pasos para activar tu cuenta y empezar a jugar
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3
          style={{
            textAlign: "center",
            margin: "0 0 12px",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Necesitas
        </h3>
        <div style={{ display: "grid", gap: 10 }}>
          {[
            "Documento de identidad (DNI)",
            "Correo electronico válido",
            "Número de teléfono móvil",
          ].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 13px",
                borderRadius: 12,
                border: "1px solid rgba(152,0,0,0.35)",
                background: "rgba(89,0,0,0.22)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: NAVBAR_RED,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 14, fontWeight: 700 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3
          style={{
            textAlign: "center",
            margin: "0 0 12px",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Pasos
        </h3>
        <div style={{ display: "grid", gap: 9 }}>
          {[
            "Completar DNI y género",
            "Confirmar tus datos personales",
            "Completar tus datos y crear una contraseña",
          ].map((text, idx) => (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  color: "#ff6161",
                  fontWeight: 700,
                  minWidth: 28,
                  textAlign: "center",
                }}
              >{`0${idx + 1}`}</span>
              <span style={{ fontSize: 14, color: TEXT_SECONDARY }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <LoadingButton
        type="button"
        onClick={onStart}
        className="primary-cta"
        isLoading={isCreatingSession}
        loadingLabel="Iniciando sesion..."
        style={primaryButton}
      >
        Comenzar registro
      </LoadingButton>
      {registrationSessionError ? (
        <small
          style={{
            color: ERROR_TEXT,
            display: "block",
            marginTop: 10,
          }}
        >
          {registrationSessionError}
        </small>
      ) : null}
    </div>
  );
}
