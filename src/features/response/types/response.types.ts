import { Contact } from "../../audience/types/audience.types";
import { SurveyOption, SurveyQuestion } from "../../survey/types/survey.types";
import { CampaignStatus, CampaignType } from "../../campaign/types/campaign.types";

export type SurveySessionStatus =
  | "STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED";

export type SurveyAnswerType =
  | "TEXT"
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "RATING"
  | "YES_NO";

export type SurveyAnswer = {
  id: string;
  sessionId: string;
  campaignId: string;
  contactId: string;
  questionId: string;
  optionId?: string | null;
  answerType: SurveyAnswerType;
  textValue?: string | null;
  numberValue?: number | null;
  booleanValue?: boolean | null;
  values: string[];
  rawValue?: string | null;
  createdAt: string;
  updatedAt?: string;
  contact?: Contact;
  question?: SurveyQuestion;
  option?: SurveyOption | null;
};

export type SurveySession = {
  id: string;
  campaignId: string;
  contactId: string;
  recipientId?: string | null;
  status: SurveySessionStatus;
  startedAt: string;
  completedAt?: string | null;
  abandonedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  contact?: Contact;
  answers?: SurveyAnswer[];
};

export type ResponseQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  questionId?: string;
  contactId?: string;
};

export type CampaignAnalytics = {
  campaign: {
    id: string;
    name: string;
    type: CampaignType;
    status: CampaignStatus;
  };
  overview: {
    recipientsTotal: number;
    recipientsResponded: number;
    sessionsTotal: number;
    sessionsCompleted: number;
    answersTotal: number;
    responseRate: number;
    completionRate: number;
  };
  questions: Array<{
    questionId: string;
    title: string;
    type: string;
    totalAnswers: number;
    chartType: "bar" | "pie" | "text-list" | string;
    average?: number;
    distribution?: Array<{
      label: string;
      value: string;
      count: number;
      percentage: number;
    }>;
    answers?: Array<{
      answerId: string;
      text: string;
      createdAt: string;
    }>;
  }>;
  nps?: {
    questionId: string;
    total: number;
    promoters: number;
    passives: number;
    detractors: number;
    nps: number;
    chartType: "gauge";
  } | null;
};