import { api } from "../../../lib/api";
import { unwrap } from "../../../lib/apiResponse";
import { PaginatedResponse } from "../../../types/api";
import {
  Campaign,
  CampaignQueryParams,
  CreateCampaignPayload,
  UpdateCampaignPayload,
  UpdateCampaignStatusPayload,
} from "../types/campaign.types";

export const getCampaignsApi = async (
  params: CampaignQueryParams,
): Promise<PaginatedResponse<Campaign>> => {
  const res = await api.get("/campaigns", {
    params,
  });

  return res.data;
};

export const getCampaignByIdApi = async (id: string): Promise<Campaign> => {
  const res = await api.get(`/campaigns/${id}`);
  return unwrap<Campaign>(res);
};

export const createCampaignApi = async (
  payload: CreateCampaignPayload,
): Promise<Campaign> => {
  const res = await api.post("/campaigns", payload);
  return unwrap<Campaign>(res);
};

export const updateCampaignApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateCampaignPayload;
}): Promise<Campaign> => {
  const res = await api.patch(`/campaigns/${id}`, payload);
  return unwrap<Campaign>(res);
};

export const updateCampaignStatusApi = async ({
  id,
  status,
}: UpdateCampaignStatusPayload): Promise<Campaign> => {
  const res = await api.patch(`/campaigns/${id}/status`, {
    status,
  });

  return unwrap<Campaign>(res);
};

export const deleteCampaignApi = async (id: string): Promise<void> => {
  await api.delete(`/campaigns/${id}`);
};