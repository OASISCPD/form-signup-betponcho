import { API_BASE_URL } from "./constants";
import type {
  ApiErrorWithCode,
  RegistrationDraft,
  RegistrationSessionApiResponse,
} from "./types";

function parseApiError(status: number, payload: unknown, fallback: string) {
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
}

function buildApiError(
  status: number,
  payload: unknown,
  fallback: string,
): ApiErrorWithCode {
  const parsed = parseApiError(status, payload, fallback);
  const error = new Error(parsed.message) as ApiErrorWithCode;
  error.code = parsed.code;
  return error;
}

export function parseAddress(fullAddress: string) {
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
}

export async function createRegistrationSession(): Promise<RegistrationDraft> {
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
    throw buildApiError(
      response.status,
      payload,
      "No se pudo crear la sesion de registro.",
    );
  }
  return payload?.data ?? {};
}

export async function getRegistrationDraft(
  sessionId: string,
): Promise<RegistrationDraft> {
  const response = await fetch(
    `${API_BASE_URL}/api/registration/${encodeURIComponent(sessionId)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );
  const payload = (await response.json()) as RegistrationSessionApiResponse;
  if (!response.ok) {
    throw buildApiError(
      response.status,
      payload,
      "No se pudo consultar la sesion de registro.",
    );
  }
  return payload?.data ?? {};
}

export async function patchRegistrationStep(
  sessionId: string,
  stepPath: "identity" | "confirmation" | "account",
  body: unknown,
): Promise<{ data: RegistrationDraft | undefined; message: string | undefined }> {
  const sanitizedBody =
    body && typeof body === "object"
      ? Object.fromEntries(
          Object.entries(body as Record<string, unknown>).filter(
            ([, value]) => {
              if (value === null || value === undefined) return false;
              if (typeof value === "string" && value.trim().length === 0)
                return false;
              return true;
            },
          ),
        )
      : body;

  if (
    sanitizedBody &&
    typeof sanitizedBody === "object" &&
    Object.keys(sanitizedBody as Record<string, unknown>).length === 0
  ) {
    return { data: undefined, message: undefined };
  }

  const response = await fetch(
    `${API_BASE_URL}/api/registration/${encodeURIComponent(sessionId)}/${stepPath}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanitizedBody),
    },
  );
  const payload = (await response.json()) as RegistrationSessionApiResponse;
  if (!response.ok) {
    const stepName =
      stepPath === "identity"
        ? "identidad"
        : stepPath === "confirmation"
          ? "confirmacion"
          : "cuenta";
    throw buildApiError(
      response.status,
      payload,
      `No se pudo guardar el paso de ${stepName}.`,
    );
  }
  return { data: payload?.data, message: payload?.message };
}
