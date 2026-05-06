import { Contact } from "../../audience/types/audience.types";

export type CampaignRecipientStatus =
  | "PENDING"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "RESPONDED"
  | "FAILED"
  | "CANCELLED";

export type CampaignRecipient = {
  id: string;
  campaignId: string;
  contactId: string;

  status: CampaignRecipientStatus;

  sentAt?: string | null;
  deliveredAt?: string | null;
  readAt?: string | null;
  respondedAt?: string | null;
  failedAt?: string | null;

  errorMessage?: string | null;

  contact?: Contact;

  createdAt: string;
  updatedAt?: string;
};

export type RecipientQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: CampaignRecipientStatus;
};

export type RecipientPreview = {
  eligibleContactsCount: number;
  existingRecipientsCount: number;
  estimatedCreditCost: number;
  canGenerateRecipients: boolean;
};

export type GenerateRecipientsResult = {
  recipientsCount: number;
  campaign: {
    id: string;
    estimatedAudienceCount: number;
    estimatedCreditCost: number;
  };
};

export type RecipientStats = {
  total: number;
  pending: number;
  sent: number;
  delivered: number;
  read: number;
  responded: number;
  failed: number;
  cancelled: number;
  responseRate: number;
  failureRate: number;
};

export type UpdateRecipientStatusPayload = {
  campaignId: string;
  recipientId: string;
  status: CampaignRecipientStatus;
  errorMessage?: string;
};