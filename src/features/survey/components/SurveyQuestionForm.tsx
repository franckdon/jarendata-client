import { FormEvent, useState } from "react";
import {
  CreateSurveyOptionPayload,
  CreateSurveyQuestionPayload,
  SurveyQuestion,
  SurveyQuestionType,
  UpdateSurveyQuestionPayload,
} from "../types/survey.types";

type SurveyQuestionFormProps = {
  formId?: string;
  initialData?: SurveyQuestion | null;
  nextOrder?: number;
  onSubmit: (
    data: CreateSurveyQuestionPayload | UpdateSurveyQuestionPayload,
  ) => Promise<void>;
};

const questionTypes: { label: string; value: SurveyQuestionType }[] = [
  { label: "Texte libre", value: "TEXT" },
  { label: "Choix unique", value: "SINGLE_CHOICE" },
  { label: "Choix multiple", value: "MULTIPLE_CHOICE" },
  { label: "Notation", value: "RATING" },
  { label: "Oui / Non", value: "YES_NO" },
];

const needsOptions = (type: SurveyQuestionType) =>
  ["SINGLE_CHOICE", "MULTIPLE_CHOICE", "RATING", "YES_NO"].includes(type);

const defaultOptionsForType = (
  type: SurveyQuestionType,
): CreateSurveyOptionPayload[] => {
  if (type === "YES_NO") {
    return [
      { label: "Oui", value: "yes", order: 1 },
      { label: "Non", value: "no", order: 2 },
    ];
  }

  if (type === "RATING") {
    return [1, 2, 3, 4, 5].map((value) => ({
      label: String(value),
      value: String(value),
      order: value,
    }));
  }

  return [
    { label: "Option 1", value: "option_1", order: 1 },
    { label: "Option 2", value: "option_2", order: 2 },
  ];
};

const SurveyQuestionForm = ({
  formId = "survey-question-form",
  initialData,
  nextOrder = 1,
  onSubmit,
}: SurveyQuestionFormProps) => {
  const [form, setForm] = useState<CreateSurveyQuestionPayload>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || "SINGLE_CHOICE",
    order: initialData?.order || nextOrder,
    isRequired: initialData?.isRequired ?? true,
    placeholder: initialData?.placeholder || "",
    minValue: initialData?.minValue ?? undefined,
    maxValue: initialData?.maxValue ?? undefined,
    options:
      initialData?.options?.map((option) => ({
        label: option.label,
        value: option.value,
        order: option.order,
        nextQuestionId: option.nextQuestionId || null,
      })) || defaultOptionsForType("SINGLE_CHOICE"),
  });

  const handleChange = (
    field: keyof CreateSurveyQuestionPayload,
    value: any,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTypeChange = (type: SurveyQuestionType) => {
    setForm((prev) => ({
      ...prev,
      type,
      minValue: type === "RATING" ? (prev.minValue ?? 1) : undefined,
      maxValue: type === "RATING" ? (prev.maxValue ?? 5) : undefined,
      options: needsOptions(type) ? defaultOptionsForType(type) : [],
    }));
  };

  const addOption = () => {
    setForm((prev) => {
      const nextIndex = (prev.options || []).length + 1;

      return {
        ...prev,
        options: [
          ...(prev.options || []),
          {
            label: `Option ${nextIndex}`,
            value: `option_${nextIndex}`,
            order: nextIndex,
          },
        ],
      };
    });
  };

  const updateOption = (
    index: number,
    field: keyof CreateSurveyOptionPayload,
    value: any,
  ) => {
    setForm((prev) => ({
      ...prev,
      options: (prev.options || []).map((option, optionIndex) =>
        optionIndex === index
          ? {
              ...option,
              [field]: value,
            }
          : option,
      ),
    }));
  };

  const removeOption = (index: number) => {
    setForm((prev) => ({
      ...prev,
      options: (prev.options || [])
        .filter((_, optionIndex) => optionIndex !== index)
        .map((option, optionIndex) => ({
          ...option,
          order: optionIndex + 1,
        })),
    }));
  };

  const cleanPayload = () => {
    const payload: CreateSurveyQuestionPayload = {
      title: form.title.trim(),
      description: form.description?.trim() || undefined,
      type: form.type,
      order: Number(form.order),
      isRequired: !!form.isRequired,
      placeholder: form.placeholder?.trim() || undefined,
      minValue:
        form.type === "RATING" && form.minValue !== undefined
          ? Number(form.minValue)
          : undefined,
      maxValue:
        form.type === "RATING" && form.maxValue !== undefined
          ? Number(form.maxValue)
          : undefined,
      options: needsOptions(form.type)
        ? (form.options || []).map((option, index) => ({
            label: option.label.trim(),
            value: option.value.trim(),
            order: index + 1,
            nextQuestionId: option.nextQuestionId || null,
          }))
        : [],
    };

    return payload;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(cleanPayload());
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Question <span className="text-rose-500">*</span>
          </label>

          <textarea
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            minLength={2}
            rows={3}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: Sur une échelle de 1 à 5, êtes-vous satisfait ?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Type
          </label>

          <select
            value={form.type}
            onChange={(e) =>
              handleTypeChange(e.target.value as SurveyQuestionType)
            }
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {questionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 mt-4 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={!!form.isRequired}
              onChange={(e) => handleChange("isRequired", e.target.checked)}
            />
            Question obligatoire
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Ordre
          </label>

          <input
            type="number"
            min={1}
            value={form.order}
            onChange={(e) => handleChange("order", Number(e.target.value))}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {form.type === "TEXT" && (
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Placeholder
            </label>

            <input
              value={form.placeholder}
              onChange={(e) => handleChange("placeholder", e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Votre réponse..."
            />
          </div>
        )}

        {form.type === "RATING" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Valeur minimale
              </label>

              <input
                type="number"
                value={form.minValue ?? 1}
                onChange={(e) =>
                  handleChange("minValue", Number(e.target.value))
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Valeur maximale
              </label>

              <input
                type="number"
                value={form.maxValue ?? 5}
                onChange={(e) =>
                  handleChange("maxValue", Number(e.target.value))
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </>
        )}

        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>

          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={2}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Instruction complémentaire..."
          />
        </div>
      </div>

      {needsOptions(form.type) && (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-800">Options</p>

            <button
              type="button"
              onClick={addOption}
              className="text-sm text-indigo-700 hover:text-indigo-900"
            >
              Ajouter une option
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {(form.options || []).map((option, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4"
              >
                <div className="md:col-span-5">
                  <label className="block text-xs text-slate-500 mb-1">
                    Libellé
                  </label>
                  <input
                    value={option.label}
                    onChange={(e) =>
                      updateOption(index, "label", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>

                <div className="md:col-span-5">
                  <label className="block text-xs text-slate-500 mb-1">
                    Valeur
                  </label>
                  <input
                    value={option.value}
                    onChange={(e) =>
                      updateOption(index, "value", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs text-slate-500 mb-1">
                    Ordre
                  </label>
                  <input
                    type="number"
                    value={option.order}
                    onChange={(e) =>
                      updateOption(index, "order", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>

                <div className="md:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-rose-600 bg-rose-50 hover:bg-rose-100"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};

export default SurveyQuestionForm;
