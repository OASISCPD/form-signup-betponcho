import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "react-phone-input-2/lib/style.css";
import {
  APP_SURFACE,
  PANEL_BORDER,
  PRIVACY_POLICY_TEXT,
  TERMS_AND_CONDITIONS_TEXT,
} from "./app/constants";
import {
  RegistrationDraft,
  Stage,
  UtmPayload,
} from "./app/types";
import { useFlowState } from "./app/useFlowState";
import {
  createRegistrationSession,
  getRegistrationDraft,
  parseAddress,
  patchRegistrationStep,
} from "./app/registrationApi";
import {
  buildIdentityPatchPayload,
  buildNosisFromDraft,
  fromCivilStatusApi,
  toCivilStatusApi,
  validateContactForm,
  validateIdentityForm,
  validatePrefillForm,
} from "./app/formRules";
import { LegalModal } from "./components/modals/LegalModal";
import { ManualPrefillModal } from "./components/modals/ManualPrefillModal";
import { ReviewPendingModal } from "./components/modals/ReviewPendingModal";
import { ContactStep } from "./components/steps/ContactStep";
import { FlowHeader } from "./components/steps/FlowHeader";
import { IdentityStep } from "./components/steps/IdentityStep";
import { PrefillStep } from "./components/steps/PrefillStep";
import {
  CompleteStep,
  CreatingStep,
  IneligibleStep,
  NosisStep,
} from "./components/steps/StatusSteps";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const appMainShellStyle: React.CSSProperties = {
  minHeight: "100dvh",
  paddingTop: "max(14px, calc(env(safe-area-inset-top) + 10px))",
  paddingRight: "max(12px, calc(env(safe-area-inset-right) + 8px))",
  paddingBottom: "max(20px, calc(env(safe-area-inset-bottom) + 16px))",
  paddingLeft: "max(12px, calc(env(safe-area-inset-left) + 8px))",
};

const appCardStyle: React.CSSProperties = {
  margin: "0 auto",
  background: APP_SURFACE,
  border: PANEL_BORDER,
  borderRadius: "clamp(18px, 3.8vw, 28px)",
  boxShadow: "0 28px 56px -34px rgba(0,0,0,0.95)",
  backdropFilter: "blur(8px)",
  overflow: "hidden",
};

