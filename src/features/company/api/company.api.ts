// src/features/company/api/company.api.ts

import { api } from "../../../lib/api";
import { unwrap } from "../../../lib/apiResponse";
import { PaginatedResponse } from "../../../types/api";
import {
  Company,
  CompanyQueryParams,
  CreateCompanyPayload,
  UpdateCompanyPayload,
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

export const createCompanyApi = async (
  payload: CreateCompanyPayload
): Promise<Company> => {

  const formData = buildCompanyFormData(payload);

  const res = await api.post("/companies", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return unwrap<Company>(res);
};

export const updateCompanyApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateCompanyPayload;
}): Promise<Company> => {
  const formData = buildCompanyFormData(payload);

  const res = await api.patch(`/companies/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return unwrap<Company>(res);
};

const buildCompanyFormData = (
  payload: CreateCompanyPayload | UpdateCompanyPayload
) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (key === "logo" && value instanceof File) {
      formData.append("logo", value);
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
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