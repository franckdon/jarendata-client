import {
  CreditTransaction,
  CreditTransactionReason,
  CreditTransactionType,
} from "../types/credit.types";

type Props = {
  transactions: CreditTransaction[];
  showCompany?: boolean;
};

const typeLabels: Record<CreditTransactionType, string> = {
  CREDIT: "Crédit",
  DEBIT: "Débit",
  REFUND: "Remboursement",
  ADJUSTMENT: "Ajustement",
};

const reasonLabels: Record<CreditTransactionReason, string> = {
  INITIAL_BONUS: "Bonus initial",
  ADMIN_TOPUP: "Recharge admin",
  CAMPAIGN_LAUNCH: "Lancement campagne",
  CAMPAIGN_REFUND: "Remboursement campagne",
  MANUAL_ADJUSTMENT: "Ajustement manuel",
};

const typeStyles: Record<CreditTransactionType, string> = {
  CREDIT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DEBIT: "bg-rose-50 text-rose-700 border-rose-200",
  REFUND: "bg-blue-50 text-blue-700 border-blue-200",
  ADJUSTMENT: "bg-amber-50 text-amber-700 border-amber-200",
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const CreditTransactionsTable = ({
  transactions,
  showCompany = false,
}: Props) => {
  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        Aucune transaction de crédits.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {showCompany && (
              <th className="text-left px-4 py-3 font-semibold text-slate-600">
                Entreprise
              </th>
            )}
            <th className="text-left px-4 py-3 font-semibold text-slate-600">
              Type
            </th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600">
              Motif
            </th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600">
              Montant
            </th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600">
              Solde
            </th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600">
              Campagne
            </th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600">
              Créé par
            </th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600">
              Date
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              {showCompany && (
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-900">
                    {transaction.company?.name || "—"}
                  </p>
                  {transaction.company && (
                    <p className="text-xs text-slate-500">
                      Solde actuel :{" "}
                      {transaction.company.creditBalance.toLocaleString()}
                    </p>
                  )}
                </td>
              )}

              <td className="px-4 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    typeStyles[transaction.type]
                  }`}
                >
                  {typeLabels[transaction.type]}
                </span>
              </td>

              <td className="px-4 py-4">
                <p className="font-medium text-slate-900">
                  {reasonLabels[transaction.reason]}
                </p>
                {transaction.description && (
                  <p className="text-xs text-slate-500 mt-1">
                    {transaction.description}
                  </p>
                )}
              </td>

              <td className="px-4 py-4">
                <span
                  className={
                    transaction.type === "DEBIT"
                      ? "font-semibold text-rose-600"
                      : "font-semibold text-emerald-600"
                  }
                >
                  {transaction.type === "DEBIT" ? "-" : "+"}
                  {Math.abs(transaction.amount).toLocaleString()}
                </span>
              </td>

              <td className="px-4 py-4 text-slate-600">
                {transaction.balanceBefore.toLocaleString()} →{" "}
                <span className="font-semibold text-slate-900">
                  {transaction.balanceAfter.toLocaleString()}
                </span>
              </td>

              <td className="px-4 py-4 text-slate-600">
                {transaction.campaign?.name || "—"}
              </td>

              <td className="px-4 py-4 text-slate-600">
                {transaction.createdBy?.fullName || "Système"}
              </td>

              <td className="px-4 py-4 text-slate-500">
                {formatDate(transaction.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreditTransactionsTable;
