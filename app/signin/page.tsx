import { SignInButton } from "@/components/auth-controls";

export default function SignInPage() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 py-12">
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 text-center shadow-2xl shadow-amber-900/10 dark:border-cyan-300/20 dark:bg-white/10 dark:shadow-cyan-500/10">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-rose-600 dark:text-cyan-200">
          Owner access
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">
          Sign in with Google
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-slate-600 dark:text-slate-200">
          Google is the only sign-in method. Sign in to save your own calculator
          results and view captured leads tied to your account.
        </p>
        <div className="mt-7 flex justify-center">
          <SignInButton />
        </div>
      </section>
    </main>
  );
}
