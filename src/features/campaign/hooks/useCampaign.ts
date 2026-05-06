import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCampaignApi,
  deleteCampaignApi,
  getCampaignByIdApi,
  getCampaignsApi,
  updateCampaignApi,
  updateCampaignStatusApi,
} from "../api/campaign.api";
import {
  CampaignQueryParams,
  CreateCampaignPayload,
  UpdateCampaignPayload,
  UpdateCampaignStatusPayload,
} from "../types/campaign.types";

export const useCampaigns = (params: CampaignQueryParams) => {
  return useQuery({
    queryKey: ["campaigns", params],
    queryFn: () => getCampaignsApi(params),
  });
};

export const useCampaignById = (id?: string) => {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: () => getCampaignByIdApi(id as string),
    enabled: !!id,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) => createCampaignApi(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCampaignPayload;
    }) => updateCampaignApi({ id, payload }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign", variables.id] });
    },
  });
};

export const useUpdateCampaignStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCampaignStatusPayload) =>
      updateCampaignStatusApi(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign", variables.id] });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCampaignApi,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
};