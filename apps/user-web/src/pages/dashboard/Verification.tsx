import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  UploadCloud,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Building2,
} from "lucide-react";
import { getApiBaseUrl } from "../../lib/api-base";

const Verification = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const API_BASE = getApiBaseUrl();
  const authToken =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    "";
  const [status, setStatus] = useState<any>(null);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [startingProvider, setStartingProvider] = useState(false);
  const [selectedVerificationType, setSelectedVerificationType] = useState<
    "IDENTITY" | "BUSINESS"
  >("IDENTITY");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });
  const role = user.role || "USER";
  const isEntrepreneur = role === "ENTREPRENEUR";
  const verificationRequests = Array.isArray(status?.requests)
    ? status.requests
    : status
      ? [status]
      : [];
  const identityRequest = verificationRequests.find(
    (request: any) => request?.verificationType === "IDENTITY",
  );
  const businessRequest = verificationRequests.find(
    (request: any) => request?.verificationType === "BUSINESS",
  );
  const selectedRequest =
    selectedVerificationType === "BUSINESS" ? businessRequest : identityRequest;
  const statusLabel = selectedRequest?.status || status?.status || "NOT_SUBMITTED";
  const isApproved = statusLabel === "APPROVED";
  const isPending = statusLabel === "PENDING";
  const isRejected = statusLabel === "REJECTED";
  const documentExamples = isEntrepreneur
    ? "CAC certificate, government ID, or business registration document"
    : "government ID, passport, or investment organization document";
  const statusCopy = isApproved
    ? {
        title: "Verified",
        body: "Your account has passed review. You can now use verified-only platform features.",
      }
    : isPending
      ? {
          title: "Review in progress",
          body: "Your document is with the NaajihBiz team. Reviews usually take 24-48 hours.",
        }
      : isRejected
        ? {
            title: "Resubmission needed",
            body: "Your last document could not be approved. Review the note below and upload a clearer replacement.",
          }
        : {
            title: "Not submitted",
            body: "Submit one clear document so the team can confirm your identity and account role.",
          };

  // 1. CHECK STATUS ON LOAD
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const profileRes = await fetch(`${API_BASE}/users/${user.email}`, {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setEmailVerified(Boolean(profile?.emailVerified));
          localStorage.setItem("user", JSON.stringify(profile));
        } else {
          setEmailVerified(Boolean(user.emailVerified));
        }
        const res = await fetch(`${API_BASE}/verification/${user.id}`, {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });

        const text = await res.text();
        if (text) {
          const data = JSON.parse(text);
          setStatus(data);
        } else {
          setStatus(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    };
    fetchStatus();
  }, [user.id]);

  const requestEmailVerification = async () => {
    if (!authToken) {
      setToast({ show: true, message: "Please log in again.", type: "error" });
      return;
    }
    setEmailSending(true);
    try {
      const res = await fetch(`${API_BASE}/users/verify-email/request`, {
        method: "POST",
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (data?.emailed) {
          setToast({
            show: true,
            message: "Verification email sent.",
            type: "success",
          });
        } else if (data?.verifyUrl) {
          setToast({
            show: true,
            message:
              "Email is not configured here, so the verification link is opening in a new tab.",
            type: "success",
          });
          window.open(data.verifyUrl, "_blank", "noopener,noreferrer");
        } else {
          setToast({
            show: true,
            message: data?.message || "Verification email requested.",
            type: "success",
          });
        }
      } else {
        setToast({
          show: true,
          message: data?.message || "Failed to send email.",
          type: "error",
        });
      }
    } catch (err) {
      setToast({ show: true, message: "Failed to send email.", type: "error" });
    } finally {
      setEmailSending(false);
    }
  };

  // 2. HANDLE FILE UPLOAD
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setToast({
        show: true,
        message: "Please upload a file under 5MB.",
        type: "error",
      });
      e.target.value = "";
      return;
    }
    if (!consentAccepted) {
      setToast({
        show: true,
        message: "Consent is required before submitting verification details.",
        type: "error",
      });
      e.target.value = "";
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      const uploadUrl = data.secure_url || data.url;
      if (uploadUrl) {
        const submitRes = await fetch(`${API_BASE}/verification/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({
            documentUrl: uploadUrl,
            verificationType: selectedVerificationType,
            consentAccepted,
          }),
        });
        const submitData = await submitRes.json().catch(() => null);
        if (!submitRes.ok) {
          throw new Error(
            submitData?.message || "Verification submission failed.",
          );
        }
        setStatus((current: any) => {
          const existing = Array.isArray(current?.requests)
            ? current.requests
            : current
              ? [current]
              : [];
          return {
            status: "PENDING",
            requests: [
              ...existing.filter(
                (request: any) =>
                  request?.verificationType !== selectedVerificationType,
              ),
              {
                status: "PENDING",
                documentUrl: uploadUrl,
                verificationType: selectedVerificationType,
                provider: "MANUAL",
              },
            ],
          };
        });
        setToast({
          show: true,
          message: "Documents submitted successfully. Pending review.",
          type: "success",
        });
        window.dispatchEvent(new Event("naajih:onboarding-refresh"));
      }
    } catch (err: any) {
      setToast({
        show: true,
        message: err?.message || "Upload failed.",
        type: "error",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const startProviderVerification = async () => {
    if (!authToken) {
      setToast({ show: true, message: "Please log in again.", type: "error" });
      return;
    }
    if (!consentAccepted) {
      setToast({
        show: true,
        message: "Consent is required before third-party verification.",
        type: "error",
      });
      return;
    }

    setStartingProvider(true);
    try {
      const res = await fetch(`${API_BASE}/verification/provider/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          verificationType: selectedVerificationType,
          consentAccepted,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Could not start verification.");
      }
      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      setStatus((current: any) => {
        const existing = Array.isArray(current?.requests)
          ? current.requests
          : current
            ? [current]
            : [];
        const nextRequest = data?.request;
        return {
          status: "PENDING",
          requests: [
            ...existing.filter(
              (request: any) =>
                request?.verificationType !== nextRequest?.verificationType,
            ),
            nextRequest,
          ].filter(Boolean),
        };
      });
      setToast({
        show: true,
        message:
          data?.message ||
          "Verification session created. We will update you when the provider returns a result.",
        type: "success",
      });
      window.dispatchEvent(new Event("naajih:onboarding-refresh"));
    } catch (err: any) {
      setToast({
        show: true,
        message: err?.message || "Could not start verification.",
        type: "error",
      });
    } finally {
      setStartingProvider(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-20">
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium flex items-center gap-2 ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Verification Center
        </h1>
        <p className="text-slate-500 dark:text-gray-400 mt-1">
          Confirm your email, verify your identity, and verify your business
          through a trusted compliance partner.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT: MAIN FLOW --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Email Verification */}
          <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">
                1
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Confirm your email
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">
              {emailVerified
                ? "Your email is confirmed. We can contact you about verification decisions and platform updates."
                : "Use the verification link sent to your inbox so account notices and review updates reach the right person."}
            </p>
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 rounded text-xs font-bold ${emailVerified ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"}`}
              >
                {emailVerified ? "Verified" : "Not Verified"}
              </div>
              {!emailVerified && (
                <button
                  onClick={requestEmailVerification}
                  disabled={emailSending}
                  className="px-4 py-2 rounded-lg bg-primary text-neutral-dark text-xs font-bold disabled:opacity-60"
                >
                  {emailSending ? "Sending..." : "Send Verification Email"}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VerificationTrackCard
              title="Identity verification"
              description="Government identity, selfie/liveness, and account ownership checks."
              status={identityRequest?.status || "NOT_SUBMITTED"}
              icon={ShieldCheck}
            />
            <VerificationTrackCard
              title="Business verification"
              description="CAC or business registration checks for entrepreneur credibility."
              status={businessRequest?.status || "NOT_SUBMITTED"}
              icon={Building2}
            />
          </div>

          {/* Status Card */}
          <div
            className={`p-6 rounded-xl border-l-4 flex items-start gap-4 ${
              isApproved
                ? "bg-green-100 dark:bg-green-900/20 border-green-500"
                : isPending
                  ? "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500"
                  : isRejected
                    ? "bg-red-100 dark:bg-red-900/20 border-red-500"
                    : "bg-slate-100 dark:bg-white/5 border-slate-400"
            }`}
          >
            <div className="p-2 bg-white/50 dark:bg-white/5 rounded-full">
              {isApproved ? (
                <CheckCircle className="text-green-600 dark:text-green-500" />
              ) : isPending ? (
                <Clock className="text-yellow-600 dark:text-yellow-500" />
              ) : (
                <AlertTriangle className="text-red-600 dark:text-red-500" />
              )}
            </div>
            <div>
              <h3
                className={`font-bold text-lg ${
                  isApproved
                    ? "text-green-700 dark:text-green-400"
                    : isPending
                      ? "text-yellow-700 dark:text-yellow-400"
                      : isRejected
                        ? "text-red-700 dark:text-red-400"
                        : "text-slate-700 dark:text-slate-300"
                }`}
              >
                Current Status: {statusCopy.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                {statusCopy.body}
              </p>
              {isRejected && status?.rejectionReason && (
                <div className="mt-4 rounded-lg border border-red-200 bg-white/70 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-black/20 dark:text-red-300">
                  <span className="font-bold">Admin note:</span>{" "}
                  {status.rejectionReason}
                </div>
              )}
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Start verification
                </h4>
                <p className="text-sm text-slate-500 dark:text-gray-500">
                  Use a trusted partner first. Manual document upload remains
                  available as a fallback while provider integration is being
                  completed.
                </p>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {(["IDENTITY", "BUSINESS"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedVerificationType(type)}
                  className={`rounded-lg border px-4 py-3 text-left transition ${
                    selectedVerificationType === type
                      ? "border-primary bg-primary/10 text-slate-900 dark:text-white"
                      : "border-slate-200 text-slate-500 hover:border-primary/40 dark:border-gray-800 dark:text-gray-400"
                  }`}
                >
                  <span className="block text-sm font-bold">
                    {type === "IDENTITY" ? "Identity" : "Business"}
                  </span>
                  <span className="text-xs">
                    {type === "IDENTITY"
                      ? "Personal KYC and liveness checks"
                      : "Business registration and ownership checks"}
                  </span>
                </button>
              ))}
            </div>

            <label className="mb-5 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300">
              <input
                type="checkbox"
                checked={consentAccepted}
                onChange={(event) => setConsentAccepted(event.target.checked)}
                className="mt-1"
              />
              <span>
                I agree that NaajihBiz may share the required verification
                details with a trusted verification partner for KYC/KYB checks,
                fraud prevention, and compliance review.
              </span>
            </label>

            <button
              type="button"
              onClick={startProviderVerification}
              disabled={startingProvider || isPending || isApproved}
              className="mb-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-neutral-dark hover:brightness-110 disabled:opacity-60"
            >
              {startingProvider ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ShieldCheck size={18} />
              )}
              Start Trusted Partner Verification
            </button>

            {isPending || isApproved ? (
              <div className="p-6 bg-slate-100 dark:bg-[#151518] rounded-xl border border-slate-200 dark:border-gray-700 text-center">
                {isApproved ? (
                  <CheckCircle
                    className="mx-auto text-green-500 mb-2"
                    size={32}
                  />
                ) : (
                  <Clock className="mx-auto text-yellow-500 mb-2" size={32} />
                )}
                <p className="font-bold text-slate-900 dark:text-white">
                  {isApproved ? "Verification Approved" : "Document Submitted"}
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-500">
                  {isApproved
                    ? "No further action is required."
                    : "We will notify you when the provider or review team returns a result."}
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf"
                  aria-label="Upload document"
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-primary" size={32} />
                    <p className="text-slate-600 dark:text-white">
                      Uploading Securely...
                    </p>
                  </div>
                ) : (
                  <>
                    <UploadCloud
                      className="mx-auto text-slate-400 mb-4"
                      size={48}
                    />
                    <p className="font-bold text-slate-900 dark:text-white">
                      {isRejected
                        ? "Upload Replacement Document"
                        : `Upload ${selectedVerificationType.toLowerCase()} document fallback`}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-500 mt-2">
                      {documentExamples}. PDF, JPG, or PNG under 5MB.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-8 opacity-50">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-slate-200 dark:bg-gray-800 flex items-center justify-center text-slate-500 dark:text-gray-400 font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Provider result and exception review
                </h4>
                <p className="text-sm text-slate-500 dark:text-gray-500">
                  Our team reviews failed, flagged, or mismatched provider
                  results before unlocking verified-only actions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: BENEFITS --- */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-6 relative overflow-hidden shadow-sm">
            <ShieldCheck
              className="absolute top-4 right-4 text-primary/10"
              size={100}
            />
            <h3 className="font-bold text-lg mb-4 relative z-10 text-slate-900 dark:text-white">
              What Verification Unlocks
            </h3>
            <ul className="space-y-4 relative z-10">
              {[
                {
                  title: "Pitch, connect, and message",
                  desc: "Verified users can use the core actions that protect the marketplace.",
                },
                {
                  title: "Trust & credibility",
                  desc: "Other users can see that your account has passed identity review.",
                },
                {
                  title: "Cleaner admin review",
                  desc: "A clear document helps the team approve you faster or give useful feedback.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <div className="size-8 bg-primary/10 rounded flex items-center justify-center text-primary shrink-0">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-500">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">
              Before You Upload
            </h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-gray-400">
              <li>Use one document that clearly shows your name.</li>
              <li>Make sure the image is not blurry or cropped.</li>
              <li>Accepted formats: PDF, JPG, or PNG under 5MB.</li>
              <li>
                If rejected, upload a corrected document from this same page.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const VerificationTrackCard = ({
  title,
  description,
  status,
  icon: Icon,
}: {
  title: string;
  description: string;
  status: string;
  icon: typeof ShieldCheck;
}) => {
  const isApproved = status === "APPROVED";
  const isPending = status === "PENDING";
  const isRejected = status === "REJECTED";
  const label = isApproved
    ? "Verified"
    : isPending
      ? "Pending"
      : isRejected
        ? "Needs review"
        : "Not started";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#1d1d20]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Icon size={18} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
            isApproved
              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
              : isPending
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                : isRejected
                  ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                  : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-gray-300"
          }`}
        >
          {label}
        </span>
      </div>
      <p className="text-sm text-slate-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default Verification;
