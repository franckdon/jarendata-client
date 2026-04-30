/**
 * Structure standard de réponse backend
 */
export type ApiEnvelope<T> = {
  message: string;
  data: T;
};

/**
 * Helper pour unwrap automatiquement la réponse API
 */
export const unwrap = <T>(response: any): T => {
  if (!response?.data) {
    throw new Error("Invalid API response: missing data");
  }

  if (!("data" in response.data)) {
    throw new Error("Invalid API response: missing data field");
  }

  return response.data.data as T;
};