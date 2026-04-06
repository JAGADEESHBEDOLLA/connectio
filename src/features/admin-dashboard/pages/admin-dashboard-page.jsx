import { Building2, ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

const actions = [
  {
    title: "Approve pending users",
    description: "Review registrations and allow users into the company workspace.",
    icon: Users,
  },
  {
    title: "Manage company teams",
    description: "Maintain teams, channels, and company collaboration structure.",
    icon: Building2,
  },
  {
    title: "Security and MFA",
    description: "Track protected access, device trust, and role management.",
    icon: ShieldCheck,
  },
];

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);

  function handleSignOut() {
    clearSession();
    navigate("/admin/auth", { replace: true });
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f6f6ff_0%,_#eef3ef_38%,_#f6f6ff_100%)] px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[32px] border border-brand-line bg-white p-7 shadow-[0_24px_80px_rgba(68,83,74,0.08)] sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-brand-secondary">
                Admin Workspace
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-brand-ink">
                Company admin dashboard
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-brand-secondary">
                MFA is complete and the session is active. This is a starter
                landing page for the admin side while we build the full company
                management experience.
              </p>
              <p className="text-sm font-medium text-brand-ink">{session?.email}</p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-2xl border-brand-line bg-white px-5 text-brand-ink hover:bg-brand-soft"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {actions.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-brand-line bg-brand-neutral p-5"
                >
                  <Icon className="mb-4 size-5 text-brand-primary" />
                  <h2 className="text-base font-semibold text-brand-ink">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-brand-secondary">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