function useRegistrationFlowScreen() {
  const sessionIdFromUrl =
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("sessionId") ?? "")
      : "";
  const {
    state,
    dispatch,
    setStage,
    setRegistrationSessionId,
    setIsCreatingSession,
    setIdentity,
    setContact,
    setProfile,
    setErrors,
    setNosis,
    setLegalModal,
  } = useFlowState(sessionIdFromUrl);
  const {
    stage,
    registrationSessionId,
    isCreatingSession,
    identity,
    contact,
    profile,
    errors,
    nosis,
    legalModal,
  } = state;
  const nosisRequestId = useRef(0);
  const completionRequestId = useRef(0);
  const flowStartedAtRef = useRef<number | null>(null);
  const hasStartedFlowRef = useRef(false);
  const hasTrackedLandingRef = useRef(false);
  const hasTrackedCompletionRef = useRef(false);
  const hasTrackedIneligibleRef = useRef(false);
  const hasTrackedAbandonRef = useRef(false);
  const lastTrackedStageRef = useRef<Stage | null>(null);
  const [showReviewPendingModal, setShowReviewPendingModal] = useState(false);
  const [showManualPrefillModal, setShowManualPrefillModal] = useState(false);
  const [isSubmittingIdentity, setIsSubmittingIdentity] = useState(false);
  const [isSubmittingPrefill, setIsSubmittingPrefill] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const showUnifiedFirstScreen = stage === "welcome" || stage === "identity";
  const showBrandedScreen =
    showUnifiedFirstScreen ||
    stage === "nosis" ||
    stage === "prefill" ||
    stage === "contact";

  const step = useMemo(() => {
    if (stage === "welcome") return 0;
    if (stage === "identity" || stage === "nosis") return 1;
    if (stage === "prefill") return 2;
    if (stage === "contact" || stage === "creating" || stage === "complete")
      return 3;
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
      if (typeof window === "undefined" || typeof window.gtag !== "function")
        return;
      const merged = {
        ...utmPayload,
        registration_session_id: registrationSessionId || undefined,
        ...params,
      };
      const cleanParams = Object.fromEntries(
        Object.entries(merged).filter(
          ([, value]) => value !== undefined && value !== null && value !== "",
        ),
      );
      window.gtag("event", eventName, cleanParams);
    },
    [registrationSessionId, utmPayload],
  );

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
      });
    }
  }, [stage, step, trackEvent]);

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
    const nextErrors = validateIdentityForm(identity, contact.referralCode);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleOpenLegalModal = useCallback(
    (type: "privacy" | "terms") => {
      setLegalModal((current) => (current === type ? current : type));
    },
    [setLegalModal],
  );

  const isDuplicateDniRegistrationError = (error: unknown) => {
    const message =
      error instanceof Error ? error.message : String(error ?? "");
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code?: unknown }).code ?? "")
        : "";

    return (
      code === "409" ||
      message.includes("(409)") ||
      /dni ya complet[oó] su proceso de registro/i.test(message)
    );
  };

  const applyDraftToState = (draft: RegistrationDraft) => {
    const sessionId = draft.sessionId ?? "";
    if (sessionId) {
      setRegistrationSessionId(sessionId);
    }

    const genero =
      draft.gender === "M" || draft.gender === "F" ? draft.gender : "";
    const referredCode = draft.referredCode ?? draft.promotionalCode ?? "";
    const direccionCompuesta = [draft.addressStreet, draft.addressNumber]
      .filter(Boolean)
      .join(" ")
      .trim();
    const direccionCompuestaLocal = [
      draft.addressStreetLocal,
      draft.addressNumberLocal,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

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
      firstName: draft.firstName ?? prev.firstName,
      lastName: draft.lastName ?? prev.lastName,
      birthDate: draft.birthDate ? draft.birthDate.split("T")[0] : prev.birthDate,
      dni: draft.dni ?? prev.dni,
      cuil: draft.cuil ?? prev.cuil,
      gender: genero || prev.gender,
      provincia: draft.provinceLocal ?? draft.province ?? prev.provincia,
      ciudad: draft.cityLocal ?? draft.city ?? prev.ciudad,
      direccion: direccionCompuestaLocal || direccionCompuesta || prev.direccion,
      pep: draft.pepDeclared ? "Si" : "No",
      estadoCivil: draft.civilStatus
        ? fromCivilStatusApi(draft.civilStatus)
        : prev.estadoCivil,
      ocupacion:
        draft.occupation === "Industria" ||
        draft.occupation === "Comercio" ||
        draft.occupation === "Profesional"
          ? draft.occupation
          : prev.ocupacion,
    }));

    const nosisFromDraft = buildNosisFromDraft(draft, genero);
    if (nosisFromDraft) {
      setNosis(nosisFromDraft);
    } else {
      setNosis(null);
    }

    const isPendingReviewDraft =
      draft.isEligible === false || Boolean(draft.ineligibleReason?.trim());
    setShowReviewPendingModal(isPendingReviewDraft);

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
      dispatch({ type: "isCreatingSession", value: true });
      try {
        const draft = await getRegistrationDraft(sessionIdFromUrl);
        if (cancelled) return;
        applyDraftToState(draft);
      } catch (error) {
        if (cancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "No se pudo cargar la sesion de registro.";
        dispatch({
          type: "errors",
          value: (previous) => ({
            ...previous,
            registrationSession: message,
          }),
        });
      } finally {
        if (!cancelled) {
          dispatch({ type: "isCreatingSession", value: false });
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
    if (isSubmittingIdentity) return;
    if (!validateIdentity()) return;

    if (!registrationSessionId) {
      setErrors((prev) => ({
        ...prev,
        identityApi: "No hay sessionId activo para guardar identidad.",
      }));
      return;
    }

    const identityPayload = buildIdentityPatchPayload(
      identity,
      contact.referralCode,
    );
    if (Object.keys(identityPayload).length === 0) {
      setErrors((prev) => ({
        ...prev,
        identityApi: "No hay datos de identidad para guardar.",
      }));
      return;
    }

    setIsSubmittingIdentity(true);
    try {
      let draftAfterIdentity: RegistrationDraft | undefined;
      try {
        draftAfterIdentity = await patchRegistrationStep(
          registrationSessionId,
          "identity",
          identityPayload,
        );
      } catch (error) {
        if (isDuplicateDniRegistrationError(error)) {
          setErrors((prev) => {
            const next = { ...prev };
            delete next.identityApi;
            next.dni =
              "Este DNI ya tiene un registro finalizado. Si necesitás ayuda, contactate con soporte.";
            return next;
          });
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "No se pudo guardar identidad.";
        setErrors((prev) => ({ ...prev, identityApi: message }));
        return;
      }

      nosisRequestId.current += 1;
      const currentRequestId = nosisRequestId.current;
      setStage("nosis");
      setErrors({});

      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (nosisRequestId.current !== currentRequestId) return;

      const safeFallbackGender: "" | "M" | "F" =
        identity.genero === "M" || identity.genero === "F" ? identity.genero : "";
      const nosisFromIdentity = draftAfterIdentity
        ? buildNosisFromDraft(draftAfterIdentity, safeFallbackGender)
        : null;
      if (nosisFromIdentity) {
        setNosis(nosisFromIdentity);
        setProfile((prev) => ({
          ...prev,
          firstName: nosisFromIdentity.nombre,
          lastName: nosisFromIdentity.apellido,
          birthDate: nosisFromIdentity.fechaNacimiento,
          dni: nosisFromIdentity.dni,
          cuil: nosisFromIdentity.cuil.replace(/\D/g, ""),
          gender: nosisFromIdentity.genero === "Masculino" ? "M" : "F",
          provincia: nosisFromIdentity.provincia,
          ciudad: nosisFromIdentity.ciudad,
          direccion: nosisFromIdentity.direccion,
          pep: draftAfterIdentity?.pepDeclared ? "Si" : "No",
        }));
        setStage("prefill");
        return;
      }

      const direccionCompuesta = [
        draftAfterIdentity?.addressStreetLocal ?? draftAfterIdentity?.addressStreet,
        draftAfterIdentity?.addressNumberLocal ?? draftAfterIdentity?.addressNumber,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();
      setNosis(null);
      setProfile((prev) => ({
        ...prev,
        firstName: draftAfterIdentity?.firstName ?? prev.firstName,
        lastName: draftAfterIdentity?.lastName ?? prev.lastName,
        birthDate: draftAfterIdentity?.birthDate
          ? draftAfterIdentity.birthDate.split("T")[0]
          : prev.birthDate,
        dni: draftAfterIdentity?.dni ?? (identity.dni.trim() || prev.dni),
        cuil: draftAfterIdentity?.cuil ?? prev.cuil,
        gender:
          (draftAfterIdentity?.gender === "M" || draftAfterIdentity?.gender === "F"
            ? draftAfterIdentity.gender
            : identity.genero === "M" || identity.genero === "F"
              ? identity.genero
              : prev.gender),
        provincia:
          draftAfterIdentity?.provinceLocal ??
          draftAfterIdentity?.province ??
          prev.provincia,
        ciudad: draftAfterIdentity?.cityLocal ?? draftAfterIdentity?.city ?? prev.ciudad,
        direccion: direccionCompuesta || prev.direccion,
        pep: draftAfterIdentity?.pepDeclared ? "Si" : "No",
      }));
      setShowManualPrefillModal(true);
      setStage("prefill");
    } finally {
      setIsSubmittingIdentity(false);
    }
  };

  const startRegistrationSession = useCallback(async () => {
    if (isCreatingSession) return;
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
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo iniciar la sesion de registro.";
      setErrors((prev) => ({
        ...prev,
        registrationSession: message,
      }));
    } finally {
      setIsCreatingSession(false);
    }
  }, [isCreatingSession, setErrors, setIsCreatingSession, setRegistrationSessionId, setStage]);

  const handleStartRegistration = useCallback(() => {
    trackEvent("form_start_click", { stage, step_index: step });
    void startRegistrationSession();
  }, [stage, step, startRegistrationSession, trackEvent]);

  useEffect(() => {
    if (sessionIdFromUrl) return;
    if (stage !== "welcome") return;
    if (isCreatingSession) return;
    if (registrationSessionId) return;
    if (errors.registrationSession) return;
    void startRegistrationSession();
  }, [
    errors.registrationSession,
    isCreatingSession,
    registrationSessionId,
    sessionIdFromUrl,
    stage,
    startRegistrationSession,
  ]);

  const validateContact = () => {
    const nextErrors = validateContactForm(contact);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmittingContact) return;
    if (!validateContact()) return;
    if (!registrationSessionId) {
      setErrors((prev) => ({
        ...prev,
        accountApi: "No hay sessionId activo para guardar la cuenta.",
      }));
      return;
    }

    setIsSubmittingContact(true);
    try {
      let draftAfterAccount: RegistrationDraft | undefined;
      try {
        draftAfterAccount = await patchRegistrationStep(
          registrationSessionId,
          "account",
          {
            password: contact.password,
            dni: identity.dni.trim(),
          },
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No se pudo guardar la cuenta.";
        setErrors((prev) => ({ ...prev, accountApi: message }));
        return;
      }

      const isPendingReview =
        draftAfterAccount?.isEligible === false ||
        Boolean(draftAfterAccount?.ineligibleReason?.trim());
      if (isPendingReview) {
        setErrors({});
        setShowReviewPendingModal(true);
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
      console.log(
        "Payload de registro:\n" + JSON.stringify(registrationPayload, null, 2),
      );
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handlePrefillContinue = async () => {
    if (isSubmittingPrefill) return;
    const requiresManualIdentityData = !nosis;
    const nextErrors = validatePrefillForm(profile, requiresManualIdentityData);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    if (!registrationSessionId) {
      setErrors((prev) => ({
        ...prev,
        confirmationApi: "Falta session activa para confirmar.",
      }));
      return;
    }

    const parsedAddress = parseAddress(profile.direccion);
    const parsedNosisAddress = parseAddress(nosis?.direccion ?? profile.direccion);
    const firstName = nosis ? nosis.nombre : profile.firstName.trim();
    const lastName = nosis ? nosis.apellido : profile.lastName.trim();
    const birthDate = nosis ? nosis.fechaNacimiento : profile.birthDate.trim();
    const cuil = (nosis ? nosis.cuil : profile.cuil).replace(/\D/g, "");
    const city = (nosis ? nosis.ciudad : profile.ciudad).trim();
    const province = (nosis ? nosis.provincia : profile.provincia).trim();

    setIsSubmittingPrefill(true);
    try {
      await patchRegistrationStep(registrationSessionId, "confirmation", {
        firstName,
        lastName,
        birthDate,
        cuil,
        addressStreet: parsedNosisAddress.addressStreet,
        addressNumber:
          parsedNosisAddress.addressNumber.replace(/\D/g, "") || "0",
        city,
        province,
        addressStreetLocal: parsedAddress.addressStreet,
        addressNumberLocal: parsedAddress.addressNumber.replace(/\D/g, "") || "0",
        cityLocal: profile.ciudad.trim(),
        provinceLocal: profile.provincia.trim(),
        postalCode: "0000",
        pepDeclared: profile.pep === "Si",
        civilStatus: toCivilStatusApi(profile.estadoCivil),
        occupation: profile.ocupacion,
      });
      setErrors({});
      setStage("contact");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo guardar la confirmacion.";
      setErrors((prev) => ({ ...prev, confirmationApi: message }));
    } finally {
      setIsSubmittingPrefill(false);
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
    setShowReviewPendingModal(false);
    setShowManualPrefillModal(false);
    setIsSubmittingIdentity(false);
    setIsSubmittingPrefill(false);
    setIsSubmittingContact(false);
    dispatch({ type: "resetFlow" });
  };

  const goBack = () => {
    nosisRequestId.current += 1;
    completionRequestId.current += 1;
    setErrors({});
    setShowReviewPendingModal(false);
    setShowManualPrefillModal(false);
    setIsSubmittingIdentity(false);
    setIsSubmittingPrefill(false);
    setIsSubmittingContact(false);

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
      style={
        showBrandedScreen
          ? {
              ...appMainShellStyle,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              background: "#000",
            }
          : appMainShellStyle
      }
    >
      <section
        style={{
          ...appCardStyle,
          maxWidth: showBrandedScreen ? 980 : 740,
          background: showBrandedScreen ? "#000" : appCardStyle.background,
          border: showBrandedScreen ? "none" : appCardStyle.border,
          borderRadius: showBrandedScreen ? 0 : appCardStyle.borderRadius,
          boxShadow: showBrandedScreen ? "none" : appCardStyle.boxShadow,
        }}
      >
        {!showBrandedScreen ? (
          <div
            style={{
              height: 3,
              background:
                "linear-gradient(90deg, rgba(255,120,120,0) 0%, rgba(255,120,120,0.9) 45%, rgba(255,120,120,0) 100%)",
            }}
          />
        ) : null}
        <div
          style={{
            padding: showBrandedScreen
              ? 0
              : "clamp(16px, 4vw, 26px) clamp(12px, 3vw, 18px) clamp(18px, 4vw, 24px)",
            maxWidth: showBrandedScreen ? 920 : 620,
            margin: "0 auto",
          }}
        >
          <div key={stage} className="stage-transition">
            {!showBrandedScreen ? (
              <FlowHeader stage={stage} step={step} onBack={goBack} />
            ) : null}

            {showUnifiedFirstScreen && (
              <IdentityStep
                identity={identity}
                referralCode={contact.referralCode}
                errors={errors}
                isSubmitting={isSubmittingIdentity}
                isBootstrapping={stage === "welcome" && isCreatingSession}
                registrationSessionError={errors.registrationSession}
                onRetrySessionStart={handleStartRegistration}
                onSubmit={handleIdentitySubmit}
                onIdentityChange={(nextIdentity) => setIdentity(nextIdentity)}
                onReferralCodeChange={(value) =>
                  setContact((prev) => ({ ...prev, referralCode: value }))
                }
                onOpenLegal={handleOpenLegalModal}
                onClearErrors={(...keys) =>
                  setErrors((prev) => {
                    let changed = false;
                    const next = { ...prev };
                    for (const key of keys) {
                      if (key in next) {
                        delete next[key];
                        changed = true;
                      }
                    }
                    return changed ? next : prev;
                  })
                }
              />
            )}

            {stage === "prefill" && (
              <PrefillStep
                nosis={nosis}
                profile={profile}
                errors={errors}
                isSubmitting={isSubmittingPrefill}
                onFirstNameChange={(value) => {
                  setProfile((prev) => ({ ...prev, firstName: value }));
                  setErrors((prev) => {
                    if (!prev.firstName) return prev;
                    const next = { ...prev };
                    delete next.firstName;
                    return next;
                  });
                }}
                onLastNameChange={(value) => {
                  setProfile((prev) => ({ ...prev, lastName: value }));
                  setErrors((prev) => {
                    if (!prev.lastName) return prev;
                    const next = { ...prev };
                    delete next.lastName;
                    return next;
                  });
                }}
                onBirthDateChange={(value) => {
                  setProfile((prev) => ({ ...prev, birthDate: value }));
                  setErrors((prev) => {
                    if (!prev.birthDate) return prev;
                    const next = { ...prev };
                    delete next.birthDate;
                    return next;
                  });
                }}
                onDniChange={(value) => {
                  setProfile((prev) => ({ ...prev, dni: value.replace(/\D/g, "") }));
                  setErrors((prev) => {
                    if (!prev.dni) return prev;
                    const next = { ...prev };
                    delete next.dni;
                    return next;
                  });
                }}
                onCuilChange={(value) => {
                  setProfile((prev) => ({ ...prev, cuil: value.replace(/\D/g, "") }));
                  setErrors((prev) => {
                    if (!prev.cuil) return prev;
                    const next = { ...prev };
                    delete next.cuil;
                    return next;
                  });
                }}
                onGenderChange={(value) => {
                  setProfile((prev) => ({ ...prev, gender: value }));
                  setErrors((prev) => {
                    if (!prev.gender) return prev;
                    const next = { ...prev };
                    delete next.gender;
                    return next;
                  });
                }}
                onDireccionChange={(value) => {
                  setProfile((prev) => ({ ...prev, direccion: value }));
                  setErrors((prev) => {
                    if (!prev.direccion) return prev;
                    const next = { ...prev };
                    delete next.direccion;
                    return next;
                  });
                }}
                onCiudadChange={(value) => {
                  setProfile((prev) => ({ ...prev, ciudad: value }));
                  setErrors((prev) => {
                    if (!prev.ciudad) return prev;
                    const next = { ...prev };
                    delete next.ciudad;
                    return next;
                  });
                }}
                onProvinciaChange={(value) => {
                  setProfile((prev) => ({ ...prev, provincia: value }));
                  setErrors((prev) => {
                    if (!prev.provincia) return prev;
                    const next = { ...prev };
                    delete next.provincia;
                    return next;
                  });
                }}
                onPepChange={(value) => {
                  setProfile((prev) => ({ ...prev, pep: value }));
                  setErrors((prev) => {
                    if (!prev.pep) return prev;
                    const next = { ...prev };
                    delete next.pep;
                    return next;
                  });
                }}
                onEstadoCivilChange={(value) => {
                  setProfile((prev) => ({ ...prev, estadoCivil: value }));
                  setErrors((prev) => {
                    if (!prev.estadoCivil) return prev;
                    const next = { ...prev };
                    delete next.estadoCivil;
                    return next;
                  });
                }}
                onOcupacionChange={(value) => {
                  setProfile((prev) => ({ ...prev, ocupacion: value }));
                  setErrors((prev) => {
                    if (!prev.ocupacion) return prev;
                    const next = { ...prev };
                    delete next.ocupacion;
                    return next;
                  });
                }}
                onContinue={handlePrefillContinue}
                onBack={goBack}
              />
            )}

            {stage === "contact" && (
              <ContactStep
                contact={contact}
                errors={errors}
                isSubmitting={isSubmittingContact}
                onSubmit={handleContactSubmit}
                onPasswordChange={(value) => {
                  setContact((prev) => ({
                    ...prev,
                    password: value,
                  }));
                  setErrors((prev) => {
                    if (!prev.password && !prev.confirmPassword) return prev;
                    const next = { ...prev };
                    delete next.password;
                    delete next.confirmPassword;
                    return next;
                  });
                }}
                onConfirmPasswordChange={(value) => {
                  setContact((prev) => ({
                    ...prev,
                    confirmPassword: value,
                  }));
                  setErrors((prev) => {
                    if (!prev.confirmPassword) return prev;
                    const next = { ...prev };
                    delete next.confirmPassword;
                    return next;
                  });
                }}
                onBack={goBack}
              />
            )}

            {stage === "nosis" && <NosisStep onBack={goBack} />}

            {stage === "ineligible" && <IneligibleStep onRestart={restartFlow} />}

            {stage === "creating" && <CreatingStep />}

            {stage === "complete" && <CompleteStep />}
          </div>
        </div>
      </section>
      {legalModal ? (
        <LegalModal
          title={
            legalModal === "privacy"
              ? "Política de Privacidad"
              : "Términos y Condiciones generales"
          }
          content={
            legalModal === "privacy"
              ? PRIVACY_POLICY_TEXT
              : TERMS_AND_CONDITIONS_TEXT
          }
          onClose={() => setLegalModal(null)}
        />
      ) : null}
      {showReviewPendingModal ? (
        <ReviewPendingModal
          onProceed={() => {
            trackEvent("review_pending_redirect", { stage, step_index: step });
            window.location.assign("https://betponcho.bet.ar/");
          }}
        />
      ) : null}
      {showManualPrefillModal ? (
        <ManualPrefillModal onClose={() => setShowManualPrefillModal(false)} />
      ) : null}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}

function App() {
  return useRegistrationFlowScreen();
}

export default App;
