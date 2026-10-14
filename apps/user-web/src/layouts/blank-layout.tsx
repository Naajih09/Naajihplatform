import { useAuth } from "@/hooks/useAuth";
import { PropsWithChildren } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

export default function BlankLayout({ children }: PropsWithChildren) {
  const { isAuth, user } = useAuth();
  const [searchParams] = useSearchParams();
  const waitlistMode = import.meta.env.VITE_WAITLIST_MODE === "true";
  const isWaitlistUser =
    waitlistMode &&
    Boolean(user?.isWaitlistUser) &&
    user?.role !== "ADMIN";

  if (isWaitlistUser) {
    return <Navigate to="/waitlist" replace />;
  }

  if (isAuth) {
    return <Navigate to={searchParams.get("returnUrl") ?? "/dashboard"} />;
  }

  return <div className="min-h-screen">{children}</div>;
}
