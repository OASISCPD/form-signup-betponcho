import type { CSSProperties } from "react";

export const HEADER_RED = "#590000";
export const NAVBAR_RED = "#980000";
export const CTA_GRADIENT = `linear-gradient(160deg, #c82222 0%, ${NAVBAR_RED} 58%, ${HEADER_RED} 100%)`;
export const APP_SURFACE =
  "linear-gradient(165deg, rgba(15, 21, 40, 0.94) 0%, rgba(8, 12, 24, 0.96) 58%, rgba(5, 8, 18, 0.98) 100%)";
export const PANEL_SURFACE =
  "linear-gradient(165deg, rgba(34, 17, 30, 0.76) 0%, rgba(20, 28, 48, 0.8) 100%)";
export const PANEL_BORDER = "1px solid rgba(210, 62, 62, 0.42)";
export const TEXT_PRIMARY = "rgba(255,255,255,0.97)";
export const TEXT_SECONDARY = "rgba(255,255,255,0.84)";
export const ERROR_TEXT = "#ffb4b4";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3028"
).replace(/\/+$/, "");

export const inputBase: CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid rgba(224, 86, 86, 0.55)",
  background: "rgba(255,255,255,0.09)",
  color: TEXT_PRIMARY,
  fontSize: 16,
  padding: "13px 14px",
  outline: "none",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.1), 0 6px 14px -10px rgba(0,0,0,0.65)",
  transition:
    "border-color 160ms ease, box-shadow 160ms ease, color 160ms ease",
};

export const selectBase: CSSProperties = {
  ...inputBase,
  colorScheme: "dark",
};

export const panelBase: CSSProperties = {
  borderRadius: 18,
  border: PANEL_BORDER,
  background: PANEL_SURFACE,
  padding: 16,
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 26px -22px rgba(0,0,0,0.85)",
};

export const primaryButton: CSSProperties = {
  width: "100%",
  minHeight: 52,
  borderRadius: 14,
  background: CTA_GRADIENT,
  color: "#fff",
  fontWeight: 700,
  padding: "14px 16px",
  border: "1px solid rgba(255, 164, 164, 0.35)",
  boxShadow:
    "0 14px 24px -14px rgba(152,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.2)",
  transition: "transform 140ms ease, filter 140ms ease, box-shadow 160ms ease",
};

export const secondaryButton: CSSProperties = {
  border: "1px solid rgba(226, 90, 90, 0.4)",
  borderRadius: 12,
  background: "rgba(90, 14, 26, 0.44)",
  color: TEXT_PRIMARY,
  fontWeight: 700,
  padding: "9px 12px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

export const logoContainerBase: CSSProperties = {
  padding: "clamp(8px, 2.2vw, 11px)",
  borderRadius: "clamp(14px, 3.2vw, 18px)",
  background: "#980000",
  border: "1px solid rgba(255, 169, 169, 0.55)",
  boxShadow:
    "0 12px 24px -14px rgba(70,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.18)",
};

export const logoImageBase: CSSProperties = {
  width: "clamp(108px, 27vw, 148px)",
  height: "auto",
  maxWidth: "100%",
  borderRadius: "clamp(10px, 2.6vw, 14px)",
  objectFit: "contain",
  display: "block",
};

export const emailAutocompleteClassNames = {
  wrapper: "email-auto-wrapper",
  input: "email-auto-input",
  dropdown: "email-auto-dropdown",
  suggestion: "email-auto-suggestion",
  username: "email-auto-username",
  domain: "email-auto-domain",
} as const;

export const PRIVACY_POLICY_TEXT = `Your privacy is important to us, and we are committed to protecting your personal information. We will be clear and open about why we collect your personal information and how we use it. Where you have choices or rights, we will explain these to you. This Privacy Policy explains how Betponcho uses your personal information when you're using one of our website.

Personally identifiable information

You provide this information to us in the process of setting up an account, placing bets and using the services of the website. This information is required to give you access to certain parts of our website and related services.

The information includes your: Username, First and surname, Date of birth, Email address, Residential address, Phone number, Billing address, Identification documents, Proof of address documents, Transaction history, Website usage preferences and payment information.

How and why we use your personal information

We use your personal information to provide requested services, meet legal and regulatory obligations, monitor website performance, and provide marketing information where you consent.

Your rights

You may request rectification, copy of your personal data, and erasure in applicable cases. We may ask for proof of identity to protect your information.

Sharing your personal information

We may disclose your personal data where legally required, to enforce our agreements, to support service operations, to prevent fraud, and to protect rights, property, and safety.

Security and retention

We protect data using modern security practices and retain personal information only as long as reasonably required for legal or business purposes.

Third-party practices and analytics

Our website may link to third-party services. Their data practices are governed by their own policies. We may use analytics tools, including Google Analytics, to monitor usage and improve services.

Disclaimer

Services are provided "AS-IS" and "AS-AVAILABLE". By registering and using the platform, you acknowledge and accept the Privacy Policy and Terms and Conditions.

We may periodically make changes to this Privacy Policy and will notify you by posting modified terms on our platforms.`;

export const TERMS_AND_CONDITIONS_TEXT = `Términos y Condiciones

BetPoncho.bet.ar, su aplicación móvil y demás formatos de acceso son administrados en la Provincia de Salta por New Gaming S.R.L., autorizada por ENREJA según la normativa aplicable.

Todos los Jugadores que participen en juegos o coloquen apuestas en línea deben aceptar estos Términos y Condiciones. El registro implica su aceptación.

Resumen de puntos principales:

1. Del vínculo y sus efectos
- Al registrarse, usted declara haber leído, comprendido y aceptado los Términos.
- BetPoncho puede actualizarlos y notificará los cambios.

2. Ámbito territorial
- Las apuestas deben materializarse dentro de la Provincia de Salta.

3. Registro y validaciones
- La cuenta es personal, individual e intransferible.
- Se solicitarán datos y documentación conforme normativa vigente.
- BetPoncho puede verificar identidad, mayoría de edad, PEP, RePET y domicilio.

4. Juego responsable
- Se ofrecen herramientas como límites de depósito, autoexclusión y canales de ayuda.

5. Depósitos y retiros
- Los depósitos y retiros están sujetos a controles de seguridad, identidad y prevención de lavado.
- Podrán aplicarse límites, validaciones y demoras por cumplimiento normativo.

6. Fraude e incumplimientos
- BetPoncho podrá suspender cuentas, cancelar apuestas/bonos y reportar a autoridades ante actividad fraudulenta o irregular.

7. Privacidad y seguridad
- El tratamiento de datos personales se rige también por la Política de Privacidad.
- El usuario debe resguardar sus credenciales y dispositivos.

8. Responsabilidad y ley aplicable
- El uso del sitio y estos términos se rigen por legislación argentina y de la Provincia de Salta.

Texto completo: los presentes Términos y Condiciones se consideran aplicables en toda su extensión, incluyendo cláusulas regulatorias, operativas, de juego responsable, AML/FT, seguridad, reclamos y prohibiciones de participación.`;
