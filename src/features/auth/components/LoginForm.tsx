import { useState } from "react";
import LoginLeftSide from "./LoginLeftSide";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { useLogin } from "../hooks/useAuth";
import { getRedirectPath } from "../../../lib/redirect";

type Props = {
  role?: string;
  title?: string;
  subtitle?: string;
};

const LoginForm = ({
  role = "company",
  title = "Welcome back",
  subtitle = "Sign in to your account",
}: Props) => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginMutation.mutateAsync({
        email,
        password,
      });

      toast.success("Connexion réussie");

      const redirectPath = getRedirectPath(res.user);

      navigate(redirectPath);
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors de la connexion");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-10"
          >
            <ArrowLeftIcon size={16} /> Retour
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-medium text-zinc-800">
              {title}
            </h1>
            <p className="text-slate-500 text-sm mt-2">{subtitle}</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 rounded w-full pr-10"
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
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 bg-indigo-600 text-white rounded flex justify-center items-center"
            >
              {loginMutation.isPending && (
                <Loader2Icon className="animate-spin mr-2" />
              )}
              Sign In
            </button>
          </form>
          <p className="text-sm text-slate-500 mt-6 text-center">
            pas de compte ?{" "}
            <Link to="/register" className="text-indigo-600 font-medium">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
