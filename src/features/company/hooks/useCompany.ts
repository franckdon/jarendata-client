// src/features/company/hooks/useCompany.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCompanyApi,
  deleteCompanyApi,
  getCompaniesApi,
  getCompanyByIdApi,
  updateCompanyApi,
  updateCompanyStatusApi,
} from "../api/company.api";
import {
  CompanyQueryParams,
  CreateCompanyPayload,
  UpdateCompanyPayload,
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

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) => createCompanyApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCompanyPayload;
    }) => updateCompanyApi({ id, payload }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["company", variables.id] });
    },
  });
};

export const useUpdateCompanyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCompanyStatusPayload) =>
      updateCompanyStatusApi(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["company", variables.id] });
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