import { FormEvent, useState } from "react";
import {
  MessagingAccount,
  MessagingProvider,
  UpsertMessagingAccountPayload,
} from "../types/messaging.types";

type Props = {
  account?: MessagingAccount | null;
  isSubmitting?: boolean;
  onSubmit: (payload: UpsertMessagingAccountPayload) => Promise<void>;
};

const providers: { label: string; value: MessagingProvider }[] = [
  { label: "Meta WhatsApp Cloud API", value: "META" },
  { label: "Twilio", value: "TWILIO" },
  { label: "Mock / Test", value: "MOCK" },
];

const MessagingAccountForm = ({
  account,
  isSubmitting = false,
  onSubmit,
}: Props) => {
  const [form, setForm] = useState<UpsertMessagingAccountPayload>({
    provider: account?.provider || "MOCK",
    name: account?.name || "",
    phoneNumberId: account?.phoneNumberId || "",
    businessAccountId: account?.businessAccountId || "",
    accessToken: account?.accessToken || "",
    webhookVerifyToken: account?.webhookVerifyToken || "",
    fromPhoneNumber: account?.fromPhoneNumber || "",
    isActive: account?.isActive ?? false,
  });

  const handleChange = (
    field: keyof UpsertMessagingAccountPayload,
    value: any,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const cleanPayload = () => ({
    provider: form.provider,
    name: form.name?.trim() || undefined,
    phoneNumberId: form.phoneNumberId?.trim() || undefined,
    businessAccountId: form.businessAccountId?.trim() || undefined,
    accessToken: form.accessToken?.trim() || undefined,
    webhookVerifyToken: form.webhookVerifyToken?.trim() || undefined,
    fromPhoneNumber: form.fromPhoneNumber?.trim() || undefined,
    isActive: !!form.isActive,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(cleanPayload());
  };

  const isMeta = form.provider === "META";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Provider
          </label>
          <select
            value={form.provider}
            onChange={(e) =>
              handleChange("provider", e.target.value as MessagingProvider)
            }
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {providers.map((provider) => (
              <option key={provider.value} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nom du compte
          </label>
          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: WhatsApp Business Jarendata"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Numéro WhatsApp
          </label>
          <input
            value={form.fromPhoneNumber}
            onChange={(e) => handleChange("fromPhoneNumber", e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: +225..."
          />
        </div>

        <div className="flex items-center pt-6">
          <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
            />
            Activer ce compte messaging
          </label>
        </div>

        {isMeta && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number ID
              </label>
              <input
                value={form.phoneNumberId}
                onChange={(e) => handleChange("phoneNumberId", e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="ID du numéro Meta"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Business Account ID
              </label>
              <input
                value={form.businessAccountId}
                onChange={(e) =>
                  handleChange("businessAccountId", e.target.value)
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="ID business Meta"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Access Token
              </label>
              <textarea
                value={form.accessToken}
                onChange={(e) => handleChange("accessToken", e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Token d’accès Meta"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Webhook Verify Token
              </label>
              <input
                value={form.webhookVerifyToken}
                onChange={(e) =>
                  handleChange("webhookVerifyToken", e.target.value)
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Token de vérification webhook"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer la configuration"}
        </button>
      </div>
    </form>
  );
};

export default MessagingAccountForm;
