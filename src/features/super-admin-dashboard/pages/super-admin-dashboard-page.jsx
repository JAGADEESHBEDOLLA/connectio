import {
  Activity,
  ArrowUpRight,
  BadgeIndianRupee,
  BellRing,
  Building2,
  ChevronRight,
  CreditCard,
  FileBarChart2,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  MonitorCog,
  Plus,
  Settings2,
  Shield,
  UserRoundCog,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

const sidebarGroups = [
  {
    title: "Platform",
    items: [
      { label: "Overview", icon: LayoutGrid, active: true },
      { label: "Companies", icon: Building2 },
      { label: "Company Admins", icon: UserRoundCog },
      { label: "Approvals", icon: Users },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Analytics", icon: FileBarChart2 },
      { label: "Billing", icon: CreditCard },
      { label: "Monitoring", icon: MonitorCog },
      { label: "Security", icon: Shield },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Notifications", icon: BellRing },
      { label: "Settings", icon: Settings2 },
      { label: "Support", icon: LifeBuoy },
    ],
  },
];

const summaryCards = [
  {
    label: "Companies onboarded",
    value: "24",
    note: "7 awaiting activation",
    icon: Building2,
  },
  {
    label: "Company admins invited",
    value: "41",
    note: "5 pending invite acceptance",
    icon: UserRoundCog,
  },
  {
    label: "Active subscriptions",
    value: "18",
    note: "3 enterprise renewals this week",
    icon: BadgeIndianRupee,
  },
  {
    label: "System health",
    value: "98.6%",
    note: "No critical alerts in the last 24h",
    icon: Activity,
  },
];

const quickActions = [
  {
    title: "Add company",
    description: "Create a new tenant company and register its workspace domain.",
  },
  {
    title: "Add company admin",
    description: "Invite the primary company admin and start the activation flow.",
  },
  {
    title: "Review pending users",
    description: "Track approval queues and escalations across company workspaces.",
  },
  {
    title: "Open monitoring",
    description: "Check CPU, memory, alerts, and weekly health reports.",
  },
];

const queueItems = [
  {
    title: "Company activation pending",
    detail: "Acme Digital is waiting on domain verification and MFA completion.",
    tag: "Needs follow-up",
  },
  {
    title: "Admin invitation sent",
    detail: "Nova Partners received an invite but has not activated its admin account.",
    tag: "Awaiting acceptance",
  },
  {
    title: "Subscription watch",
    detail: "Two premium plans are nearing renewal and one enterprise plan needs review.",
    tag: "Billing review",
  },
];

export function SuperAdminDashboardPage() {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);

  const identity = useMemo(() => {
    const email = session?.email || "superadmin@levitica.com";
    const [namePart] = email.split("@");
    const displayName = namePart
      .split(/[.\-_]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    return {
      email,
      displayName: displayName || "Super Admin",
      role: session?.role || "SUPER_ADMIN",
    };
  }, [session]);

  function handleSignOut() {
    clearSession();
    navigate("/super-admin/auth", { replace: true });
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#edf4ff_0%,_#f7fbff_38%,_#f8fafc_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-slate-950 text-slate-200 lg:min-h-screen lg:w-[292px] lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col px-5 py-6">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-200">
                Conectio Control
              </p>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                Super admin workspace
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Platform-level view for company creation, admin invitations, and
                governance.
              </p>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">{identity.displayName}</p>
              <p className="mt-1 text-sm text-slate-400">{identity.email}</p>
              <span className="mt-3 inline-flex rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                {identity.role.replaceAll("_", " ")}
              </span>
            </div>

            <nav className="mt-8 flex-1 space-y-8">
              {sidebarGroups.map((group) => (
                <div key={group.title} className="space-y-3">
                  <p className="px-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                    {group.title}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.label}
                          type="button"
                          className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm transition ${
                            item.active
                              ? "bg-white text-slate-950 shadow-sm"
                              : "text-slate-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon className="size-4" />
                            {item.label}
                          </span>
                          <ChevronRight className="size-4 opacity-60" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <Button
              type="button"
              variant="outline"
              className="mt-6 h-11 rounded-2xl border-white/15 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </aside>

        <section className="flex-1 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">
                <Shield className="size-3.5" />
                Platform Overview
              </div>
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Manage companies, admin access, and platform operations.
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  This starter dashboard maps directly to the flows in the
                  product document so we can grow into real backend modules
                  without redoing the navigation shell.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                className="h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
              >
                <Plus className="size-4" />
                Add company
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-2xl border-slate-300 bg-white px-5 text-slate-900 hover:bg-slate-100"
              >
                <UserRoundCog className="size-4" />
                Add company admin
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.label}
                  className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">{card.label}</p>
                      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                        {card.value}
                      </p>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100">
                      <Icon className="size-5 text-slate-900" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{card.note}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Quick actions
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                    Core super admin workflows
                  </h3>
                </div>
                <ArrowUpRight className="size-5 text-slate-400" />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    type="button"
                    className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-slate-300 hover:bg-slate-100"
                  >
                    <p className="text-base font-semibold text-slate-950">{action.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {action.description}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-slate-100 shadow-[0_16px_50px_rgba(15,23,42,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">
                Workflow queue
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                Items that need super admin attention
              </h3>

              <div className="mt-6 space-y-4">
                {queueItems.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {item.detail}
                        </p>
                      </div>
                      <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-200">
                        {item.tag}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
