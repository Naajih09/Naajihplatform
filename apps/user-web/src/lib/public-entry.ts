export const isConferenceModeEnabled = () =>
  import.meta.env.VITE_CONFERENCE_MODE === "true";

export const getPublicEntryPath = () =>
  isConferenceModeEnabled() ? "/conference-waitlist" : "/signup";
