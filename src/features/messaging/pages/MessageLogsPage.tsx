import { useMemo, useState } from "react";
import { SearchIcon, SendIcon } from "lucide-react";
import { MessageDirection, MessageStatus } from "../types/messaging.types";
import { useMessageLogs } from "../hooks/useMessaging";

const statusLabels: Record<MessageStatus, string> = {
  PENDING: "En attente",
  SENT: "Envoyé",
  DELIVERED: "Livré",
  READ: "Lu",
  FAILED: "Échec",
  RECEIVED: "Reçu",
};

const directionLabels: Record<MessageDirection, string> = {
  INBOUND: "Entrant",
  OUTBOUND: "Sortant",
};

const MessageLogsPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<MessageStatus | "">("");
  const [direction, setDirection] = useState<MessageDirection | "">("");

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      status: status || undefined,
      direction: direction || undefined,
    }),
    [page, status, direction],
  );

  const { data, isLoading, isError } = useMessageLogs(params);

  const logs = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <SendIcon className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Logs messages</h1>
          <p className="text-sm text-slate-500">
            Suivez les messages entrants et sortants WhatsApp.
          </p>
        </div>
      </div>

      <div className="card p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <input
              disabled
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
              placeholder="Recherche texte à ajouter côté API plus tard"
            />
          </div>

          <select
            value={direction}
            onChange={(e) => {
              setDirection(e.target.value as MessageDirection | "");
              setPage(1);
            }}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white"
          >
            <option value="">Toutes les directions</option>
            <option value="INBOUND">Entrant</option>
            <option value="OUTBOUND">Sortant</option>
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as MessageStatus | "");
              setPage(1);
            }}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white"
          >
            <option value="">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="SENT">Envoyé</option>
            <option value="DELIVERED">Livré</option>
            <option value="READ">Lu</option>
            <option value="FAILED">Échec</option>
            <option value="RECEIVED">Reçu</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">
            Chargement des logs...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-500">
            Erreur lors du chargement des logs.
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Aucun log disponible.
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
                      Campagne
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Direction
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Statut
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Message
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">
                          {log.contact?.fullName || "—"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {log.contact?.phone || log.fromPhone || log.toPhone}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {log.campaign?.name || "—"}
                      </td>

                      <td className="px-4 py-4">
                        {directionLabels[log.direction]}
                      </td>

                      <td className="px-4 py-4">
                        {statusLabels[log.status]}
                        {log.errorMessage && (
                          <p className="text-xs text-rose-500 mt-1">
                            {log.errorMessage}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 max-w-md text-slate-600">
                        <p className="line-clamp-2">{log.body || "—"}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && (
              <div className="flex items-center justify-between px-4 py-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Page {meta.page} sur {meta.totalPages} — {meta.total} logs
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-50"
                  >
                    Précédent
                  </button>

                  <button
                    type="button"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MessageLogsPage;
