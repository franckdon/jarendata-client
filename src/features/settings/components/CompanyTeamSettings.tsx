import { FormEvent, useEffect, useState } from "react";
import {
  LockIcon,
  PlusIcon,
  Trash2Icon,
  UserCheckIcon,
  UserIcon,
  UserXIcon,
  UsersIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../../lib/api";
import { unwrap } from "../../../lib/apiResponse";
import {
  CompanyMemberRole,
  CompanyUser,
  CreateCompanyMemberPayload,
} from "../../company/types/company.types";

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

type Props = {
  canManage: boolean;
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

const CompanyTeamSettings = ({ canManage }: Props) => {
  const [members, setMembers] = useState<CompanyUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<CompanyUser | null>(
    null,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<CreateCompanyMemberPayload>({
    fullName: "",
    email: "",
    password: "",
    companyRole: "MEMBER",
  });

  const fetchTeam = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/team");
      const data = unwrap<CompanyUser[]>(res);
      setMembers(data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors du chargement de l'équipe",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

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

    if (!canManage) return;

    try {
      setIsSubmitting(true);

      await api.post("/team", {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        companyRole: form.companyRole,
      });

      toast.success("Membre ajouté avec succès");
      resetForm();
      setOpenAdd(false);
      fetchTeam();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de l'ajout du membre",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (
    member: CompanyUser,
    companyRole: Exclude<CompanyMemberRole, "OWNER">,
  ) => {
    if (!canManage) return;

    try {
      await api.patch(`/team/${member.id}/role`, {
        companyRole,
      });

      toast.success("Rôle mis à jour avec succès");
      fetchTeam();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la modification du rôle",
      );
    }
  };

  const handleStatusToggle = async (member: CompanyUser) => {
    if (!canManage) return;

    try {
      await api.patch(`/team/${member.id}/status`, {
        isActive: !member.isActive,
      });

      toast.success(
        !member.isActive
          ? "Membre activé avec succès"
          : "Membre désactivé avec succès",
      );

      fetchTeam();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la modification du statut",
      );
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete || !canManage) return;

    try {
      await api.delete(`/team/${memberToDelete.id}`);

      toast.success("Membre supprimé avec succès");
      setMemberToDelete(null);
      fetchTeam();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la suppression du membre",
      );
    }
  };

  return (
    <div className="card p-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <UsersIcon className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">Équipe</h2>
            <p className="text-sm text-slate-500">
              Gérez les membres de votre entreprise.
            </p>
          </div>
        </div>

        {canManage ? (
          <button
            type="button"
            onClick={() => setOpenAdd(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="w-4 h-4" />
            Ajouter un membre
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-amber-700 bg-amber-50 border border-amber-200">
            <LockIcon className="w-4 h-4" />
            Gestion réservée au propriétaire
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-500">
          Chargement de l’équipe...
        </div>
      ) : members.length === 0 ? (
        <div className="p-6 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
          Aucun membre trouvé.
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
                {canManage && (
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {members.map((member) => {
                const isOwner = member.companyRole === "OWNER";

                return (
                  <tr key={member.id}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          <UserIcon className="w-4 h-4" />
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {member.fullName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {isOwner || !canManage ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-indigo-50 text-indigo-700 border-indigo-200">
                          {roleLabels[member.companyRole || "MEMBER"]}
                        </span>
                      ) : (
                        <select
                          value={member.companyRole || "MEMBER"}
                          onChange={(e) =>
                            handleRoleChange(
                              member,
                              e.target.value as Exclude<
                                CompanyMemberRole,
                                "OWNER"
                              >,
                            )
                          }
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          member.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {member.isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>

                    {canManage && (
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={isOwner}
                            onClick={() => handleStatusToggle(member)}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed ${
                              member.isActive
                                ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                                : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                            }`}
                          >
                            {member.isActive ? (
                              <UserXIcon className="w-4 h-4" />
                            ) : (
                              <UserCheckIcon className="w-4 h-4" />
                            )}
                            {member.isActive ? "Désactiver" : "Activer"}
                          </button>

                          <button
                            type="button"
                            disabled={isOwner}
                            onClick={() => setMemberToDelete(member)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2Icon className="w-4 h-4" />
                            Supprimer
                          </button>
                        </div>
                      </td>
                    )}
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
              Créez un accès utilisateur pour votre entreprise.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleCreateMember} className="space-y-4">
            <input
              value={form.fullName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, fullName: e.target.value }))
              }
              required
              minLength={2}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm"
              placeholder="Nom complet"
            />

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm"
              placeholder="Email"
            />

            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              minLength={6}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm"
              placeholder="Mot de passe"
            />

            <select
              value={form.companyRole}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  companyRole: e.target
                    .value as CreateCompanyMemberPayload["companyRole"],
                }))
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white"
            >
              {editableRoles.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </select>

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
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isSubmitting ? "Enregistrement..." : "Ajouter"}
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
              sera supprimé de l’équipe.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteMember}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompanyTeamSettings;
