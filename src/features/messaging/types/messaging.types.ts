export type MessagingProvider = "META" | "TWILIO" | "MOCK";
export type MessagingAccountScope = "PLATFORM" | "COMPANY";
export type MessageDirection = "INBOUND" | "OUTBOUND";
export type MessageStatus =
  | "PENDING"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "FAILED"
  | "RECEIVED";

export type MessagingAccount = {
  id: string;
  scope: MessagingAccountScope;
  companyId?: string | null;
  provider: MessagingProvider;
  name: string;
  phoneNumberId?: string | null;
  businessAccountId?: string | null;
  accessToken?: string | null;
  webhookVerifyToken?: string | null;
  fromPhoneNumber?: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type UpsertMessagingAccountPayload = {
  provider?: MessagingProvider;
  name?: string;
  phoneNumberId?: string;
  businessAccountId?: string;
  accessToken?: string;
  webhookVerifyToken?: string;
  fromPhoneNumber?: string;
  isActive?: boolean;
};

export type MessageLog = {
  id: string;
  companyId: string;
  messagingAccountId?: string | null;
  campaignId?: string | null;
  contactId?: string | null;
  recipientId?: string | null;
  direction: MessageDirection;
  status: MessageStatus;
  provider: MessagingProvider;
  waMessageId?: string | null;
  fromPhone?: string | null;
  toPhone?: string | null;
  body?: string | null;
  errorMessage?: string | null;
  createdAt: string;

  messagingAccount?: {
    id: string;
    name: string;
    scope: MessagingAccountScope;
    provider: MessagingProvider;
  } | null;

  campaign?: {
    id: string;
    name: string;
  } | null;

  contact?: {
    id: string;
    fullName?: string | null;
    phone: string;
  } | null;
};

export type MessageLogQueryParams = {
  page?: number;
  limit?: number;
  campaignId?: string;
  contactId?: string;
  direction?: MessageDirection;
  status?: MessageStatus;
};

export type SendCampaignMessagesPayload = {
  campaignId: string;
  limit?: number;
};

export type SendCampaignMessagesResult = {
  totalProcessed: number;
  sent: number;
  failed: number;
};