// src/features/company/pages/CompanyCreatePage.tsx

import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CompanyForm from "../components/CompanyForm";
import { useCreateCompany } from "../hooks/useCompany";
import { CreateCompanyPayload } from "../types/company.types";

const CompanyCreatePage = () => {
  const navigate = useNavigate();
  const createCompanyMutation = useCreateCompany();

  const handleSubmit = async (data: CreateCompanyPayload) => {
    try {
      const company = await createCompanyMutation.mutateAsync(data);

      toast.success("Entreprise créée avec succès");
      navigate(`/companies/${company.id}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la création de l’entreprise",
      );
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <button
          type="button"
          onClick={() => navigate("/companies")}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Retour aux entreprises
        </button>

        <div className="page-header">
          <h1 className="page-title">Nouvelle entreprise</h1>
          <p className="page-subtitle">
            Créez une entreprise et renseignez ses informations principales.
          </p>
        </div>
      </div>

      <CompanyForm
        mode="create"
        isSubmitting={createCompanyMutation.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CompanyCreatePage;
