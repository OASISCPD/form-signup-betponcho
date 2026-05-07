import type {
  CivilStatusApi,
  ContactForm,
  IdentityForm,
  NosisData,
  ProfileForm,
  RegistrationDraft,
} from "./types";

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 50;

export function validateIdentityForm(
  identity: IdentityForm,
): Record<string, string> {
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
    nextErrors.acceptedLegal =
      "Debes aceptar términos y confirmar que eres mayor de 18 años.";
  }
  return nextErrors;
}

export function isPasswordValid(password: string): boolean {
  return (
    password.length > 0 &&
    /\d/.test(password) &&
    !/\s/.test(password) &&
    /^[\x00-\x7F]*$/.test(password) &&
    password.length >= PASSWORD_MIN_LENGTH &&
    password.length <= PASSWORD_MAX_LENGTH &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password)
  );
}

export function validateContactForm(
  contact: ContactForm,
): Record<string, string> {
  const nextErrors: Record<string, string> = {};
  if (!isPasswordValid(contact.password)) {
    nextErrors.password = "La contraseña no cumple las condiciones.";
  }
  if (!contact.confirmPassword) {
    nextErrors.confirmPassword = "Confirma tu contraseña.";
  } else if (contact.confirmPassword !== contact.password) {
    nextErrors.confirmPassword = "Las contraseñas no coinciden.";
  }
  return nextErrors;
}

export function validatePrefillForm(
  profile: ProfileForm,
  requireIdentityData = false,
): Record<string, string> {
  const nextErrors: Record<string, string> = {};
  if (requireIdentityData) {
    if (!profile.firstName.trim()) {
      nextErrors.firstName = "Ingresa tu nombre";
    }
    if (!profile.lastName.trim()) {
      nextErrors.lastName = "Ingresa tu apellido";
    }
    const birthDateValue = profile.birthDate.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDateValue)) {
      nextErrors.birthDate = "Ingresa una fecha de nacimiento valida";
    } else {
      const birthDate = new Date(`${birthDateValue}T00:00:00`);
      if (Number.isNaN(birthDate.getTime())) {
        nextErrors.birthDate = "Ingresa una fecha de nacimiento valida";
      } else {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const hasNotHadBirthdayYet =
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate());
        if (hasNotHadBirthdayYet) {
          age -= 1;
        }
        if (age < 18) {
          nextErrors.birthDate = "Debes ser mayor de 18 años";
        }
      }
    }
    if (!/^\d{7,8}$/.test(profile.dni.trim())) {
      nextErrors.dni = "Ingresa un DNI valido";
    }
    if (!/^\d{11}$/.test(profile.cuil.replace(/\D/g, ""))) {
      nextErrors.cuil = "Ingresa un CUIL/CUIT valido";
    }
    if (profile.gender !== "M" && profile.gender !== "F") {
      nextErrors.gender = "Selecciona un genero";
    }
  }
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
  return nextErrors;
}

export function toCivilStatusApi(
  value: ProfileForm["estadoCivil"],
): CivilStatusApi {
  if (value === "Casado") return "casado";
  if (value === "Viudo") return "viudo";
  if (value === "Union Civil") return "union_convivencial";
  return "soltero";
}

export function fromCivilStatusApi(
  value?: CivilStatusApi | null,
): ProfileForm["estadoCivil"] {
  if (value === "casado") return "Casado";
  if (value === "viudo") return "Viudo";
  if (value === "union_convivencial") return "Union Civil";
  return "Soltero";
}

export function buildIdentityPatchPayload(
  identity: IdentityForm,
  referralCode: string,
) {
  const payload: Record<string, string | boolean> = {};
  const dni = identity.dni.trim();
  const email = identity.email.trim();
  const confirmEmail = identity.confirmEmail.trim();
  const phone = identity.telefono.trim();
  const promotionalCode = referralCode.trim();

  if (dni) payload.dni = dni;
  if (identity.genero === "M" || identity.genero === "F")
    payload.gender = identity.genero;
  if (email) payload.email = email;
  if (confirmEmail) payload.confirmEmail = confirmEmail;
  if (phone) payload.phone = phone;
  if (identity.acceptedLegal) payload.acceptedTerms = true;
  if (promotionalCode) payload.promotionalCode = promotionalCode;

  return payload;
}

export function buildNosisFromDraft(
  draft: RegistrationDraft,
  fallbackGender?: "M" | "F" | "",
): NosisData | null {
  const gender =
    draft.gender === "M" || draft.gender === "F"
      ? draft.gender
      : (fallbackGender ?? "");
  if (
    !draft.firstName ||
    !draft.lastName ||
    !draft.birthDate ||
    !draft.cuil ||
    !draft.dni ||
    !gender
  ) {
    return null;
  }
  const direccionCompuesta = [draft.addressStreet, draft.addressNumber]
    .filter(Boolean)
    .join(" ")
    .trim();
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
}
