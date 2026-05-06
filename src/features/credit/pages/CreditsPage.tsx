import { useMemo, useState } from "react";
import { CoinsIcon, FilterIcon } from "lucide-react";
import { useAuthStore } from "../../auth/store/auth.store";
import {
  CreditTransactionReason,
  CreditTransactionType,
} from "../types/credit.types";
import {
  useAdminAllCreditTransactions,
  useMyCreditBalance,
  useMyCreditTransactions,
} from "../hooks/useCredit";
import CreditTransactionsTable from "../components/CreditTransactionsTable";

const CreditsPage = () => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "ADMIN";

  const [page, setPage] = useState(1);
  const [companyId, setCompanyId] = useState("");
  const [type, setType] = useState<CreditTransactionType | "">("");
  const [reason, setReason] = useState<CreditTransactionReason | "">("");

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      companyId: isAdmin && companyId ? companyId : undefined,
      type: type || undefined,
      reason: reason || undefined,
    }),
    [page, companyId, type, reason, isAdmin],
  );

  const balanceQuery = useMyCreditBalance(!isAdmin);

  const companyTransactionsQuery = useMyCreditTransactions(params, !isAdmin);
  const adminTransactionsQuery = useAdminAllCreditTransactions(params, isAdmin);

  const transactionsQuery = isAdmin
    ? adminTransactionsQuery
    : companyTransactionsQuery;

  const transactions = transactionsQuery.data?.data || [];
  const meta = transactionsQuery.data?.meta;

  const resetFilters = () => {
    setCompanyId("");
    setType("");
    setReason("");
    setPage(1);
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <CoinsIcon className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Crédits</h1>
          <p className="text-sm text-slate-500">
            {isAdmin
              ? "Consultez tous les mouvements de crédits des entreprises."
              : "Consultez votre solde et l’historique des transactions."}
          </p>
        </div>
      </div>

      {!isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="card p-5">
            <p className="text-sm text-slate-500">Entreprise</p>
            <p className="text-lg font-semibold text-slate-900 mt-1">
              {balanceQuery.isLoading
                ? "Chargement..."
                : balanceQuery.data?.name || "—"}
            </p>
          </div>

          <div className="card p-5 lg:col-span-2">
            <p className="text-sm text-slate-500">Solde disponible</p>
            <p className="text-3xl font-bold text-indigo-700 mt-1">
              {balanceQuery.isLoading
                ? "..."
                : `${balanceQuery.data?.creditBalance?.toLocaleString() || 0} crédits`}
            </p>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="card p-5">
            <p className="text-sm text-slate-500">Vue</p>
            <p className="text-lg font-semibold text-slate-900 mt-1">
              Administration
            </p>
          </div>

          <div className="card p-5 lg:col-span-2">
            <p className="text-sm text-slate-500">Mouvements affichés</p>
            <p className="text-3xl font-bold text-indigo-700 mt-1">
              {meta?.total?.toLocaleString() || 0} transactions
            </p>
          </div>
        </div>
      )}

      <div className="card p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4 text-slate-400" />
            <p className="text-sm font-medium text-slate-700">Filtres</p>
          </div>

          {(companyId || type || reason) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              Réinitialiser
            </button>
          )}
        </div>

        <div
          className={`grid grid-cols-1 gap-3 ${
            isAdmin ? "md:grid-cols-3" : "md:grid-cols-2"
          }`}
        >
          {isAdmin && (
            <input
              value={companyId}
              onChange={(e) => {
                setCompanyId(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white"
              placeholder="Filtrer par companyId"
            />
          )}

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as CreditTransactionType | "");
              setPage(1);
            }}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white"
          >
            <option value="">Tous les types</option>
            <option value="CREDIT">Crédit</option>
            <option value="DEBIT">Débit</option>
            <option value="REFUND">Remboursement</option>
            <option value="ADJUSTMENT">Ajustement</option>
          </select>

          <select
            value={reason}
            onChange={(e) => {
              setReason(e.target.value as CreditTransactionReason | "");
              setPage(1);
            }}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white"
          >
            <option value="">Tous les motifs</option>
            <option value="INITIAL_BONUS">Bonus initial</option>
            <option value="ADMIN_TOPUP">Recharge admin</option>
            <option value="CAMPAIGN_LAUNCH">Lancement campagne</option>
            <option value="CAMPAIGN_REFUND">Remboursement campagne</option>
            <option value="MANUAL_ADJUSTMENT">Ajustement manuel</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {transactionsQuery.isLoading ? (
          <div className="p-8 text-center text-slate-500">
            Chargement des transactions...
          </div>
        ) : transactionsQuery.isError ? (
          <div className="p-8 text-center text-rose-500">
            Erreur lors du chargement des transactions.
          </div>
        ) : (
          <>
            <CreditTransactionsTable
              transactions={transactions}
              showCompany={isAdmin}
            />

            {meta && (
              <div className="flex items-center justify-between px-4 py-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Page {meta.page} sur {meta.totalPages} — {meta.total}{" "}
                  transactions
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
                    disabled={meta.totalPages === 0 || page >= meta.totalPages}
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

export default CreditsPage;
