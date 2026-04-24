import { FormEvent } from "react";
import { Email } from "@smastrom/react-email-autocomplete";
import PhoneInput from "react-phone-input-2";
import {
  emailAutocompleteClassNames,
  ERROR_TEXT,
  inputBase,
  panelBase,
  primaryButton,
  selectBase,
  TEXT_SECONDARY,
} from "../../app/constants";
import type { IdentityForm } from "../../app/types";

type IdentityStepProps = {
  identity: IdentityForm;
  referralCode: string;
  errors: Record<string, string>;
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
  onSubmit,
  onIdentityChange,
  onReferralCodeChange,
  onOpenLegal,
  onClearErrors,
}: IdentityStepProps) {
  const confirmEmailHasValue = identity.confirmEmail.trim().length > 0;
  const emailsMatch =
    confirmEmailHasValue && identity.confirmEmail.trim() === identity.email.trim();
  const emailMismatch =
    confirmEmailHasValue && identity.confirmEmail.trim() !== identity.email.trim();
  const preventClipboardAction = (
    event: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
  };
  const preventDropAction = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 14, ...panelBase }}>
      <label style={{ display: "grid", gap: 8 }}>
        <span>DNI</span>
        <input
          value={identity.dni}
          onChange={(e) =>
            onIdentityChange({ ...identity, dni: e.target.value.replace(/\D/g, "") })
          }
          inputMode="numeric"
          maxLength={8}
          style={inputBase}
          placeholder="Ej: 30123456"
        />
        {errors.dni ? <small style={{ color: ERROR_TEXT }}>{errors.dni}</small> : null}
      </label>

      <label style={{ display: "grid", gap: 8 }}>
        <span>Género</span>
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
          <option value="" style={{ color: "#111", background: "#fff" }}>
            Seleccionar
          </option>
          <option value="M" style={{ color: "#111", background: "#fff" }}>
            Masculino
          </option>
          <option value="F" style={{ color: "#111", background: "#fff" }}>
            Femenino
          </option>
          <option value="X" style={{ color: "#111", background: "#fff" }}>
            No binario
          </option>
        </select>
        {errors.genero ? (
          <small style={{ color: ERROR_TEXT }}>{errors.genero}</small>
        ) : null}
      </label>

      <label style={{ display: "grid", gap: 8 }}>
        <span>Email</span>
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
          placeholder="nombre@dominio.com"
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

      <label style={{ display: "grid", gap: 8 }}>
        <span>Confirmar email</span>
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
          placeholder="nombre@dominio.com"
        />
        {errors.confirmEmail ? (
          <small style={{ color: ERROR_TEXT }}>{errors.confirmEmail}</small>
        ) : emailMismatch ? (
          <small style={{ color: "#ffd08f" }}>Los emails no coinciden.</small>
        ) : emailsMatch ? (
          <small style={{ color: "#9ff3bf" }}>Los emails coinciden.</small>
        ) : null}
      </label>

      <label style={{ display: "grid", gap: 8 }}>
        <span>Teléfono</span>
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
          placeholder="Ej: 3871234567"
        />
        {errors.telefono ? (
          <small style={{ color: ERROR_TEXT }}>{errors.telefono}</small>
        ) : null}
      </label>

      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          border: "1px solid rgba(214, 84, 84, 0.34)",
          background: "rgba(88, 12, 24, 0.2)",
          borderRadius: 12,
          padding: "12px 13px",
        }}
      >
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
            lineHeight: 1.35,
            color: TEXT_SECONDARY,
          }}
        >
          Tengo más de 18 años y he aceptado la{" "}
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
            Política de Privacidad
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
        <small style={{ color: ERROR_TEXT }}>{errors.acceptedLegal}</small>
      ) : null}

      <label style={{ display: "grid", gap: 8, marginTop: 2 }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <span>Codigo Promocional</span>
        </span>
        <input
          value={referralCode}
          onChange={(e) => {
            onReferralCodeChange(e.target.value);
            onClearErrors("referralCode");
          }}
          type="text"
          style={inputBase}
          placeholder="Ej: BIENVENIDA2026"
        />
        {errors.referralCode ? (
          <small style={{ color: ERROR_TEXT }}>{errors.referralCode}</small>
        ) : null}
      </label>

      <button type="submit" className="primary-cta" style={primaryButton}>
        Verificar
      </button>
      {errors.identityApi ? (
        <small style={{ color: ERROR_TEXT }}>{errors.identityApi}</small>
      ) : null}
    </form>
  );
}
