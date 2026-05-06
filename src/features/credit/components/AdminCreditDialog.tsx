import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useAddCredits, useAdjustCredits } from "../hooks/useCredit";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  companyId: string;
  companyName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Mode = "ADD" | "ADJUST";

const AdminCreditDialog = ({
  companyId,
  companyName,
  open,
  onOpenChange,
}: Props) => {
  const [mode, setMode] = useState<Mode>("ADD");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const addMutation = useAddCredits();
  const adjustMutation = useAdjustCredits();

  const isSubmitting = addMutation.isPending || adjustMutation.isPending;

  const reset = () => {
    setMode("ADD");
    setAmount("");
    setDescription("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parsedAmount = Number(amount);

    if (!parsedAmount || Number.isNaN(parsedAmount)) {
      toast.error("Montant invalide");
      return;
    }

    try {
      if (mode === "ADD") {
        await addMutation.mutateAsync({
          companyId,
          amount: Math.abs(parsedAmount),
          description: description.trim() || undefined,
        });

        toast.success("Crédits ajoutés avec succès");
      } else {
        await adjustMutation.mutateAsync({
          companyId,
          amount: parsedAmount,
          description: description.trim() || undefined,
        });

        toast.success("Crédits ajustés avec succès");
      }

      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de l'opération",
      );
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) reset();
      }}
    >
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Gérer les crédits</AlertDialogTitle>
          <AlertDialogDescription>
            {companyName
              ? `Entreprise : ${companyName}`
              : "Ajoutez ou ajustez le solde de crédits."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode("ADD")}
              className={`px-4 py-2.5 rounded-lg text-sm border ${
                mode === "ADD"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Ajouter
            </button>

            <button
              type="button"
              onClick={() => setMode("ADJUST")}
              className={`px-4 py-2.5 rounded-lg text-sm border ${
                mode === "ADJUST"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Ajuster
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Montant
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={mode === "ADD" ? "Ex: 1000" : "Ex: -200 ou 500"}
              required
            />

            {mode === "ADJUST" && (
              <p className="text-xs text-slate-500 mt-1">
                Utilisez un montant négatif pour retirer des crédits.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Motif de l'opération..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSubmitting ? "Traitement..." : "Valider"}
            </button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminCreditDialog;
