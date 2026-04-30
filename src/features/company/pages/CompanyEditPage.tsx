// src/features/company/pages/CompanyEditPage.tsx

import { ArrowLeftIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import CompanyForm from "../components/CompanyForm";
import { useCompanyById, useUpdateCompany } from "../hooks/useCompany";
import { UpdateCompanyPayload } from "../types/company.types";

const CompanyEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: company, isLoading, isError } = useCompanyById(id);
  const updateCompanyMutation = useUpdateCompany();

  const handleSubmit = async (data: UpdateCompanyPayload) => {
    if (!id) return;

    try {
      await updateCompanyMutation.mutateAsync({
        id,
        payload: data,
      });

      toast.success("Entreprise mise à jour avec succès");
      navigate(`/companies/${id}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la mise à jour de l’entreprise",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="card p-8 text-center text-slate-500">
        Chargement de l’entreprise...
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="card p-8 text-center text-rose-500">
        Entreprise introuvable.
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <button
          type="button"
          onClick={() => navigate(`/companies/${company.id}`)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Retour au détail
        </button>

        <div className="page-header">
          <h1 className="page-title">Modifier l’entreprise</h1>
          <p className="page-subtitle">
            Mettez à jour les informations de {company.name}.
          </p>
        </div>
      </div>

      <CompanyForm
        mode="edit"
        initialData={company}
        isSubmitting={updateCompanyMutation.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CompanyEditPage;
