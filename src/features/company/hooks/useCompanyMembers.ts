import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCompanyMemberApi,
  deleteCompanyMemberApi,
  updateCompanyMemberRoleApi,
  updateCompanyMemberStatusApi,
} from "../api/companyMembers.api";
import {
  CreateCompanyMemberPayload,
  UpdateCompanyMemberRolePayload,
  UpdateCompanyMemberStatusPayload,
} from "../types/company.types";

export const useCreateCompanyMember = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCompanyMemberPayload) =>
      createCompanyMemberApi({ companyId, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", companyId] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useUpdateCompanyMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCompanyMemberRolePayload) =>
      updateCompanyMemberRoleApi(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["company", variables.companyId],
      });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useUpdateCompanyMemberStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCompanyMemberStatusPayload) =>
      updateCompanyMemberStatusApi(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["company", variables.companyId],
      });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useDeleteCompanyMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompanyMemberApi,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["company", variables.companyId],
      });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};