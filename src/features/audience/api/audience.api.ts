import { api } from "../../../lib/api";
import { unwrap } from "../../../lib/apiResponse";
import { PaginatedResponse } from "../../../types/api";
import {
  Contact,
  ContactQueryParams,
  CreateContactPayload,
  ImportContactsPayload,
  ImportContactsResult,
  SyncContactPayload,
  SyncContactResult,
  UpdateContactPayload,
} from "../types/audience.types";

export const getContactsApi = async (
  params: ContactQueryParams,
): Promise<PaginatedResponse<Contact>> => {
  const res = await api.get("/audience", {
    params,
  });

  return res.data;
};

export const getContactByIdApi = async (id: string): Promise<Contact> => {
  const res = await api.get(`/audience/${id}`);
  return unwrap<Contact>(res);
};

export const createContactApi = async (
  payload: CreateContactPayload,
): Promise<Contact> => {
  const res = await api.post("/audience", payload);
  return unwrap<Contact>(res);
};

export const updateContactApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateContactPayload;
}): Promise<Contact> => {
  const res = await api.patch(`/audience/${id}`, payload);
  return unwrap<Contact>(res);
};

export const deleteContactApi = async (id: string): Promise<void> => {
  await api.delete(`/audience/${id}`);
};

export const importContactsApi = async (
  payload: ImportContactsPayload,
): Promise<ImportContactsResult> => {
  const res = await api.post("/audience/import", payload);
  return unwrap<ImportContactsResult>(res);
};

export const syncContactApi = async (
  payload: SyncContactPayload,
): Promise<SyncContactResult> => {
  const res = await api.post("/audience/sync", payload);
  return unwrap<SyncContactResult>(res);
};