export type CreditTransactionType =
  | "CREDIT"
  | "DEBIT"
  | "REFUND"
  | "ADJUSTMENT";

export type CreditTransactionReason =
  | "INITIAL_BONUS"
  | "ADMIN_TOPUP"
  | "CAMPAIGN_LAUNCH"
  | "CAMPAIGN_REFUND"
  | "MANUAL_ADJUSTMENT";

export type CreditBalance = {
  id: string;
  name: string;
  creditBalance: number;
};

export type CreditTransaction = {
  id: string;
  companyId: string;
  campaignId?: string | null;
  createdById?: string | null;

  type: CreditTransactionType;
  reason: CreditTransactionReason;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description?: string | null;

  company?: {
    id: string;
    name: string;
    creditBalance: number;
  } | null;

  campaign?: {
    id: string;
    name: string;
    status: string;
  } | null;

  createdBy?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  } | null;

  createdAt: string;
  updatedAt?: string;
};

export type CreditQueryParams = {
  page?: number;
  limit?: number;
  companyId?: string;
  type?: CreditTransactionType;
  reason?: CreditTransactionReason;
};

export type AddCreditsPayload = {
  companyId: string;
  amount: number;
  description?: string;
};

export type AdjustCreditsPayload = {
  companyId: string;
  amount: number;
  description?: string;
};

export type CreditOperationResult = {
  company: CreditBalance;
  transaction: CreditTransaction;
};