import { panelBase, primaryButton, secondaryButton } from "../../app/constants";

const completeCheckIconStyle: React.CSSProperties = {
  width: 58,
  height: 58,
  margin: "0 auto 14px",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  background: "rgba(34, 207, 110, 0.24)",
  border: "1px solid rgba(180, 255, 213, 0.38)",
  fontSize: 26,
  fontWeight: 700,
};

export function NosisStep() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "30px 16px",
        ...panelBase,
      }}
    >
      <h2 className="font-display" style={{ marginTop: 0, fontSize: 34 }}>
        Consultando
      </h2>
      <p style={{ marginBottom: 12, color: "rgba(255,255,255,0.78)" }}>
        Validando identidad
      </p>
      <div
        style={{
          width: 52,
          height: 52,
          margin: "0 auto",
          borderRadius: "50%",
          border: "4px solid rgba(255,255,255,0.2)",
          borderTopColor: "#fff",
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  );
}

export function IneligibleStep({ onRestart }: { onRestart: () => void }) {
  return (
    <div
      style={{
        ...panelBase,
        border: "1px solid rgba(255,145,145,0.42)",
        background: "rgba(99, 15, 15, 0.54)",
        padding: 18,
        textAlign: "center",
      }}
    >
      <h2 className="font-display" style={{ marginTop: 0, fontSize: 32 }}>
        No elegible
      </h2>
      <p style={{ marginBottom: 18 }}>
        Los datos de la persona no cumplen para inscribirse en la plataforma.
      </p>
      <button type="button" onClick={onRestart} style={secondaryButton}>
        Volver a iniciar
      </button>
    </div>
  );
}

export function CreatingStep() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "30px 16px",
        ...panelBase,
      }}
    >
      <h2 className="font-display" style={{ marginTop: 0, fontSize: 34 }}>
        Creando tu cuenta
      </h2>
      <p style={{ marginBottom: 12, color: "rgba(255,255,255,0.82)" }}>
        Estamos validando la informacion final y activando tu perfil.
      </p>
      <div
        style={{
          width: 52,
          height: 52,
          margin: "0 auto",
          borderRadius: "50%",
          border: "4px solid rgba(255,255,255,0.2)",
          borderTopColor: "#fff",
          animation: "spin 1s linear infinite",
        }}
      />
      <p
        style={{
          marginTop: 14,
          marginBottom: 0,
          color: "rgba(255,255,255,0.66)",
          fontSize: 13,
        }}
      >
        Esto puede demorar unos segundos.
      </p>
    </div>
  );
}

export function CompleteStep() {
  return (
    <div
      style={{
        ...panelBase,
        border: "1px solid rgba(145,255,173,0.42)",
        background:
          "linear-gradient(165deg, rgba(19, 116, 56, 0.44) 0%, rgba(11, 62, 31, 0.46) 100%)",
        padding: 22,
        textAlign: "center",
      }}
    >
      <div style={completeCheckIconStyle}>{"\u2713"}</div>
      <h2 className="font-display" style={{ marginTop: 0, marginBottom: 8, fontSize: 36 }}>
        Registro completado
      </h2>
      <p
        style={{
          marginTop: 0,
          marginBottom: 4,
          color: "rgba(255,255,255,0.94)",
        }}
      >
        Tu cuenta de BetPoncho ya esta activa.
      </p>
      <p
        style={{
          marginTop: 0,
          marginBottom: 18,
          color: "rgba(255,255,255,0.72)",
          fontSize: 14,
        }}
      >
        Ya podes ingresar y comenzar a jugar.
      </p>
      <button
        type="button"
        onClick={() => {
          window.location.href = "https://betponcho.bet.ar/";
        }}
        className="primary-cta"
        style={{ ...primaryButton, width: "auto", minWidth: 220, justifySelf: "center" }}
      >
        Ir a BetPoncho
      </button>
    </div>
  );
}
