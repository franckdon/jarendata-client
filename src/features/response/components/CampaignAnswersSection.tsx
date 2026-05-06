import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { useCampaignAnswers } from "../hooks/useResponse";

type CampaignAnswersSectionProps = {
  campaignId: string;
};

const CampaignAnswersSection = ({
  campaignId,
}: CampaignAnswersSectionProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useCampaignAnswers(campaignId, {
    page,
    limit: 10,
    search: search || undefined,
  });

  const answers = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="relative">
          <SearchIcon className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Rechercher une réponse, un contact..."
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">
            Chargement des réponses...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-500">
            Erreur lors du chargement des réponses.
          </div>
        ) : answers.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Aucune réponse disponible.
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
                      Question
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Réponse
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {answers.map((answer) => (
                    <tr key={answer.id}>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">
                          {answer.contact?.fullName || "Sans nom"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {answer.contact?.phone}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-slate-600 max-w-sm">
                        {answer.question?.title || "—"}
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">
                          {answer.textValue ||
                            answer.option?.label ||
                            answer.rawValue ||
                            answer.numberValue ||
                            answer.booleanValue?.toString() ||
                            answer.values?.join(", ") ||
                            "—"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-slate-500">
                        {new Intl.DateTimeFormat("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(answer.createdAt))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && (
              <div className="flex items-center justify-between px-4 py-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Page {meta.page} sur {meta.totalPages} — {meta.total} réponses
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

export default CampaignAnswersSection;
