import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Email } from "@smastrom/react-email-autocomplete";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type Stage = "welcome" | "identity" | "nosis" | "prefill" | "contact" | "creating" | "ineligible" | "complete";

type IdentityForm = {
  dni: string;
  genero: "M" | "F" | "X" | "";
  email: string;
  confirmEmail: string;
  telefono: string;
  acceptedLegal: boolean;
};

type ContactForm = {
  password: string;
  confirmPassword: string;
  referralCode: string;
};

type ProfileForm = {
  estadoCivil: "" | "Casado" | "Soltero" | "Viudo" | "Union Civil";
  ocupacion: "" | "Industria" | "Comercio" | "Profesional";
  pep: "" | "Si" | "No";
  provincia: string;
  ciudad: string;
  direccion: string;
};

type NosisData = {
  nombre: string;
  apellido: string;
  dni: string;
  genero: string;
  fechaNacimiento: string;
  cuil: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  pep: boolean;
  repet: boolean;
  fallecido: boolean;
};

type LegalModalType = "privacy" | "terms";
type CivilStatusApi = "soltero" | "casado" | "divorciado" | "viudo" | "union_convivencial";
type RegistrationDraft = {
  sessionId?: string;
  stage?: string;
  dni?: string | null;
  gender?: "M" | "F" | null;
  email?: string | null;
  confirmEmail?: string | null;
  phone?: string | null;
  acceptedTerms?: boolean | null;
  promotionalCode?: string | null;
  nosisQueryId?: string | null;
  isEligible?: boolean | null;
  ineligibleReason?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  birthDate?: string | null;
  cuil?: string | null;
  addressStreet?: string | null;
  addressNumber?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  pepDeclared?: boolean | null;
  civilStatus?: CivilStatusApi | null;
  occupation?: string | null;
  referredCode?: string | null;
  lastCompletedStep?: number | null;
  completedAt?: string | null;
};

const HEADER_RED = "#590000";
const NAVBAR_RED = "#980000";
const CTA_GRADIENT = `linear-gradient(160deg, #c82222 0%, ${NAVBAR_RED} 58%, ${HEADER_RED} 100%)`;
const APP_SURFACE = "linear-gradient(165deg, rgba(15, 21, 40, 0.94) 0%, rgba(8, 12, 24, 0.96) 58%, rgba(5, 8, 18, 0.98) 100%)";
const PANEL_SURFACE = "linear-gradient(165deg, rgba(34, 17, 30, 0.76) 0%, rgba(20, 28, 48, 0.8) 100%)";
const PANEL_BORDER = "1px solid rgba(210, 62, 62, 0.42)";
const TEXT_PRIMARY = "rgba(255,255,255,0.97)";
const TEXT_SECONDARY = "rgba(255,255,255,0.84)";
const ERROR_TEXT = "#ffb4b4";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3028").replace(/\/+$/, "");

type RegistrationSessionApiResponse =
  | {
      sessionId?: string;
      success?: boolean;
      message?: string;
      data?: RegistrationDraft & { sessionId?: string };
      result?: {
        sessionId?: string;
      };
      code?: string;
      errorCode?: string;
    }
  | undefined;

type ApiErrorWithCode = Error & {
  code?: string;
};
type UtmPayload = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const inputBase: React.CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid rgba(224, 86, 86, 0.55)",
  background: "rgba(255,255,255,0.09)",
  color: TEXT_PRIMARY,
  fontSize: 16,
  padding: "13px 14px",
  outline: "none",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 6px 14px -10px rgba(0,0,0,0.65)",
  transition: "border-color 160ms ease, box-shadow 160ms ease, color 160ms ease",
};

const selectBase: React.CSSProperties = {
  ...inputBase,
  colorScheme: "dark",
};

const panelBase: React.CSSProperties = {
  borderRadius: 18,
  border: PANEL_BORDER,
  background: PANEL_SURFACE,
  padding: 16,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 26px -22px rgba(0,0,0,0.85)",
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  minHeight: 52,
  borderRadius: 14,
  background: CTA_GRADIENT,
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  padding: "14px 16px",
  border: "1px solid rgba(255, 164, 164, 0.35)",
  boxShadow: "0 14px 24px -14px rgba(152,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.2)",
  transition: "transform 140ms ease, filter 140ms ease, box-shadow 160ms ease",
};

