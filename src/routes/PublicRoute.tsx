import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../features/auth/store/auth.store";
import { getRedirectPath } from "../lib/redirect";

const PublicRoute = () => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return <div>Chargement...</div>;
  }

  if (isAuthenticated && user) {
    return <Navigate to={getRedirectPath(user)} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
