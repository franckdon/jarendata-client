// src/features/company/pages/CompanyDetailPage.tsx
import {
  ArrowLeftIcon,
  Building2Icon,
  CalendarIcon,
  CoinsIcon,
  EditIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserIcon,
  UsersIcon,
  GlobeIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCompanyById, useDeleteCompany } from "../hooks/useCompany";
import { Company, CompanyStatus } from "../types/company.types";
import toast from "react-hot-toast";
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
import { useState } from "react";
import CompanyUsersSection from "../components/CompanyUsersSection";
import AdminCreditDialog from "@/features/credit/components/AdminCreditDialog";

const statusLabels: Record<CompanyStatus, string> = {
  ACTIVE: "Active",
  PENDING: "En attente",
  SUSPENDED: "Suspendue",
  DISABLED: "Désactivée",
};

const statusStyles: Record<CompanyStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  SUSPENDED: "bg-rose-50 text-rose-700 border-rose-200",
  DISABLED: "bg-slate-100 text-slate-600 border-slate-200",
};

const sizeLabels: Record<Company["size"], string> = {
  SOLO: "Solo",
  SMALL: "Petite entreprise",
  MEDIUM: "Moyenne entreprise",
  LARGE: "Grande entreprise",
  ENTERPRISE: "Entreprise",
};

const formatDate = (date?: string) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string | number | null;
}) => {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
      <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-indigo-600">
        <Icon className="w-4 h-4" />
      </div>

      <div>
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value || "—"}</p>
      </div>
    </div>
  );
};

const CompanyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [openDelete, setOpenDelete] = useState(false);

  const [openCredits, setOpenCredits] = useState(false);

  const { data: company, isLoading, isError } = useCompanyById(id);
  const deleteCompanyMutation = useDeleteCompany();

  const handleDelete = async () => {
    if (!company) return;

    try {
      await deleteCompanyMutation.mutateAsync(company.id);
      toast.success("Entreprise supprimée avec succès");
      navigate("/companies");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la suppression",
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

  const owner = company.users?.find((user) => user.companyRole === "OWNER");

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

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl font-bold overflow-hidden">
              {company.logoUrl ? (
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
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">
                  {company.name}
                </h1>

                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[company.status]}`}
                >
                  {statusLabels[company.status]}
                </span>
              </div>

              <p className="text-sm text-slate-500">{company.slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpenCredits(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
            >
              Gérer crédits
            </button>

            <button
              type="button"
              onClick={() => navigate(`/companies/${company.id}/edit`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <EditIcon className="w-4 h-4" />
              Modifier
            </button>

            <button
              type="button"
              onClick={() => setOpenDelete(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-rose-600 bg-rose-50 hover:bg-rose-100"
            >
              <Trash2Icon className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Informations de l’entreprise
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={Building2Icon} label="Nom" value={company.name} />
              <InfoItem
                icon={ShieldCheckIcon}
                label="Statut"
                value={statusLabels[company.status]}
              />
              <InfoItem icon={MailIcon} label="Email" value={company.email} />
              <InfoItem
                icon={PhoneIcon}
                label="Téléphone"
                value={company.phone}
              />
              <InfoItem
                icon={GlobeIcon}
                label="Site web"
                value={company.website}
              />
              <InfoItem
                icon={Building2Icon}
                label="Secteur"
                value={company.industry}
              />
              <InfoItem
                icon={UsersIcon}
                label="Taille"
                value={sizeLabels[company.size]}
              />
              <InfoItem
                icon={CoinsIcon}
                label="Crédits disponibles"
                value={company.creditBalance.toLocaleString()}
              />
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Localisation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={MapPinIcon}
                label="Pays"
                value={company.country}
              />
              <InfoItem icon={MapPinIcon} label="Ville" value={company.city} />
              <div className="md:col-span-2">
                <InfoItem
                  icon={MapPinIcon}
                  label="Adresse"
                  value={company.address}
                />
              </div>
            </div>
          </div>

          <CompanyUsersSection company={company} />
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Propriétaire
            </h2>

            {owner ? (
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <UserIcon className="w-5 h-5" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {owner.fullName}
                  </p>
                  <p className="text-sm text-slate-500">{owner.email}</p>
                  <p className="text-xs text-indigo-600 mt-1">OWNER</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Aucun propriétaire identifié.
              </p>
            )}
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Dates</h2>

            <div className="space-y-3">
              <InfoItem
                icon={CalendarIcon}
                label="Créée le"
                value={formatDate(company.createdAt)}
              />
              <InfoItem
                icon={CalendarIcon}
                label="Dernière modification"
                value={formatDate(company.updatedAt)}
              />
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l’entreprise</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L’entreprise{" "}
              <span className="font-semibold text-slate-900">
                {company.name}
              </span>{" "}
              sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AdminCreditDialog
        companyId={company.id}
        companyName={company.name}
        open={openCredits}
        onOpenChange={setOpenCredits}
      />
    </div>
  );
};

export default CompanyDetailPage;
