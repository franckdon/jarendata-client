// src/features/auth/types/auth.types.ts
export type Company = {
  id: string;
  name: string;
  slug: string;
  country?: string;
  city?: string;
  industry?: string;
  status: string;
  creditBalance: number;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "COMPANY";
  companyRole?: "OWNER" | "MANAGER" | "ANALYST" | "MEMBER" | null;
  isActive: boolean;
  company?: Company;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  companyName: string;
  companyCountry: string;
  companyCity?: string;
  companyPhone?: string;
  companyIndustry?: string;
};