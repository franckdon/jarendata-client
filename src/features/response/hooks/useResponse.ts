import { useQuery } from "@tanstack/react-query";
import {
  getCampaignAnalyticsApi,
  getCampaignAnswersApi,
  getCampaignSessionsApi,
} from "../api/response.api";
import { ResponseQueryParams } from "../types/response.types";

export const useCampaignAnswers = (
  campaignId?: string,
  params: ResponseQueryParams = {},
) => {
  return useQuery({
    queryKey: ["campaign-answers", campaignId, params],
    queryFn: () =>
      getCampaignAnswersApi({
        campaignId: campaignId as string,
        params,
      }),
    enabled: !!campaignId,
  });
};

export const useCampaignSessions = (
  campaignId?: string,
  params: ResponseQueryParams = {},
) => {
  return useQuery({
    queryKey: ["campaign-sessions", campaignId, params],
    queryFn: () =>
      getCampaignSessionsApi({
        campaignId: campaignId as string,
        params,
      }),
    enabled: !!campaignId,
  });
};

export const useCampaignAnalytics = (campaignId?: string) => {
  return useQuery({
    queryKey: ["campaign-analytics", campaignId],
    queryFn: () => getCampaignAnalyticsApi(campaignId as string),
    enabled: !!campaignId,
  });
};