import { FormEvent, useState } from "react";
import { ERROR_TEXT, inputBase, primaryButton } from "../../app/constants";
import type { ContactForm } from "../../app/types";
import {
  isPasswordValid,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../../app/formRules";
import { LoadingButton } from "../LoadingButton";

type ContactStepProps = {
  contact: ContactForm;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onBack: () => void;
};

function EyeIcon({ crossed }: { crossed: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
      {crossed ? <path d="M3 3l18 18" /> : null}
    </svg>
  );
}

export function ContactStep({
  contact,
  errors,
  isSubmitting,
  onSubmit,
  onPasswordChange,
  onConfirmPasswordChange,
  onBack,
}: ContactStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordConditionsOk = isPasswordValid(contact.password);
  const confirmPasswordHasValue = contact.confirmPassword.length > 0;
  const confirmPasswordMatches =
    confirmPasswordHasValue && contact.confirmPassword === contact.password;
  const confirmPasswordMismatch =
    confirmPasswordHasValue && contact.confirmPassword !== contact.password;
  const preventClipboardAction = (
    event: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
  };
  const preventDropAction = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  const iconButtonStyle: React.CSSProperties = {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    width: 28,
    height: 28,
    display: "grid",
    placeItems: "center",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.88)",
    cursor: "pointer",
    padding: 0,
  };

  return (
    <div className="contact-page identity-shell">
      <header className="identity-brand-header">
        <img
          src="/images/logo.png"
          alt="BetPoncho"
          className="identity-brand-logo"
        />
      </header>

      <div className="brand-hero-art contact-hero">
        <img
          src="/images/hero.png"
          alt="Bienvenido a BetPoncho"
          className="brand-hero-image brand-hero-image-standard"
        />
      </div>

      <nav className="prefill-flow-nav" aria-label="Progreso del registro">
        <button type="button" onClick={onBack} className="prefill-back-button">
          &lt; Volver
        </button>
        {[
          { number: "✓", label: "Ingresar datos", done: true },
          { number: "✓", label: "Confirmar", done: true },
          { number: "3", label: "Crear cuenta", active: true },
        ].map((item) => (
          <div
            key={item.label}
            className={`identity-step-chip ${
              item.active ? "identity-step-chip-active" : ""
            } ${item.done ? "identity-step-chip-done" : ""}`}
          >
            <span className="identity-step-chip-number">{item.number}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <form onSubmit={onSubmit} className="contact-card">
        <div className="prefill-card-head">
          <div className="prefill-step-badge">3</div>
          <h2 className="font-display">Crear cuenta</h2>
        </div>

        <label className="contact-field">
          <span>Contrasena</span>
          <div style={{ position: "relative" }}>
            <input
              value={contact.password}
              onChange={(event) => onPasswordChange(event.target.value)}
              type={showPassword ? "text" : "password"}
              minLength={PASSWORD_MIN_LENGTH}
              maxLength={PASSWORD_MAX_LENGTH}
              style={{
                ...inputBase,
                paddingRight: 46,
                border: errors.password
                  ? "1px solid rgba(255, 110, 110, 0.85)"
                  : passwordConditionsOk
                    ? "1px solid rgba(35, 214, 120, 0.7)"
                    : inputBase.border,
              }}
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={iconButtonStyle}
              aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
            >
              <EyeIcon crossed={showPassword} />
            </button>
          </div>
          {errors.password ? (
            <small style={{ color: ERROR_TEXT }}>{errors.password}</small>
          ) : null}
        </label>

        {contact.password.length > 0 ? (
          <div className="contact-password-rules">
            <strong>Tu contrasena debe incluir:</strong>
            {[
              {
                ok: contact.password.length > 0,
                text: "Este campo es obligatorio",
              },
              {
                ok: /\d/.test(contact.password),
                text: "Al menos un digito",
              },
              {
                ok: !/\s/.test(contact.password),
                text: "Sin espacios",
              },
              {
                ok: /^[\x00-\x7F]*$/.test(contact.password),
                text: "Solo caracteres en ingles",
              },
              {
                ok: contact.password.length >= PASSWORD_MIN_LENGTH,
                text: `Longitud minima ${PASSWORD_MIN_LENGTH}`,
              },
              {
                ok: contact.password.length <= PASSWORD_MAX_LENGTH,
                text: `Longitud maxima ${PASSWORD_MAX_LENGTH}`,
              },
              {
                ok: /[A-Z]/.test(contact.password) && /[a-z]/.test(contact.password),
                text: "Mayusculas y minusculas",
              },
            ].map((rule) => (
              <div
                key={rule.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  color: rule.ok ? "#d8ffe6" : "rgba(255,255,255,0.8)",
                }}
              >
                <span
                  style={{
                    color: rule.ok ? "#1dd05d" : "rgba(255,255,255,0.45)",
                    fontWeight: 700,
                  }}
                >
                  {rule.ok ? "✓" : "•"}
                </span>
                <span>{rule.text}</span>
              </div>
            ))}
          </div>
        ) : null}

        <label className="contact-field">
          <span>Confirmar contrasena</span>
          <div style={{ position: "relative" }}>
            <input
              value={contact.confirmPassword}
              onChange={(event) => onConfirmPasswordChange(event.target.value)}
              type={showConfirmPassword ? "text" : "password"}
              minLength={PASSWORD_MIN_LENGTH}
              maxLength={PASSWORD_MAX_LENGTH}
              onCopy={preventClipboardAction}
              onCut={preventClipboardAction}
              onPaste={preventClipboardAction}
              onDrop={preventDropAction}
              style={{
                ...inputBase,
                paddingRight: 46,
                border: errors.confirmPassword
                  ? "1px solid rgba(255, 110, 110, 0.85)"
                  : confirmPasswordMatches
                    ? "1px solid rgba(35, 214, 120, 0.7)"
                    : confirmPasswordMismatch
                      ? "1px solid rgba(255, 178, 96, 0.76)"
                      : inputBase.border,
              }}
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              style={iconButtonStyle}
              aria-label={
                showConfirmPassword
                  ? "Ocultar confirmacion de contrasena"
                  : "Mostrar confirmacion de contrasena"
              }
            >
              <EyeIcon crossed={showConfirmPassword} />
            </button>
          </div>
          {errors.confirmPassword ? (
            <small style={{ color: ERROR_TEXT }}>{errors.confirmPassword}</small>
          ) : confirmPasswordMismatch ? (
            <small style={{ color: "#ffd08f" }}>Las contrasenas no coinciden.</small>
          ) : confirmPasswordMatches ? (
            <small style={{ color: "#9ff3bf" }}>Las contrasenas coinciden.</small>
          ) : null}
        </label>

        <LoadingButton
          type="submit"
          className="primary-cta contact-submit"
          style={primaryButton}
          isLoading={isSubmitting}
          loadingLabel="Creando cuenta..."
        >
          Completar registro
        </LoadingButton>
        {errors.accountApi ? (
          <small style={{ color: ERROR_TEXT }}>{errors.accountApi}</small>
        ) : null}
      </form>

      <div className="identity-footer-wrap" aria-hidden="true">
        <img src="/images/footer.png" alt="" className="identity-footer-image" />
      </div>
    </div>
  );
}
