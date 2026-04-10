import { Link } from 'react-router-dom';

const sections = [
  {
    title: '1. Information we collect',
    body:
      'We collect information you provide directly, such as your name, email address, role selection, profile details, messages, and any information you submit when using platform features. We may also collect device, browser, and usage information when you interact with the app.',
  },
  {
    title: '2. How we use information',
    body:
      'We use your information to create and manage accounts, deliver platform features, authenticate users, connect relevant participants, send service messages, improve the product, protect against fraud, and comply with legal obligations.',
  },
  {
    title: '3. How we share information',
    body:
      'We do not sell your personal information. We may share information with service providers that help us run the platform, with other users when you choose to make content public or communicate directly, and with regulators or legal authorities when required by law.',
  },
  {
    title: '4. Payments and third-party tools',
    body:
      'If you use a payment, messaging, analytics, or verification feature powered by a third party, that provider may process information under its own privacy terms. We try to use providers that apply strong security and privacy standards, but we are not responsible for their independent practices.',
  },
  {
    title: '5. Cookies and similar technologies',
    body:
      'We may use cookies, session storage, and similar technologies to keep you signed in, remember preferences, measure performance, and improve the user experience. You can usually control cookies through your browser settings, but parts of the service may not work as intended if you disable them.',
  },
  {
    title: '6. Data retention',
    body:
      'We keep personal information only as long as needed to provide the platform, meet legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, we take reasonable steps to delete or de-identify it.',
  },
  {
    title: '7. Security',
    body:
      'We use administrative, technical, and organizational safeguards designed to protect your information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.',
  },
  {
    title: '8. Your choices and rights',
    body:
      'Depending on where you live, you may have rights to access, correct, delete, or restrict the processing of your personal data. You may also be able to opt out of certain communications. To make a request, contact us using the details below.',
  },
  {
    title: '9. Children',
    body:
      'NaajihBiz is intended for adult users and business participants. We do not knowingly collect personal data from children. If you believe a child has provided us with data, contact us so we can investigate and remove it where appropriate.',
  },
  {
    title: '10. International transfers',
    body:
      'Because our platform and service providers may operate in multiple regions, your information may be processed in countries other than where you live. We take steps designed to protect the information when that happens.',
  },
  {
    title: '11. Changes to this policy',
    body:
      'We may update this privacy policy from time to time. If we make significant changes, we will update the effective date and, where appropriate, notify users through the platform.',
  },
  {
    title: '12. Contact',
    body:
      'For privacy questions or requests, contact support@naajihbiz.com.',
  },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background-light text-slate-900 dark:bg-background-dark dark:text-white">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-16 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
          Legal
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
          Privacy Policy
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-400">
          Effective date: April 10, 2026. This privacy policy is tailored to
          NaajihBiz and describes how we handle information across the platform.
        </p>

        <section className="mt-12 space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-bold">{section.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {section.body}
              </p>
            </div>
          ))}
        </section>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/signup"
            className="rounded-lg bg-primary px-5 py-3 font-bold text-background-dark transition hover:brightness-110"
          >
            Back to signup
          </Link>
          <Link
            to="/terms"
            className="rounded-lg border border-slate-300 px-5 py-3 font-bold text-slate-900 transition hover:border-primary hover:text-primary dark:border-white/10 dark:text-white"
          >
            View terms and conditions
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
