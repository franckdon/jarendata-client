import { api } from "../../../lib/api";
import { unwrap } from "../../../lib/apiResponse";
import { PaginatedResponse } from "../../../types/api";
import {
  Company,
  CompanyQueryParams,
  UpdateCompanyStatusPayload,
} from "../types/company.types";

export const getCompaniesApi = async (
  params: CompanyQueryParams
): Promise<PaginatedResponse<Company>> => {
  const res = await api.get("/companies", {
    params,
  });

  return res.data;
};

export const getCompanyByIdApi = async (id: string): Promise<Company> => {
  const res = await api.get(`/companies/${id}`);
  return unwrap<Company>(res);
};

export const updateCompanyStatusApi = async ({
  id,
  status,
}: UpdateCompanyStatusPayload): Promise<Company> => {
  const res = await api.patch(`/companies/${id}/status`, {
    status,
  });

  return unwrap<Company>(res);
};

export const deleteCompanyApi = async (id: string): Promise<void> => {
  await api.delete(`/companies/${id}`);
};