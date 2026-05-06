import { useMemo, useState } from "react";
import {
  CalendarIcon,
  EditIcon,
  MegaphoneIcon,
  PlayIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import toast from "react-hot-toast";
import CampaignForm from "../components/CampaignForm";
import {
  Campaign,
  CampaignQueryParams,
  CampaignStatus,
  CampaignType,
  CreateCampaignPayload,
  UpdateCampaignPayload,
} from "../types/campaign.types";
import {
  useCampaigns,
  useCreateCampaign,
  useDeleteCampaign,
  useUpdateCampaign,
  useUpdateCampaignStatus,
} from "../hooks/useCampaign";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";

const CAMPAIGN_FORM_ID = "campaign-form";

const statusLabels: Record<CampaignStatus, string> = {
  DRAFT: "Brouillon",
  SCHEDULED: "Planifiée",
  RUNNING: "En cours",
  PAUSED: "En pause",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

const statusStyles: Record<CampaignStatus, string> = {
  DRAFT: "bg-slate-50 text-slate-700 border-slate-200",
  SCHEDULED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  RUNNING: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PAUSED: "bg-amber-50 text-amber-700 border-amber-200",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
};

const typeLabels: Record<CampaignType, string> = {
  CUSTOMER_SATISFACTION: "Satisfaction client",
  NPS: "NPS",
  PRODUCT_FEEDBACK: "Feedback produit",
  PRICE_TEST: "Test de prix",
  MARKET_RESEARCH: "Étude de marché",
  CUSTOMER_RETENTION: "Rétention client",
  CUSTOM: "Personnalisée",
};

const formatDate = (date?: string | null) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const CampaignsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CampaignStatus | "">("");
  const [type, setType] = useState<CampaignType | "">("");

  const [openForm, setOpenForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(
    null,
  );

  const params: CampaignQueryParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: search || undefined,
      status: status || undefined,
      type: type || undefined,
    }),
    [page, search, status, type],
  );

  const { data, isLoading, isError } = useCampaigns(params);

  const createCampaignMutation = useCreateCampaign();
  const updateCampaignMutation = useUpdateCampaign();
  const updateStatusMutation = useUpdateCampaignStatus();
  const deleteCampaignMutation = useDeleteCampaign();

  const campaigns = data?.data || [];
  const meta = data?.meta;

  const isSaving =
    createCampaignMutation.isPending || updateCampaignMutation.isPending;

  const handleOpenCreate = () => {
    setSelectedCampaign(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedCampaign(null);
  };

  const handleSubmit = async (
    payload: CreateCampaignPayload | UpdateCampaignPayload,
  ) => {
    try {
      if (selectedCampaign) {
        await updateCampaignMutation.mutateAsync({
          id: selectedCampaign.id,
          payload,
        });

        toast.success("Campagne modifiée avec succès");
      } else {
        await createCampaignMutation.mutateAsync(
          payload as CreateCampaignPayload,
        );

        toast.success("Campagne créée avec succès");
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

  const handleStatusChange = async (
    campaign: Campaign,
    newStatus: CampaignStatus,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: campaign.id,
        status: newStatus,
      });

      toast.success("Statut mis à jour avec succès");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la mise à jour du statut",
      );
    }
  };

  const handleDelete = async () => {
    if (!campaignToDelete) return;

    try {
      await deleteCampaignMutation.mutateAsync(campaignToDelete.id);
      toast.success("Campagne supprimée avec succès");
      setCampaignToDelete(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la suppression",
      );
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setType("");
    setPage(1);
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <MegaphoneIcon className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">Campagnes</h1>
            <p className="text-sm text-slate-500">
              Créez et pilotez vos campagnes WhatsApp.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="w-4 h-4" />
          Nouvelle campagne
        </button>
      </div>

      <div className="card p-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2 relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Rechercher par nom ou description..."
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as CampaignStatus | "");
              setPage(1);
            }}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tous les statuts</option>
            <option value="DRAFT">Brouillon</option>
            <option value="SCHEDULED">Planifiée</option>
            <option value="RUNNING">En cours</option>
            <option value="PAUSED">En pause</option>
            <option value="COMPLETED">Terminée</option>
            <option value="CANCELLED">Annulée</option>
          </select>

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as CampaignType | "");
              setPage(1);
            }}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tous les types</option>
            <option value="CUSTOMER_SATISFACTION">Satisfaction client</option>
            <option value="NPS">NPS</option>
            <option value="PRODUCT_FEEDBACK">Feedback produit</option>
            <option value="PRICE_TEST">Test de prix</option>
            <option value="MARKET_RESEARCH">Étude de marché</option>
            <option value="CUSTOMER_RETENTION">Rétention client</option>
            <option value="CUSTOM">Personnalisée</option>
          </select>
        </div>

        {(search || status || type) && (
          <div className="mt-3">
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">
            Chargement des campagnes...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-500">
            Erreur lors du chargement des campagnes.
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <MegaphoneIcon className="w-7 h-7" />
            </div>

            <p className="font-medium text-slate-900">
              Aucune campagne trouvée
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Créez votre première campagne pour interroger votre audience.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Campagne
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Statut
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Audience
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Planification
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {campaigns.map((campaign) => {
                    const canEdit = ["DRAFT", "SCHEDULED", "PAUSED"].includes(
                      campaign.status,
                    );

                    const canDelete = campaign.status === "DRAFT";

                    return (
                      <tr key={campaign.id}>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-slate-900">
                              <Link to={`/campaigns/${campaign.id}`}>
                                {campaign.name}
                              </Link>
                            </p>

                            <p className="text-xs text-slate-500 line-clamp-1">
                              {campaign.description || "Aucune description"}
                            </p>

                            {campaign.createdBy && (
                              <p className="text-xs text-slate-400 mt-1">
                                Créée par {campaign.createdBy.fullName}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {typeLabels[campaign.type]}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                              statusStyles[campaign.status]
                            }`}
                          >
                            {statusLabels[campaign.status]}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-medium text-slate-900">
                            {campaign.estimatedAudienceCount.toLocaleString()}{" "}
                            contacts
                          </p>
                          <p className="text-xs text-slate-500">
                            {campaign.estimatedCreditCost.toLocaleString()}{" "}
                            crédits estimés
                          </p>
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-slate-400" />
                            <span>{formatDate(campaign.scheduledAt)}</span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={campaign.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  campaign,
                                  e.target.value as CampaignStatus,
                                )
                              }
                              disabled={updateStatusMutation.isPending}
                              className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                            >
                              <option value="DRAFT">Brouillon</option>
                              <option value="SCHEDULED">Planifiée</option>
                              <option value="RUNNING">Lancer</option>
                              <option value="PAUSED">Pause</option>
                              <option value="COMPLETED">Terminée</option>
                              <option value="CANCELLED">Annulée</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(campaign)}
                              disabled={!canEdit}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <EditIcon className="w-4 h-4" />
                              Modifier
                            </button>

                            <button
                              type="button"
                              onClick={() => setCampaignToDelete(campaign)}
                              disabled={!canDelete}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2Icon className="w-4 h-4" />
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {meta && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Page {meta.page} sur {meta.totalPages} — {meta.total}{" "}
                  campagnes
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Précédent
                  </button>

                  <button
                    type="button"
                    disabled={meta.totalPages === 0 || page >= meta.totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog
        open={openForm}
        onOpenChange={(open) => {
          setOpenForm(open);
          if (!open) setSelectedCampaign(null);
        }}
      >
        <AlertDialogContent className="!w-[92vw] !max-w-6xl max-h-[92vh] overflow-hidden p-0">
          <div className="flex flex-col w-full max-h-[92vh]">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {selectedCampaign
                    ? "Modifier la campagne"
                    : "Créer une campagne"}
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Définissez le type, la cible et la planification de la
                  campagne.
                </AlertDialogDescription>
              </AlertDialogHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              <CampaignForm
                formId={CAMPAIGN_FORM_ID}
                initialData={selectedCampaign}
                onSubmit={handleSubmit}
              />
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-white">
              <button
                type="button"
                onClick={handleCloseForm}
                className="inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>

              <button
                type="submit"
                form={CAMPAIGN_FORM_ID}
                disabled={isSaving}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
              >
                {isSaving
                  ? "Enregistrement..."
                  : selectedCampaign
                    ? "Enregistrer les modifications"
                    : "Créer la campagne"}
              </button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!campaignToDelete}
        onOpenChange={(open) => {
          if (!open) setCampaignToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la campagne</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La campagne{" "}
              <span className="font-semibold text-slate-900">
                {campaignToDelete?.name}
              </span>{" "}
              sera supprimée définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteCampaignMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {deleteCampaignMutation.isPending
                ? "Suppression..."
                : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampaignsPage;
