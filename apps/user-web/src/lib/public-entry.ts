export const isWaitlistModeEnabled = () =>
  import.meta.env.VITE_WAITLIST_MODE === "true";

export const getPublicEntryPath = () =>
  "/signup";
