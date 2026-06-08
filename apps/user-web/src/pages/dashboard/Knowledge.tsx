import { ArrowRight, BadgeCheck, BookOpen, Handshake, Rocket, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Create a trusted profile',
    text: 'Add your name, business or investment details, focus areas, and a clear profile photo so other users know who they are dealing with.',
    icon: UserRoundCheck,
  },
  {
    title: 'Verify your account',
    text: 'Submit identity verification before taking key actions like pitching, connecting, or messaging. This keeps the network serious and safer.',
    icon: ShieldCheck,
  },
  {
    title: 'Choose your path',
    text: 'Aspirants start with Academy and Community. Entrepreneurs prepare a paid pitch. Investors browse approved opportunities and save deal flow.',
    icon: BookOpen,
  },
  {
    title: 'Submit or review pitches',
    text: 'Entrepreneurs submit opportunities for admin review. Investors only see and connect around pitches that are ready for discovery.',
    icon: Rocket,
  },
  {
    title: 'Connect with intent',
    text: 'Use connection requests to start serious conversations. Pending and accepted states help everyone understand where the relationship stands.',
    icon: Handshake,
  },
  {
    title: 'Build a quality network',
    text: 'Use messages, focus areas, and recommendations to keep the platform useful instead of noisy.',
    icon: BadgeCheck,
  },
];

const roleGuides = {
  ASPIRING_BUSINESS_OWNER: {
    role: 'Aspiring Business Owner',
    title: 'Learn before pitching',
    text: 'Your account is for learning and preparation. Start with Academy programs, join community discussions, and use mentor sessions to shape your idea before moving into pitch creation.',
    to: '/dashboard/learning-center',
    action: 'Open Academy',
  },
  ENTREPRENEUR: {
    role: 'Entrepreneur',
    title: 'Prepare investor-ready opportunities',
    text: 'Your account is for building and pitching. Complete verification, upgrade when ready to pitch, select the right investment type, and keep your funding ask and equity clear.',
    to: '/dashboard/create-pitch',
    action: 'Create Pitch',
  },
  INVESTOR: {
    role: 'Investor',
    title: 'Browse clean deal flow',
    text: 'Your account is for reviewing opportunities, not Academy onboarding. Set focus areas and investment preferences, review approved pitches, save interesting deals, and connect with founders.',
    to: '/dashboard/opportunities',
    action: 'Browse Deals',
  },
};

const roleNotes = [
  {
    role: 'Aspirants',
    text: 'Use Academy, Community, and mentorship to build business foundations before pitching.',
  },
  {
    role: 'Entrepreneurs',
    text: 'Verify, upgrade, submit pitches, and respond to investor interest.',
  },
  {
    role: 'Investors',
    text: 'Set preferences, review approved deal flow, save pitches, and connect with founders.',
  },
];

export default function Knowledge() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentGuide =
    roleGuides[user.role as keyof typeof roleGuides] || roleGuides.ASPIRING_BUSINESS_OWNER;

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-20 text-slate-900 dark:text-white">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#1d1d20] md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Knowledge</p>
        <div className="mt-3 grid gap-6 md:grid-cols-[1.4fr_0.8fr] md:items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              How NaajihBiz Works
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-gray-400">
              A practical walkthrough for getting from profile setup to verified pitching, investor discovery, and meaningful connections.
            </p>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm text-slate-700 dark:text-white/80">
            <p className="font-bold text-primary">Recommended first move</p>
            <p className="mt-1">
              Complete profile and verification before trying to connect, message, or submit a pitch.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Walkthrough Steps</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              The platform works best when these steps happen in order.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1d1d20]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-black">
                  <step.icon size={22} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-black">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-400">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black">Your Path</h2>
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/10 p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
            {currentGuide.role}
          </p>
          <h3 className="mt-3 text-xl font-black">{currentGuide.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-white/80">
            {currentGuide.text}
          </p>
          <Link
            to={currentGuide.to}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-black text-black transition hover:brightness-110"
          >
            {currentGuide.action}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black">Other Roles at a Glance</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {roleNotes.map((guide) => (
            <article
              key={guide.role}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1d1d20]"
            >
              <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
                {guide.role}
              </p>
              <h3 className="mt-3 text-lg font-black">{guide.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-gray-400">
                {guide.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
