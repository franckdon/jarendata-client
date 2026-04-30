import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import LoginLeftSide from "./LoginLeftSide";
import { useRegister } from "../hooks/useAuth";
import { getRedirectPath } from "../../../lib/redirect";
import { RegisterPayload } from "../types/auth.types";

const RegisterForm = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<RegisterPayload>({
    fullName: "",
    email: "",
    password: "",
    companyName: "",
    companyCountry: "Côte d’Ivoire",
    companyCity: "",
    companyPhone: "",
    companyIndustry: "",
  });

  const updateField = (field: keyof RegisterPayload, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const goNext = () => {
    if (!formData.fullName.trim()) {
      toast.error("Le nom complet est obligatoire");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("L’email est obligatoire");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      toast.error("Le nom de l’entreprise est obligatoire");
      return;
    }

    if (!formData.companyCountry.trim()) {
      toast.error("Le pays est obligatoire");
      return;
    }

    try {
      const res = await registerMutation.mutateAsync(formData);

      toast.success("Compte créé avec succès");

      navigate(getRedirectPath(res.user));
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors de la création du compte");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-10"
          >
            <ArrowLeftIcon size={16} /> Retour connexion
          </Link>

          <div className="mb-8">
            <p className="text-sm text-indigo-600 font-medium mb-2">
              Étape {step} sur 2
            </p>

            <h1 className="text-2xl sm:text-3xl font-medium text-zinc-800">
              {step === 1 ? "Créer votre compte" : "Informations entreprise"}
            </h1>

            <p className="text-slate-500 text-sm mt-2">
              {step === 1
                ? "Renseignez vos informations personnelles."
                : "Configurez votre espace entreprise Jarendata."}
            </p>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full mb-8">
            <div
              className="h-2 bg-indigo-600 rounded-full transition-all"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="Donald Bassa"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className="border p-2 rounded w-full pr-10"
                      placeholder="••••••••"
                      required
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon size={18} />
                      ) : (
                        <EyeIcon size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  className="w-full py-3 bg-indigo-600 text-white rounded flex justify-center items-center"
                >
                  Continuer
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm mb-2">
                    Nom de l’entreprise
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="Lacoste CI"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Pays</label>
                  <input
                    type="text"
                    value={formData.companyCountry}
                    onChange={(e) =>
                      updateField("companyCountry", e.target.value)
                    }
                    className="border p-2 rounded w-full"
                    placeholder="Côte d’Ivoire"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Ville</label>
                  <input
                    type="text"
                    value={formData.companyCity}
                    onChange={(e) => updateField("companyCity", e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="Abidjan"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Téléphone WhatsApp
                  </label>
                  <div className="flex gap-2">
                    <div className="w-24 border p-2 rounded bg-slate-50 text-slate-600">
                      +225
                    </div>
                    <input
                      type="tel"
                      value={formData.companyPhone?.replace("+225", "") || ""}
                      onChange={(e) =>
                        updateField("companyPhone", `+225${e.target.value}`)
                      }
                      className="border p-2 rounded w-full"
                      placeholder="0700000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Secteur d’activité
                  </label>
                  <select
                    value={formData.companyIndustry}
                    onChange={(e) =>
                      updateField("companyIndustry", e.target.value)
                    }
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Retail">Retail / Commerce</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Finance">Finance</option>
                    <option value="Santé">Santé</option>
                    <option value="Éducation">Éducation</option>
                    <option value="Transport">Transport</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full py-3 border border-slate-300 text-slate-700 rounded"
                  >
                    Retour
                  </button>

                  <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full py-3 bg-indigo-600 text-white rounded flex justify-center items-center disabled:opacity-50"
                  >
                    {registerMutation.isPending && (
                      <Loader2Icon className="animate-spin mr-2" />
                    )}
                    Créer le compte
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-sm text-slate-500 mt-6 text-center">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-indigo-600 font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
