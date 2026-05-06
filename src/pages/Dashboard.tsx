import { useEffect, useState } from "react";
import { dummyAdminDashboardData } from "../assets/assets";
import Loading from "../components/Loading";
import CompanyDashboard from "../components/CompanyDashboard";
import AdminDashboard from "../components/AdminDashboard";
import { useAuthStore } from "../features/auth/store/auth.store";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setData(dummyAdminDashboardData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (!user) return <Loading />;

  if (user.role === "ADMIN") {
    return <AdminDashboard data={{ data }} />;
  }

  return <CompanyDashboard data={{ data }} />;
};

export default Dashboard;
