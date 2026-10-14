import { Clock3, MailCheck, ShieldCheck } from "lucide-react";

const steps = [
  "Your account has been saved",
  "We are preparing early access",
  "We will email you when the product is ready",
];

export default function EarlyAccessPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(160,255,0,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.07),transparent_30%)]" />
      <section className="relative w-full max-w-2xl border-y border-white/10 bg-white/5 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:rounded-2xl sm:border sm:p-10">
        <header className="mb-8 flex items-center gap-3 border-b border-white/10 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-black text-slate-950">
            N
          </div>
          <div>
            <div className="text-lg font-black">NaajihBiz</div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
              account early access
            </div>
          </div>
        </header>

        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <ShieldCheck className="h-7 w-7" />
          </div>
        </div>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Account created
        </p>
        <h1 className="mt-3 text-center text-3xl font-black sm:text-4xl">
          Your early access is on its way.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-6 text-slate-300">
          Your account is saved. We’re preparing NaajihBiz for launch and will
          email you when account access opens.
        </p>

        <ol className="mt-8 space-y-4 border-y border-white/10 py-6">
          {steps.map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-sm text-slate-200">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-black text-slate-950">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
            <Clock3 className="h-4 w-4 shrink-0 text-primary" />
            <span>We’re building toward launch.</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
            <MailCheck className="h-4 w-4 shrink-0 text-primary" />
            <span>We’ll email you when access opens.</span>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          Keep an eye on your inbox, including your spam folder, for launch updates.
        </p>
      </section>
    </main>
  );
}
