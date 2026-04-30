import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { loginApi, registerApi, getMeApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      localStorage.setItem("jarendata_token", data.token);
      setAuth(data.user);
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      localStorage.setItem("jarendata_token", data.token);
      setAuth(data.user);
    },
  });
};

export const useMe = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);
  const token = localStorage.getItem("jarendata_token");

  const query = useQuery({
    queryKey: ["me"],
    queryFn: getMeApi,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      setAuth(query.data);
    }
  }, [query.data, setAuth]);

  useEffect(() => {
    if (query.isError) {
      logout();
    }
  }, [query.isError, logout]);

  return query;
};