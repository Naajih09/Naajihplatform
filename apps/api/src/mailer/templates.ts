type BaseEmailParams = {
  title: string;
  preheader?: string;
  contentHtml: string;
};

type WelcomeEmailParams = {
  firstName: string;
  role: string;
  dashboardUrl: string;
};

const baseEmail = ({ title, preheader, contentHtml }: BaseEmailParams) => {
  const safePreheader = preheader || title;
  return `
  <div style="display:none;max-height:0;overflow:hidden;color:#fff">${safePreheader}</div>
  <div style="font-family:Arial,Helvetica,sans-serif;background:#0f0f10;padding:24px;">
    <div style="max-width:600px;margin:0 auto;background:#151518;border-radius:12px;padding:24px;color:#ffffff;">
      <h1 style="font-size:20px;margin:0 0 12px 0;">${title}</h1>
      <div style="font-size:14px;line-height:1.6;color:#d1d5db;">
        ${contentHtml}
      </div>
      <div style="margin-top:24px;font-size:12px;color:#6b7280;">
        Naajih Platform
      </div>
    </div>
  </div>
  `;
};

export const verificationEmail = (verifyUrl: string, hours: number) =>
  baseEmail({
    title: 'Verify your Naajih account',
    preheader: 'Confirm your email address',
    contentHtml: `
      <p>Welcome to Naajih Platform.</p>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verifyUrl}" style="color:#fbbf24;">${verifyUrl}</a></p>
      <p>This link expires in ${hours} hours.</p>
    `,
  });

export const notificationEmail = (message: string) =>
  baseEmail({
    title: 'Naajih Notification',
    preheader: message,
    contentHtml: `<p>${message}</p>`,
  });

const roleWelcomeCopy: Record<
  string,
  { label: string; body: string; next: string }
> = {
  ENTREPRENEUR: {
    label: 'Entrepreneur',
    body: 'Your founder workspace is ready. You can shape your profile, prepare your pitch, and connect with Sharia-compliant investors.',
    next: 'Start by completing your business profile and creating your first pitch.',
  },
  INVESTOR: {
    label: 'Investor',
    body: 'Your investor workspace is ready. You can discover vetted opportunities, review founder profiles, and build an ethical portfolio.',
    next: 'Start by setting your investment focus so we can surface better matches.',
  },
  ASPIRING_BUSINESS_OWNER: {
    label: 'Aspiring Business Owner',
    body: 'Your learning workspace is ready. You can use Naajih Academy, mentorship, and founder resources to move from idea to launch.',
    next: 'Start in the learning center and build your foundation step by step.',
  },
};

export const welcomeEmail = ({
  firstName,
  role,
  dashboardUrl,
}: WelcomeEmailParams) => {
  const copy = roleWelcomeCopy[role] || roleWelcomeCopy.ENTREPRENEUR;

  return baseEmail({
    title: `Welcome to NaajihBiz, ${firstName}`,
    preheader: `Your ${copy.label} account is ready`,
    contentHtml: `
      <p>Assalamu alaikum ${firstName},</p>
      <p>Welcome to NaajihBiz. You joined as an <strong>${copy.label}</strong>.</p>
      <p>${copy.body}</p>
      <p>${copy.next}</p>
      <p><a href="${dashboardUrl}" style="color:#fbbf24;">Go to your dashboard</a></p>
    `,
  });
};

export const passwordResetEmail = (resetUrl: string, minutes: number) =>
  baseEmail({
    title: 'Reset your NaajihBiz password',
    preheader: 'Use this secure link to create a new password',
    contentHtml: `
      <p>We received a request to reset your NaajihBiz password.</p>
      <p><a href="${resetUrl}" style="color:#fbbf24;">Reset your password</a></p>
      <p>This link expires in ${minutes} minutes. If you did not request this, you can ignore this email.</p>
    `,
  });
