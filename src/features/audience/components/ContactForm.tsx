import { FormEvent, useState } from "react";
import {
  ConsentStatus,
  Contact,
  ContactSource,
  CreateContactPayload,
  UpdateContactPayload,
} from "../types/audience.types";

type ContactFormProps = {
  formId?: string;
  initialData?: Contact | null;
  onSubmit: (
    data: CreateContactPayload | UpdateContactPayload,
  ) => Promise<void>;
};

const sourceOptions: { label: string; value: ContactSource }[] = [
  { label: "Manuel", value: "MANUAL" },
  { label: "Import", value: "IMPORT" },
  { label: "API", value: "API" },
  { label: "WhatsApp opt-in", value: "WHATSAPP_OPT_IN" },
];

const consentOptions: { label: string; value: ConsentStatus }[] = [
  { label: "En attente", value: "PENDING" },
  { label: "Accepté", value: "ACCEPTED" },
  { label: "Rejeté", value: "REJECTED" },
];

const ContactForm = ({
  formId = "contact-form",
  initialData,
  onSubmit,
}: ContactFormProps) => {
  const [form, setForm] = useState<CreateContactPayload>({
    fullName: initialData?.fullName || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    country: initialData?.country || "",
    city: initialData?.city || "",
    gender: initialData?.gender || "",
    ageRange: initialData?.ageRange || "",
    externalId: initialData?.externalId || "",
    source: initialData?.source || "MANUAL",
    consentStatus: initialData?.consentStatus || "PENDING",
    consentText: initialData?.consentText || "",
    tags: initialData?.tags || [],
  });

  const [tagInput, setTagInput] = useState("");

  const handleChange = (field: keyof CreateContactPayload, value: any) => {
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
      tags: Array.from(new Set([...(prev.tags || []), value])),
    }));

    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((item) => item !== tag),
    }));
  };

  const cleanPayload = () => {
    return {
      fullName: form.fullName?.trim() || undefined,
      phone: form.phone.trim(),
      email: form.email?.trim() || undefined,
      country: form.country?.trim() || undefined,
      city: form.city?.trim() || undefined,
      gender: form.gender?.trim() || undefined,
      ageRange: form.ageRange?.trim() || undefined,
      externalId: form.externalId?.trim() || undefined,
      source: form.source,
      consentStatus: form.consentStatus,
      consentText: form.consentText?.trim() || undefined,
      tags: form.tags || [],
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(cleanPayload());
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nom complet
          </label>
          <input
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            minLength={2}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: Jean Kouassi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Téléphone <span className="text-rose-500">*</span>
          </label>
          <input
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="+225..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="client@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Pays
          </label>
          <input
            value={form.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Côte d'Ivoire"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Ville
          </label>
          <input
            value={form.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Abidjan"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Genre
          </label>
          <input
            value={form.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Homme, Femme..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tranche d’âge
          </label>
          <input
            value={form.ageRange}
            onChange={(e) => handleChange("ageRange", e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="18-25, 26-35..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Source
          </label>
          <select
            value={form.source}
            onChange={(e) =>
              handleChange("source", e.target.value as ContactSource)
            }
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {sourceOptions.map((source) => (
              <option key={source.value} value={source.value}>
                {source.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Consentement
          </label>
          <select
            value={form.consentStatus}
            onChange={(e) =>
              handleChange("consentStatus", e.target.value as ConsentStatus)
            }
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {consentOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Identifiant externe
          </label>
          <input
            value={form.externalId}
            onChange={(e) => handleChange("externalId", e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="ID Sage, POS, ERP, site e-commerce..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Texte de consentement
          </label>
          <textarea
            value={form.consentText}
            onChange={(e) => handleChange("consentText", e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: Consentement donné lors du passage en boutique..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tags
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

          {(form.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.tags?.map((tag) => (
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
      </div>
    </form>
  );
};

export default ContactForm;
