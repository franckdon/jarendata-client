import {
  CoinsIcon,
  ContactRoundIcon,
  MegaphoneIcon,
  MessageCircleIcon,
  TrendingUpIcon,
  ClipboardListIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import { companyDashboardMock } from "../data/dashboard.mock";
import { Link } from "react-router-dom";

const CompanyDashboard = () => {
  const data = companyDashboardMock;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="page-header">
        <h1 className="page-title">Dashboard entreprise</h1>
        <p className="page-subtitle">
          Suivez votre audience, vos campagnes, vos crédits et les réponses
          collectées.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        <StatCard
          title="Audience"
          value={data.stats.contacts.toLocaleString()}
          subtitle="Contacts enregistrés"
          icon={ContactRoundIcon}
        />

        <StatCard
          title="Campagnes actives"
          value={data.stats.activeCampaigns}
          subtitle="En cours ou planifiées"
          icon={MegaphoneIcon}
        />

        <StatCard
          title="Crédits restants"
          value={data.stats.creditsBalance.toLocaleString()}
          subtitle="Solde disponible"
          icon={CoinsIcon}
        />

        <StatCard
          title="Taux réponse"
          value={`${data.stats.responseRate}%`}
          subtitle="Moyenne campagnes"
          icon={TrendingUpIcon}
        />

        <StatCard
          title="Messages envoyés"
          value={data.stats.messagesSent.toLocaleString()}
          subtitle="WhatsApp"
          icon={MessageCircleIcon}
        />

        <StatCard
          title="Réponses"
          value={data.stats.answersCollected.toLocaleString()}
          subtitle="Collectées"
          icon={ClipboardListIcon}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <ChartCard
            title="Réponses collectées"
            subtitle="Évolution sur les 7 derniers jours"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.responsesByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="responses"
                  name="Réponses"
                  strokeWidth={3}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Contacts par source">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.contactsBySource}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
              >
                {data.contactsBySource.map((_, index) => (
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
          title="Performance des campagnes"
          subtitle="Messages envoyés vs réponses"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.campaignPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sent" name="Envoyés" radius={[6, 6, 0, 0]} />
              <Bar dataKey="responses" name="Réponses" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="card p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Actions rapides
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link
              to="/audience"
              className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100"
            >
              <p className="font-semibold text-indigo-800">Gérer l’audience</p>
              <p className="text-sm text-indigo-700 mt-1">
                Ajouter, importer ou filtrer vos contacts.
              </p>
            </Link>

            <Link
              to="/campaigns"
              className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100"
            >
              <p className="font-semibold text-emerald-800">
                Créer une campagne
              </p>
              <p className="text-sm text-emerald-700 mt-1">
                Lancer une enquête WhatsApp.
              </p>
            </Link>

            <Link
              to="/credits"
              className="p-4 rounded-xl bg-amber-50 border border-amber-100 hover:bg-amber-100"
            >
              <p className="font-semibold text-amber-800">Voir les crédits</p>
              <p className="text-sm text-amber-700 mt-1">
                Suivre le solde et les mouvements.
              </p>
            </Link>

            <Link
              to="/messaging/logs"
              className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100"
            >
              <p className="font-semibold text-slate-800">Logs WhatsApp</p>
              <p className="text-sm text-slate-600 mt-1">
                Vérifier les messages envoyés et reçus.
              </p>
            </Link>
          </div>
        </div>
      </div>

      {data.stats.creditsBalance < 1000 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <p className="font-medium text-rose-800">Crédits faibles</p>
          <p className="text-sm text-rose-700 mt-1">
            Votre solde est faible. Pensez à recharger avant de lancer une
            nouvelle campagne.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
