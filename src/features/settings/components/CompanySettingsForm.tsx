import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Building2Icon, LockIcon } from "lucide-react";
import { api } from "../../../lib/api";
import { unwrap } from "../../../lib/apiResponse";
import {
  Company,
  CompanySize,
  UpdateCompanyPayload,
} from "../../company/types/company.types";

type Props = {
  canEdit: boolean;
};

const sizeLabels: Record<CompanySize, string> = {
  SOLO: "Solo",
  SMALL: "Petite entreprise",
  MEDIUM: "Moyenne entreprise",
  LARGE: "Grande entreprise",
  ENTERPRISE: "Entreprise",
};

const CompanySettingsForm = ({ canEdit }: Props) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [form, setForm] = useState<UpdateCompanyPayload>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCompany = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/companies/me");
      const data = unwrap<Company>(res);

      setCompany(data);
      setForm({
        name: data.name,
        email: data.email || "",
        phone: data.phone || "",
        website: data.website || "",
        country: data.country,
        city: data.city || "",
        address: data.address || "",
        industry: data.industry || "",
        size: data.size,
        logo: null,
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors du chargement de l'entreprise",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleChange = (field: keyof UpdateCompanyPayload, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const buildFormData = () => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      if (key === "logo" && value instanceof File) {
        formData.append("logo", value);
        return;
      }

      if (key !== "logo") {
        formData.append(key, String(value));
      }
    });

    return formData;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!canEdit) return;

    try {
      setIsSubmitting(true);

      const res = await api.patch("/companies/me", buildFormData(), {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedCompany = unwrap<Company>(res);

      setCompany(updatedCompany);
      toast.success("Entreprise mise à jour avec succès");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la mise à jour de l'entreprise",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="card p-8 text-center text-slate-500">
        Chargement de l’entreprise...
      </div>
    );
  }

  if (!company) {
    return (
      <div className="card p-8 text-center text-rose-500">
        Entreprise introuvable.
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Building2Icon className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">Entreprise</h2>
            <p className="text-sm text-slate-500">
              Informations générales de votre entreprise.
            </p>
          </div>
        </div>

        {!canEdit && (
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-amber-700 bg-amber-50 border border-amber-200">
            <LockIcon className="w-4 h-4" />
            Réservé au propriétaire
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-xl font-bold text-slate-600">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo preview"
                className="w-full h-full object-cover"
              />
            ) : company.logoUrl ? (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${company.logoUrl}`}
                alt={company.name}
                className="w-full h-full object-cover"
              />
            ) : (
              company.name.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Logo
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={!canEdit}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleChange("logo", file);

                if (file) {
                  setLogoPreview(URL.createObjectURL(file));
                }
              }}
              className="text-sm text-slate-600 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom
            </label>
            <input
              value={form.name || ""}
              disabled={!canEdit}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Taille
            </label>
            <select
              value={form.size || "SMALL"}
              disabled={!canEdit}
              onChange={(e) => handleChange("size", e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white disabled:bg-slate-50"
            >
              {Object.entries(sizeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email || ""}
              disabled={!canEdit}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Téléphone
            </label>
            <input
              value={form.phone || ""}
              disabled={!canEdit}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Site web
            </label>
            <input
              value={form.website || ""}
              disabled={!canEdit}
              onChange={(e) => handleChange("website", e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm disabled:bg-slate-50"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Secteur
            </label>
            <input
              value={form.industry || ""}
              disabled={!canEdit}
              onChange={(e) => handleChange("industry", e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pays
            </label>
            <input
              value={form.country || ""}
              disabled={!canEdit}
              onChange={(e) => handleChange("country", e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ville
            </label>
            <input
              value={form.city || ""}
              disabled={!canEdit}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm disabled:bg-slate-50"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Adresse
            </label>
            <input
              value={form.address || ""}
              disabled={!canEdit}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm disabled:bg-slate-50"
            />
          </div>
        </div>

        {canEdit && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CompanySettingsForm;
