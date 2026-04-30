export type Stage =
  | "welcome"
  | "identity"
  | "nosis"
  | "prefill"
  | "contact"
  | "creating"
  | "ineligible"
  | "complete";

export type IdentityForm = {
  dni: string;
  genero: "M" | "F" | "X" | "";
  email: string;
  confirmEmail: string;
  telefono: string;
  acceptedLegal: boolean;
};

export type ContactForm = {
  password: string;
  confirmPassword: string;
  referralCode: string;
};

export type ProfileForm = {
  firstName: string;
  lastName: string;
  birthDate: string;
  dni: string;
  cuil: string;
  gender: string;
  estadoCivil: "" | "Casado" | "Soltero" | "Viudo" | "Union Civil";
  ocupacion: "" | "Industria" | "Comercio" | "Profesional";
  pep: "" | "Si" | "No";
  provincia: string;
  ciudad: string;
  direccion: string;
};

export type NosisData = {
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

export type LegalModalType = "privacy" | "terms";

export type CivilStatusApi =
  | "soltero"
  | "casado"
  | "divorciado"
  | "viudo"
  | "union_convivencial";

export type RegistrationDraft = {
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
  addressStreetLocal?: string | null;
  addressNumberLocal?: string | null;
  city?: string | null;
  cityLocal?: string | null;
  province?: string | null;
  provinceLocal?: string | null;
  postalCode?: string | null;
  pepDeclared?: boolean | null;
  civilStatus?: CivilStatusApi | null;
  occupation?: string | null;
  referredCode?: string | null;
  lastCompletedStep?: number | null;
  completedAt?: string | null;
};

export type RegistrationSessionApiResponse =
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

export type ApiErrorWithCode = Error & {
  code?: string;
};

export type UtmPayload = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
};
