import { Building2, ShieldCheck, Users } from "lucide-react";
import { AdminLayout } from "../components/admin-layout";

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
  return (
    <AdminLayout>
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
          </div>
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
    </AdminLayout>
  );
}
