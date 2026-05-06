import { FormEvent, useState } from "react";
import {
  Campaign,
  CampaignType,
  CreateCampaignPayload,
  UpdateCampaignPayload,
} from "../types/campaign.types";

type CampaignFormProps = {
  formId?: string;
  initialData?: Campaign | null;
  onSubmit: (
    data: CreateCampaignPayload | UpdateCampaignPayload,
  ) => Promise<void>;
};

const campaignTypes: { label: string; value: CampaignType }[] = [
  { label: "Satisfaction client", value: "CUSTOMER_SATISFACTION" },
  { label: "NPS", value: "NPS" },
  { label: "Feedback produit", value: "PRODUCT_FEEDBACK" },
  { label: "Test de prix", value: "PRICE_TEST" },
  { label: "Étude de marché", value: "MARKET_RESEARCH" },
  { label: "Rétention client", value: "CUSTOMER_RETENTION" },
  { label: "Personnalisée", value: "CUSTOM" },
];

const toDatetimeLocal = (date?: string | null) => {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().slice(0, 16);
};

const toIsoDateTime = (date?: string) => {
  if (!date) return undefined;
  return new Date(date).toISOString();
};

const CampaignForm = ({
  formId = "campaign-form",
  initialData,
  onSubmit,
}: CampaignFormProps) => {
  const [form, setForm] = useState<CreateCampaignPayload>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || "CUSTOM",
    targetAllContacts: initialData?.targetAllContacts || false,
    countryFilter: initialData?.countryFilter || "",
    cityFilter: initialData?.cityFilter || "",
    tagsFilter: initialData?.tagsFilter || [],
    scheduledAt: toDatetimeLocal(initialData?.scheduledAt),
  });

  const [tagInput, setTagInput] = useState("");

  const handleChange = (field: keyof CreateCampaignPayload, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;

    setForm((prev) => ({
      ...prev,
      tagsFilter: Array.from(new Set([...(prev.tagsFilter || []), value])),
    }));

    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tagsFilter: (prev.tagsFilter || []).filter((item) => item !== tag),
    }));
  };

  const cleanPayload = () => {
    return {
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      type: form.type,
      targetAllContacts: !!form.targetAllContacts,
      countryFilter: form.targetAllContacts
        ? undefined
        : form.countryFilter?.trim() || undefined,
      cityFilter: form.targetAllContacts
        ? undefined
        : form.cityFilter?.trim() || undefined,
      tagsFilter: form.targetAllContacts ? [] : form.tagsFilter || [],
      scheduledAt: toIsoDateTime(form.scheduledAt),
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(cleanPayload());
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nom de la campagne <span className="text-rose-500">*</span>
          </label>

          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            minLength={2}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: Enquête satisfaction clients"
          />
        </div>

        <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50">
          <p className="text-sm font-semibold text-indigo-700">
            Ciblage intelligent
          </p>
          <p className="text-xs text-indigo-600 mt-1">
            L’audience sera estimée automatiquement à partir des contacts
            acceptés.
          </p>
        </div>

        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>

          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Objectif ou contexte de la campagne..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Type de campagne
          </label>

          <select
            value={form.type}
            onChange={(e) =>
              handleChange("type", e.target.value as CampaignType)
            }
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {campaignTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Planification
          </label>

          <input
            type="datetime-local"
            value={form.scheduledAt || ""}
            onChange={(e) => handleChange("scheduledAt", e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <p className="text-xs text-slate-400 mt-1">
            Laissez vide pour garder la campagne en brouillon.
          </p>
        </div>

        <div className="lg:col-span-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.targetAllContacts}
              onChange={(e) =>
                handleChange("targetAllContacts", e.target.checked)
              }
              className="mt-1"
            />

            <span>
              <span className="block text-sm font-medium text-slate-800">
                Cibler tous les contacts acceptés
              </span>
              <span className="block text-xs text-slate-500 mt-1">
                Si cette option est cochée, les filtres pays, ville et tags ne
                seront pas utilisés.
              </span>
            </span>
          </label>
        </div>

        {!form.targetAllContacts && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Filtre pays
              </label>

              <input
                value={form.countryFilter}
                onChange={(e) => handleChange("countryFilter", e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Côte d'Ivoire"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Filtre ville
              </label>

              <input
                value={form.cityFilter}
                onChange={(e) => handleChange("cityFilter", e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Abidjan"
              />
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tags ciblés
              </label>

              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: vip, boutique, abidjan..."
                />

                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2.5 rounded-lg text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                >
                  Ajouter
                </button>
              </div>

              {(form.tagsFilter || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.tagsFilter?.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                    >
                      {tag} ×
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default CampaignForm;
