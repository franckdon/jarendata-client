import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMessageLogsApi,
  getMyMessagingAccountApi,
  getPlatformMessagingAccountApi,
  sendCampaignMessagesApi,
  upsertMyMessagingAccountApi,
  upsertPlatformMessagingAccountApi,
} from "../api/messaging.api";
import {
  MessageLogQueryParams,
  SendCampaignMessagesPayload,
  UpsertMessagingAccountPayload,
} from "../types/messaging.types";

export const useMyMessagingAccount = () => {
  return useQuery({
    queryKey: ["messaging-account", "me"],
    queryFn: getMyMessagingAccountApi,
  });
};

export const useUpsertMyMessagingAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertMessagingAccountPayload) =>
      upsertMyMessagingAccountApi(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messaging-account", "me"],
      });
    },
  });
};

export const usePlatformMessagingAccount = () => {
  return useQuery({
    queryKey: ["messaging-account", "platform"],
    queryFn: getPlatformMessagingAccountApi,
  });
};

export const useUpsertPlatformMessagingAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertMessagingAccountPayload) =>
      upsertPlatformMessagingAccountApi(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messaging-account", "platform"],
      });
    },
  });
};

export const useMessageLogs = (params: MessageLogQueryParams) => {
  return useQuery({
    queryKey: ["message-logs", params],
    queryFn: () => getMessageLogsApi(params),
  });
};

export const useSendCampaignMessages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendCampaignMessagesPayload) =>
      sendCampaignMessagesApi(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["message-logs"] });
      queryClient.invalidateQueries({
        queryKey: ["campaign-recipients", variables.campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ["campaign-recipient-stats", variables.campaignId],
      });
    },
  });
};