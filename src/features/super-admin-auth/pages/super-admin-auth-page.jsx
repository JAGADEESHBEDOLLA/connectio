import { Navigate } from "react-router-dom";
import { ChevronRight, Globe, ShieldEllipsis, TowerControl } from "lucide-react";

import { SuperAdminLoginForm } from "@/features/super-admin-auth/components/super-admin-login-form";
import { useAuthStore } from "@/store/auth-store";

const trustPoints = [
  "Global platform access across every tenant workspace",
  "Company provisioning, approval oversight, and role governance",
  "Built for backend-first integration with auth and audit services",
];

export function SuperAdminAuthPage() {
  const session = useAuthStore((state) => state.session);

  if (session?.accessToken) {
    return <Navigate to="/super-admin/dashboard" replace />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(246,246,255,0.97)_34%,_rgba(233,239,235,0.92)_62%,_#f6f6ff_100%)]">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(0,105,71,0.18),_transparent_60%)]" />
      <div className="absolute left-[-8rem] top-16 size-72 rounded-full bg-[rgba(95,126,108,0.16)] blur-3xl" />
      <div className="absolute bottom-0 right-[-6rem] size-80 rounded-full bg-[rgba(145,68,64,0.12)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-12 px-6 py-10 lg:flex-row lg:items-center lg:px-10">
        <section className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-line/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-secondary backdrop-blur">
            <Globe className="size-3.5" />
            Enterprise Collaboration Platform
          </div>

          <div className="space-y-5">
            <h2 className="max-w-xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-brand-ink md:text-6xl">
              Control the platform layer before teams ever log in.
            </h2>
            <p className="max-w-xl text-base leading-7 text-brand-secondary md:text-lg">
              This is the command point for super admins managing tenant
              onboarding, organization approvals, and the trust boundary between
              frontend and backend systems.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/70 bg-white/[0.78] p-5 shadow-[0_18px_60px_rgba(68,83,74,0.08)] backdrop-blur">
              <TowerControl className="mb-4 size-5 text-brand-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-secondary">
                Provisioning
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-ink">
                Create companies, assign company admins, and activate tenant
                journeys.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/70 bg-white/[0.78] p-5 shadow-[0_18px_60px_rgba(68,83,74,0.08)] backdrop-blur">
              <ShieldEllipsis className="mb-4 size-5 text-brand-tertiary" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-secondary">
                Security
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-ink">
                Keep authentication flows ready for MFA, audit logs, and secure
                backend validation.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/70 bg-white/[0.78] p-5 shadow-[0_18px_60px_rgba(68,83,74,0.08)] backdrop-blur">
              <ChevronRight className="mb-4 size-5 text-brand-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-secondary">
                Integration
              </h3>
              <p className="mt-2 text-sm leading-6 text-brand-ink">
                Structured so we can connect real API responses without
                redesigning the screen later.
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-[28px] border border-brand-line/70 bg-brand-primary p-6 text-white shadow-[0_24px_80px_rgba(0,105,71,0.22)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Why this structure
            </p>
            {trustPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 text-sm leading-6">
                <span className="mt-2 size-1.5 rounded-full bg-white/80" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full max-w-lg">
          <SuperAdminLoginForm />
        </section>
      </div>
    </main>
  );
}
