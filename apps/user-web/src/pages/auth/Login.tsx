import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Send,
} from "lucide-react";
import Button from "../../components/Button";
import { useAppDispatch } from "@/store/store";
import { setAuth, setToken, setUser } from "@/store/slices/auth-slice";
import { getApiBaseUrl } from "@/lib/api-base";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationUrl, setVerificationUrl] = useState("");
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const API_BASE = getApiBaseUrl();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVerificationMessage("");
    setVerificationUrl("");
    setNeedsEmailVerification(false);

    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(
          data.message || "Login failed. Check your email/password.",
        );

      // Success! Save user info
      localStorage.setItem("accessToken", data.access_token);
      localStorage.removeItem("access_token");

      const userToSave = data.user ? data.user : data;
      localStorage.setItem("user", JSON.stringify(userToSave));

      dispatch(setToken({ accessToken: data.access_token }));
      dispatch(setUser(userToSave));
      dispatch(setAuth(true));

      // Redirect to Dashboard
      const returnUrl = searchParams.get("returnUrl");
      navigate(returnUrl || "/dashboard", { replace: true });
    } catch (err: any) {
      console.error(err);
      const message = err.message || "Login failed. Check your email/password.";
      setError(message);
      setNeedsEmailVerification(
        message.toLowerCase().includes("email not verified"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email.trim()) return;

    setResendingVerification(true);
    setVerificationMessage("");
    setVerificationUrl("");

    try {
      const response = await fetch(`${API_BASE}/users/verify-email/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to resend verification email.");
      }

      setVerificationMessage(
        data.message ||
          "If your account is unverified, a verification link has been sent.",
      );
      setVerificationUrl(
        typeof data.verifyUrl === "string" ? data.verifyUrl : "",
      );
    } catch (err: any) {
      setError(err.message || "Unable to resend verification email.");
    } finally {
      setResendingVerification(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] bg-background-light font-sans text-slate-900 dark:bg-background-dark dark:text-white">
      {/* BRANDING SIDE */}
      <div className="hidden lg:flex w-1/2 bg-background-dark border-r border-white/10 p-12 flex-col justify-between relative overflow-hidden">
        <div className="z-10 flex items-center gap-2">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-black font-extrabold">
            N
          </div>
          <h2 className="text-2xl font-bold text-white">
            Naajih<span className="text-primary">Biz</span>.
          </h2>
        </div>
        <div className="z-10 relative">
          <h2 className="text-5xl font-bold mb-6 leading-tight text-white">
            Welcome back.
          </h2>
          <p className="text-slate-400 text-lg">
            Continue connecting with trusted investors.
          </p>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      {/* FORM SIDE */}
      <div className="flex w-full items-center justify-center px-4 py-8 sm:p-8 lg:w-1/2">
        <div className="max-w-md w-full">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary font-extrabold text-black">
              N
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              NaajihBiz
            </span>
          </Link>
          <h2 className="mb-2 text-3xl font-bold">Log In</h2>
          <p className="text-slate-500 mb-8">
            Enter your credentials to access your dashboard.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {verificationMessage && (
            <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-600">
              <p>{verificationMessage}</p>
              {verificationUrl && (
                <a
                  href={verificationUrl}
                  className="mt-3 inline-flex rounded-md bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700"
                >
                  Open verification link
                </a>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-slate-400"
                  size={20}
                />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="min-h-12 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-3 transition-colors focus:border-primary focus:outline-none dark:border-white/10 dark:bg-transparent"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-500">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-slate-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="min-h-12 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-12 py-3 transition-colors focus:border-primary focus:outline-none dark:border-white/10 dark:bg-transparent"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-background-dark font-bold hover:brightness-110"
              isLoading={loading}
            >
              Log In <ArrowRight size={20} />
            </Button>
            {needsEmailVerification && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendingVerification || !formData.email.trim()}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-primary/40 px-5 py-3 text-sm font-bold text-primary transition-all hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resendingVerification ? "Sending..." : "Resend verification"}
                {!resendingVerification && <Send size={18} />}
              </button>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-bold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
