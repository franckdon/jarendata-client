import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  applySurveyTemplateApi,
  createSurveyQuestionApi,
  deleteSurveyQuestionApi,
  getSurveyFlowApi,
  reorderQuestionsApi,
  replaceQuestionOptionsApi,
  updateOptionNextQuestionApi,
  updateSurveyQuestionApi,
} from "../api/survey.api";
import {
  ApplySurveyTemplatePayload,
  CreateSurveyOptionPayload,
  CreateSurveyQuestionPayload,
  ReorderQuestionsPayload,
  UpdateOptionNextQuestionPayload,
  UpdateSurveyQuestionPayload,
} from "../types/survey.types";

export const useSurveyFlow = (campaignId?: string) => {
  return useQuery({
    queryKey: ["survey-flow", campaignId],
    queryFn: () => getSurveyFlowApi(campaignId as string),
    enabled: !!campaignId,
  });
};

export const useCreateSurveyQuestion = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSurveyQuestionPayload) =>
      createSurveyQuestionApi({ campaignId, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["survey-flow", campaignId] });
    },
  });
};

export const useUpdateSurveyQuestion = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      payload,
    }: {
      questionId: string;
      payload: UpdateSurveyQuestionPayload;
    }) => updateSurveyQuestionApi({ campaignId, questionId, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["survey-flow", campaignId] });
    },
  });
};

export const useDeleteSurveyQuestion = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) =>
      deleteSurveyQuestionApi({ campaignId, questionId }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["survey-flow", campaignId] });
    },
  });
};

export const useReplaceQuestionOptions = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      options,
    }: {
      questionId: string;
      options: CreateSurveyOptionPayload[];
    }) => replaceQuestionOptionsApi({ campaignId, questionId, options }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["survey-flow", campaignId] });
    },
  });
};

export const useUpdateOptionNextQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateOptionNextQuestionPayload) =>
      updateOptionNextQuestionApi(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["survey-flow", variables.campaignId],
      });
    },
  });
};

export const useReorderQuestions = (campaignId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReorderQuestionsPayload) =>
      reorderQuestionsApi({ campaignId, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["survey-flow", campaignId] });
    },
  });
};

export const useApplySurveyTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApplySurveyTemplatePayload) =>
      applySurveyTemplateApi(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["survey-flow", variables.campaignId],
      });
    },
  });
};