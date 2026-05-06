import { useState } from "react";
import {
  ArrowLeftIcon,
  BarChart3Icon,
  FileQuestionIcon,
  InfoIcon,
  MessageSquareTextIcon,
  UsersIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCampaignById } from "../hooks/useCampaign";
import SurveyQuestionsSection from "../../survey/components/SurveyQuestionsSection";
import CampaignAnswersSection from "../../response/components/CampaignAnswersSection";
import CampaignAnalyticsSection from "../../response/components/CampaignAnalyticsSection";
import CampaignRecipientsSection from "@/features/dispatch/components/CampaignRecipientsSection";

type TabKey = "overview" | "questions" | "recipients" | "answers" | "analytics";

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  SCHEDULED: "Planifiée",
  RUNNING: "En cours",
  PAUSED: "En pause",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

const typeLabels: Record<string, string> = {
  CUSTOMER_SATISFACTION: "Satisfaction client",
  NPS: "NPS",
  PRODUCT_FEEDBACK: "Feedback produit",
  PRICE_TEST: "Test de prix",
  MARKET_RESEARCH: "Étude de marché",
  CUSTOMER_RETENTION: "Rétention client",
  CUSTOM: "Personnalisée",
};

const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const { data: campaign, isLoading, isError } = useCampaignById(id);

  if (isLoading) {
    return (
      <div className="card p-8 text-center text-slate-500">
        Chargement de la campagne...
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="card p-8 text-center text-rose-500">
        Campagne introuvable.
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: "overview", label: "Aperçu", icon: InfoIcon },
    { key: "recipients", label: "Destinataires", icon: UsersIcon },
    { key: "questions", label: "Questionnaire", icon: FileQuestionIcon },
    { key: "answers", label: "Réponses", icon: MessageSquareTextIcon },
    { key: "analytics", label: "Analytics", icon: BarChart3Icon },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <button
          type="button"
          onClick={() => navigate("/campaigns")}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Retour aux campagnes
        </button>

        <div className="card p-5">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {campaign.name}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {campaign.description || "Aucune description"}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border bg-indigo-50 text-indigo-700 border-indigo-200">
                  {typeLabels[campaign.type]}
                </span>

                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 text-slate-700 border-slate-200">
                  {statusLabels[campaign.status]}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 min-w-[260px]">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500">Audience estimée</p>
                <p className="font-bold text-slate-900">
                  {campaign.estimatedAudienceCount}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500">Crédits estimés</p>
                <p className="font-bold text-slate-900">
                  {campaign.estimatedCreditCost}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Informations
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Type</span>
                <span className="font-medium text-slate-900">
                  {typeLabels[campaign.type]}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Statut</span>
                <span className="font-medium text-slate-900">
                  {statusLabels[campaign.status]}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Tous les contacts</span>
                <span className="font-medium text-slate-900">
                  {campaign.targetAllContacts ? "Oui" : "Non"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Pays ciblé</span>
                <span className="font-medium text-slate-900">
                  {campaign.countryFilter || "—"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Ville ciblée</span>
                <span className="font-medium text-slate-900">
                  {campaign.cityFilter || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Tags ciblés
            </h2>

            {campaign.tagsFilter.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {campaign.tagsFilter.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Aucun tag ciblé.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "recipients" && (
        <CampaignRecipientsSection campaignId={campaign.id} />
      )}

      {activeTab === "questions" && (
        <SurveyQuestionsSection campaignId={campaign.id} />
      )}

      {activeTab === "answers" && (
        <CampaignAnswersSection campaignId={campaign.id} />
      )}

      {activeTab === "analytics" && (
        <CampaignAnalyticsSection campaignId={campaign.id} />
      )}
    </div>
  );
};

export default CampaignDetailPage;
