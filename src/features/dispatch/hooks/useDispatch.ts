import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearCampaignRecipientsApi,
  generateCampaignRecipientsApi,
  getCampaignRecipientStatsApi,
  getCampaignRecipientsApi,
  previewCampaignRecipientsApi,
  updateCampaignRecipientStatusApi,
} from "../api/dispatch.api";
import {
  RecipientQueryParams,
  UpdateRecipientStatusPayload,
} from "../types/dispatch.types";

export const useRecipientPreview = (campaignId?: string) => {
  return useQuery({
    queryKey: ["recipient-preview", campaignId],
    queryFn: () => previewCampaignRecipientsApi(campaignId as string),
    enabled: !!campaignId,
  });
};

export const useCampaignRecipients = (
  campaignId?: string,
  params: RecipientQueryParams = {},
) => {
  return useQuery({
    queryKey: ["campaign-recipients", campaignId, params],
    queryFn: () =>
      getCampaignRecipientsApi({
        campaignId: campaignId as string,
        params,
      }),
    enabled: !!campaignId,
  });
};

export const useCampaignRecipientStats = (campaignId?: string) => {
  return useQuery({
    queryKey: ["campaign-recipient-stats", campaignId],
    queryFn: () => getCampaignRecipientStatsApi(campaignId as string),
    enabled: !!campaignId,
  });
};

export const useGenerateCampaignRecipients = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => generateCampaignRecipientsApi(campaignId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recipient-preview", campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ["campaign-recipients", campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ["campaign-recipient-stats", campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ["campaign", campaignId],
      });
    },
  });
};

export const useUpdateCampaignRecipientStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRecipientStatusPayload) =>
      updateCampaignRecipientStatusApi(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["campaign-recipients", variables.campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ["campaign-recipient-stats", variables.campaignId],
      });
    },
  });
};

export const useClearCampaignRecipients = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearCampaignRecipientsApi(campaignId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recipient-preview", campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ["campaign-recipients", campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ["campaign-recipient-stats", campaignId],
      });
    },
  });
};