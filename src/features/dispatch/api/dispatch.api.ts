import { api } from "../../../lib/api";
import { unwrap } from "../../../lib/apiResponse";
import { PaginatedResponse } from "../../../types/api";
import {
  CampaignRecipient,
  GenerateRecipientsResult,
  RecipientPreview,
  RecipientQueryParams,
  RecipientStats,
  UpdateRecipientStatusPayload,
} from "../types/dispatch.types";

export const previewCampaignRecipientsApi = async (
  campaignId: string,
): Promise<RecipientPreview> => {
  const res = await api.get(
    `/dispatch/campaigns/${campaignId}/recipients/preview`,
  );

  return unwrap<RecipientPreview>(res);
};

export const generateCampaignRecipientsApi = async (
  campaignId: string,
): Promise<GenerateRecipientsResult> => {
  const res = await api.post(
    `/dispatch/campaigns/${campaignId}/recipients/generate`,
  );

  return unwrap<GenerateRecipientsResult>(res);
};

export const getCampaignRecipientsApi = async ({
  campaignId,
  params,
}: {
  campaignId: string;
  params: RecipientQueryParams;
}): Promise<PaginatedResponse<CampaignRecipient>> => {
  const res = await api.get(`/dispatch/campaigns/${campaignId}/recipients`, {
    params,
  });

  return res.data;
};

export const getCampaignRecipientStatsApi = async (
  campaignId: string,
): Promise<RecipientStats> => {
  const res = await api.get(
    `/dispatch/campaigns/${campaignId}/recipients/stats`,
  );

  return unwrap<RecipientStats>(res);
};

export const updateCampaignRecipientStatusApi = async ({
  campaignId,
  recipientId,
  status,
  errorMessage,
}: UpdateRecipientStatusPayload): Promise<CampaignRecipient> => {
  const res = await api.patch(
    `/dispatch/campaigns/${campaignId}/recipients/${recipientId}/status`,
    {
      status,
      errorMessage,
    },
  );

  return unwrap<CampaignRecipient>(res);
};

export const clearCampaignRecipientsApi = async (
  campaignId: string,
): Promise<void> => {
  await api.delete(`/dispatch/campaigns/${campaignId}/recipients/clear`);
};