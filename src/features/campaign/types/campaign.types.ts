export type CampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED";

export type CampaignType =
  | "CUSTOMER_SATISFACTION"
  | "NPS"
  | "PRODUCT_FEEDBACK"
  | "PRICE_TEST"
  | "MARKET_RESEARCH"
  | "CUSTOMER_RETENTION"
  | "CUSTOM";

export type CampaignChannel = "WHATSAPP";

export type CampaignCreatedBy = {
  id: string;
  fullName: string;
  email: string;
};

export type Campaign = {
  id: string;
  companyId: string;

  name: string;
  description?: string | null;
  type: CampaignType;
  channel: CampaignChannel;
  status: CampaignStatus;

  targetAllContacts: boolean;

  countryFilter?: string | null;
  cityFilter?: string | null;
  tagsFilter: string[];

  estimatedAudienceCount: number;
  estimatedCreditCost: number;

  scheduledAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;

  createdById?: string | null;
  createdBy?: CampaignCreatedBy | null;

  createdAt: string;
  updatedAt?: string;
};

export type CampaignQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: CampaignStatus;
  type?: CampaignType;
};

export type CreateCampaignPayload = {
  name: string;
  description?: string;
  type?: CampaignType;
  targetAllContacts?: boolean;
  countryFilter?: string;
  cityFilter?: string;
  tagsFilter?: string[];
  scheduledAt?: string;
};

export type UpdateCampaignPayload = Partial<CreateCampaignPayload>;

export type UpdateCampaignStatusPayload = {
  id: string;
  status: CampaignStatus;
};