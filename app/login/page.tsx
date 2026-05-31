import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Login / Register" };

export default function LoginPage() {
  return (
    <section className="section-pad">
      <div className="container-wide grid min-h-[70vh] items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-saffron">Login / Register</p>
          <h1 className="text-4xl font-black sm:text-6xl">Join the trusted local network.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Users can book work, sell products, earn rewards, refer friends, and workers can grow from Bronze to Elite.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Daily streak", "Referral points", "Profile boost"].map((item) => (
              <div key={item} className="glass rounded-3xl p-4 font-black">{item}</div>
            ))}
          </div>
        </div>
        <AuthForm />
      </div>
    </section>
  );
}
