import { api } from "../../../lib/api";
import { unwrap } from "../../../lib/apiResponse";
import {
  CompanyUser,
  CreateCompanyMemberPayload,
  UpdateCompanyMemberRolePayload,
  UpdateCompanyMemberStatusPayload,
} from "../types/company.types";

export const createCompanyMemberApi = async ({
  companyId,
  payload,
}: {
  companyId: string;
  payload: CreateCompanyMemberPayload;
}): Promise<CompanyUser> => {
  const res = await api.post(`/companies/${companyId}/members`, payload);
  return unwrap<CompanyUser>(res);
};

export const updateCompanyMemberRoleApi = async ({
  companyId,
  userId,
  companyRole,
}: UpdateCompanyMemberRolePayload): Promise<CompanyUser> => {
  const res = await api.patch(`/companies/${companyId}/members/${userId}/role`, {
    companyRole,
  });

  return unwrap<CompanyUser>(res);
};

export const updateCompanyMemberStatusApi = async ({
  companyId,
  userId,
  isActive,
}: UpdateCompanyMemberStatusPayload): Promise<CompanyUser> => {
  const res = await api.patch(
    `/companies/${companyId}/members/${userId}/status`,
    {
      isActive,
    },
  );

  return unwrap<CompanyUser>(res);
};

export const deleteCompanyMemberApi = async ({
  companyId,
  userId,
}: {
  companyId: string;
  userId: string;
}): Promise<void> => {
  await api.delete(`/companies/${companyId}/members/${userId}`);
};