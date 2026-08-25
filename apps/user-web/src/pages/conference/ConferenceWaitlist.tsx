import { Clock3, MailCheck, ShieldCheck } from "lucide-react";

export default function ConferenceWaitlistPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-center text-primary">
          <ShieldCheck className="h-12 w-12" />
        </div>
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
          Conference Access
        </p>
        <h1 className="text-center text-3xl font-black tracking-tight sm:text-4xl">
          You’re on the waitlist
        </h1>
        <p className="mt-5 text-center text-base text-slate-300">
          Thanks for signing up early. We’ve reserved your place and will email you as soon as the conference access opens.
        </p>

        <div className="mt-8 space-y-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-3 text-sm text-slate-200">
            <Clock3 className="h-4 w-4 text-primary" />
            <span>We’ll keep your account ready so you can log back in without creating a new one.</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-200">
            <MailCheck className="h-4 w-4 text-primary" />
            <span>Your first email will confirm when it’s time to unlock the full dashboard.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