const secondaryButton: React.CSSProperties = {
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

const logoContainerBase: React.CSSProperties = {
  padding: "clamp(8px, 2.2vw, 11px)",
  borderRadius: "clamp(14px, 3.2vw, 18px)",
  background: "#980000",
  border: "1px solid rgba(255, 169, 169, 0.55)",
  boxShadow: "0 12px 24px -14px rgba(70,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.18)",
};

const logoImageBase: React.CSSProperties = {
  width: "clamp(108px, 27vw, 148px)",
  height: "auto",
  maxWidth: "100%",
  borderRadius: "clamp(10px, 2.6vw, 14px)",
  objectFit: "contain",
  display: "block",
};

const emailAutocompleteClassNames = {
  wrapper: "email-auto-wrapper",
  input: "email-auto-input",
  dropdown: "email-auto-dropdown",
  suggestion: "email-auto-suggestion",
  username: "email-auto-username",
  domain: "email-auto-domain",
} as const;

const PRIVACY_POLICY_TEXT = `Your privacy is important to us, and we are committed to protecting your personal information. We will be clear and open about why we collect your personal information and how we use it. Where you have choices or rights, we will explain these to you. This Privacy Policy explains how Betponcho uses your personal information when you're using one of our website.

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

const TERMS_AND_CONDITIONS_TEXT = `Términos y Condiciones

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

function App() {
  const sessionIdFromUrl =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("sessionId") ?? "" : "";
  const [stage, setStage] = useState<Stage>("welcome");
  const [registrationSessionId, setRegistrationSessionId] = useState(sessionIdFromUrl);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [identity, setIdentity] = useState<IdentityForm>({
    dni: "",
    genero: "",
    email: "",
    confirmEmail: "",
    telefono: "",
    acceptedLegal: false,
  });
  const [contact, setContact] = useState<ContactForm>({
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [profile, setProfile] = useState<ProfileForm>({
    estadoCivil: "",
    ocupacion: "",
    pep: "",
    provincia: "",
    ciudad: "",
    direccion: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nosis, setNosis] = useState<NosisData | null>(null);
  const [legalModal, setLegalModal] = useState<LegalModalType | null>(null);
  const [provinceNotSaltaModalMessage, setProvinceNotSaltaModalMessage] = useState("");
  const nosisRequestId = useRef(0);
  const completionRequestId = useRef(0);
  const flowStartedAtRef = useRef<number | null>(null);
  const hasStartedFlowRef = useRef(false);
  const hasTrackedLandingRef = useRef(false);
  const hasTrackedCompletionRef = useRef(false);
  const hasTrackedIneligibleRef = useRef(false);
  const hasTrackedAbandonRef = useRef(false);
  const lastTrackedStageRef = useRef<Stage | null>(null);

  const step = useMemo(() => {
    if (stage === "welcome") return 0;
    if (stage === "identity" || stage === "nosis") return 1;
    if (stage === "prefill") return 2;
    if (stage === "contact" || stage === "creating" || stage === "complete") return 3;
    return 1;
  }, [stage]);

  const utmPayload = useMemo<UtmPayload>(() => {
    if (typeof window === "undefined") return {};
    const storageKey = "bp_utm_payload_v1";
    const params = new URLSearchParams(window.location.search);
    const current: UtmPayload = {
      utm_source: params.get("utm_source") ?? undefined,
      utm_medium: params.get("utm_medium") ?? undefined,
      utm_campaign: params.get("utm_campaign") ?? undefined,
      utm_content: params.get("utm_content") ?? undefined,
      utm_term: params.get("utm_term") ?? undefined,
      gclid: params.get("gclid") ?? undefined,
      fbclid: params.get("fbclid") ?? undefined,
    };
    const hasCurrentValues = Object.values(current).some(Boolean);
    if (hasCurrentValues) {
      sessionStorage.setItem(storageKey, JSON.stringify(current));
      return current;
    }
    const saved = sessionStorage.getItem(storageKey);
    if (!saved) return {};
    try {
      return JSON.parse(saved) as UtmPayload;
    } catch {
      return {};
    }
  }, []);

  const trackEvent = useCallback(
    (eventName: string, params: Record<string, unknown> = {}) => {
      if (typeof window === "undefined" || typeof window.gtag !== "function") return;
      const merged = {
        ...utmPayload,
        registration_session_id: registrationSessionId || undefined,
        ...params,
      };
      const cleanParams = Object.fromEntries(
        Object.entries(merged).filter(([, value]) => value !== undefined && value !== null && value !== ""),
      );
      window.gtag("event", eventName, cleanParams);
    },
    [registrationSessionId, utmPayload],
  );

  const confirmPasswordHasValue = contact.confirmPassword.length > 0;
  const confirmPasswordMatches = confirmPasswordHasValue && contact.confirmPassword === contact.password;
  const confirmPasswordMismatch = confirmPasswordHasValue && contact.confirmPassword !== contact.password;
  const confirmEmailHasValue = identity.confirmEmail.trim().length > 0;
  const emailsMatch = confirmEmailHasValue && identity.confirmEmail.trim() === identity.email.trim();
  const emailMismatch = confirmEmailHasValue && identity.confirmEmail.trim() !== identity.email.trim();
  const preventClipboardAction = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
  };
  const preventDropAction = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
  };
  const passwordConditionsOk =
    contact.password.length > 0 &&
    /\d/.test(contact.password) &&
    !/\s/.test(contact.password) &&
    /^[\x00-\x7F]*$/.test(contact.password) &&
    contact.password.length >= 6 &&
    contact.password.length <= 50 &&
    /[A-Z]/.test(contact.password) &&
    /[a-z]/.test(contact.password);

  useEffect(() => {
    if (hasTrackedLandingRef.current) return;
    hasTrackedLandingRef.current = true;
    trackEvent("form_landing_view", {
      stage: "welcome",
      step_index: 0,
    });
  }, [trackEvent]);

  useEffect(() => {
    if (lastTrackedStageRef.current === stage) return;
    lastTrackedStageRef.current = stage;

    trackEvent("form_step_view", {
      stage,
      step_index: step,
    });

    if (!hasStartedFlowRef.current && stage !== "welcome") {
      hasStartedFlowRef.current = true;
      flowStartedAtRef.current = Date.now();
      trackEvent("form_started", {
        stage,
        step_index: step,
      });
    }

    if (stage === "complete" && !hasTrackedCompletionRef.current) {
      hasTrackedCompletionRef.current = true;
      hasTrackedAbandonRef.current = true;
      trackEvent("form_completed", {
        stage,
        step_index: step,
        elapsed_seconds: flowStartedAtRef.current
          ? Math.round((Date.now() - flowStartedAtRef.current) / 1000)
          : undefined,
      });
    }

    if (stage === "ineligible" && !hasTrackedIneligibleRef.current) {
      hasTrackedIneligibleRef.current = true;
      hasTrackedAbandonRef.current = true;
      trackEvent("form_ineligible", {
        stage,
        step_index: step,
        reason: provinceNotSaltaModalMessage.includes("Salta") ? "PROVINCE_NOT_SALTA" : undefined,
      });
    }
  }, [stage, step, trackEvent, provinceNotSaltaModalMessage]);

  useEffect(() => {
    const trackAbandonIfNeeded = () => {
      if (hasTrackedAbandonRef.current) return;
      if (!hasStartedFlowRef.current) return;
      if (stage === "complete" || stage === "ineligible") return;
      hasTrackedAbandonRef.current = true;
      trackEvent("form_abandoned", {
        stage,
        step_index: step,
        elapsed_seconds: flowStartedAtRef.current
          ? Math.round((Date.now() - flowStartedAtRef.current) / 1000)
          : undefined,
      });
    };

    const onPageHide = () => trackAbandonIfNeeded();
    const onBeforeUnload = () => trackAbandonIfNeeded();

    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [stage, step, trackEvent]);

  const validateIdentity = () => {
    const nextErrors: Record<string, string> = {};
    if (!/^\d{7,8}$/.test(identity.dni.trim())) {
      nextErrors.dni = "Ingresa un DNI valido de 7 u 8 digitos.";
    }
    if (!identity.genero) {
      nextErrors.genero = "Selecciona un genero.";
    } else if (identity.genero === "X") {
      nextErrors.genero = "Por el momento API solo admite genero M o F.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email.trim())) {
      nextErrors.email = "Ingresa un email valido.";
    }
    if (!identity.confirmEmail.trim()) {
      nextErrors.confirmEmail = "Confirma tu email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.confirmEmail.trim())) {
      nextErrors.confirmEmail = "Ingresa un email valido.";
    } else if (identity.confirmEmail.trim() !== identity.email.trim()) {
      nextErrors.confirmEmail = "Los emails no coinciden.";
    }
    if (!/^\d{8,15}$/.test(identity.telefono.trim())) {
      nextErrors.telefono = "Ingresa un telefono valido (solo numeros).";
    }
    if (!identity.acceptedLegal) {
      nextErrors.acceptedLegal = "Debes aceptar términos y confirmar que eres mayor de 18 años.";
    }
    if (contact.referralCode && !/^[a-zA-Z0-9_-]{3,30}$/.test(contact.referralCode.trim())) {
      nextErrors.referralCode = "Codigo de Referido invalido (3-30, letras, numeros, guion o guion bajo).";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
  const evaluateNosis = (dni: string, genero: string): NosisData => {
    const seeds = [
      { nombre: "Luciano", apellido: "Gomez", ciudad: "Rosario", provincia: "Santa Fe" },
      { nombre: "Camila", apellido: "Diaz", ciudad: "Cordoba", provincia: "Cordoba" },
      { nombre: "Agustin", apellido: "Perez", ciudad: "Mendoza", provincia: "Mendoza" },
      { nombre: "Martina", apellido: "Lopez", ciudad: "La Plata", provincia: "Buenos Aires" },
    ];

    const hash = Number(dni.slice(-2));
    const pick = seeds[hash % seeds.length];
    const birthYear = 1978 + (hash % 22);
    const birthMonth = String((hash % 12) + 1).padStart(2, "0");
    const birthDay = String((hash % 27) + 1).padStart(2, "0");

    const normalizedGender = genero === "M" ? "Masculino" : genero === "F" ? "Femenino" : "No binario";

    return {
      nombre: pick.nombre,
      apellido: pick.apellido,
      dni,
      genero: normalizedGender,
      fechaNacimiento: `${birthYear}-${birthMonth}-${birthDay}`,
      cuil: `20-${dni.slice(0, 8).padStart(8, "0")}-${(hash % 9) + 1}`,
      direccion: `Av. ${pick.apellido} ${120 + hash}`,
      ciudad: pick.ciudad,
      provincia: pick.provincia,
      pep: dni.endsWith("7"),
      repet: dni.endsWith("9"),
      fallecido: dni.endsWith("5"),
    };
  };

  const parseApiError = (status: number, payload: unknown, fallback: string) => {
    let code: string | undefined;
    if (payload && typeof payload === "object") {
      const apiPayload = payload as {
        code?: unknown;
        errorCode?: unknown;
        data?: { code?: unknown; errorCode?: unknown };
        result?: { code?: unknown; errorCode?: unknown };
      };
      const potentialCode =
        apiPayload.errorCode ??
        apiPayload.code ??
        apiPayload.data?.errorCode ??
        apiPayload.data?.code ??
        apiPayload.result?.errorCode ??
        apiPayload.result?.code;
      if (typeof potentialCode === "string" && potentialCode.trim().length > 0) {
        code = potentialCode.trim();
      }
    }

    if (payload && typeof payload === "object" && "message" in payload) {
      const message = (payload as { message?: unknown }).message;
      if (typeof message === "string" && message.trim().length > 0) {
        return { message: `${message} (${status})`, code };
      }
      if (Array.isArray(message) && message.length > 0) {
        return { message: `${String(message[0])} (${status})`, code };
      }
    }
    return { message: `${fallback} (${status})`, code };
  };

  const buildApiError = (status: number, payload: unknown, fallback: string): ApiErrorWithCode => {
    const parsed = parseApiError(status, payload, fallback);
    const error = new Error(parsed.message) as ApiErrorWithCode;
    error.code = parsed.code;
    return error;
  };

  const toCivilStatusApi = (value: ProfileForm["estadoCivil"]): CivilStatusApi => {
    if (value === "Casado") return "casado";
    if (value === "Viudo") return "viudo";
    if (value === "Union Civil") return "union_convivencial";
    return "soltero";
  };

  const fromCivilStatusApi = (value?: CivilStatusApi | null): ProfileForm["estadoCivil"] => {
    if (value === "casado") return "Casado";
    if (value === "viudo") return "Viudo";
    if (value === "union_convivencial") return "Union Civil";
    return "Soltero";
  };

  const parseAddress = (fullAddress: string) => {
    const trimmed = fullAddress.trim();
    const match = trimmed.match(/^(.*?)(\d+)\s*$/);
    if (!match) {
      return {
        addressStreet: trimmed || "Sin calle",
        addressNumber: "S/N",
      };
    }
    return {
      addressStreet: match[1].trim() || "Sin calle",
      addressNumber: match[2],
    };
  };

  const createRegistrationSession = async (): Promise<RegistrationDraft> => {
    const response = await fetch(`${API_BASE_URL}/api/registration/session`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const payload = (await response.json()) as RegistrationSessionApiResponse;
    if (!response.ok) {
      throw buildApiError(response.status, payload, "No se pudo crear la sesion de registro.");
    }
    return payload?.data ?? {};
  };

  const getRegistrationDraft = async (sessionId: string): Promise<RegistrationDraft> => {
    const response = await fetch(`${API_BASE_URL}/api/registration/${encodeURIComponent(sessionId)}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const payload = (await response.json()) as RegistrationSessionApiResponse;
    if (!response.ok) {
      throw buildApiError(response.status, payload, "No se pudo consultar la sesion de registro.");
    }
    return payload?.data ?? {};
  };

  const patchRegistrationStep = async (
    sessionId: string,
    stepPath: "identity" | "confirmation" | "account",
    body: unknown,
  ): Promise<RegistrationDraft | undefined> => {
    const sanitizedBody =
      body && typeof body === "object"
        ? Object.fromEntries(
            Object.entries(body as Record<string, unknown>).filter(([, value]) => {
              if (value === null || value === undefined) return false;
              if (typeof value === "string" && value.trim().length === 0) return false;
              return true;
            }),
          )
        : body;

    if (sanitizedBody && typeof sanitizedBody === "object" && Object.keys(sanitizedBody as Record<string, unknown>).length === 0) {
      return undefined;
    }

    const response = await fetch(`${API_BASE_URL}/api/registration/${encodeURIComponent(sessionId)}/${stepPath}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanitizedBody),
    });
    const payload = (await response.json()) as RegistrationSessionApiResponse;
    if (!response.ok) {
      const stepName = stepPath === "identity" ? "identidad" : stepPath === "confirmation" ? "confirmacion" : "cuenta";
      throw buildApiError(response.status, payload, `No se pudo guardar el paso de ${stepName}.`);
    }
    return payload?.data;
  };

  const buildIdentityPatchPayload = () => {
    const payload: Record<string, string | boolean> = {};
    const dni = identity.dni.trim();
    const email = identity.email.trim();
    const confirmEmail = identity.confirmEmail.trim();
    const phone = identity.telefono.trim();
    const promotionalCode = contact.referralCode.trim();

    if (dni) payload.dni = dni;
    if (identity.genero === "M" || identity.genero === "F") payload.gender = identity.genero;
    if (email) payload.email = email;
    if (confirmEmail) payload.confirmEmail = confirmEmail;
    if (phone) payload.phone = phone;
    if (identity.acceptedLegal) payload.acceptedTerms = true;
    if (promotionalCode) payload.promotionalCode = promotionalCode;

    return payload;
  };

  const buildNosisFromDraft = (draft: RegistrationDraft, fallbackGender?: "M" | "F" | ""): NosisData | null => {
    const gender = draft.gender === "M" || draft.gender === "F" ? draft.gender : fallbackGender ?? "";
    if (!draft.firstName || !draft.lastName || !draft.birthDate || !draft.cuil || !draft.dni || !gender) {
      return null;
    }
    const direccionCompuesta = [draft.addressStreet, draft.addressNumber].filter(Boolean).join(" ").trim();
    return {
      nombre: draft.firstName,
      apellido: draft.lastName,
      dni: draft.dni,
      genero: gender === "M" ? "Masculino" : "Femenino",
      fechaNacimiento: draft.birthDate.split("T")[0],
      cuil: draft.cuil,
      direccion: direccionCompuesta,
      ciudad: draft.city ?? "",
      provincia: draft.province ?? "",
      pep: Boolean(draft.pepDeclared),
      repet: false,
      fallecido: false,
    };
  };

  const applyDraftToState = (draft: RegistrationDraft) => {
    const sessionId = draft.sessionId ?? "";
    if (sessionId) {
      setRegistrationSessionId(sessionId);
    }

    const genero = draft.gender === "M" || draft.gender === "F" ? draft.gender : "";
    const referredCode = draft.referredCode ?? draft.promotionalCode ?? "";
    const direccionCompuesta = [draft.addressStreet, draft.addressNumber].filter(Boolean).join(" ").trim();

    setIdentity((prev) => ({
      ...prev,
      dni: draft.dni ?? "",
      genero,
      email: draft.email ?? "",
      confirmEmail: draft.confirmEmail ?? draft.email ?? "",
      telefono: draft.phone ?? "",
      acceptedLegal: Boolean(draft.acceptedTerms),
    }));

    setContact((prev) => ({
      ...prev,
      referralCode: referredCode,
    }));

    setProfile((prev) => ({
      ...prev,
      provincia: draft.province ?? prev.provincia,
      ciudad: draft.city ?? prev.ciudad,
      direccion: direccionCompuesta || prev.direccion,
      pep: draft.pepDeclared === null || draft.pepDeclared === undefined ? prev.pep : draft.pepDeclared ? "Si" : "No",
      estadoCivil: draft.civilStatus ? fromCivilStatusApi(draft.civilStatus) : prev.estadoCivil,
      ocupacion: draft.occupation === "Industria" || draft.occupation === "Comercio" || draft.occupation === "Profesional" ? draft.occupation : prev.ocupacion,
    }));

    const nosisFromDraft = buildNosisFromDraft(draft, genero);
    if (nosisFromDraft) {
      setNosis(nosisFromDraft);
    } else if (draft.dni && genero) {
      setNosis(evaluateNosis(draft.dni, genero));
    } else {
      setNosis(null);
    }

    if (draft.ineligibleReason === "PROVINCE_NOT_SALTA") {
      setProvinceNotSaltaModalMessage("Solo se permiten registros con domicilio en la provincia de Salta.");
    } else {
      setProvinceNotSaltaModalMessage("");
    }

    if (draft.stage === "INELIGIBLE" || draft.isEligible === false) {
      setStage("ineligible");
      return;
    }

    const completed = draft.lastCompletedStep ?? 0;
    if (draft.completedAt || completed >= 3) {
      setStage("complete");
      return;
    }
    if (completed >= 2) {
      setStage("contact");
      return;
    }
    if (completed >= 1) {
      setStage("prefill");
      return;
    }
    setStage("identity");
  };

  useEffect(() => {
    if (!sessionIdFromUrl) return;
    let cancelled = false;
    const loadDraft = async () => {
      setIsCreatingSession(true);
      try {
        const draft = await getRegistrationDraft(sessionIdFromUrl);
        if (cancelled) return;
        applyDraftToState(draft);
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "No se pudo cargar la sesion de registro.";
        setErrors((prev) => ({
          ...prev,
          registrationSession: message,
        }));
      } finally {
        if (!cancelled) {
          setIsCreatingSession(false);
        }
      }
    };
    loadDraft();
    return () => {
      cancelled = true;
    };
  }, [sessionIdFromUrl]);

  const handleIdentitySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateIdentity()) return;

    if (!registrationSessionId) {
      setErrors((prev) => ({ ...prev, identityApi: "No hay sessionId activo para guardar identidad." }));
      return;
    }

    const identityPayload = buildIdentityPatchPayload();
    if (Object.keys(identityPayload).length === 0) {
      setErrors((prev) => ({ ...prev, identityApi: "No hay datos de identidad para guardar." }));
      return;
    }

    try {
      const draftAfterIdentity = await patchRegistrationStep(registrationSessionId, "identity", identityPayload);
      if (
        draftAfterIdentity?.ineligibleReason === "PROVINCE_NOT_SALTA" ||
        (draftAfterIdentity?.stage === "INELIGIBLE" && draftAfterIdentity?.ineligibleReason === "PROVINCE_NOT_SALTA")
      ) {
        setProvinceNotSaltaModalMessage("Solo se permiten registros con domicilio en la provincia de Salta.");
        setStage("ineligible");
        return;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar identidad.";
      const apiCode = (error as ApiErrorWithCode | undefined)?.code;
      if (apiCode === "PROVINCE_NOT_SALTA" || message.includes("PROVINCE_NOT_SALTA")) {
        setProvinceNotSaltaModalMessage(message);
        return;
      }
      setErrors((prev) => ({ ...prev, identityApi: message }));
      return;
    }

    nosisRequestId.current += 1;
    const currentRequestId = nosisRequestId.current;
    setStage("nosis");
    setErrors({});

    await new Promise((resolve) => setTimeout(resolve, 1200));
    if (nosisRequestId.current !== currentRequestId) return;

    let resultFromIdentity: RegistrationDraft | undefined;
    try {
      resultFromIdentity = await getRegistrationDraft(registrationSessionId);
    } catch {
      resultFromIdentity = undefined;
    }

    const safeFallbackGender: "" | "M" | "F" = identity.genero === "M" || identity.genero === "F" ? identity.genero : "";
    const nosisFromIdentity = resultFromIdentity ? buildNosisFromDraft(resultFromIdentity, safeFallbackGender) : null;
    if (nosisFromIdentity) {
      setNosis(nosisFromIdentity);
      setProfile((prev) => ({
        ...prev,
        provincia: nosisFromIdentity.provincia,
        ciudad: nosisFromIdentity.ciudad,
        direccion: nosisFromIdentity.direccion,
      }));
      setStage("prefill");
      return;
    }

    const result = evaluateNosis(identity.dni, identity.genero);
    const bornDate = new Date(result.fechaNacimiento);
    const years = new Date().getFullYear() - bornDate.getFullYear();
    const meetsAge = years >= 18;
    const meetsCompliance = !result.pep && !result.repet && !result.fallecido;

    if (!meetsAge || !meetsCompliance) {
      setStage("ineligible");
      return;
    }

    setNosis(result);
    setProfile((prev) => ({
      ...prev,
      provincia: result.provincia,
      ciudad: result.ciudad,
      direccion: result.direccion,
    }));
    setStage("prefill");
  };

  const handleStartRegistration = async () => {
    if (isCreatingSession) return;
    trackEvent("form_start_click", { stage, step_index: step });
    setErrors((prev) => {
      if (!prev.registrationSession) return prev;
      const next = { ...prev };
      delete next.registrationSession;
      return next;
    });

    setIsCreatingSession(true);
    try {
      const draft = await createRegistrationSession();
      const sessionId = draft.sessionId;
      if (!sessionId) {
        throw new Error("La API no devolvio sessionId.");
      }
      setRegistrationSessionId(sessionId);
      setStage("identity");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo iniciar la sesion de registro.";
      setErrors((prev) => ({
        ...prev,
        registrationSession: message,
      }));
    } finally {
      setIsCreatingSession(false);
    }
  };

  const validateContact = () => {
    const nextErrors: Record<string, string> = {};
    const passwordValid =
      contact.password.length > 0 &&
      /\d/.test(contact.password) &&
      !/\s/.test(contact.password) &&
      /^[\x00-\x7F]*$/.test(contact.password) &&
      contact.password.length >= 6 &&
      contact.password.length <= 50 &&
      /[A-Z]/.test(contact.password) &&
      /[a-z]/.test(contact.password);

    if (!passwordValid) {
      nextErrors.password = "La contraseña no cumple las condiciones.";
    }
    if (!contact.confirmPassword) {
      nextErrors.confirmPassword = "Confirma tu contraseña.";
    } else if (contact.confirmPassword !== contact.password) {
      nextErrors.confirmPassword = "Las contraseñas no coinciden.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateContact()) return;
    if (!registrationSessionId) {
      setErrors((prev) => ({ ...prev, accountApi: "No hay sessionId activo para guardar la cuenta." }));
      return;
    }

    try {
      await patchRegistrationStep(registrationSessionId, "account", {
        password: contact.password,
        referredCode: contact.referralCode.trim() || undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar la cuenta.";
      setErrors((prev) => ({ ...prev, accountApi: message }));
      return;
    }

    completionRequestId.current += 1;
    const currentRequestId = completionRequestId.current;
    setErrors({});
    setStage("creating");
    await new Promise((resolve) => setTimeout(resolve, 1300));
    if (completionRequestId.current !== currentRequestId) return;
    setStage("complete");
    const now = new Date();
    const completedAtArgentina = new Intl.DateTimeFormat("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now);
    const registrationPayload = {
      event: "registration_completed",
      sessionId: registrationSessionId || null,
      completedSteps: 3,
      completedAtArgentina,
      timezone: "America/Argentina/Buenos_Aires",
      sources: {
        local: {
          identity,
          profile,
          contact,
        },
        nosis: nosis
          ? {
              nombre: nosis.nombre,
              apellido: nosis.apellido,
              dni: nosis.dni,
              genero: nosis.genero,
              fechaNacimiento: nosis.fechaNacimiento,
              cuil: nosis.cuil,
              direccion: nosis.direccion,
              ciudad: nosis.ciudad,
              provincia: nosis.provincia,
              pep: nosis.pep,
              repet: nosis.repet,
              fallecido: nosis.fallecido,
            }
          : null,
      },
    };
    console.info("Proceso terminado: pasos 1, 2 y 3 completados.");
    console.log("Payload de registro:\n" + JSON.stringify(registrationPayload, null, 2));
  };

  const handlePrefillContinue = async () => {
    const nextErrors: Record<string, string> = {};
    if (!profile.provincia.trim()) {
      nextErrors.provincia = "Ingresa una provincia";
    }
    if (!profile.ciudad.trim()) {
      nextErrors.ciudad = "Ingresa una ciudad";
    }
    if (!profile.direccion.trim()) {
      nextErrors.direccion = "Ingresa una direccion";
    }
    if (!profile.estadoCivil) {
      nextErrors.estadoCivil = "Selecciona un estado civil";
    }
    if (!profile.ocupacion) {
      nextErrors.ocupacion = "Selecciona una ocupacion";
    }
    if (!profile.pep) {
      nextErrors.pep = "Selecciona una opcion para Persona Expuesta Politicamente";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    if (!registrationSessionId || !nosis) {
      setErrors((prev) => ({ ...prev, confirmationApi: "Falta session activa o datos personales para confirmar." }));
      return;
    }

    let currentDraft: RegistrationDraft;
    try {
      currentDraft = await getRegistrationDraft(registrationSessionId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo consultar el estado de la sesion.";
      setErrors((prev) => ({ ...prev, confirmationApi: message }));
      return;
    }

    if (currentDraft.isEligible === false) {
      setErrors((prev) => ({
        ...prev,
        confirmationApi: currentDraft.ineligibleReason || "El backend informó que la sesión no es elegible.",
      }));
      setStage("ineligible");
      return;
    }

    if (currentDraft.isEligible !== true) {
      setErrors((prev) => ({
        ...prev,
        confirmationApi: "La sesión aún no está elegible en backend (isEligible pendiente). No se puede enviar Step 2.",
      }));
      return;
    }

    const parsedAddress = parseAddress(profile.direccion);
    try {
      await patchRegistrationStep(registrationSessionId, "confirmation", {
        firstName: nosis.nombre,
        lastName: nosis.apellido,
        birthDate: nosis.fechaNacimiento,
        cuil: nosis.cuil.replace(/\D/g, ""),
        addressStreet: parsedAddress.addressStreet,
        addressNumber: parsedAddress.addressNumber.replace(/\D/g, "") || "0",
        city: profile.ciudad.trim(),
        province: profile.provincia.trim(),
        postalCode: "0000",
        pepDeclared: profile.pep === "Si",
        civilStatus: toCivilStatusApi(profile.estadoCivil),
        occupation: profile.ocupacion,
      });
      setErrors({});
      setStage("contact");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar la confirmacion.";
      setErrors((prev) => ({ ...prev, confirmationApi: message }));
    }
  };

  const restartFlow = () => {
    nosisRequestId.current += 1;
    completionRequestId.current += 1;
    flowStartedAtRef.current = null;
    hasStartedFlowRef.current = false;
    hasTrackedCompletionRef.current = false;
    hasTrackedIneligibleRef.current = false;
    hasTrackedAbandonRef.current = false;
    lastTrackedStageRef.current = null;
    setStage("welcome");
    setRegistrationSessionId("");
    setIsCreatingSession(false);
    setIdentity({ dni: "", genero: "", email: "", confirmEmail: "", telefono: "", acceptedLegal: false });
    setContact({ password: "", confirmPassword: "", referralCode: "" });
    setProfile({ estadoCivil: "", ocupacion: "", pep: "", provincia: "", ciudad: "", direccion: "" });
    setErrors({});
    setNosis(null);
    setProvinceNotSaltaModalMessage("");
  };

  const goBack = () => {
    nosisRequestId.current += 1;
    completionRequestId.current += 1;
    setErrors({});

    if (stage === "identity") {
      setStage("welcome");
      return;
    }
    if (stage === "nosis") {
      setStage("identity");
      return;
    }
    if (stage === "prefill") {
      setStage("identity");
      return;
    }
    if (stage === "contact") {
      setStage("prefill");
      return;
    }
    if (stage === "creating") {
      setStage("contact");
      return;
    }
    if (stage === "ineligible") {
      setStage("identity");
      return;
    }
    if (stage === "complete") {
      setStage("contact");
    }
  };

  return (
    <main
      style={{
        minHeight: "100dvh",
        paddingTop: "max(14px, calc(env(safe-area-inset-top) + 10px))",
        paddingRight: "max(12px, calc(env(safe-area-inset-right) + 8px))",
        paddingBottom: "max(20px, calc(env(safe-area-inset-bottom) + 16px))",
        paddingLeft: "max(12px, calc(env(safe-area-inset-left) + 8px))",
      }}
    >
      <section
        style={{
          maxWidth: 740,
          margin: "0 auto",
          background: APP_SURFACE,
          border: PANEL_BORDER,
          borderRadius: "clamp(18px, 3.8vw, 28px)",
          boxShadow: "0 28px 56px -34px rgba(0,0,0,0.95)",
          backdropFilter: "blur(16px)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg, rgba(255,120,120,0) 0%, rgba(255,120,120,0.9) 45%, rgba(255,120,120,0) 100%)",
          }}
        />
        <div
          style={{
            padding: "clamp(16px, 4vw, 26px) clamp(12px, 3vw, 18px) clamp(18px, 4vw, 24px)",
            maxWidth: 620,
            margin: "0 auto",
          }}
        >
          <div key={stage} className="stage-transition">
          {stage === "welcome" ? (
            <div style={{ maxWidth: 560, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}>
                <div style={logoContainerBase}>
                  <img src="/images/logo.png" alt="Logo BetPoncho" style={logoImageBase} />
                </div>
              </div>

              <div style={{ textAlign: "center", marginBottom: 30 }}>
                <h1
                  className="font-display"
                  style={{ margin: "0 0 12px", fontSize: "clamp(33px, 8vw, 44px)", lineHeight: 1.05, fontWeight: 600 }}
                >
                  Bienvenido a BetPoncho
                </h1>
                <p style={{ margin: 0, color: TEXT_SECONDARY, fontSize: 17, lineHeight: 1.5 }}>
                  Registrate en pocos pasos para activar tu cuenta y empezar a jugar
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ textAlign: "center", margin: "0 0 12px", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>
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
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: NAVBAR_RED, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ textAlign: "center", margin: "0 0 12px", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  Pasos
                </h3>
                <div style={{ display: "grid", gap: 9 }}>
                  {[
                    "Completar DNI y género",
                    "Confirmar tus datos personales",
                    "Completar tus datos y crear una contraseña",
                  ].map((text, idx) => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ color: "#ff6161", fontWeight: 700, minWidth: 28, textAlign: "center" }}>{`0${idx + 1}`}</span>
                      <span style={{ fontSize: 14, color: TEXT_SECONDARY }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartRegistration}
                className="primary-cta"
                disabled={isCreatingSession}
                style={primaryButton}
              >
                {isCreatingSession ? "Iniciando sesion..." : "Comenzar registro"}
              </button>
              {errors.registrationSession ? <small style={{ color: ERROR_TEXT, display: "block", marginTop: 10 }}>{errors.registrationSession}</small> : null}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={goBack}
                style={{ ...secondaryButton, marginBottom: 14 }}
              >
                <FaArrowLeftLong size={14} />
                Volver
              </button>

              <header style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>

                </div>
                <h1
                  className="font-display"
                  style={{ margin: "0 0 8px", fontSize: "clamp(30px, 7.5vw, 36px)", lineHeight: 1.1, fontWeight: 600, color: TEXT_PRIMARY }}
                >
                  Registro BetPoncho
                </h1>

                <p style={{ margin: "8px 0 0", color: TEXT_SECONDARY, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
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
                  return (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          margin: "0 auto",
                          width: "clamp(36px, 9vw, 44px)",
                          height: "clamp(36px, 9vw, 44px)",
                          borderRadius: 14,
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 700,
                          background: done
                            ? "#14a44d"
                            : active
                              ? NAVBAR_RED
                              : "rgba(255,255,255,0.14)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.18)",
                          transition: "background-color 220ms ease, transform 180ms ease, box-shadow 220ms ease",
                          transform: active ? "translateY(-1px)" : "translateY(0)",
                          boxShadow: active ? "0 10px 20px -16px rgba(232,66,66,0.95)" : "none",
                        }}
                      >
                        {done ? "\u2713" : current}
                      </div>
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
          )}

          {stage === "identity" && (
            <form onSubmit={handleIdentitySubmit} style={{ display: "grid", gap: 14, ...panelBase }}>
              <label style={{ display: "grid", gap: 8 }}>
                <span>DNI</span>
                <input
                  value={identity.dni}
                  onChange={(e) => setIdentity((prev) => ({ ...prev, dni: e.target.value.replace(/\D/g, "") }))}
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
                  onChange={(e) => setIdentity((prev) => ({ ...prev, genero: e.target.value as IdentityForm["genero"] }))}
                  style={selectBase}
                >
                  <option value="" style={{ color: "#111", background: "#fff" }}>Seleccionar</option>
                  <option value="M" style={{ color: "#111", background: "#fff" }}>Masculino</option>
                  <option value="F" style={{ color: "#111", background: "#fff" }}>Femenino</option>
                  <option value="X" style={{ color: "#111", background: "#fff" }}>No binario</option>
                </select>
                {errors.genero ? <small style={{ color: ERROR_TEXT }}>{errors.genero}</small> : null}
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span>Email</span>
                <Email
                  value={identity.email}
                  onChange={(value: string) => {
                    setIdentity((prev) => ({ ...prev, email: value }));
                    setErrors((prev) => {
                      if (!prev.email && !prev.confirmEmail) return prev;
                      const next = { ...prev };
                      delete next.email;
                      delete next.confirmEmail;
                      return next;
                    });
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
                    const nextEmail = e.target.value;
                    setIdentity((prev) => ({ ...prev, confirmEmail: nextEmail }));
                    setErrors((prev) => {
                      if (!prev.confirmEmail) return prev;
                      const next = { ...prev };
                      delete next.confirmEmail;
                      return next;
                    });
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
                    setIdentity((prev) => ({
                      ...prev,
                      telefono: value.replace(/\D/g, "").slice(0, 15),
                    }))
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
                {errors.telefono ? <small style={{ color: ERROR_TEXT }}>{errors.telefono}</small> : null}
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
                  onChange={(e) => setIdentity((prev) => ({ ...prev, acceptedLegal: e.target.checked }))}
                  style={{ marginTop: 3 }}
                />
                <span style={{ fontSize: 13, lineHeight: 1.35, color: TEXT_SECONDARY }}>
                  Tengo más de 18 años y he aceptado la{" "}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setLegalModal("privacy");
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
                      setLegalModal("terms");
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
              {errors.acceptedLegal ? <small style={{ color: ERROR_TEXT }}>{errors.acceptedLegal}</small> : null}

              <label style={{ display: "grid", gap: 8, marginTop: 2 }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span>Codigo Promocional</span>

                </span>
                <input
                  value={contact.referralCode}
                  onChange={(e) => {
                    setContact((prev) => ({ ...prev, referralCode: e.target.value }));
                    setErrors((prev) => {
                      if (!prev.referralCode) return prev;
                      const next = { ...prev };
                      delete next.referralCode;
                      return next;
                    });
                  }}
                  type="text"
                  style={inputBase}
                  placeholder="Ej: BIENVENIDA2026"
                />
                {errors.referralCode ? <small style={{ color: ERROR_TEXT }}>{errors.referralCode}</small> : null}
              </label>

              <button
                type="submit"
                className="primary-cta"
                style={primaryButton}
              >
                Verificar
              </button>
              {errors.identityApi ? <small style={{ color: ERROR_TEXT }}>{errors.identityApi}</small> : null}
            </form>
          )}

          {stage === "nosis" && (
            <div style={{ textAlign: "center", padding: "30px 16px", ...panelBase }}>
              <h2 className="font-display" style={{ marginTop: 0, fontSize: 34 }}>Consultando</h2>
              <p style={{ marginBottom: 12, color: "rgba(255,255,255,0.78)" }}>Validando identidad</p>
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
          )}

          {stage === "ineligible" && (
            <div
              style={{
                ...panelBase,
                border: "1px solid rgba(255,145,145,0.42)",
                background: "rgba(99, 15, 15, 0.54)",
                padding: 18,
                textAlign: "center",
              }}
            >
              <h2 className="font-display" style={{ marginTop: 0, fontSize: 32 }}>No elegible</h2>
              <p style={{ marginBottom: 18 }}>
                Los datos de la persona no cumplen para inscribirse en la plataforma.
              </p>
              <button
                type="button"
                onClick={restartFlow}
                style={secondaryButton}
              >
                Volver a iniciar
              </button>
            </div>
          )}

          {stage === "prefill" && nosis && (
            <div style={{ display: "grid", gap: 14 }}>
              <h2 className="font-display" style={{ margin: 0, fontSize: 34 }}>Confirmar datos</h2>
              <div
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(150, 176, 224, 0.34)",
                  background: "rgba(255,255,255,0.06)",
                  padding: 14,
                  display: "grid",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gap: 10,
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  }}
                >
                  <ReadonlyField label="Nombre" value={nosis.nombre} />
                  <ReadonlyField label="Apellido" value={nosis.apellido} />
                  <ReadonlyField label="Fecha nacimiento" value={nosis.fechaNacimiento} />
                  <ReadonlyField label="DNI" value={nosis.dni} />
                  <ReadonlyField label="CUIL/CUIT" value={nosis.cuil} />
                  <ReadonlyField label="Género" value={nosis.genero} />
                </div>
              </div>

              <div
                style={{
                  ...panelBase,
                  padding: 14,
                  display: "grid",
                  gap: 10,
                  border: "1px solid rgba(236, 106, 106, 0.34)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gap: 10,
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  }}
                >
                  <EditablePrefillField
                    label="Dirección"
                    value={profile.direccion}
                    placeholder="Ej: Av. Lopez 143"
                    error={errors.direccion}
                    onChange={(value) => {
                      setProfile((prev) => ({ ...prev, direccion: value }));
                      setErrors((prev) => {
                        if (!prev.direccion) return prev;
                        const next = { ...prev };
                        delete next.direccion;
                        return next;
                      });
                    }}
                  />
                  <EditablePrefillField
                    label="Ciudad"
                    value={profile.ciudad}
                    placeholder="Ej: La Plata"
                    error={errors.ciudad}
                    onChange={(value) => {
                      setProfile((prev) => ({ ...prev, ciudad: value }));
                      setErrors((prev) => {
                        if (!prev.ciudad) return prev;
                        const next = { ...prev };
                        delete next.ciudad;
                        return next;
                      });
                    }}
                  />
                  <EditablePrefillField
                    label="Provincia"
                    value={profile.provincia}
                    placeholder="Ej: Buenos Aires"
                    error={errors.provincia}
                    onChange={(value) => {
                      setProfile((prev) => ({ ...prev, provincia: value }));
                      setErrors((prev) => {
                        if (!prev.provincia) return prev;
                        const next = { ...prev };
                        delete next.provincia;
                        return next;
                      });
                    }}
                  />
                  <div style={{ display: "grid", gap: 8 }}>
                    <fieldset
                      style={{
                        margin: 0,
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: errors.pep ? "1px solid rgba(255, 110, 110, 0.85)" : "1px solid rgba(236, 106, 106, 0.45)",
                        display: "grid",
                        gap: 8,
                        width: "100%",
                        maxWidth: 240,
                      }}
                    >
                      <legend style={{ padding: "0 6px", fontSize: 14 }}>
                        Persona Expuesta Politicamente (PEP)
                      </legend>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <label
                          className={`pep-radio-chip ${profile.pep === "Si" ? "pep-radio-chip-active" : ""}`}
                          style={{ cursor: "pointer" }}
                        >
                          <input
                            className="pep-radio-input"
                            type="radio"
                            name="pep"
                            value="Si"
                            checked={profile.pep === "Si"}
                            onChange={(e) => {
                              setProfile((prev) => ({ ...prev, pep: e.target.value as ProfileForm["pep"] }));
                              setErrors((prev) => {
                                if (!prev.pep) return prev;
                                const next = { ...prev };
                                delete next.pep;
                                return next;
                              });
                            }}
                          />
                          <span>Si</span>
                        </label>
                        <label
                          className={`pep-radio-chip ${profile.pep === "No" ? "pep-radio-chip-active" : ""}`}
                          style={{ cursor: "pointer" }}
                        >
                          <input
                            className="pep-radio-input"
                            type="radio"
                            name="pep"
                            value="No"
                            checked={profile.pep === "No"}
                            onChange={(e) => {
                              setProfile((prev) => ({ ...prev, pep: e.target.value as ProfileForm["pep"] }));
                              setErrors((prev) => {
                                if (!prev.pep) return prev;
                                const next = { ...prev };
                                delete next.pep;
                                return next;
                              });
                            }}
                          />
                          <span>No</span>
                        </label>
                      </div>
                      {errors.pep ? <small style={{ color: ERROR_TEXT }}>{errors.pep}</small> : null}
                    </fieldset>
                  </div>
                </div>
              </div>

              <div
                style={{
                  ...panelBase,
                  padding: 14,
                  display: "grid",
                  gap: 10,
                  border: "1px solid rgba(236, 106, 106, 0.34)",
                }}
              >
                <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                  <label style={{ display: "grid", gap: 8 }}>
                    <span>Estado civil</span>
                    <select
                      value={profile.estadoCivil}
                      onChange={(e) => {
                        setProfile((prev) => ({ ...prev, estadoCivil: e.target.value as ProfileForm["estadoCivil"] }));
                        setErrors((prev) => {
                          if (!prev.estadoCivil) return prev;
                          const next = { ...prev };
                          delete next.estadoCivil;
                          return next;
                        });
                      }}
                      style={{ ...selectBase, border: "1px solid rgba(236, 106, 106, 0.45)" }}
                    >
                      <option value="" style={{ color: "#111", background: "#fff" }}>Seleccionar</option>
                      <option value="Casado" style={{ color: "#111", background: "#fff" }}>Casado</option>
                      <option value="Soltero" style={{ color: "#111", background: "#fff" }}>Soltero</option>
                      <option value="Viudo" style={{ color: "#111", background: "#fff" }}>Viudo</option>
                      <option value="Union Civil" style={{ color: "#111", background: "#fff" }}>Union Civil</option>
                    </select>
                    {errors.estadoCivil ? <small style={{ color: ERROR_TEXT }}>{errors.estadoCivil}</small> : null}
                  </label>
                  <label style={{ display: "grid", gap: 8 }}>
                    <span>Ocupacion</span>
                    <select
                      value={profile.ocupacion}
                      onChange={(e) => {
                        setProfile((prev) => ({ ...prev, ocupacion: e.target.value as ProfileForm["ocupacion"] }));
                        setErrors((prev) => {
                          if (!prev.ocupacion) return prev;
                          const next = { ...prev };
                          delete next.ocupacion;
                          return next;
                        });
                      }}
                      style={{ ...selectBase, border: "1px solid rgba(236, 106, 106, 0.45)" }}
                    >
                      <option value="" style={{ color: "#111", background: "#fff" }}>Seleccionar</option>
                      <option value="Industria" style={{ color: "#111", background: "#fff" }}>Industria</option>
                      <option value="Comercio" style={{ color: "#111", background: "#fff" }}>Comercio</option>
                      <option value="Profesional" style={{ color: "#111", background: "#fff" }}>Profesional</option>
                    </select>
                    {errors.ocupacion ? <small style={{ color: ERROR_TEXT }}>{errors.ocupacion}</small> : null}
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePrefillContinue}
                className="primary-cta"
                style={primaryButton}
              >
                Continuar con datos de contacto
              </button>
              {errors.confirmationApi ? <small style={{ color: ERROR_TEXT }}>{errors.confirmationApi}</small> : null}
            </div>
          )}

          {stage === "contact" && (
            <form onSubmit={handleContactSubmit} style={{ display: "grid", gap: 14, ...panelBase }}>
              <label style={{ display: "grid", gap: 8 }}>
                <span>Contraseña</span>
                <input
                  value={contact.password}
                  onChange={(e) => {
                    const nextPassword = e.target.value;
                    setContact((prev) => ({ ...prev, password: nextPassword }));
                    setErrors((prev) => {
                      if (!prev.password && !prev.confirmPassword) return prev;
                      const next = { ...prev };
                      delete next.password;
                      delete next.confirmPassword;
                      return next;
                    });
                  }}
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
                    { ok: contact.password.length > 0, text: "Este campo es obligatorio" },
                    { ok: /\d/.test(contact.password), text: "Al menos un dígito" },
                    { ok: !/\s/.test(contact.password), text: "Sin espacios" },
                    { ok: /^[\x00-\x7F]*$/.test(contact.password), text: "Solo caracteres en inglés" },
                    { ok: contact.password.length >= 6, text: "Longitud mínima 6" },
                    { ok: contact.password.length <= 50, text: "Longitud máxima 50" },
                    { ok: /[A-Z]/.test(contact.password) && /[a-z]/.test(contact.password), text: "Mayúsculas y minúsculas" },
                  ].map((rule) => (
                    <div key={rule.text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: rule.ok ? "#d8ffe6" : "rgba(255,255,255,0.8)" }}>
                      <span style={{ color: rule.ok ? "#1dd05d" : "rgba(255,255,255,0.45)", fontWeight: 700 }}>{rule.ok ? "✓" : "•"}</span>
                      <span>{rule.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <label style={{ display: "grid", gap: 8 }}>
                <span>Confirmar contraseña</span>
                <input
                  value={contact.confirmPassword}
                  onChange={(e) => {
                    setContact((prev) => ({ ...prev, confirmPassword: e.target.value }));
                    setErrors((prev) => {
                      if (!prev.confirmPassword) return prev;
                      const next = { ...prev };
                      delete next.confirmPassword;
                      return next;
                    });
                  }}
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

              <button
                type="submit"
                className="primary-cta"
                style={primaryButton}
              >
                Completar registro
              </button>
              {errors.accountApi ? <small style={{ color: ERROR_TEXT }}>{errors.accountApi}</small> : null}
            </form>
          )}

          {stage === "creating" && (
            <div style={{ textAlign: "center", padding: "30px 16px", ...panelBase }}>
              <h2 className="font-display" style={{ marginTop: 0, fontSize: 34 }}>Creando tu cuenta</h2>
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
              <p style={{ marginTop: 14, marginBottom: 0, color: "rgba(255,255,255,0.66)", fontSize: 13 }}>
                Esto puede demorar unos segundos.
              </p>
            </div>
          )}

          {stage === "complete" && (
            <div
              style={{
                ...panelBase,
                border: "1px solid rgba(145,255,173,0.42)",
                background: "linear-gradient(165deg, rgba(19, 116, 56, 0.44) 0%, rgba(11, 62, 31, 0.46) 100%)",
                padding: 22,
                textAlign: "center",
              }}
            >
              <div
                style={{
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
                }}
              >
                {"\u2713"}
              </div>
              <h2 className="font-display" style={{ marginTop: 0, marginBottom: 8, fontSize: 36 }}>
                Registro completado
              </h2>
              <p style={{ marginTop: 0, marginBottom: 4, color: "rgba(255,255,255,0.94)" }}>
                Tu cuenta de BetPoncho ya esta activa.
              </p>
              <p style={{ marginTop: 0, marginBottom: 18, color: "rgba(255,255,255,0.72)", fontSize: 14 }}>
                Ya podes ingresar y comenzar a jugar.
              </p>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "https://betponcho.bet.ar/";
                }}
                style={secondaryButton}
              >
                Ir a BetPoncho
              </button>
            </div>
          )}
          </div>
        </div>
      </section>
      {legalModal ? (
        <LegalModal
          title={legalModal === "privacy" ? "Política de Privacidad" : "Términos y Condiciones generales"}
          content={legalModal === "privacy" ? PRIVACY_POLICY_TEXT : TERMS_AND_CONDITIONS_TEXT}
          onClose={() => setLegalModal(null)}
        />
      ) : null}
      {provinceNotSaltaModalMessage ? (
        <ProvinceNotSaltaModal
          message={provinceNotSaltaModalMessage}
          onBackToStart={restartFlow}
        />
      ) : null}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gap: 4, opacity: 0.86 }}>
      <small
        style={{
          opacity: 0.72,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          fontSize: 11,
          color: "rgba(228, 234, 245, 0.72)",
        }}
      >
        {label}
      </small>
      <div
        aria-readonly="true"
        style={{
          borderRadius: 12,
          border: "1px solid rgba(150, 176, 224, 0.34)",
          background: "linear-gradient(165deg, rgba(68, 78, 98, 0.42) 0%, rgba(45, 54, 72, 0.45) 100%)",
          minHeight: 44,
          display: "grid",
          alignItems: "center",
          padding: "0 12px",
          color: "rgba(232, 236, 244, 0.78)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          cursor: "not-allowed",
          userSelect: "none",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function EditablePrefillField({
  label,
  value,
  placeholder,
  error,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={{ display: "grid", gap: 4, opacity: 0.96 }}>
      <small
        style={{
          opacity: 0.72,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          fontSize: 11,
          color: "rgba(228, 234, 245, 0.72)",
        }}
      >
        {label}
      </small>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="text"
        placeholder={placeholder}
        style={{
          borderRadius: 12,
          border: error ? "1px solid rgba(255, 110, 110, 0.85)" : "1px solid rgba(236, 106, 106, 0.45)",
          background: "linear-gradient(165deg, rgba(82, 90, 108, 0.42) 0%, rgba(56, 63, 78, 0.45) 100%)",
          minHeight: 44,
          padding: "0 12px",
          color: "rgba(232, 236, 244, 0.94)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          outline: "none",
          fontSize: 16,
          width: "100%",
        }}
      />
      {error ? <small style={{ color: ERROR_TEXT }}>{error}</small> : null}
    </label>
  );
}

function ProvinceNotSaltaModal({ message, onBackToStart }: { message: string; onBackToStart: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Registro no disponible"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1001,
        background: "rgba(6, 6, 10, 0.46)",
        paddingTop: "max(14px, calc(env(safe-area-inset-top) + 10px))",
        paddingRight: "max(12px, calc(env(safe-area-inset-right) + 8px))",
        paddingBottom: "max(20px, calc(env(safe-area-inset-bottom) + 16px))",
        paddingLeft: "max(12px, calc(env(safe-area-inset-left) + 8px))",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: "min(540px, 100%)",
          borderRadius: 18,
          border: "1px solid rgba(255, 117, 117, 0.34)",
          background: "linear-gradient(165deg, rgba(18, 24, 40, 0.95) 0%, rgba(12, 16, 30, 0.97) 100%)",
          boxShadow: "0 30px 50px -30px rgba(0,0,0,0.9)",
          padding: "22px 20px",
          display: "grid",
          gap: 12,
          justifyItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            border: "1px solid rgba(255, 160, 160, 0.45)",
            background: "rgba(152, 0, 0, 0.24)",
            color: "rgba(255, 218, 218, 0.98)",
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          !
        </div>
        <h3 className="font-display" style={{ margin: 0, fontSize: "clamp(24px, 5vw, 30px)" }}>
          Registro no disponible
        </h3>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.88)", lineHeight: 1.5, maxWidth: 440 }}>
          {message.includes("PROVINCE_NOT_SALTA")
            ? "Solo se permiten registros con domicilio en la provincia de Salta."
            : message}
        </p>
        <div style={{ marginTop: 4 }}>
          <button type="button" onClick={onBackToStart} style={{ ...secondaryButton, minWidth: 180, justifyContent: "center" }}>
            Volver a inicio
          </button>
        </div>
      </div>
    </div>
  );
}

function LegalModal({ title, content, onClose }: { title: string; content: string; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(6, 6, 10, 0.72)",
        paddingTop: "max(14px, calc(env(safe-area-inset-top) + 10px))",
        paddingRight: "max(12px, calc(env(safe-area-inset-right) + 8px))",
        paddingBottom: "max(20px, calc(env(safe-area-inset-bottom) + 16px))",
        paddingLeft: "max(12px, calc(env(safe-area-inset-left) + 8px))",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(880px, 100%)",
          maxHeight: "88dvh",
          borderRadius: 18,
          border: "1px solid rgba(255, 117, 117, 0.34)",
          background: "linear-gradient(165deg, rgba(13, 17, 30, 0.98) 0%, rgba(10, 12, 22, 0.99) 100%)",
          boxShadow: "0 30px 50px -30px rgba(0,0,0,0.9)",
          overflow: "hidden",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <div style={{ padding: "16px 16px 0" }}>
          <h3 className="font-display" style={{ margin: 0, fontSize: "clamp(24px, 5vw, 30px)" }}>
            {title}
          </h3>
        </div>
        <div
          style={{
            padding: "14px 16px 8px",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.9)",
            fontSize: 14,
          }}
        >
          {content}
        </div>
        <div style={{ padding: 16 }}>
          <button type="button" onClick={onClose} style={{ ...secondaryButton, minWidth: 120, justifyContent: "center" }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;










