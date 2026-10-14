export const isWaitlistMode = (): boolean =>
  process.env.WAITLIST_MODE === 'true';