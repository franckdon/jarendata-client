//src/features/auth/components/AuthInitializer.tsx

import { ReactNode, useEffect } from "react";
import { useMe } from "../hooks/useAuth";
import { useAuthStore } from "../store/auth.store";

type Props = {
  children: ReactNode;
};

const AuthInitializer = ({ children }: Props) => {
  const setHasHydrated = useAuthStore((s) => s.setHasHydrated);
  const token = localStorage.getItem("jarendata_token");

  const meQuery = useMe();

  useEffect(() => {
    if (!token) {
      setHasHydrated(true);
    }
  }, [token, setHasHydrated]);

  useEffect(() => {
    if (meQuery.isError) {
      setHasHydrated(true);
    }
  }, [meQuery.isError, setHasHydrated]);

  return <>{children}</>;
};

export default AuthInitializer;
