import { useCallback, useReducer } from "react";
import type {
  ContactForm,
  IdentityForm,
  LegalModalType,
  NosisData,
  ProfileForm,
  Stage,
} from "./types";

type Updater<T> = T | ((previous: T) => T);

type AppState = {
  stage: Stage;
  registrationSessionId: string;
  isCreatingSession: boolean;
  identity: IdentityForm;
  contact: ContactForm;
  profile: ProfileForm;
  errors: Record<string, string>;
  nosis: NosisData | null;
  legalModal: LegalModalType | null;
  provinceNotSaltaModalMessage: string;
};

type AppAction =
  | { type: "stage"; value: Updater<Stage> }
  | { type: "registrationSessionId"; value: Updater<string> }
  | { type: "isCreatingSession"; value: Updater<boolean> }
  | { type: "identity"; value: Updater<IdentityForm> }
  | { type: "contact"; value: Updater<ContactForm> }
  | { type: "profile"; value: Updater<ProfileForm> }
  | { type: "errors"; value: Updater<Record<string, string>> }
  | { type: "nosis"; value: Updater<NosisData | null> }
  | { type: "legalModal"; value: Updater<LegalModalType | null> }
  | { type: "provinceNotSaltaModalMessage"; value: Updater<string> }
  | { type: "resetFlow" };

const EMPTY_IDENTITY: IdentityForm = {
  dni: "",
  genero: "",
  email: "",
  confirmEmail: "",
  telefono: "",
  acceptedLegal: false,
};

const EMPTY_CONTACT: ContactForm = {
  password: "",
  confirmPassword: "",
  referralCode: "",
};

const EMPTY_PROFILE: ProfileForm = {
  firstName: "",
  lastName: "",
  birthDate: "",
  dni: "",
  cuil: "",
  gender: "",
  estadoCivil: "",
  ocupacion: "",
  pep: "",
  provincia: "",
  ciudad: "",
  direccion: "",
};

function applyUpdate<T>(previous: T, value: Updater<T>): T {
  return typeof value === "function"
    ? (value as (previous: T) => T)(previous)
    : value;
}

function createInitialState(sessionIdFromUrl: string): AppState {
  return {
    stage: "welcome",
    registrationSessionId: sessionIdFromUrl,
    isCreatingSession: false,
    identity: { ...EMPTY_IDENTITY },
    contact: { ...EMPTY_CONTACT },
    profile: { ...EMPTY_PROFILE },
    errors: {},
    nosis: null,
    legalModal: null,
    provinceNotSaltaModalMessage: "",
  };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "stage":
      return { ...state, stage: applyUpdate(state.stage, action.value) };
    case "registrationSessionId":
      return {
        ...state,
        registrationSessionId: applyUpdate(
          state.registrationSessionId,
          action.value,
        ),
      };
    case "isCreatingSession":
      return {
        ...state,
        isCreatingSession: applyUpdate(state.isCreatingSession, action.value),
      };
    case "identity":
      return { ...state, identity: applyUpdate(state.identity, action.value) };
    case "contact":
      return { ...state, contact: applyUpdate(state.contact, action.value) };
    case "profile":
      return { ...state, profile: applyUpdate(state.profile, action.value) };
    case "errors":
      return { ...state, errors: applyUpdate(state.errors, action.value) };
    case "nosis":
      return { ...state, nosis: applyUpdate(state.nosis, action.value) };
    case "legalModal":
      return {
        ...state,
        legalModal: applyUpdate(state.legalModal, action.value),
      };
    case "provinceNotSaltaModalMessage":
      return {
        ...state,
        provinceNotSaltaModalMessage: applyUpdate(
          state.provinceNotSaltaModalMessage,
          action.value,
        ),
      };
    case "resetFlow":
      return createInitialState("");
    default:
      return state;
  }
}

export function useFlowState(sessionIdFromUrl: string) {
  const [state, dispatch] = useReducer(
    appReducer,
    sessionIdFromUrl,
    createInitialState,
  );
  const setStage = useCallback((value: Updater<Stage>) => {
    dispatch({ type: "stage", value });
  }, []);
  const setRegistrationSessionId = useCallback((value: Updater<string>) => {
    dispatch({ type: "registrationSessionId", value });
  }, []);
  const setIsCreatingSession = useCallback((value: Updater<boolean>) => {
    dispatch({ type: "isCreatingSession", value });
  }, []);
  const setIdentity = useCallback((value: Updater<IdentityForm>) => {
    dispatch({ type: "identity", value });
  }, []);
  const setContact = useCallback((value: Updater<ContactForm>) => {
    dispatch({ type: "contact", value });
  }, []);
  const setProfile = useCallback((value: Updater<ProfileForm>) => {
    dispatch({ type: "profile", value });
  }, []);
  const setErrors = useCallback((value: Updater<Record<string, string>>) => {
    dispatch({ type: "errors", value });
  }, []);
  const setNosis = useCallback((value: Updater<NosisData | null>) => {
    dispatch({ type: "nosis", value });
  }, []);
  const setLegalModal = useCallback((value: Updater<LegalModalType | null>) => {
    dispatch({ type: "legalModal", value });
  }, []);
  const setProvinceNotSaltaModalMessage = useCallback(
    (value: Updater<string>) => {
      dispatch({ type: "provinceNotSaltaModalMessage", value });
    },
    [],
  );

  return {
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
    setProvinceNotSaltaModalMessage,
  };
}
