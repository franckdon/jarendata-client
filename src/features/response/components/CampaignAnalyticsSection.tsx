import { BarChart3Icon } from "lucide-react";
import { useCampaignAnalytics } from "../hooks/useResponse";

type CampaignAnalyticsSectionProps = {
  campaignId: string;
};

const CampaignAnalyticsSection = ({
  campaignId,
}: CampaignAnalyticsSectionProps) => {
  const { data, isLoading, isError } = useCampaignAnalytics(campaignId);

  if (isLoading) {
    return (
      <div className="card p-8 text-center text-slate-500">
        Chargement des analytics...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="card p-8 text-center text-rose-500">
        Erreur lors du chargement des analytics.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <p className="text-sm text-slate-500">Destinataires</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {data.overview.recipientsTotal}
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm text-slate-500">Répondants</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {data.overview.recipientsResponded}
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm text-slate-500">Taux de réponse</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {data.overview.responseRate}%
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm text-slate-500">Réponses</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {data.overview.answersTotal}
          </p>
        </div>
      </div>

      {data.nps && (
        <div className="card p-5">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">NPS</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-500">Score NPS</p>
              <p className="text-3xl font-bold text-indigo-700">
                {data.nps.nps}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Promoteurs</p>
              <p className="text-xl font-semibold text-emerald-700">
                {data.nps.promoters}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Passifs</p>
              <p className="text-xl font-semibold text-amber-700">
                {data.nps.passives}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Détracteurs</p>
              <p className="text-xl font-semibold text-rose-700">
                {data.nps.detractors}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="card p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <BarChart3Icon className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Résultats par question
            </h3>
            <p className="text-sm text-slate-500">
              Analyse des réponses collectées.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {data.questions.map((question) => (
            <div
              key={question.questionId}
              className="p-4 rounded-xl border border-slate-200"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {question.title}
                  </p>
                  <p className="text-sm text-slate-500">
                    {question.totalAnswers} réponses
                  </p>
                </div>

                {typeof question.average === "number" && (
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
                    Moyenne : {question.average}
                  </span>
                )}
              </div>

              {question.distribution && (
                <div className="space-y-2">
                  {question.distribution.map((item) => (
                    <div key={item.value}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-700">{item.label}</span>
                        <span className="text-slate-500">
                          {item.count} — {item.percentage}%
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-indigo-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {question.answers && (
                <div className="space-y-2">
                  {question.answers.slice(0, 8).map((answer) => (
                    <div
                      key={answer.answerId}
                      className="p-3 rounded-lg bg-slate-50 text-sm text-slate-700"
                    >
                      {answer.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignAnalyticsSection;
