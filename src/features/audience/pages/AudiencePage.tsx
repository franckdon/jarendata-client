import { useMemo, useState } from "react";
import {
  EditIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  ConsentStatus,
  Contact,
  ContactQueryParams,
  ContactSource,
  CreateContactPayload,
  UpdateContactPayload,
} from "../types/audience.types";
import {
  useContacts,
  useCreateContact,
  useDeleteContact,
  useUpdateContact,
} from "../hooks/useAudience";
import ContactForm from "../components/ContactForm";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CONTACT_FORM_ID = "contact-form";

const sourceLabels: Record<ContactSource, string> = {
  MANUAL: "Manuel",
  IMPORT: "Import",
  API: "API",
  WHATSAPP_OPT_IN: "WhatsApp opt-in",
};

const sourceStyles: Record<ContactSource, string> = {
  MANUAL: "bg-slate-50 text-slate-700 border-slate-200",
  IMPORT: "bg-indigo-50 text-indigo-700 border-indigo-200",
  API: "bg-blue-50 text-blue-700 border-blue-200",
  WHATSAPP_OPT_IN: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const consentLabels: Record<ConsentStatus, string> = {
  PENDING: "En attente",
  ACCEPTED: "Accepté",
  REJECTED: "Rejeté",
};

const consentStyles: Record<ConsentStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
};

const AudiencePage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<ContactSource | "">("");
  const [consentStatus, setConsentStatus] = useState<ConsentStatus | "">("");

  const [openForm, setOpenForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const params: ContactQueryParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: search || undefined,
      source: source || undefined,
      consentStatus: consentStatus || undefined,
    }),
    [page, search, source, consentStatus],
  );

  const { data, isLoading, isError } = useContacts(params);

  const createContactMutation = useCreateContact();
  const updateContactMutation = useUpdateContact();
  const deleteContactMutation = useDeleteContact();

  const contacts = data?.data || [];
  const meta = data?.meta;

  const isSaving =
    createContactMutation.isPending || updateContactMutation.isPending;

  const handleOpenCreate = () => {
    setSelectedContact(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedContact(null);
  };

  const handleSubmit = async (
    payload: CreateContactPayload | UpdateContactPayload,
  ) => {
    try {
      if (selectedContact) {
        await updateContactMutation.mutateAsync({
          id: selectedContact.id,
          payload,
        });

        toast.success("Contact modifié avec succès");
      } else {
        await createContactMutation.mutateAsync(
          payload as CreateContactPayload,
        );
        toast.success("Contact ajouté avec succès");
      }

      handleCloseForm();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de l'enregistrement",
      );
    }
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;

    try {
      await deleteContactMutation.mutateAsync(contactToDelete.id);
      toast.success("Contact supprimé avec succès");
      setContactToDelete(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la suppression",
      );
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSource("");
    setConsentStatus("");
    setPage(1);
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <UsersIcon className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">Audience</h1>
            <p className="text-sm text-slate-500">
              Gérez les contacts clients disponibles pour vos campagnes.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="w-4 h-4" />
          Ajouter un contact
        </button>
      </div>

      <div className="card p-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2 relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Rechercher par nom, téléphone, email, ville..."
            />
          </div>

          <select
            value={source}
            onChange={(e) => {
              setSource(e.target.value as ContactSource | "");
              setPage(1);
            }}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Toutes les sources</option>
            <option value="MANUAL">Manuel</option>
            <option value="IMPORT">Import</option>
            <option value="API">API</option>
            <option value="WHATSAPP_OPT_IN">WhatsApp opt-in</option>
          </select>

          <select
            value={consentStatus}
            onChange={(e) => {
              setConsentStatus(e.target.value as ConsentStatus | "");
              setPage(1);
            }}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tous les consentements</option>
            <option value="PENDING">En attente</option>
            <option value="ACCEPTED">Accepté</option>
            <option value="REJECTED">Rejeté</option>
          </select>
        </div>

        {(search || source || consentStatus) && (
          <div className="mt-3">
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">
            Chargement de l’audience...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-500">
            Erreur lors du chargement des contacts.
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <UsersIcon className="w-7 h-7" />
            </div>
            <p className="font-medium text-slate-900">Aucun contact trouvé</p>
            <p className="text-sm text-slate-500 mt-1">
              Ajoutez votre premier contact ou importez une liste d’audience.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Contact
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Localisation
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Source
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Consentement
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Tags
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                            <UserIcon className="w-4 h-4" />
                          </div>

                          <div>
                            <p className="font-medium text-slate-900">
                              {contact.fullName || "Sans nom"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {contact.phone}
                            </p>
                            {contact.email && (
                              <p className="text-xs text-slate-400">
                                {contact.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        <p>{contact.country || "—"}</p>
                        <p className="text-xs text-slate-400">
                          {contact.city || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            sourceStyles[contact.source]
                          }`}
                        >
                          {sourceLabels[contact.source]}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            consentStyles[contact.consentStatus]
                          }`}
                        >
                          {consentLabels[contact.consentStatus]}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {contact.tags?.length ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {contact.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600"
                              >
                                {tag}
                              </span>
                            ))}

                            {contact.tags.length > 3 && (
                              <span className="text-xs text-slate-400">
                                +{contact.tags.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(contact)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                          >
                            <EditIcon className="w-4 h-4" />
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => setContactToDelete(contact)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-600 bg-rose-50 hover:bg-rose-100"
                          >
                            <Trash2Icon className="w-4 h-4" />
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Page {meta.page} sur {meta.totalPages} — {meta.total} contacts
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Précédent
                  </button>

                  <button
                    type="button"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog
        open={openForm}
        onOpenChange={(open) => {
          setOpenForm(open);
          if (!open) setSelectedContact(null);
        }}
      >
        <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
          <div className="flex flex-col max-h-[90vh]">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {selectedContact
                    ? "Modifier le contact"
                    : "Ajouter un contact"}
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Renseignez les informations du contact audience.
                </AlertDialogDescription>
              </AlertDialogHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ContactForm
                formId={CONTACT_FORM_ID}
                initialData={selectedContact}
                onSubmit={handleSubmit}
              />
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-white">
              <button
                type="button"
                onClick={handleCloseForm}
                className="inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>

              <button
                type="submit"
                form={CONTACT_FORM_ID}
                disabled={isSaving}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
              >
                {isSaving
                  ? "Enregistrement..."
                  : selectedContact
                    ? "Enregistrer les modifications"
                    : "Ajouter le contact"}
              </button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!contactToDelete}
        onOpenChange={(open) => {
          if (!open) setContactToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le contact</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le contact{" "}
              <span className="font-semibold text-slate-900">
                {contactToDelete?.fullName || contactToDelete?.phone}
              </span>{" "}
              sera supprimé de votre audience.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteContactMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {deleteContactMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AudiencePage;
