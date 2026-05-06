import { api } from "../../../lib/api";
import { unwrap } from "../../../lib/apiResponse";
import { PaginatedResponse } from "../../../types/api";
import {
  MessageLog,
  MessageLogQueryParams,
  MessagingAccount,
  SendCampaignMessagesPayload,
  SendCampaignMessagesResult,
  UpsertMessagingAccountPayload,
} from "../types/messaging.types";

export const getMyMessagingAccountApi =
  async (): Promise<MessagingAccount | null> => {
    const res = await api.get("/messaging/settings/me");
    return unwrap<MessagingAccount | null>(res);
  };

export const upsertMyMessagingAccountApi = async (
  payload: UpsertMessagingAccountPayload,
): Promise<MessagingAccount> => {
  const res = await api.put("/messaging/settings/me", payload);
  return unwrap<MessagingAccount>(res);
};

export const getPlatformMessagingAccountApi =
  async (): Promise<MessagingAccount | null> => {
    const res = await api.get("/messaging/platform/settings");
    return unwrap<MessagingAccount | null>(res);
  };

export const upsertPlatformMessagingAccountApi = async (
  payload: UpsertMessagingAccountPayload,
): Promise<MessagingAccount> => {
  const res = await api.put("/messaging/platform/settings", payload);
  return unwrap<MessagingAccount>(res);
};

export const getMessageLogsApi = async (
  params: MessageLogQueryParams,
): Promise<PaginatedResponse<MessageLog>> => {
  const res = await api.get("/messaging/logs", {
    params,
  });

  return res.data;
};

export const sendCampaignMessagesApi = async ({
  campaignId,
  limit,
}: SendCampaignMessagesPayload): Promise<SendCampaignMessagesResult> => {
  const res = await api.post(`/messaging/campaigns/${campaignId}/send`, {
    limit,
  });

  return unwrap<SendCampaignMessagesResult>(res);
};