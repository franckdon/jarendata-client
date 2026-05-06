import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCreditsApi,
  adjustCreditsApi,
  adminGetAllCreditTransactionsApi,
  adminGetCompanyCreditTransactionsApi,
  getMyCreditBalanceApi,
  getMyCreditTransactionsApi,
} from "../api/credit.api";
import {
  AddCreditsPayload,
  AdjustCreditsPayload,
  CreditQueryParams,
} from "../types/credit.types";

export const useMyCreditBalance = (enabled = true) => {
  return useQuery({
    queryKey: ["credits", "me", "balance"],
    queryFn: getMyCreditBalanceApi,
    enabled,
  });
};

export const useMyCreditTransactions = (
  params: CreditQueryParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["credits", "me", "transactions", params],
    queryFn: () => getMyCreditTransactionsApi(params),
    enabled,
  });
};

export const useAdminAllCreditTransactions = (
  params: CreditQueryParams = {},
  enabled = true,
) => {
  return useQuery({
    queryKey: ["credits", "admin", "all", params],
    queryFn: () => adminGetAllCreditTransactionsApi(params),
    enabled,
  });
};

export const useAdminCompanyCreditTransactions = (
  companyId?: string,
  params: CreditQueryParams = {},
) => {
  return useQuery({
    queryKey: ["credits", "admin", companyId, "transactions", params],
    queryFn: () =>
      adminGetCompanyCreditTransactionsApi({
        companyId: companyId as string,
        params,
      }),
    enabled: !!companyId,
  });
};

export const useAddCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddCreditsPayload) => addCreditsApi(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({
        queryKey: ["company", variables.companyId],
      });
    },
  });
};

export const useAdjustCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdjustCreditsPayload) => adjustCreditsApi(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({
        queryKey: ["company", variables.companyId],
      });
    },
  });
};