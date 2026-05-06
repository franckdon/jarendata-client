import { FormEvent, useState } from "react";
import {
  PlusIcon,
  Trash2Icon,
  UserIcon,
  UserCheckIcon,
  UserXIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Company,
  CompanyMemberRole,
  CompanyUser,
  CreateCompanyMemberPayload,
} from "../types/company.types";
import {
  useCreateCompanyMember,
  useDeleteCompanyMember,
  useUpdateCompanyMemberRole,
  useUpdateCompanyMemberStatus,
} from "../hooks/useCompanyMembers";

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

type CompanyUsersSectionProps = {
  company: Company;
};

const roleLabels: Record<CompanyMemberRole, string> = {
  OWNER: "Propriétaire",
  MANAGER: "Manager",
  ANALYST: "Analyste",
  MEMBER: "Membre",
};

const editableRoles: Exclude<CompanyMemberRole, "OWNER">[] = [
  "MANAGER",
  "ANALYST",
  "MEMBER",
];

const CompanyUsersSection = ({ company }: CompanyUsersSectionProps) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<CompanyUser | null>(
    null,
  );

  const createMutation = useCreateCompanyMember(company.id);
  const updateRoleMutation = useUpdateCompanyMemberRole();
  const updateStatusMutation = useUpdateCompanyMemberStatus();
  const deleteMutation = useDeleteCompanyMember();

  const [form, setForm] = useState<CreateCompanyMemberPayload>({
    fullName: "",
    email: "",
    password: "",
    companyRole: "MEMBER",
  });

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      password: "",
      companyRole: "MEMBER",
    });
  };

  const handleCreateMember = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await createMutation.mutateAsync({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        companyRole: form.companyRole,
      });

      toast.success("Membre ajouté avec succès");
      resetForm();
      setOpenAdd(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de l'ajout du membre",
      );
    }
  };

  const handleRoleChange = async (
    user: CompanyUser,
    companyRole: Exclude<CompanyMemberRole, "OWNER">,
  ) => {
    try {
      await updateRoleMutation.mutateAsync({
        companyId: company.id,
        userId: user.id,
        companyRole,
      });

      toast.success("Rôle mis à jour avec succès");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la modification du rôle",
      );
    }
  };

  const handleStatusToggle = async (user: CompanyUser) => {
    try {
      await updateStatusMutation.mutateAsync({
        companyId: company.id,
        userId: user.id,
        isActive: !user.isActive,
      });

      toast.success(
        !user.isActive
          ? "Membre activé avec succès"
          : "Membre désactivé avec succès",
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la modification du statut",
      );
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      await deleteMutation.mutateAsync({
        companyId: company.id,
        userId: memberToDelete.id,
      });

      toast.success("Membre supprimé avec succès");
      setMemberToDelete(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la suppression du membre",
      );
    }
  };

  const users = company.users || [];

  return (
    <div className="card p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Utilisateurs associés
          </h2>
          <p className="text-sm text-slate-500">
            Gérez les membres rattachés à cette entreprise.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpenAdd(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="w-4 h-4" />
          Ajouter un membre
        </button>
      </div>

      {users.length === 0 ? (
        <div className="p-6 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
          Aucun utilisateur associé à cette entreprise.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Utilisateur
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Rôle
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                  Statut
                </th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const isOwner = user.companyRole === "OWNER";

                return (
                  <tr key={user.id}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          <UserIcon className="w-4 h-4" />
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {isOwner ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-indigo-50 text-indigo-700 border-indigo-200">
                          Propriétaire
                        </span>
                      ) : (
                        <select
                          value={user.companyRole || "MEMBER"}
                          onChange={(e) =>
                            handleRoleChange(
                              user,
                              e.target.value as Exclude<
                                CompanyMemberRole,
                                "OWNER"
                              >,
                            )
                          }
                          disabled={updateRoleMutation.isPending}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                        >
                          {editableRoles.map((role) => (
                            <option key={role} value={role}>
                              {roleLabels[role]}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {user.isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={isOwner || updateStatusMutation.isPending}
                          onClick={() => handleStatusToggle(user)}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed ${
                            user.isActive
                              ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                              : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          }`}
                        >
                          {user.isActive ? (
                            <UserXIcon className="w-4 h-4" />
                          ) : (
                            <UserCheckIcon className="w-4 h-4" />
                          )}
                          {user.isActive ? "Désactiver" : "Activer"}
                        </button>

                        <button
                          type="button"
                          disabled={isOwner}
                          onClick={() => setMemberToDelete(user)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2Icon className="w-4 h-4" />
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={openAdd} onOpenChange={setOpenAdd}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ajouter un membre</AlertDialogTitle>
            <AlertDialogDescription>
              Créez un accès utilisateur pour cette entreprise.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleCreateMember} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nom complet <span className="text-rose-500">*</span>
              </label>
              <input
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                required
                minLength={2}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Jean Kouassi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                required
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="membre@entreprise.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
                minLength={6}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Minimum 6 caractères"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Rôle
              </label>
              <select
                value={form.companyRole}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    companyRole: e.target
                      .value as CreateCompanyMemberPayload["companyRole"],
                  }))
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {editableRoles.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]}
                  </option>
                ))}
              </select>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel
                type="button"
                onClick={() => {
                  resetForm();
                  setOpenAdd(false);
                }}
              >
                Annuler
              </AlertDialogCancel>

              <AlertDialogAction
                type="submit"
                disabled={createMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {createMutation.isPending
                  ? "Enregistrement..."
                  : "Ajouter le membre"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!memberToDelete}
        onOpenChange={(open) => {
          if (!open) setMemberToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le membre</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le membre{" "}
              <span className="font-semibold text-slate-900">
                {memberToDelete?.fullName}
              </span>{" "}
              sera supprimé de cette entreprise.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteMember}
              disabled={deleteMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompanyUsersSection;
