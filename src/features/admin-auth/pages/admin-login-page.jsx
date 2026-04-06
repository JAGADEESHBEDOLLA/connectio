import { Navigate } from "react-router-dom";
import { Building2, KeyRound, Shield, Sparkles } from "lucide-react";

import { AdminLoginForm } from "@/features/admin-auth/components/admin-login-form";
import { useAuthStore } from "@/store/auth-store";

const highlights = [
  {
    title: "Company administration",
    description: "Manage users, approvals, teams, and collaboration settings.",
    icon: Building2,
  },
  {
    title: "Security first",
    description: "Password login followed by MFA setup and OTP verification.",
    icon: Shield,
  },
  {
    title: "Backend aligned",
    description: "Built around your live `/auth/login`, `/auth/mfa/setup`, and `/auth/mfa/verify` endpoints.",
    icon: KeyRound,
  },
];

export function AdminLoginPage() {
  const session = useAuthStore((state) => state.session);

  if (session?.accessToken && session?.role !== "SUPER_ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(246,246,255,0.97)_34%,_rgba(233,239,235,0.92)_62%,_#f6f6ff_100%)]">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(0,105,71,0.18),_transparent_60%)]" />
      <div className="absolute right-[-9rem] top-20 size-80 rounded-full bg-[rgba(95,126,108,0.15)] blur-3xl" />
      <div className="absolute bottom-0 left-[-8rem] size-80 rounded-full bg-[rgba(145,68,64,0.12)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-12 px-6 py-10 lg:flex-row lg:items-center lg:px-10">
        <section className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-line/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-secondary backdrop-blur">
            <Sparkles className="size-3.5 text-brand-primary" />
            Company Admin Portal
          </div>

          <div className="space-y-5">
            <h2 className="max-w-xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-brand-ink md:text-6xl">
              Sign in, secure the device, and enter the company workspace.
            </h2>
            <p className="max-w-xl text-base leading-7 text-brand-secondary md:text-lg">
              This flow handles email and password first, then moves through MFA
              setup and OTP verification before the admin session becomes active.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-white/70 bg-white/[0.8] p-5 shadow-[0_18px_60px_rgba(68,83,74,0.08)] backdrop-blur"
                >
                  <Icon className="mb-4 size-5 text-brand-primary" />
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-secondary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-brand-ink">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="w-full max-w-lg">
          <AdminLoginForm />
        </section>
      </div>
    </main>
  );
}
