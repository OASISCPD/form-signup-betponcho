import { FormEvent } from "react";
import { ERROR_TEXT, inputBase, panelBase, primaryButton } from "../../app/constants";
import type { ContactForm } from "../../app/types";
import { isPasswordValid } from "../../app/formRules";

type ContactStepProps = {
  contact: ContactForm;
  errors: Record<string, string>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
};

export function ContactStep({
  contact,
  errors,
  onSubmit,
  onPasswordChange,
  onConfirmPasswordChange,
}: ContactStepProps) {
  const passwordConditionsOk = isPasswordValid(contact.password);
  const confirmPasswordHasValue = contact.confirmPassword.length > 0;
  const confirmPasswordMatches =
    confirmPasswordHasValue && contact.confirmPassword === contact.password;
  const confirmPasswordMismatch =
    confirmPasswordHasValue && contact.confirmPassword !== contact.password;

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 14, ...panelBase }}>
      <label style={{ display: "grid", gap: 8 }}>
        <span>Contraseña</span>
        <input
          value={contact.password}
          onChange={(e) => onPasswordChange(e.target.value)}
          type="password"
          style={{
            ...inputBase,
            border: errors.password
              ? "1px solid rgba(255, 110, 110, 0.85)"
              : passwordConditionsOk
                ? "1px solid rgba(35, 214, 120, 0.7)"
                : inputBase.border,
          }}
          placeholder="********"
        />
        {errors.password ? <small style={{ color: ERROR_TEXT }}>{errors.password}</small> : null}
      </label>

      {contact.password.length > 0 && (
        <div
          style={{
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.16)",
            background: "rgba(255,255,255,0.05)",
            padding: "12px 13px",
            display: "grid",
            gap: 8,
          }}
        >
          <strong style={{ fontSize: 14 }}>Tu contraseña debe incluir:</strong>
          {[
            {
              ok: contact.password.length > 0,
              text: "Este campo es obligatorio",
            },
            {
              ok: /\d/.test(contact.password),
              text: "Al menos un dígito",
            },
            {
              ok: !/\s/.test(contact.password),
              text: "Sin espacios",
            },
            {
              ok: /^[\x00-\x7F]*$/.test(contact.password),
              text: "Solo caracteres en inglés",
            },
            {
              ok: contact.password.length >= 6,
              text: "Longitud mínima 6",
            },
            {
              ok: contact.password.length <= 50,
              text: "Longitud máxima 50",
            },
            {
              ok: /[A-Z]/.test(contact.password) && /[a-z]/.test(contact.password),
              text: "Mayúsculas y minúsculas",
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
      )}

      <label style={{ display: "grid", gap: 8 }}>
        <span>Confirmar contraseña</span>
        <input
          value={contact.confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          type="password"
          style={{
            ...inputBase,
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
        {errors.confirmPassword ? (
          <small style={{ color: ERROR_TEXT }}>{errors.confirmPassword}</small>
        ) : confirmPasswordMismatch ? (
          <small style={{ color: "#ffd08f" }}>Las contraseñas no coinciden.</small>
        ) : confirmPasswordMatches ? (
          <small style={{ color: "#9ff3bf" }}>Las contraseñas coinciden.</small>
        ) : null}
      </label>

      <button type="submit" className="primary-cta" style={primaryButton}>
        Completar registro
      </button>
      {errors.accountApi ? <small style={{ color: ERROR_TEXT }}>{errors.accountApi}</small> : null}
    </form>
  );
}
