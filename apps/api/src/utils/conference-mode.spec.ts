import { isConferenceMode } from './conference-mode';

describe('isConferenceMode', () => {
  const original = process.env.CONFERENCE_MODE;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.CONFERENCE_MODE;
    } else {
      process.env.CONFERENCE_MODE = original;
    }
  });

  it('returns true when the env is set to true', () => {
    process.env.CONFERENCE_MODE = 'true';
    expect(isConferenceMode()).toBe(true);
  });

  it('returns false for non-enabled values', () => {
    process.env.CONFERENCE_MODE = 'false';
    expect(isConferenceMode()).toBe(false);
  });
});
