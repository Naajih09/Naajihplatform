import React, { useState } from "react";
import { Bell, Check, Eye, EyeOff, Lock, Target, Trash2 } from "lucide-react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../../lib/api-base";

const FOCUS_AREAS = [
  "FinTech",
  "AgriTech",
  "HealthTech",
  "Retail",
  "Education",
  "Logistics",
  "Real Estate",
  "Islamic Finance",
  "SaaS",
  "Clean Energy",
  "Fashion",
  "Food & Beverage",
];

const Settings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const profile =
    user.role === "INVESTOR" ? user.investorProfile : user.entrepreneurProfile;

  const [activeTab, setActiveTab] = useState("security");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusAreas, setFocusAreas] = useState<string[]>(() =>
    Array.isArray(profile?.focusIndustries)
      ? profile.focusIndustries
      : profile?.industry
        ? [profile.industry]
        : [],
  );
  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem("notificationPreferences");
      return stored
        ? JSON.parse(stored)
        : {
            email: true,
            messages: true,
            opportunities: true,
          };
    } catch {
      return {
        email: true,
        messages: true,
        opportunities: true,
      };
    }
  });
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });
  const API_BASE = getApiBaseUrl();
  const authToken =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    "";
  const authHeaders = authToken ? { Authorization: `Bearer ${authToken}` } : {};

  React.useEffect(() => {
    localStorage.setItem(
      "notificationPreferences",
      JSON.stringify(notificationPrefs),
    );
  }, [notificationPrefs]);

  const toggleFocusArea = (area: string) => {
    setFocusAreas((current) =>
      current.includes(area)
        ? current.filter((item) => item !== area)
        : [...current, area],
    );
  };

  const handleSaveFocusAreas = async () => {
    if (!user?.id) {
      setToast({
        show: true,
        message: "Session expired. Please log in again.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const payload =
        user.role === "INVESTOR"
          ? {
              investorProfile: {
                ...(user.investorProfile || {}),
                focusIndustries: focusAreas,
              },
            }
          : {
              entrepreneurProfile: {
                ...(user.entrepreneurProfile || {}),
                focusIndustries: focusAreas,
              },
            };

      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok)
        throw new Error(data?.message || "Failed to save focus areas.");

      localStorage.setItem("user", JSON.stringify(data));
      setToast({ show: true, message: "Focus areas saved.", type: "success" });
    } catch (err: any) {
      setToast({
        show: true,
        message: err?.message || "Failed to save focus areas.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/password/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("Failed to update password");
      setToast({
        show: true,
        message: "Password updated successfully.",
        type: "success",
      });
      setPassword("");
    } catch (err) {
      setToast({
        show: true,
        message: "Error updating password.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      await fetch(`${API_BASE}/users/${user.id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      setToast({ show: true, message: "Account deleted.", type: "success" });
      handleLogout();
    } catch (err) {
      setToast({
        show: true,
        message: "Failed to delete account.",
        type: "error",
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20 font-sans md:space-y-8">
      {toast.show && (
        <div
          className={`fixed left-3 right-3 top-4 z-50 flex items-center gap-2 rounded px-4 py-3 font-medium text-white shadow-lg sm:left-auto sm:right-4 ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
        Settings
      </h1>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
        {/* Sidebar */}
        <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 mobile-scrollbar-hide md:mx-0 md:block md:space-y-2 md:overflow-visible md:px-0 md:pb-0">
          {["Security", "Focus Areas", "Notifications"].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab.toLowerCase().replace(/\s+/g, "-"))
              }
              className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-bold transition-colors md:w-full ${
                activeTab === tab.toLowerCase().replace(/\s+/g, "-")
                  ? "bg-primary text-black"
                  : "hover:bg-slate-200 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="hidden pt-8 md:block">
            <button
              onClick={handleDeleteAccount}
              className="w-full text-left px-4 py-3 rounded-xl font-bold text-xs text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#1d1d20] sm:p-8 md:col-span-2">
          {activeTab === "security" && (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-gray-800">
                <Lock className="text-primary" size={24} />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Security & Password
                </h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 pr-12 bg-slate-100 dark:bg-[#151518] border border-slate-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white focus:border-primary focus:outline-none"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-stretch sm:justify-end">
                <Button
                  type="submit"
                  isLoading={loading}
                  className="bg-slate-900 text-white dark:bg-white dark:text-black font-bold"
                >
                  Update Password
                </Button>
              </div>
            </form>
          )}

          {activeTab === "focus-areas" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-gray-800">
                <Target className="text-primary" size={24} />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Focus Areas
                </h3>
              </div>
              <p className="text-slate-500 dark:text-gray-500 text-sm">
                Select the industries you want the platform to prioritize in
                feeds and recommendations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FOCUS_AREAS.map((area) => {
                  const selected = focusAreas.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleFocusArea(area)}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-bold transition-colors ${
                        selected
                          ? "border-primary bg-primary text-black"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/50 dark:border-gray-800 dark:bg-[#151518] dark:text-white"
                      }`}
                    >
                      <span>{area}</span>
                      {selected && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4">
                <p className="text-xs text-slate-500 dark:text-gray-500">
                  {focusAreas.length} selected
                </p>
                <Button
                  type="button"
                  onClick={handleSaveFocusAreas}
                  isLoading={loading}
                  className="bg-primary text-black font-bold"
                >
                  Save Focus Areas
                </Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-gray-800">
                <Bell className="text-primary" size={24} />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Preferences
                </h3>
              </div>
              <p className="text-slate-500 dark:text-gray-500 text-sm">
                Your notification preferences are saved on this device for now.
              </p>
              <div className="space-y-3">
                {[
                  {
                    key: "email",
                    label: "Email alerts",
                    desc: "Get updates by email.",
                  },
                  {
                    key: "messages",
                    label: "Message alerts",
                    desc: "Get notified when someone sends a message.",
                  },
                  {
                    key: "opportunities",
                    label: "Opportunity alerts",
                    desc: "Get notified about pitch and opportunity activity.",
                  },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setNotificationPrefs((prev: any) => ({
                        ...prev,
                        [item.key]: !prev[item.key],
                      }))
                    }
                    className="w-full flex items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-gray-800 px-4 py-4 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-500">
                        {item.desc}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        notificationPrefs[item.key]
                          ? "bg-primary text-black"
                          : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-gray-400"
                      }`}
                    >
                      {notificationPrefs[item.key] ? "On" : "Off"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
