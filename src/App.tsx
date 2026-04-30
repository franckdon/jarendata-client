import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payslips from "./pages/Payslips";
import Settings from "./pages/Settings";
import PrintPayslip from "./pages/PrintPayslip";
import LoginForm from "./features/auth/components/LoginForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import RegisterForm from "./features/auth/components/RegisterForm";
import CompaniesPage from "./features/company/pages/CompaniesPage";
import CompanyDetailPage from "./features/company/pages/CompanyDetailPage";
import CompanyEditPage from "./features/company/pages/CompanyEditPage";
import CompanyCreatePage from "./features/company/pages/CompanyCreatePage";

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

            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/payslips" element={<Payslips />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/print/payslips/:id" element={<PrintPayslip />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};

export default App;
