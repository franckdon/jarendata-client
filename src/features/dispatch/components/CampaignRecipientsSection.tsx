import { useState } from "react";
import {
  RefreshCcwIcon,
  SearchIcon,
  SendIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { CampaignRecipientStatus } from "../types/dispatch.types";
import {
  useCampaignRecipientStats,
  useCampaignRecipients,
  useClearCampaignRecipients,
  useGenerateCampaignRecipients,
  useRecipientPreview,
  useUpdateCampaignRecipientStatus,
} from "../hooks/useDispatch";

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

type CampaignRecipientsSectionProps = {
  campaignId: string;
};

const statusLabels: Record<CampaignRecipientStatus, string> = {
  PENDING: "En attente",
  SENT: "Envoyé",
  DELIVERED: "Livré",
  READ: "Lu",
  RESPONDED: "Répondu",
  FAILED: "Échec",
  CANCELLED: "Annulé",
};

const statusStyles: Record<CampaignRecipientStatus, string> = {
  PENDING: "bg-slate-50 text-slate-700 border-slate-200",
  SENT: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-blue-50 text-blue-700 border-blue-200",
  READ: "bg-emerald-50 text-emerald-700 border-emerald-200",
  RESPONDED: "bg-green-50 text-green-700 border-green-200",
  FAILED: "bg-rose-50 text-rose-700 border-rose-200",
  CANCELLED: "bg-amber-50 text-amber-700 border-amber-200",
};

const statuses: CampaignRecipientStatus[] = [
  "PENDING",
  "SENT",
  "DELIVERED",
  "READ",
  "RESPONDED",
  "FAILED",
  "CANCELLED",
];

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="card p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
};

const CampaignRecipientsSection = ({
  campaignId,
}: CampaignRecipientsSectionProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CampaignRecipientStatus | "">("");
  const [openClear, setOpenClear] = useState(false);

  const { data: preview, isLoading: isPreviewLoading } =
    useRecipientPreview(campaignId);

  const { data: stats } = useCampaignRecipientStats(campaignId);

  const { data, isLoading, isError } = useCampaignRecipients(campaignId, {
    page,
    limit: 10,
    search: search || undefined,
    status: status || undefined,
  });

  const generateMutation = useGenerateCampaignRecipients(campaignId);
  const updateStatusMutation = useUpdateCampaignRecipientStatus();
  const clearMutation = useClearCampaignRecipients(campaignId);

  const recipients = data?.data || [];
  const meta = data?.meta;

  const handleGenerate = async () => {
    try {
      const result = await generateMutation.mutateAsync();

      toast.success(
        `${result.recipientsCount} destinataire(s) généré(s) avec succès`,
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la génération des destinataires",
      );
    }
  };

  const handleStatusChange = async (
    recipientId: string,
    newStatus: CampaignRecipientStatus,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        campaignId,
        recipientId,
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

  const handleClear = async () => {
    try {
      await clearMutation.mutateAsync();
      toast.success("Destinataires en attente supprimés avec succès");
      setOpenClear(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors du nettoyage des destinataires",
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <UsersIcon className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Destinataires
              </h2>
              <p className="text-sm text-slate-500">
                Préparez et suivez les contacts ciblés par la campagne.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={
                generateMutation.isPending ||
                isPreviewLoading ||
                !preview?.canGenerateRecipients
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              <SendIcon className="w-4 h-4" />
              {generateMutation.isPending
                ? "Génération..."
                : "Générer les destinataires"}
            </button>

            <button
              type="button"
              onClick={() => setOpenClear(true)}
              disabled={!stats?.pending || clearMutation.isPending}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50"
            >
              <Trash2Icon className="w-4 h-4" />
              Nettoyer pending
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Contacts éligibles"
          value={preview?.eligibleContactsCount ?? "—"}
        />
        <StatCard
          label="Destinataires existants"
          value={preview?.existingRecipientsCount ?? "—"}
        />
        <StatCard
          label="Coût estimé"
          value={preview?.estimatedCreditCost ?? "—"}
        />
        <StatCard
          label="Taux de réponse"
          value={stats ? `${stats.responseRate}%` : "—"}
        />
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Envoyés" value={stats.sent} />
          <StatCard label="Livrés" value={stats.delivered} />
          <StatCard label="Lus" value={stats.read} />
          <StatCard label="Répondus" value={stats.responded} />
          <StatCard label="Échecs" value={stats.failed} />
          <StatCard label="Annulés" value={stats.cancelled} />
        </div>
      )}

      <div className="card p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Rechercher par nom, téléphone, email, ville..."
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as CampaignRecipientStatus | "");
              setPage(1);
            }}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tous les statuts</option>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {statusLabels[item]}
              </option>
            ))}
          </select>
        </div>

        {(search || status) && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("");
                setPage(1);
              }}
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
            Chargement des destinataires...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-500">
            Erreur lors du chargement des destinataires.
          </div>
        ) : recipients.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <RefreshCcwIcon className="w-7 h-7" />
            </div>

            <p className="font-medium text-slate-900">
              Aucun destinataire généré
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Générez les destinataires à partir de l’audience ciblée.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Contact
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Localisation
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Statut
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Dates
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recipients.map((recipient) => (
                    <tr key={recipient.id}>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">
                          {recipient.contact?.fullName || "Sans nom"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {recipient.contact?.phone}
                        </p>
                        {recipient.contact?.email && (
                          <p className="text-xs text-slate-400">
                            {recipient.contact.email}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        <p>{recipient.contact?.country || "—"}</p>
                        <p className="text-xs text-slate-400">
                          {recipient.contact?.city || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            statusStyles[recipient.status]
                          }`}
                        >
                          {statusLabels[recipient.status]}
                        </span>

                        {recipient.errorMessage && (
                          <p className="text-xs text-rose-500 mt-1">
                            {recipient.errorMessage}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-500 space-y-1">
                        <p>Envoyé : {recipient.sentAt ? "Oui" : "—"}</p>
                        <p>Livré : {recipient.deliveredAt ? "Oui" : "—"}</p>
                        <p>Lu : {recipient.readAt ? "Oui" : "—"}</p>
                        <p>Répondu : {recipient.respondedAt ? "Oui" : "—"}</p>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end">
                          <select
                            value={recipient.status}
                            disabled={updateStatusMutation.isPending}
                            onChange={(e) =>
                              handleStatusChange(
                                recipient.id,
                                e.target.value as CampaignRecipientStatus,
                              )
                            }
                            className="px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                          >
                            {statuses.map((item) => (
                              <option key={item} value={item}>
                                {statusLabels[item]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Page {meta.page} sur {meta.totalPages} — {meta.total}{" "}
                  destinataires
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

      <AlertDialog open={openClear} onOpenChange={setOpenClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nettoyer les destinataires</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera uniquement les destinataires encore en
              attente. Les destinataires envoyés, lus, répondus ou en erreur ne
              seront pas supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleClear}
              disabled={clearMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {clearMutation.isPending ? "Nettoyage..." : "Nettoyer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampaignRecipientsSection;
