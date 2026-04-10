import { Link } from 'react-router-dom';

const sections = [
  {
    title: '1. Acceptance of these terms',
    body:
      'By creating an account, browsing the platform, or using any service offered by NaajihBiz, you agree to these Terms of Service and to our Privacy Policy. If you do not agree, you should not use the platform.',
  },
  {
    title: '2. What NaajihBiz does',
    body:
      'NaajihBiz is a digital marketplace and community platform designed to connect entrepreneurs, investors, and learners around ethical and Sharia-compliant business opportunities. We provide tools for discovery, profile management, communication, education, and workflow support. We do not guarantee investment results, funding outcomes, or business performance.',
  },
  {
    title: '3. Eligibility and accounts',
    body:
      'You must be able to form a binding contract in your jurisdiction and provide accurate registration information. You are responsible for keeping your account credentials secure, for all activity carried out under your account, and for notifying us promptly if you suspect unauthorized access.',
  },
  {
    title: '4. Ethical and halal use',
    body:
      'The platform is intended for ethical business activity and interest-free, value-based participation. You agree not to use NaajihBiz to promote or facilitate fraud, deception, prohibited goods or services, gambling, or any activity that conflicts with applicable law or the platform’s halal principles.',
  },
  {
    title: '5. Investment and business risk',
    body:
      'Any investment, funding, mentorship, or business decision made through the platform carries risk. You are solely responsible for evaluating opportunities, carrying out due diligence, and seeking independent legal, tax, financial, or Sharia advice where appropriate. NaajihBiz is not a bank, broker-dealer, adviser, or guarantor of any deal.',
  },
  {
    title: '6. User content and conduct',
    body:
      'You retain ownership of content you submit, but you grant NaajihBiz a non-exclusive license to host, process, display, and distribute that content for the purpose of operating and improving the platform. You must not upload unlawful, misleading, infringing, defamatory, or harmful content.',
  },
  {
    title: '7. Prohibited behavior',
    body:
      'You may not attempt to reverse engineer the service, scrape data without permission, interfere with platform security, impersonate other users, bypass access controls, or use the platform in a way that could damage the service or other users.',
  },
  {
    title: '8. Fees and third-party services',
    body:
      'Some features may rely on third-party services such as hosting, analytics, payments, communication tools, or verification providers. Those services may have separate terms and fees. If platform fees are introduced, we will communicate them clearly before they apply.',
  },
  {
    title: '9. Suspension and termination',
    body:
      'We may suspend or terminate access if we reasonably believe you violated these terms, created risk for other users, or if required by law or security concerns. You may stop using the service at any time and request account deletion through support, subject to legal retention requirements.',
  },
  {
    title: '10. Disclaimers and liability',
    body:
      'The platform is provided on an "as is" and "as available" basis. To the maximum extent permitted by law, NaajihBiz disclaims implied warranties and will not be liable for indirect, incidental, special, or consequential damages arising from your use of the service or from decisions made based on platform content.',
  },
  {
    title: '11. Governing law',
    body:
      'These terms are intended to be governed by the laws applicable in Nigeria, without regard to conflict-of-law rules, unless a separate written agreement says otherwise. If a part of these terms is unenforceable, the rest remains in effect.',
  },
  {
    title: '12. Contact',
    body:
      'If you have questions about these terms, contact the NaajihBiz team at support@naajihbiz.com.',
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background-light text-slate-900 dark:bg-background-dark dark:text-white">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-16 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
          Legal
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
          Terms and Conditions
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-400">
          Effective date: April 10, 2026. This draft is tailored to the
          NaajihBiz platform and can be reviewed by counsel before launch.
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
            to="/privacy"
            className="rounded-lg border border-slate-300 px-5 py-3 font-bold text-slate-900 transition hover:border-primary hover:text-primary dark:border-white/10 dark:text-white"
          >
            View privacy policy
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Terms;
