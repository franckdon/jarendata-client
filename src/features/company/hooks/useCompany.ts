import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteCompanyApi,
  getCompaniesApi,
  getCompanyByIdApi,
  updateCompanyStatusApi,
} from "../api/company.api";
import {
  CompanyQueryParams,
  UpdateCompanyStatusPayload,
} from "../types/company.types";

export const useCompanies = (params: CompanyQueryParams) => {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: () => getCompaniesApi(params),
  });
};

export const useCompanyById = (id?: string) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyByIdApi(id as string),
    enabled: !!id,
  });
};

export const useUpdateCompanyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCompanyStatusPayload) =>
      updateCompanyStatusApi(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompanyApi,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};