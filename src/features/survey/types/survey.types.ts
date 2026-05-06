export type SurveyQuestionType =
  | "TEXT"
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "RATING"
  | "YES_NO";

export type SurveyTemplateKey =
  | "CUSTOMER_SATISFACTION"
  | "PRICE_TEST"
  | "MARKET_RESEARCH"
  | "PRODUCT_FEEDBACK"
  | "CUSTOMER_RETENTION"
  | "NPS"
  | "BUSINESS_IDEA_VALIDATION";

export type SurveyOption = {
  id: string;
  questionId: string;
  label: string;
  value: string;
  order: number;
  nextQuestionId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type SurveyQuestion = {
  id: string;
  campaignId: string;
  title: string;
  description?: string | null;
  type: SurveyQuestionType;
  order: number;
  isRequired: boolean;
  placeholder?: string | null;
  minValue?: number | null;
  maxValue?: number | null;
  options: SurveyOption[];
  createdAt?: string;
  updatedAt?: string;
};

export type CreateSurveyOptionPayload = {
  label: string;
  value: string;
  order: number;
  nextQuestionId?: string | null;
};

export type CreateSurveyQuestionPayload = {
  title: string;
  description?: string;
  type: SurveyQuestionType;
  order: number;
  isRequired?: boolean;
  placeholder?: string;
  minValue?: number;
  maxValue?: number;
  options?: CreateSurveyOptionPayload[];
};

export type UpdateSurveyQuestionPayload = Partial<CreateSurveyQuestionPayload>;

export type ReorderQuestionsPayload = {
  questions: {
    id: string;
    order: number;
  }[];
};

export type UpdateOptionNextQuestionPayload = {
  campaignId: string;
  optionId: string;
  nextQuestionId: string | null;
};

export type ApplySurveyTemplatePayload = {
  campaignId: string;
  templateKey: SurveyTemplateKey;
};