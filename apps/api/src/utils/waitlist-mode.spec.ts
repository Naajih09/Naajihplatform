import { isWaitlistMode } from './waitlist-mode';

describe('waitlist mode', () => {
  const originalWaitlistMode = process.env.WAITLIST_MODE;

  afterEach(() => {
    if (originalWaitlistMode === undefined) {
      delete process.env.WAITLIST_MODE;
    } else {
      process.env.WAITLIST_MODE = originalWaitlistMode;
    }
  });

  it('is enabled only when WAITLIST_MODE is true', () => {
    process.env.WAITLIST_MODE = 'true';
    expect(isWaitlistMode()).toBe(true);

    process.env.WAITLIST_MODE = 'false';
    expect(isWaitlistMode()).toBe(false);
  });
});