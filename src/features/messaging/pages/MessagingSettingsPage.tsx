import { MessageCircleIcon, ShieldCheckIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../auth/store/auth.store";
import MessagingAccountForm from "../components/MessagingAccountForm";
import {
  useMyMessagingAccount,
  usePlatformMessagingAccount,
  useUpsertMyMessagingAccount,
  useUpsertPlatformMessagingAccount,
} from "../hooks/useMessaging";
import { UpsertMessagingAccountPayload } from "../types/messaging.types";

const MessagingSettingsPage = () => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "ADMIN";

  const companyQuery = useMyMessagingAccount();
  const platformQuery = usePlatformMessagingAccount();

  const companyMutation = useUpsertMyMessagingAccount();
  const platformMutation = useUpsertPlatformMessagingAccount();

  const account = isAdmin ? platformQuery.data : companyQuery.data;
  const isLoading = isAdmin ? platformQuery.isLoading : companyQuery.isLoading;
  const isSubmitting = isAdmin
    ? platformMutation.isPending
    : companyMutation.isPending;

  const handleSubmit = async (payload: UpsertMessagingAccountPayload) => {
    try {
      if (isAdmin) {
        await platformMutation.mutateAsync(payload);
        toast.success("Configuration plateforme enregistrée avec succès");
      } else {
        await companyMutation.mutateAsync(payload);
        toast.success("Configuration entreprise enregistrée avec succès");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de l'enregistrement",
      );
    }
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <MessageCircleIcon className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Configuration WhatsApp
          </h1>
          <p className="text-sm text-slate-500">
            {isAdmin
              ? "Configurez le compte WhatsApp par défaut de la plateforme."
              : "Configurez le compte WhatsApp de votre entreprise."}
          </p>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-5">
          <ShieldCheckIcon className="w-5 h-5 text-indigo-600 mt-0.5" />
          <div>
            <p className="font-medium text-slate-900">
              Mode de résolution du compte
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Si une entreprise possède un compte actif, il sera utilisé. Sinon,
              la plateforme utilise le compte WhatsApp par défaut Jarendata.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500">
            Chargement de la configuration...
          </div>
        ) : (
          <MessagingAccountForm
            account={account}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default MessagingSettingsPage;
