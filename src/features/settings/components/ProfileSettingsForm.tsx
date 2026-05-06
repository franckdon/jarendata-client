import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  SaveIcon,
  UserIcon,
} from "lucide-react";
import { api } from "../../../lib/api";
import { unwrap } from "../../../lib/apiResponse";
import { useAuthStore } from "../../auth/store/auth.store";
import { User } from "../../auth/types/auth.types";

type ProfileForm = {
  fullName: string;
  email: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder: string;
};

const PasswordInput = ({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
}: PasswordInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2.5 pr-11 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={placeholder}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
        >
          {show ? (
            <EyeOffIcon className="w-4 h-4" />
          ) : (
            <EyeIcon className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

const ProfileSettingsForm = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsProfileSubmitting(true);

      const res = await api.patch("/auth/me", {
        fullName: profileForm.fullName.trim(),
        email: profileForm.email.trim(),
      });

      const updatedUser = unwrap<User>(res);
      setUser(updatedUser);

      toast.success("Profil mis à jour avec succès");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la mise à jour du profil",
      );
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setIsPasswordSubmitting(true);

      await api.patch("/auth/me", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Mot de passe modifié avec succès");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la modification du mot de passe",
      );
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <UserIcon className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Informations du profil
            </h2>
            <p className="text-sm text-slate-500">
              Modifiez vos informations personnelles.
            </p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="max-w-3xl space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nom complet
              </label>

              <input
                value={profileForm.fullName}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                required
                minLength={2}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Votre nom complet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>

              <input
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                required
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="email@exemple.com"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isProfileSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
            >
              <SaveIcon className="w-4 h-4" />
              {isProfileSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <LockIcon className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">Sécurité</h2>
            <p className="text-sm text-slate-500">
              Modifiez votre mot de passe de connexion.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="max-w-3xl space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <PasswordInput
              label="Mot de passe actuel"
              value={passwordForm.currentPassword}
              onChange={(value) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: value,
                }))
              }
              show={showCurrentPassword}
              onToggle={() => setShowCurrentPassword((prev) => !prev)}
              placeholder="Mot de passe actuel"
            />

            <PasswordInput
              label="Nouveau mot de passe"
              value={passwordForm.newPassword}
              onChange={(value) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: value,
                }))
              }
              show={showNewPassword}
              onToggle={() => setShowNewPassword((prev) => !prev)}
              placeholder="Minimum 6 caractères"
            />

            <PasswordInput
              label="Confirmation"
              value={passwordForm.confirmPassword}
              onChange={(value) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmPassword: value,
                }))
              }
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((prev) => !prev)}
              placeholder="Confirmer le mot de passe"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPasswordSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60"
            >
              <LockIcon className="w-4 h-4" />
              {isPasswordSubmitting
                ? "Modification..."
                : "Modifier le mot de passe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsForm;
