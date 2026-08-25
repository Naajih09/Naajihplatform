export const isConferenceMode = (): boolean => {
  return process.env.CONFERENCE_MODE === 'true';
};
