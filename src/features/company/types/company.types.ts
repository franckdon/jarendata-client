// src/features/company/types/company.types.ts

export type CompanyStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "DISABLED";

export type CompanySize = "SOLO" | "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE";

export type CompanyUser = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "COMPANY";
  companyRole?: "OWNER" | "MANAGER" | "ANALYST" | "MEMBER" | null;
  isActive: boolean;
  createdAt?: string;
};

export type Company = {
  id: string;
  name: string;
  slug: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  logoUrl?: string | null;

  country: string;
  city?: string | null;
  address?: string | null;
  industry?: string | null;

  size: CompanySize;
  status: CompanyStatus;
  creditBalance: number;

  users?: CompanyUser[];

  createdAt: string;
  updatedAt?: string;
};

export type CompanyQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type CreateCompanyPayload = {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  country: string;
  city?: string;
  address?: string;
  industry?: string;
  size: CompanySize;
  status?: CompanyStatus;
  logo?: File | null;
};

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>;

export type UpdateCompanyStatusPayload = {
  id: string;
  status: CompanyStatus;
};