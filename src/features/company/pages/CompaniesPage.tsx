//src/features/company/pages/CompaniesPage.tsx
import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  Plus,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useCompanies,
  useDeleteCompany,
  useUpdateCompanyStatus,
} from "../hooks/useCompany";
import { Company } from "../types/company.types";
import { Switch } from "../../../components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CompaniesPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const { data, isLoading, isError } = useCompanies({
    page,
    limit,
    search,
  });

  const updateStatusMutation = useUpdateCompanyStatus();

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  const deleteCompanyMutation = useDeleteCompany();

  const companies = data?.data || [];
  const meta = data?.meta;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleToggleStatus = async (company: Company) => {
    try {
      const nextStatus = company.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

      await updateStatusMutation.mutateAsync({
        id: company.id,
        status: nextStatus,
      });

      toast.success(
        nextStatus === "ACTIVE"
          ? "Entreprise activée avec succès"
          : "Entreprise désactivée avec succès",
      );
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors du changement de statut");
    }
  };

  const confirmDelete = async () => {
    if (!selectedCompany) return;

    try {
      await deleteCompanyMutation.mutateAsync(selectedCompany.id);
      toast.success("Entreprise supprimée avec succès");
      setOpenDelete(false);
      setSelectedCompany(null);
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors de la suppression");
    }
  };

  const getStatusBadge = (status: Company["status"]) => {
    const styles: Record<Company["status"], string> = {
      ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
      PENDING: "bg-amber-50 text-amber-700 border-amber-200",
      SUSPENDED: "bg-rose-50 text-rose-700 border-rose-200",
      DISABLED: "bg-slate-100 text-slate-600 border-slate-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Entreprises</h1>
        <p className="page-subtitle">
          Gérez les entreprises inscrites sur Jarendata.
        </p>
      </div>

      <div className="card p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher par nom, email, pays, ville..."
              className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500">
              {meta?.total || 0} entreprise(s)
            </div>

            <button
              type="button"
              onClick={() => navigate("/companies/create")}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une entreprise
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Entreprise
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Contact
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Localisation
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Secteur
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Crédits
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Statut
                </th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600">
                  Actif
                </th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    Chargement...
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-rose-500"
                  >
                    Erreur lors du chargement des entreprises.
                  </td>
                </tr>
              )}

              {!isLoading &&
                companies.map((company) => {
                  const owner = company.users?.find(
                    (user) => user.companyRole === "OWNER",
                  );

                  return (
                    <tr key={company.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold overflow-hidden">
                            {company.logoUrl ? (
                              <img
                                src={`${BASE_URL}${company.logoUrl}`}
                                alt={company.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              company.name.charAt(0).toUpperCase()
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-slate-900">
                              {company.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {company.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-slate-700">
                          {owner?.fullName || "—"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {company.email || owner?.email || "—"}
                        </p>
                        {company.phone && (
                          <p className="text-xs text-slate-500">
                            {company.phone}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        <p>{company.country}</p>
                        <p className="text-xs text-slate-400">
                          {company.city || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {company.industry || "—"}
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-semibold text-slate-900">
                          {company.creditBalance.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {getStatusBadge(company.status)}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <Switch
                          checked={company.status === "ACTIVE"}
                          disabled={updateStatusMutation.isPending}
                          onCheckedChange={() => handleToggleStatus(company)}
                        />
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                            title="Voir"
                            onClick={() => {
                              navigate(`/companies/${company.id}`);
                            }}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                            title="Modifier"
                            onClick={() => {
                              navigate(`/companies/${company.id}/edit`);
                            }}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                            title="Supprimer"
                            onClick={() => {
                              setSelectedCompany(company);
                              setOpenDelete(true);
                            }}
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!isLoading && companies.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    Aucune entreprise trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {meta && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Page {meta.currentPage} sur {meta.lastPage || 1}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={!meta.hasPreviousPage}
                onClick={() => setPage(meta.previousPage || 1)}
                className="inline-flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-50"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Précédent
              </button>

              <button
                disabled={!meta.hasNextPage}
                onClick={() => setPage(meta.nextPage || meta.currentPage)}
                className="inline-flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-50"
              >
                Suivant
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l’entreprise</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L’entreprise{" "}
              <span className="font-semibold text-slate-900">
                {selectedCompany?.name}
              </span>{" "}
              sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompaniesPage;
