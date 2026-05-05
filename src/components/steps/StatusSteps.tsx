import { primaryButton, secondaryButton } from "../../app/constants";
import { LoadingButton } from "../LoadingButton";

const successButtonStyle: React.CSSProperties = {
  ...primaryButton,
  width: "auto",
  minWidth: 220,
  justifySelf: "center",
};

function BrandedProgress({
  step,
  onBack,
}: {
  step: 1 | 2 | 3;
  onBack?: () => void;
}) {
  return (
    <nav className="prefill-flow-nav" aria-label="Progreso del registro">
      {onBack ? (
        <button type="button" onClick={onBack} className="prefill-back-button">
          &lt; Volver
        </button>
      ) : (
        <span />
      )}
      {[
        { number: step > 1 ? "✓" : "1", label: "Ingresar datos", done: step > 1 },
        { number: step > 2 ? "✓" : "2", label: "Confirmar", done: step > 2 },
        { number: "3", label: "Crear cuenta" },
      ].map((item, index) => {
        const current = index + 1;
        return (
          <div
            key={item.label}
            className={`identity-step-chip ${
              current === step ? "identity-step-chip-active" : ""
            } ${item.done ? "identity-step-chip-done" : ""}`}
          >
            <span className="identity-step-chip-number">{item.number}</span>
            <span>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function BrandedStatusPage({
  children,
  step,
  onBack,
}: {
  children: React.ReactNode;
  step: 1 | 2 | 3;
  onBack?: () => void;
}) {
  return (
    <div className="status-page identity-shell">
      <header className="identity-brand-header">
        <img
          src="/images/logo.png"
          alt="BetPoncho"
          className="identity-brand-logo"
        />
      </header>
      <div className="brand-hero-art">
        <img
          src="/images/hero.png"
          alt="Bienvenido a BetPoncho"
          className="brand-hero-image brand-hero-image-standard"
        />
      </div>
      <BrandedProgress step={step} onBack={onBack} />
      {children}
      <div className="identity-footer-wrap" aria-hidden="true">
        <img src="/images/footer.png" alt="" className="identity-footer-image" />
      </div>
    </div>
  );
}

export function NosisStep({ onBack }: { onBack?: () => void }) {
  return (
    <BrandedStatusPage step={1} onBack={onBack}>
      <div className="brand-status-card">
        <div className="brand-status-loader" aria-hidden="true" />
        <h2 className="font-display">Consultando</h2>
        <p>Validando identidad</p>
      </div>
    </BrandedStatusPage>
  );
}

export function IneligibleStep({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="brand-status-card brand-status-card-warning">
      <div className="brand-status-icon" aria-hidden="true">
        !
      </div>
      <h2 className="font-display">No elegible</h2>
      <p>Los datos de la persona no cumplen para inscribirse en la plataforma.</p>
      <button type="button" onClick={onRestart} style={secondaryButton}>
        Volver a iniciar
      </button>
    </div>
  );
}

export function CreatingStep() {
  return (
    <div className="brand-status-card">
      <div className="brand-status-loader" aria-hidden="true" />
      <h2 className="font-display">Creando tu cuenta</h2>
      <p>Estamos validando la informacion final y activando tu perfil.</p>
      <small>Esto puede demorar unos segundos.</small>
    </div>
  );
}

export function CompleteStep() {
  return (
    <div className="brand-status-card brand-status-card-success">
      <div className="brand-status-icon brand-status-icon-success" aria-hidden="true">
        {"\u2713"}
      </div>
      <h2 className="font-display">Registro completado</h2>
      <p>Tu cuenta de BetPoncho ya esta activa.</p>
      <small>Ya podes ingresar y comenzar a jugar.</small>
      <LoadingButton
        type="button"
        onClick={() => {
          window.location.href = "https://betponcho.bet.ar/";
        }}
        className="primary-cta"
        style={successButtonStyle}
      >
        Ir a BetPoncho
      </LoadingButton>
    </div>
  );
}
