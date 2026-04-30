// src/features/company/components/CompanyForm.tsx

import { FormEvent, useState } from "react";
import {
  Company,
  CompanySize,
  CompanyStatus,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "../types/company.types";
import { SaveIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type CompanyFormProps = {
  initialData?: Company;
  isSubmitting?: boolean;
  mode: "create" | "edit";
  onSubmit: (
    data: CreateCompanyPayload | UpdateCompanyPayload,
  ) => Promise<void>;
};

const sizes: { label: string; value: CompanySize }[] = [
  { label: "Solo", value: "SOLO" },
  { label: "Petite", value: "SMALL" },
  { label: "Moyenne", value: "MEDIUM" },
  { label: "Grande", value: "LARGE" },
  { label: "Entreprise", value: "ENTERPRISE" },
];

const statuses: { label: string; value: CompanyStatus }[] = [
  { label: "En attente", value: "PENDING" },
  { label: "Active", value: "ACTIVE" },
  { label: "Suspendue", value: "SUSPENDED" },
  { label: "Désactivée", value: "DISABLED" },
];

const CompanyForm = ({
  initialData,
  isSubmitting = false,
  mode,
  onSubmit,
}: CompanyFormProps) => {
  const navigate = useNavigate();

  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData?.logoUrl || null,
  );

  const [form, setForm] = useState<CreateCompanyPayload>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "",
    country: initialData?.country || "Côte d'Ivoire",
    city: initialData?.city || "",
    address: initialData?.address || "",
    industry: initialData?.industry || "",
    size: initialData?.size || "SMALL",
    status: initialData?.status || "PENDING",
    logo: null,
  });

  const handleChange = (field: keyof CreateCompanyPayload, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const cleanPayload = () => {
    return {
      ...form,
      email: form.email?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      website: form.website?.trim() || undefined,
      city: form.city?.trim() || undefined,
      address: form.address?.trim() || undefined,
      industry: form.industry?.trim() || undefined,
      logo: form.logo || undefined,
    };
  };

  const handleLogoChange = (file?: File) => {
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      logo: file,
    }));

    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(cleanPayload());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Informations générales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Logo de l’entreprise
            </label>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo entreprise"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-400">Logo</span>
                )}
              </div>

              <div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => handleLogoChange(e.target.files?.[0])}
                  className="block text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />

                <p className="text-xs text-slate-400 mt-1">
                  Formats acceptés : JPG, PNG, WEBP.
                </p>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom de l’entreprise <span className="text-rose-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              minLength={2}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Jarendata"
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
              placeholder="contact@entreprise.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Téléphone
            </label>
            <input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="+225..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Site web
            </label>
            <input
              value={form.website}
              onChange={(e) => handleChange("website", e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Secteur d’activité
            </label>
            <input
              value={form.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Santé, Finance, Commerce..."
            />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Localisation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pays <span className="text-rose-500">*</span>
            </label>
            <input
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
              required
              minLength={2}
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Adresse
            </label>
            <input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Adresse complète"
            />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Paramètres
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Taille
            </label>
            <select
              value={form.size}
              onChange={(e) =>
                handleChange("size", e.target.value as CompanySize)
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {sizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Statut
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                handleChange("status", e.target.value as CompanyStatus)
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate("/companies")}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
        >
          <XIcon className="w-4 h-4" />
          Annuler
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
        >
          <SaveIcon className="w-4 h-4" />
          {isSubmitting
            ? "Enregistrement..."
            : mode === "create"
              ? "Créer l’entreprise"
              : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;
