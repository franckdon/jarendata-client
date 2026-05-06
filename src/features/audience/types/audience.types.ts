export type ContactSource = "MANUAL" | "IMPORT" | "API" | "WHATSAPP_OPT_IN";

export type ConsentStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type Contact = {
  id: string;

  companyId: string;

  fullName?: string | null;
  phone: string;
  email?: string | null;
  country?: string | null;
  city?: string | null;
  gender?: string | null;
  ageRange?: string | null;

  externalId?: string | null;
  metadata?: Record<string, any> | null;

  source: ContactSource;
  consentStatus: ConsentStatus;

  optInAt?: string | null;
  consentText?: string | null;

  tags: string[];

  createdAt: string;
  updatedAt?: string;
};

export type ContactQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  source?: ContactSource;
  consentStatus?: ConsentStatus;
  country?: string;
  city?: string;
};

export type CreateContactPayload = {
  fullName?: string;
  phone: string;
  email?: string;
  country?: string;
  city?: string;
  gender?: string;
  ageRange?: string;
  externalId?: string;
  metadata?: Record<string, any>;
  source?: ContactSource;
  consentStatus?: ConsentStatus;
  consentText?: string;
  tags?: string[];
};

export type UpdateContactPayload = Partial<CreateContactPayload>;

export type ImportContactsPayload = {
  contacts: CreateContactPayload[];
  consentStatus?: ConsentStatus;
  defaultTags?: string[];
};

export type ImportContactsResult = {
  created: number;
  updated: number;
  skipped: number;
  total: number;
  errors: {
    phone?: string;
    email?: string;
    reason: string;
  }[];
};

export type SyncContactPayload = {
  externalId: string;
  fullName?: string;
  phone: string;
  email?: string;
  country?: string;
  city?: string;
  gender?: string;
  ageRange?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  consentStatus?: ConsentStatus;
};

export type SyncContactResult = {
  action: "created" | "updated";
  contact: Contact;
};