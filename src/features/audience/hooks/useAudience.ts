import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContactApi,
  deleteContactApi,
  getContactByIdApi,
  getContactsApi,
  importContactsApi,
  syncContactApi,
  updateContactApi,
} from "../api/audience.api";
import {
  ContactQueryParams,
  CreateContactPayload,
  ImportContactsPayload,
  SyncContactPayload,
  UpdateContactPayload,
} from "../types/audience.types";

export const useContacts = (params: ContactQueryParams) => {
  return useQuery({
    queryKey: ["audience", params],
    queryFn: () => getContactsApi(params),
  });
};

export const useContactById = (id?: string) => {
  return useQuery({
    queryKey: ["audience-contact", id],
    queryFn: () => getContactByIdApi(id as string),
    enabled: !!id,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContactPayload) => createContactApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audience"] });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateContactPayload;
    }) => updateContactApi({ id, payload }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["audience"] });
      queryClient.invalidateQueries({
        queryKey: ["audience-contact", variables.id],
      });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContactApi,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audience"] });
    },
  });
};

export const useImportContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ImportContactsPayload) => importContactsApi(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audience"] });
    },
  });
};

export const useSyncContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SyncContactPayload) => syncContactApi(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audience"] });
    },
  });
};