import { useState } from "react";
import {
  Building2Icon,
  Settings2Icon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { useAuthStore } from "../../auth/store/auth.store";
import ProfileSettingsForm from "../components/ProfileSettingsForm";
import CompanySettingsForm from "../components/CompanySettingsForm";
import CompanyTeamSettings from "../components/CompanyTeamSettings";

type TabKey = "profile" | "company" | "team";

const SettingsPage = () => {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  const isCompany = user?.role === "COMPANY";
  const isOwner = user?.companyRole === "OWNER";

  const tabs = [
    {
      key: "profile" as const,
      label: "Mon profil",
      icon: UserIcon,
      visible: true,
    },
    {
      key: "company" as const,
      label: "Entreprise",
      icon: Building2Icon,
      visible: isCompany,
    },
    {
      key: "team" as const,
      label: "Équipe",
      icon: UsersIcon,
      visible: isCompany,
    },
  ].filter((tab) => tab.visible);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Settings2Icon className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
          <p className="text-sm text-slate-500">
            Gérez votre profil, votre entreprise et votre équipe.
          </p>
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

      {activeTab === "profile" && <ProfileSettingsForm />}

      {activeTab === "company" && <CompanySettingsForm canEdit={isOwner} />}

      {activeTab === "team" && <CompanyTeamSettings canManage={isOwner} />}
    </div>
  );
};

export default SettingsPage;
