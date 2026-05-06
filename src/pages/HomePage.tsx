import {
  ArrowRightIcon,
  BarChart3Icon,
  BotIcon,
  CheckCircle2Icon,
  MessageCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import logoBlack from "../assets/logos/jarendata-black.svg";

const features = [
  {
    icon: MessageCircleIcon,
    title: "Campagnes WhatsApp",
    description:
      "Lancez des enquêtes courtes et engageantes directement sur WhatsApp.",
  },
  {
    icon: UsersIcon,
    title: "Audience centralisée",
    description:
      "Importez, segmentez et exploitez vos contacts clients simplement.",
  },
  {
    icon: BarChart3Icon,
    title: "Analytics en temps réel",
    description:
      "Suivez les réponses, taux de participation, scores NPS et tendances.",
  },
  {
    icon: BotIcon,
    title: "Questionnaires intelligents",
    description:
      "Créez des flows dynamiques avec conditions, options et templates prêts.",
  },
];

const useCases = [
  "Satisfaction client",
  "NPS",
  "Test de prix",
  "Étude de marché",
  "Feedback produit",
  "Fidélisation client",
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoBlack} alt="Jarendata" className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-950">
              Fonctionnalités
            </a>
            <a href="#usecases" className="hover:text-slate-950">
              Cas d’usage
            </a>
            <a href="#security" className="hover:text-slate-950">
              Sécurité
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Connexion
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-slate-950 hover:bg-slate-800"
            >
              Commencer
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#eef2ff,transparent_35%),radial-gradient(circle_at_top_left,#f8fafc,transparent_30%)]" />

          <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6">
                <SparklesIcon className="w-4 h-4" />
                Customer insights via WhatsApp
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-tight">
                Comprenez vos clients plus vite, directement sur WhatsApp.
              </h1>

              <p className="mt-6 text-lg text-slate-600 leading-8 max-w-xl">
                Jarendata aide les entreprises à créer des campagnes
                conversationnelles, collecter des réponses et transformer les
                retours clients en décisions business.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Créer un compte
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold text-slate-800 border border-slate-200 hover:bg-slate-50"
                >
                  Accéder au dashboard
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="w-4 h-4 text-emerald-600" />
                  Campagnes rapides
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="w-4 h-4 text-emerald-600" />
                  Segmentation audience
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="w-4 h-4 text-emerald-600" />
                  Résultats exploitables
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-100 rounded-[2rem] blur-2xl opacity-70" />

              <div className="relative bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-5">
                <div className="rounded-2xl bg-slate-950 p-5 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-slate-400">Campagne active</p>
                      <p className="font-semibold">Satisfaction client</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-300">
                      En cours
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-white/8">
                      <p className="text-xs text-slate-400">Contacts ciblés</p>
                      <p className="text-2xl font-bold mt-1">12 450</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/8">
                      <p className="text-xs text-slate-400">Taux réponse</p>
                      <p className="text-2xl font-bold mt-1">42%</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/8">
                      <p className="text-xs text-slate-400">Score moyen</p>
                      <p className="text-2xl font-bold mt-1">4.3/5</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/8">
                      <p className="text-xs text-slate-400">Réponses</p>
                      <p className="text-2xl font-bold mt-1">5 229</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-sm font-semibold text-slate-900 mb-3">
                    Question WhatsApp
                  </p>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p>Bonjour 👋 Merci pour votre achat.</p>
                    <p>Sur une échelle de 1 à 5, êtes-vous satisfait ?</p>
                    <div className="grid grid-cols-5 gap-2 pt-2">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <div
                          key={score}
                          className="h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-semibold text-slate-700"
                        >
                          {score}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-slate-950">
                Tout pour collecter et analyser la voix client.
              </h2>
              <p className="mt-4 text-slate-600">
                Une plateforme simple pour créer des campagnes, cibler une
                audience et suivre les résultats.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition"
                >
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-950">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-6">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="usecases" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-950">
                Des templates adaptés aux vrais besoins business.
              </h2>

              <p className="mt-4 text-slate-600 leading-7">
                Lancez une campagne en quelques minutes avec des modèles prêts :
                satisfaction client, NPS, feedback produit, test de prix ou
                étude de marché.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {useCases.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 rounded-[2rem] p-6 text-white">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircleIcon className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="font-semibold">Flow conversationnel</p>
                  <p className="text-sm text-slate-400">
                    Questions courtes, réponses simples, branchements.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/8 rounded-2xl p-4">
                  <p className="text-sm">1️⃣ Êtes-vous satisfait ?</p>
                </div>
                <div className="bg-indigo-500 rounded-2xl p-4 ml-8">
                  <p className="text-sm">4 - Satisfait</p>
                </div>
                <div className="bg-white/8 rounded-2xl p-4">
                  <p className="text-sm">
                    Super 😊 Qu’avez-vous le plus apprécié ?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="security" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-100">
                <ShieldCheckIcon className="w-8 h-8 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-slate-950">
                  Gestion des rôles
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-6">
                  OWNER, MANAGER, ANALYST et MEMBER pour sécuriser les actions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100">
                <ZapIcon className="w-8 h-8 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-slate-950">Envoi WhatsApp</h3>
                <p className="mt-2 text-sm text-slate-600 leading-6">
                  Préparez vos destinataires, suivez les messages et les logs.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100">
                <BarChart3Icon className="w-8 h-8 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-slate-950">
                  Décision data-driven
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-6">
                  Transformez les réponses clients en indicateurs exploitables.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-950 text-white">
          <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Prêt à mieux comprendre vos clients ?
            </h2>

            <p className="mt-4 text-slate-400">
              Créez votre première campagne WhatsApp et commencez à collecter
              des insights exploitables.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100"
              >
                Démarrer maintenant
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <img src={logoBlack} alt="Jarendata" className="h-9 w-auto" />
            <p className="text-sm text-slate-500 mt-3">
              Customer insights via WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
            <a href="#features" className="hover:text-slate-950">
              Fonctionnalités
            </a>
            <a href="#usecases" className="hover:text-slate-950">
              Cas d’usage
            </a>
            <Link to="/login" className="hover:text-slate-950">
              Connexion
            </Link>
          </div>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Jarendata. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
