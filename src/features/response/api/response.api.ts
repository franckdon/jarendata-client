import { api } from "../../../lib/api";
import { unwrap } from "../../../lib/apiResponse";
import { PaginatedResponse } from "../../../types/api";
import {
  CampaignAnalytics,
  ResponseQueryParams,
  SurveyAnswer,
  SurveySession,
} from "../types/response.types";

export const getCampaignAnswersApi = async ({
  campaignId,
  params,
}: {
  campaignId: string;
  params: ResponseQueryParams;
}): Promise<PaginatedResponse<SurveyAnswer>> => {
  const res = await api.get(`/responses/campaigns/${campaignId}/answers`, {
    params,
  });

  return res.data;
};

export const getCampaignSessionsApi = async ({
  campaignId,
  params,
}: {
  campaignId: string;
  params: ResponseQueryParams;
}): Promise<PaginatedResponse<SurveySession>> => {
  const res = await api.get(`/responses/campaigns/${campaignId}/sessions`, {
    params,
  });

  return res.data;
};

export const getCampaignAnalyticsApi = async (
  campaignId: string,
): Promise<CampaignAnalytics> => {
  const res = await api.get(`/responses/campaigns/${campaignId}/analytics`);
  return unwrap<CampaignAnalytics>(res);
};