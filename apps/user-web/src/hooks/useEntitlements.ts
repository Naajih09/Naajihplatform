import { useEffect, useState } from "react";
import { getApiBaseUrl } from "@/lib/api-base";

export type UserEntitlements = {
  academyPremium: boolean;
  networkingPremium: boolean;
  mentorBooking: boolean;
  certificates: boolean;
  canCreatePitch: boolean;
  canConnect: boolean;
  canMessage: boolean;
  canSubmitVerification: boolean;
};

const defaultEntitlements: UserEntitlements = {
  academyPremium: false,
  networkingPremium: false,
  mentorBooking: false,
  certificates: false,
  canCreatePitch: false,
  canConnect: false,
  canMessage: false,
  canSubmitVerification: false,
};

export const useEntitlements = () => {
  const [entitlements, setEntitlements] =
    useState<UserEntitlements>(defaultEntitlements);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      "";

    if (!authToken) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/users/me/entitlements`, {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Cache-Control": "no-store",
          },
        });
        if (!res.ok) throw new Error("Failed to load entitlements.");
        const data = await res.json();
        if (!cancelled) {
          setEntitlements({ ...defaultEntitlements, ...data });
        }
      } catch {
        if (!cancelled) {
          setEntitlements(defaultEntitlements);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { entitlements, loading };
};
