import { useState } from "react";
import {
  EditIcon,
  FileQuestionIcon,
  PlusIcon,
  Trash2Icon,
  Wand2Icon,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  CreateSurveyQuestionPayload,
  SurveyQuestion,
  SurveyTemplateKey,
  UpdateSurveyQuestionPayload,
} from "../types/survey.types";
import {
  useApplySurveyTemplate,
  useCreateSurveyQuestion,
  useDeleteSurveyQuestion,
  useSurveyFlow,
  useUpdateSurveyQuestion,
} from "../hooks/useSurvey";
import SurveyQuestionForm from "./SurveyQuestionForm";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const QUESTION_FORM_ID = "survey-question-form";

const typeLabels: Record<string, string> = {
  TEXT: "Texte",
  SINGLE_CHOICE: "Choix unique",
  MULTIPLE_CHOICE: "Choix multiple",
  RATING: "Notation",
  YES_NO: "Oui / Non",
};

const templateOptions: { label: string; value: SurveyTemplateKey }[] = [
  { label: "Satisfaction client", value: "CUSTOMER_SATISFACTION" },
  { label: "Test de prix", value: "PRICE_TEST" },
  { label: "Étude de marché", value: "MARKET_RESEARCH" },
  { label: "Feedback produit", value: "PRODUCT_FEEDBACK" },
  { label: "Fidélisation client", value: "CUSTOMER_RETENTION" },
  { label: "NPS", value: "NPS" },
  { label: "Validation idée business", value: "BUSINESS_IDEA_VALIDATION" },
];

type SurveyQuestionsSectionProps = {
  campaignId: string;
};

const SurveyQuestionsSection = ({
  campaignId,
}: SurveyQuestionsSectionProps) => {
  const {
    data: questions = [],
    isLoading,
    isError,
  } = useSurveyFlow(campaignId);

  const [openForm, setOpenForm] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<SurveyQuestion | null>(null);
  const [questionToDelete, setQuestionToDelete] =
    useState<SurveyQuestion | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplateKey>(
    "CUSTOMER_SATISFACTION",
  );

  const createMutation = useCreateSurveyQuestion(campaignId);
  const updateMutation = useUpdateSurveyQuestion(campaignId);
  const deleteMutation = useDeleteSurveyQuestion(campaignId);
  const applyTemplateMutation = useApplySurveyTemplate();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleOpenCreate = () => {
    setSelectedQuestion(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (question: SurveyQuestion) => {
    setSelectedQuestion(question);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedQuestion(null);
    setOpenForm(false);
  };

  const handleSubmit = async (
    payload: CreateSurveyQuestionPayload | UpdateSurveyQuestionPayload,
  ) => {
    try {
      if (selectedQuestion) {
        await updateMutation.mutateAsync({
          questionId: selectedQuestion.id,
          payload,
        });
        toast.success("Question modifiée avec succès");
      } else {
        await createMutation.mutateAsync(
          payload as CreateSurveyQuestionPayload,
        );
        toast.success("Question ajoutée avec succès");
      }

      handleCloseForm();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de l'enregistrement",
      );
    }
  };

  const handleApplyTemplate = async () => {
    try {
      await applyTemplateMutation.mutateAsync({
        campaignId,
        templateKey: selectedTemplate,
      });

      toast.success("Template appliqué avec succès");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de l'application du template",
      );
    }
  };

  const handleDelete = async () => {
    if (!questionToDelete) return;

    try {
      await deleteMutation.mutateAsync(questionToDelete.id);
      toast.success("Question supprimée avec succès");
      setQuestionToDelete(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la suppression",
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Questionnaire
            </h2>
            <p className="text-sm text-slate-500">
              Configurez les questions et le flow de réponse.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <select
              value={selectedTemplate}
              onChange={(e) =>
                setSelectedTemplate(e.target.value as SurveyTemplateKey)
              }
              disabled={questions.length > 0}
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white disabled:opacity-50"
            >
              {templateOptions.map((template) => (
                <option key={template.value} value={template.value}>
                  {template.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={questions.length > 0 || applyTemplateMutation.isPending}
              onClick={handleApplyTemplate}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50"
            >
              <Wand2Icon className="w-4 h-4" />
              Appliquer template
            </button>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="w-4 h-4" />
              Ajouter une question
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">
            Chargement du questionnaire...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-500">
            Erreur lors du chargement du questionnaire.
          </div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <FileQuestionIcon className="w-7 h-7" />
            </div>
            <p className="font-medium text-slate-900">Aucune question</p>
            <p className="text-sm text-slate-500 mt-1">
              Ajoutez une question ou appliquez un template.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {questions.map((question) => (
              <div key={question.id} className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-semibold">
                      {question.order}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 text-slate-700 border-slate-200">
                          {typeLabels[question.type]}
                        </span>

                        {question.isRequired && (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border bg-rose-50 text-rose-700 border-rose-200">
                            Obligatoire
                          </span>
                        )}
                      </div>

                      <p className="font-semibold text-slate-900">
                        {question.title}
                      </p>

                      {question.description && (
                        <p className="text-sm text-slate-500 mt-1">
                          {question.description}
                        </p>
                      )}

                      {question.options?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {question.options.map((option) => (
                            <span
                              key={option.id}
                              className="inline-flex px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-600"
                            >
                              {option.label}
                              {option.nextQuestionId ? " → redirection" : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(question)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                    >
                      <EditIcon className="w-4 h-4" />
                      Modifier
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuestionToDelete(question)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-600 bg-rose-50 hover:bg-rose-100"
                    >
                      <Trash2Icon className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={openForm}
        onOpenChange={(open) => {
          setOpenForm(open);
          if (!open) setSelectedQuestion(null);
        }}
      >
        <AlertDialogContent className="!w-[92vw] !max-w-5xl max-h-[92vh] overflow-hidden p-0">
          <div className="flex flex-col max-h-[92vh]">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {selectedQuestion
                    ? "Modifier la question"
                    : "Ajouter une question"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Configurez le contenu, le type et les options de la question.
                </AlertDialogDescription>
              </AlertDialogHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              <SurveyQuestionForm
                formId={QUESTION_FORM_ID}
                initialData={selectedQuestion}
                nextOrder={questions.length + 1}
                onSubmit={handleSubmit}
              />
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-white">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>

              <button
                type="submit"
                form={QUESTION_FORM_ID}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
              >
                {isSaving
                  ? "Enregistrement..."
                  : selectedQuestion
                    ? "Enregistrer"
                    : "Ajouter"}
              </button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!questionToDelete}
        onOpenChange={(open) => {
          if (!open) setQuestionToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la question</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La question sera supprimée du
              questionnaire.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SurveyQuestionsSection;
