import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import LoginForm from "./features/auth/components/LoginForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import RegisterForm from "./features/auth/components/RegisterForm";
import CompaniesPage from "./features/company/pages/CompaniesPage";
import CompanyDetailPage from "./features/company/pages/CompanyDetailPage";
import CompanyEditPage from "./features/company/pages/CompanyEditPage";
import CompanyCreatePage from "./features/company/pages/CompanyCreatePage";
import AudiencePage from "./features/audience/pages/AudiencePage";
import CampaignsPage from "./features/campaign/pages/CampaignsPage";
import CampaignDetailPage from "./features/campaign/pages/CampaignDetailPage";
import MessagingSettingsPage from "./features/messaging/pages/MessagingSettingsPage";
import MessageLogsPage from "./features/messaging/pages/MessageLogsPage";
import CreditsPage from "./features/credit/pages/CreditsPage";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/create" element={<CompanyCreatePage />} />
            <Route path="/companies/:id" element={<CompanyDetailPage />} />
            <Route path="/companies/:id/edit" element={<CompanyEditPage />} />

            <Route path="/audience" element={<AudiencePage />} />

            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/campaigns/:id" element={<CampaignDetailPage />} />

            <Route
              path="/messaging/settings"
              element={<MessagingSettingsPage />}
            />
            <Route path="/messaging/logs" element={<MessageLogsPage />} />

            <Route path="/credits" element={<CreditsPage />} />

            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};

export default App;
