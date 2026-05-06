import {
  Building2Icon,
  CoinsIcon,
  MegaphoneIcon,
  MessageCircleIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import { adminDashboardMock } from "../data/dashboard.mock";

const AdminDashboard = () => {
  const data = adminDashboardMock;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="page-header">
        <h1 className="page-title">Dashboard administrateur</h1>
        <p className="page-subtitle">
          Vue globale de la plateforme, des entreprises, campagnes, crédits et
          messages.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        <StatCard
          title="Entreprises"
          value={data.stats.totalCompanies}
          subtitle={`${data.stats.activeCompanies} actives`}
          icon={Building2Icon}
          trend="+12% ce mois"
        />

        <StatCard
          title="Campagnes"
          value={data.stats.totalCampaigns}
          subtitle="Toutes entreprises"
          icon={MegaphoneIcon}
        />

        <StatCard
          title="Crédits consommés"
          value={data.stats.creditsConsumed.toLocaleString()}
          subtitle="Total plateforme"
          icon={CoinsIcon}
        />

        <StatCard
          title="Messages envoyés"
          value={data.stats.messagesSent.toLocaleString()}
          subtitle="WhatsApp"
          icon={MessageCircleIcon}
        />

        <StatCard
          title="Taux réponse"
          value={`${data.stats.averageResponseRate}%`}
          subtitle="Moyenne globale"
          icon={TrendingUpIcon}
        />

        <StatCard
          title="Clients actifs"
          value={data.stats.activeCompanies}
          subtitle="Comptes COMPANY"
          icon={UsersIcon}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <ChartCard
            title="Évolution campagnes / réponses"
            subtitle="Volume mensuel sur la plateforme"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.campaignsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="campaigns"
                  name="Campagnes"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="responses"
                  name="Réponses"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Entreprises par statut">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.companiesByStatus}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
              >
                {data.companiesByStatus.map((_, index) => (
                  <Cell key={index} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard
          title="Top entreprises consommatrices"
          subtitle="Classement par crédits consommés"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topCompanies} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="credits" name="Crédits" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="card p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Alertes plateforme
          </h2>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="font-medium text-amber-800">
                18 entreprises en attente d’activation
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Pensez à vérifier les nouveaux comptes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <p className="font-medium text-rose-800">
                9 entreprises suspendues
              </p>
              <p className="text-sm text-rose-700 mt-1">
                Vérifier les statuts et la consommation de crédits.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
              <p className="font-medium text-indigo-800">
                Pic d’activité sur les campagnes NPS
              </p>
              <p className="text-sm text-indigo-700 mt-1">
                Opportunité d’améliorer les templates recommandés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
