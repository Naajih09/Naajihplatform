import { Link } from "react-router-dom";

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111113] px-6 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1d1d20] p-8 text-center shadow-2xl">
        <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary text-xl font-black text-black">
          N
        </div>
        <h1 className="mt-5 text-2xl font-black tracking-tight">
          NaajihBiz Admin
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Manage users, verification, waitlists, academy programs, and platform
          operations.
        </p>
        <Link
          to="/admin/dashboard"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-black transition hover:brightness-110"
        >
          Open Dashboard
        </Link>
      </section>
    </main>
  );
}

export default App;
