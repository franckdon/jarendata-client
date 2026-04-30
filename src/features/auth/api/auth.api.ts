import { api } from "../../../lib/api";
import { unwrap } from "../../../lib/apiResponse";
import { AuthResponse, User } from "../types/auth.types";

/**
 * LOGIN
 */
export const loginApi = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", data);
  return unwrap<AuthResponse>(res);
};

/**
 * REGISTER
 */
export const registerApi = async (data: any): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", data);
  return unwrap<AuthResponse>(res);
};

/**
 * GET ME
 */
export const getMeApi = async (): Promise<User> => {
  const res = await api.get("/auth/me");
  return unwrap<User>(res);
};