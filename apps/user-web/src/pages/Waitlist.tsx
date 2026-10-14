import { Clock3, MailCheck, ShieldCheck, Sparkles } from "lucide-react";

const steps = [
  "Your account has been saved",
  "We are preparing early access",
  "We will email you when the product is ready",
];

export default function WaitlistPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(160,255,0,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),transparent_30%)]" />

      <div className="relative w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8 md:p-10">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-black text-slate-950 shadow-[0_10px_30px_rgba(170,255,0,0.4)]">
              N
            </div>
            <div>
              <div className="text-lg font-black tracking-tight">NaajihBiz</div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
                early access
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Waitlist
          </div>
        </div>

        <div className="mb-7 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_30px_rgba(170,255,0,0.12)]">
            <ShieldCheck className="h-8 w-8" />
          </div>
        </div>

        <p className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
          You’re in
        </p>
        <h1 className="mt-3 text-center text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
          You’re on the waitlist
        </h1>

        <p className="mt-5 text-center text-base leading-7 text-slate-300">
          Thanks for joining us early. We’re getting NaajihBiz ready for launch
          and will email you as soon as early access opens.
        </p>

        <div className="mt-8 space-y-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
          {steps.map((step, index) => (
            <div key={step} className="flex items-start gap-3 text-sm text-slate-200">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-black text-slate-950">
                {index + 1}
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
            <Clock3 className="h-4 w-4 text-primary" />
            <span>We’re building toward launch.</span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
            <MailCheck className="h-4 w-4 text-primary" />
            <span>We’ll email you when access opens.</span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Keep an eye on your inbox, including your spam folder, for launch updates.
        </p>
      </div>
    </div>
  );
}