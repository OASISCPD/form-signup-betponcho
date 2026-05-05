import { FormEvent } from "react";
import { Email } from "@smastrom/react-email-autocomplete";
import PhoneInput from "react-phone-input-2";
import {
  emailAutocompleteClassNames,
  ERROR_TEXT,
  inputBase,
  primaryButton,
  selectBase,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "../../app/constants";
import type { IdentityForm } from "../../app/types";
import { LoadingButton } from "../LoadingButton";

type IdentityStepProps = {
  identity: IdentityForm;
  referralCode: string;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isBootstrapping: boolean;
  registrationSessionError?: string;
  onRetrySessionStart: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
  onIdentityChange: (value: IdentityForm) => void;
  onReferralCodeChange: (value: string) => void;
  onOpenLegal: (type: "privacy" | "terms") => void;
  onClearErrors: (...keys: string[]) => void;
};

export function IdentityStep({
  identity,
  referralCode,
  errors,
  isSubmitting,
  isBootstrapping,
  registrationSessionError,
  onRetrySessionStart,
  onSubmit,
  onIdentityChange,
  onReferralCodeChange,
  onOpenLegal,
  onClearErrors,
}: IdentityStepProps) {
  const hasCompletedRegistrationDniError =
    /Este DNI ya tiene un registro finalizado/i.test(errors.dni ?? "");
  const confirmEmailHasValue = identity.confirmEmail.trim().length > 0;
  const emailsMatch =
    confirmEmailHasValue && identity.confirmEmail.trim() === identity.email.trim();
  const emailMismatch =
    confirmEmailHasValue && identity.confirmEmail.trim() !== identity.email.trim();
  const formDisabled = isBootstrapping || isSubmitting;

  const preventClipboardAction = (
    event: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
  };

  const preventDropAction = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  return (
    <section className="identity-shell">
      <header className="identity-brand-header">
        <img
          src="/images/logo.png"
          alt="BetPoncho"
          className="identity-brand-logo"
        />
      </header>

      <div className="brand-hero-art">
        <img
          src="/images/hero steps.png"
          alt="Bienvenido a BetPoncho"
          className="brand-hero-image brand-hero-image-steps"
        />
      </div>

      <div className="identity-step-strip" aria-label="Progreso del registro">
        {[
          { number: "1", label: "Ingresar datos", active: true },
          { number: "2", label: "Confirmar" },
          { number: "3", label: "Crear cuenta" },
        ].map((item) => (
          <div
            key={item.number}
            className={`identity-step-chip ${item.active ? "identity-step-chip-active" : ""}`}
          >
            <span className="identity-step-chip-number">{item.number}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="identity-form-card">
        <div className="identity-form-head">
          <div className="identity-form-step">1</div>
          <div>
            <p className="identity-form-eyebrow">Paso 1</p>
            <h2 className="identity-form-title font-display">Datos personales</h2>
          </div>
        </div>

        {isBootstrapping ? (
          <div className="identity-session-banner">
            <strong>Estamos preparando tu registro.</strong>
            <span>En unos segundos vas a poder completar el formulario.</span>
          </div>
        ) : null}

        {registrationSessionError ? (
          <div className="identity-session-banner identity-session-banner-error">
            <strong>No pudimos iniciar la sesion.</strong>
            <span>{registrationSessionError}</span>
            <button
              type="button"
              onClick={onRetrySessionStart}
              className="identity-retry-button"
            >
              Reintentar
            </button>
          </div>
        ) : null}

        <fieldset
          disabled={formDisabled}
          style={{
            border: "none",
            padding: 0,
            margin: 0,
            minWidth: 0,
            opacity: formDisabled ? 0.72 : 1,
          }}
        >
          <div className="identity-form-grid">
            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ color: TEXT_PRIMARY }}>DNI</span>
              <input
                value={identity.dni}
                onChange={(e) => {
                  onIdentityChange({ ...identity, dni: e.target.value.replace(/\D/g, "") });
                  onClearErrors("dni", "identityApi");
                }}
                inputMode="numeric"
                maxLength={8}
                style={inputBase}
                placeholder="30123456"
              />
              {errors.dni ? (
                <small style={{ color: ERROR_TEXT }}>{errors.dni}</small>
              ) : (
                <small className="identity-field-hint">Ingresa los 7 o 8 digitos</small>
              )}
            </label>

            <label style={{ display: "grid", gap: 8 }}>
              <span style={{ color: TEXT_PRIMARY }}>Género</span>
              <select
                value={identity.genero}
                onChange={(e) =>
                  onIdentityChange({
                    ...identity,
                    genero: e.target.value as IdentityForm["genero"],
                  })
                }
                style={selectBase}
              >
                <option value="" style={{ color: "#fff", background: "#050505" }}>
                  Seleccionar
                </option>
                <option value="M" style={{ color: "#fff", background: "#050505" }}>
                  Masculino
                </option>
                <option value="F" style={{ color: "#fff", background: "#050505" }}>
                  Femenino
                </option>
                <option value="X" style={{ color: "#fff", background: "#050505" }}>
                  No binario
                </option>
              </select>
              {errors.genero ? (
                <small style={{ color: ERROR_TEXT }}>{errors.genero}</small>
              ) : null}
            </label>

            <label className="identity-form-span-2" style={{ display: "grid", gap: 8 }}>
              <span style={{ color: TEXT_PRIMARY }}>Email</span>
              <Email
                value={identity.email}
                onChange={(value: string) => {
                  onIdentityChange({ ...identity, email: value });
                  onClearErrors("email", "confirmEmail");
                }}
                baseList={[
                  "gmail.com",
                  "hotmail.com",
                  "outlook.com",
                  "yahoo.com",
                  "icloud.com",
                  "live.com",
                  "hotmail.com.ar",
                  "yahoo.com.ar",
                ]}
                placeholder="bet@poncho.com"
                classNames={{
                  ...emailAutocompleteClassNames,
                  input: `email-auto-input ${
                    errors.email
                      ? "email-auto-input-error"
                      : emailsMatch
                        ? "email-auto-input-valid"
                        : emailMismatch
                          ? "email-auto-input-warning"
                          : ""
                  }`,
                }}
                aria-label="Email"
                onCopy={preventClipboardAction}
                onCut={preventClipboardAction}
                onPaste={preventClipboardAction}
                onDrop={preventDropAction}
              />
              {errors.email ? <small style={{ color: ERROR_TEXT }}>{errors.email}</small> : null}
            </label>

            <label className="identity-form-span-2" style={{ display: "grid", gap: 8 }}>
              <span style={{ color: TEXT_PRIMARY }}>Confirmar email</span>
              <input
                value={identity.confirmEmail}
                onChange={(e) => {
                  onIdentityChange({ ...identity, confirmEmail: e.target.value });
                  onClearErrors("confirmEmail");
                }}
                type="email"
                onCopy={preventClipboardAction}
                onCut={preventClipboardAction}
                onPaste={preventClipboardAction}
                onDrop={preventDropAction}
                style={{
                  ...inputBase,
                  border: errors.confirmEmail
                    ? "1px solid rgba(255, 110, 110, 0.85)"
                    : emailsMatch
                      ? "1px solid rgba(35, 214, 120, 0.7)"
                      : emailMismatch
                        ? "1px solid rgba(255, 178, 96, 0.76)"
                        : inputBase.border,
                }}
                placeholder="bet@poncho.com"
              />
              {errors.confirmEmail ? (
                <small style={{ color: ERROR_TEXT }}>{errors.confirmEmail}</small>
              ) : emailMismatch ? (
                <small style={{ color: "#ffd08f" }}>Los emails no coinciden.</small>
              ) : emailsMatch ? (
                <small style={{ color: "#9ff3bf" }}>Los emails coinciden.</small>
              ) : null}
            </label>

            <label className="identity-form-span-2" style={{ display: "grid", gap: 8 }}>
              <span style={{ color: TEXT_PRIMARY }}>Teléfono</span>
              <PhoneInput
                country="ar"
                enableSearch
                countryCodeEditable={false}
                value={identity.telefono}
                onChange={(value: string) =>
                  onIdentityChange({
                    ...identity,
                    telefono: value.replace(/\D/g, "").slice(0, 15),
                  })
                }
                inputClass={`phone-input-field ${errors.telefono ? "phone-input-field-error" : ""}`}
                buttonClass={`phone-input-flag ${errors.telefono ? "phone-input-flag-error" : ""}`}
                containerClass="phone-input-container"
                dropdownClass="phone-input-dropdown"
                inputProps={{
                  name: "telefono",
                  required: false,
                  "aria-label": "Telefono",
                  autoComplete: "tel",
                }}
                placeholder=""
              />
              {errors.telefono ? (
                <small style={{ color: ERROR_TEXT }}>{errors.telefono}</small>
              ) : null}
            </label>

            <label className="identity-form-span-2 identity-legal-card">
              <input
                type="checkbox"
                checked={identity.acceptedLegal}
                onChange={(e) =>
                  onIdentityChange({ ...identity, acceptedLegal: e.target.checked })
                }
                style={{ marginTop: 3 }}
              />
              <span
                style={{
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: TEXT_SECONDARY,
                }}
              >
                Tengo mas de 18 años y he aceptado la{" "}
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onOpenLegal("privacy");
                  }}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#ff4b4b",
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                  }}
                >
                  Politica de Privacidad
                </button>{" "}
                y los{" "}
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onOpenLegal("terms");
                  }}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#ff4b4b",
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                  }}
                >
                  Términos y Condiciones Generales
                </button>
                .
              </span>
            </label>
            {errors.acceptedLegal ? (
              <small className="identity-form-span-2" style={{ color: ERROR_TEXT }}>
                {errors.acceptedLegal}
              </small>
            ) : null}

            <label className="identity-form-span-2" style={{ display: "grid", gap: 8 }}>
              <span style={{ color: TEXT_PRIMARY }}>Codigo promocional</span>
              <input
                value={referralCode}
                onChange={(e) => {
                  onReferralCodeChange(e.target.value);
                  onClearErrors("referralCode");
                }}
                type="text"
                style={inputBase}
                placeholder=""
              />
              {errors.referralCode ? (
                <small style={{ color: ERROR_TEXT }}>{errors.referralCode}</small>
              ) : null}
            </label>
          </div>

          <div className="identity-form-actions">
            <LoadingButton
              type="submit"
              className="primary-cta"
              style={primaryButton}
              isLoading={isSubmitting}
              disabled={hasCompletedRegistrationDniError || isBootstrapping}
              loadingLabel={isBootstrapping ? "Preparando..." : "Verificando..."}
            >
              Verificar
            </LoadingButton>
            {errors.identityApi ? (
              <small style={{ color: ERROR_TEXT }}>{errors.identityApi}</small>
            ) : null}
          </div>
        </fieldset>
      </form>

      <div className="identity-footer-wrap" aria-hidden="true">
        <img src="/images/footer.png" alt="" className="identity-footer-image" />
      </div>
    </section>
  );
}
