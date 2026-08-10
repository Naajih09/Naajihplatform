import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import Button from "../../components/Button";
import { getApiBaseUrl } from "@/lib/api-base";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const initialEmail = searchParams.get("email") || "";
  const wasSent = searchParams.get("sent") === "1";
  const API_BASE = getApiBaseUrl();

  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    token ? "loading" : "idle",
  );
  const [message, setMessage] = useState(
    wasSent
      ? "We sent a verification link to your email. Open it to activate your account."
      : "Enter your email and we will send a fresh verification link.",
  );
  const [resendUrl, setResendUrl] = useState("");
  const [resending, setResending] = useState(false);

  const canResend = useMemo(() => email.trim().length > 0, [email]);

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      setStatus("loading");
      setMessage("Checking your verification link...");

      try {
        const response = await fetch(
          `${API_BASE}/users/verify-email?token=${encodeURIComponent(token)}`,
        );
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Verification link is invalid.");
        }

        setStatus("success");
        setMessage(data.message || "Email verified successfully.");
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Verification link is invalid or expired.");
      }
    };

    verify();
  }, [API_BASE, token]);

  const handleResend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canResend) return;

    setResending(true);
    setResendUrl("");

    try {
      const response = await fetch(`${API_BASE}/users/verify-email/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to resend verification email.");
      }

      setStatus("idle");
      setMessage(
        data.message ||
          "If an unverified account exists, a verification link has been sent.",
      );
      setResendUrl(typeof data.verifyUrl === "string" ? data.verifyUrl : "");
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Unable to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  const icon =
    status === "loading" ? (
      <Loader2 className="animate-spin text-primary" size={28} />
    ) : status === "success" ? (
      <CheckCircle2 className="text-green-500" size={28} />
    ) : status === "error" ? (
      <AlertCircle className="text-red-500" size={28} />
    ) : (
      <Mail className="text-primary" size={28} />
    );

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background-light px-4 py-8 text-slate-900 dark:bg-background-dark dark:text-white">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary"
        >
          <ArrowLeft size={16} /> Back to login
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#171717]">
          <div className="mb-5 flex size-14 items-center justify-center rounded-lg bg-primary/10">
            {icon}
          </div>
          <h1 className="mb-2 text-3xl font-bold">Verify Email</h1>
          <p className="mb-6 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {message}
          </p>

          {status === "success" ? (
            <Link
              to="/login"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-5 py-3 font-bold text-background-dark transition-all hover:brightness-110"
            >
              Continue to login
            </Link>
          ) : (
            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-500">
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
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="min-h-12 w-full rounded-lg border border-slate-300 bg-transparent py-3 pl-10 pr-4 transition-colors focus:border-primary focus:outline-none dark:border-white/10"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary font-bold text-background-dark hover:brightness-110"
                isLoading={resending}
                disabled={resending || !canResend}
              >
                Resend verification <Send size={18} />
              </Button>
              {resendUrl && (
                <a
                  href={resendUrl}
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-green-500/30 px-4 py-2 text-sm font-bold text-green-600 hover:bg-green-500/10"
                >
                  Open verification link
                </a>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
