type BaseEmailParams = {
  title: string;
  preheader?: string;
  contentHtml: string;
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
