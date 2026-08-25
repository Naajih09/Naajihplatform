import { useAuth } from "@/hooks/useAuth";
import { PropsWithChildren } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

export default function BlankLayout({ children }: PropsWithChildren) {
  const { isAuth, user } = useAuth();
  const [searchParams] = useSearchParams();
  const conferenceMode = import.meta.env.VITE_CONFERENCE_MODE === "true";
  const isConferenceWaitlist =
    conferenceMode &&
    Boolean(user?.isConferenceWaitlist) &&
    user?.role !== "ADMIN";

  if (isConferenceWaitlist) {
    return <Navigate to="/conference-waitlist" replace />;
  }

  if (isAuth) {
    return <Navigate to={searchParams.get("returnUrl") ?? "/dashboard"} />;
  }

  return <div className="min-h-screen">{children}</div>;
}
