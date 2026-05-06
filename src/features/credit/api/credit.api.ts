import { api } from "../../../lib/api";
import { unwrap } from "../../../lib/apiResponse";
import { PaginatedResponse } from "../../../types/api";
import {
  AddCreditsPayload,
  AdjustCreditsPayload,
  CreditBalance,
  CreditOperationResult,
  CreditQueryParams,
  CreditTransaction,
} from "../types/credit.types";

export const getMyCreditBalanceApi = async (): Promise<CreditBalance> => {
  const res = await api.get("/credits/me/balance");
  return unwrap<CreditBalance>(res);
};

export const getMyCreditTransactionsApi = async (
  params: CreditQueryParams,
): Promise<PaginatedResponse<CreditTransaction>> => {
  const res = await api.get("/credits/me/transactions", {
    params,
  });

  return res.data;
};

export const adminGetAllCreditTransactionsApi = async (
  params: CreditQueryParams,
): Promise<PaginatedResponse<CreditTransaction>> => {
  const res = await api.get("/credits/admin/transactions", {
    params,
  });

  return res.data;
};

export const adminGetCompanyCreditTransactionsApi = async ({
  companyId,
  params,
}: {
  companyId: string;
  params: CreditQueryParams;
}): Promise<PaginatedResponse<CreditTransaction>> => {
  const res = await api.get(
    `/credits/admin/companies/${companyId}/transactions`,
    {
      params,
    },
  );

  return res.data;
};

export const addCreditsApi = async (
  payload: AddCreditsPayload,
): Promise<CreditOperationResult> => {
  const res = await api.post("/credits/admin/add", payload);
  return unwrap<CreditOperationResult>(res);
};

export const adjustCreditsApi = async (
  payload: AdjustCreditsPayload,
): Promise<CreditOperationResult> => {
  const res = await api.post("/credits/admin/adjust", payload);
  return unwrap<CreditOperationResult>(res);
};