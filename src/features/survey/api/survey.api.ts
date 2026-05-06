import { api } from "../../../lib/api";
import { unwrap } from "../../../lib/apiResponse";
import {
  ApplySurveyTemplatePayload,
  CreateSurveyOptionPayload,
  CreateSurveyQuestionPayload,
  ReorderQuestionsPayload,
  SurveyOption,
  SurveyQuestion,
  UpdateOptionNextQuestionPayload,
  UpdateSurveyQuestionPayload,
} from "../types/survey.types";

export const getSurveyFlowApi = async (
  campaignId: string,
): Promise<SurveyQuestion[]> => {
  const res = await api.get(`/survey/campaigns/${campaignId}/questions`);
  return unwrap<SurveyQuestion[]>(res);
};

export const createSurveyQuestionApi = async ({
  campaignId,
  payload,
}: {
  campaignId: string;
  payload: CreateSurveyQuestionPayload;
}): Promise<SurveyQuestion> => {
  const res = await api.post(`/survey/campaigns/${campaignId}/questions`, payload);
  return unwrap<SurveyQuestion>(res);
};

export const updateSurveyQuestionApi = async ({
  campaignId,
  questionId,
  payload,
}: {
  campaignId: string;
  questionId: string;
  payload: UpdateSurveyQuestionPayload;
}): Promise<SurveyQuestion> => {
  const res = await api.patch(
    `/survey/campaigns/${campaignId}/questions/${questionId}`,
    payload,
  );

  return unwrap<SurveyQuestion>(res);
};

export const deleteSurveyQuestionApi = async ({
  campaignId,
  questionId,
}: {
  campaignId: string;
  questionId: string;
}): Promise<void> => {
  await api.delete(`/survey/campaigns/${campaignId}/questions/${questionId}`);
};

export const replaceQuestionOptionsApi = async ({
  campaignId,
  questionId,
  options,
}: {
  campaignId: string;
  questionId: string;
  options: CreateSurveyOptionPayload[];
}): Promise<SurveyQuestion> => {
  const res = await api.put(
    `/survey/campaigns/${campaignId}/questions/${questionId}/options`,
    { options },
  );

  return unwrap<SurveyQuestion>(res);
};

export const updateOptionNextQuestionApi = async ({
  campaignId,
  optionId,
  nextQuestionId,
}: UpdateOptionNextQuestionPayload): Promise<SurveyOption> => {
  const res = await api.patch(
    `/survey/campaigns/${campaignId}/options/${optionId}/next-question`,
    { nextQuestionId },
  );

  return unwrap<SurveyOption>(res);
};

export const reorderQuestionsApi = async ({
  campaignId,
  payload,
}: {
  campaignId: string;
  payload: ReorderQuestionsPayload;
}): Promise<SurveyQuestion[]> => {
  const res = await api.patch(
    `/survey/campaigns/${campaignId}/questions/reorder`,
    payload,
  );

  return unwrap<SurveyQuestion[]>(res);
};

export const applySurveyTemplateApi = async ({
  campaignId,
  templateKey,
}: ApplySurveyTemplatePayload): Promise<SurveyQuestion[]> => {
  const res = await api.post(`/survey/campaigns/${campaignId}/templates`, {
    templateKey,
  });

  return unwrap<SurveyQuestion[]>(res);
};