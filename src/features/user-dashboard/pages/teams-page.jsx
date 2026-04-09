import { useState } from "react";
import {
  Users2,
  Plus,
  Search,
  Hash,
  Crown,
  MoreVertical,
  Settings,
  UserPlus,
  LogIn,
  Globe,
  Lock,
  ChevronRight,
  Star,
  MessageSquare,
  Video,
} from "lucide-react";
import { UserLayout } from "../components/user-layout";

const mockTeams = [
  {
    id: 1,
    name: "Product & Design",
    description: "Collaborative space for product strategy, design reviews, and UX research.",
    members: 12,
    channels: 5,
    type: "public",
    role: "admin",
    color: "from-violet-500 to-purple-600",
    initials: "PD",
    channels_list: ["general", "design-reviews", "ux-research", "announcements", "resources"],
    pinned: true,
  },
  {
    id: 2,
    name: "Engineering",
    description: "Backend, frontend, DevOps, and code review discussions.",
    members: 20,
    channels: 8,
    type: "private",
    role: "member",
    color: "from-blue-500 to-cyan-500",
    initials: "EN",
    channels_list: ["general", "frontend", "backend", "devops", "code-review", "bugs", "releases", "infra"],
    pinned: true,
  },
  {
    id: 3,
    name: "Marketing",
    description: "Campaign planning, content creation, and brand strategy.",
    members: 8,
    channels: 4,
    type: "public",
    role: "member",
    color: "from-pink-500 to-rose-500",
    initials: "MK",
    channels_list: ["general", "campaigns", "content", "analytics"],
    pinned: false,
  },
  {
    id: 4,
    name: "Finance & Operations",
    description: "Budget tracking, approvals, and operational workflows.",
    members: 6,
    channels: 3,
    type: "private",
    role: "member",
    color: "from-amber-500 to-orange-500",
    initials: "FO",
    channels_list: ["general", "budgets", "approvals"],
    pinned: false,
  },
  {
    id: 5,
    name: "Customer Success",
    description: "Client onboarding, support escalations, and success metrics.",
    members: 10,
    channels: 6,
    type: "public",
    role: "member",
    color: "from-emerald-500 to-teal-500",
    initials: "CS",
    channels_list: ["general", "onboarding", "support", "feedback", "metrics", "renewals"],
    pinned: false,
  },
];

function TeamCard({ team, onClick, isActive }) {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-[24px] border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        isActive
          ? "border-brand-primary/40 bg-brand-primary/5 shadow-md shadow-brand-primary/10"
          : "border-brand-line bg-white hover:border-brand-primary/20"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`size-12 rounded-2xl bg-gradient-to-br ${team.color} flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0`}>
          {team.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-bold text-base truncate ${isActive ? "text-brand-primary" : "text-brand-ink"}`}>
              {team.name}
            </h3>
            {team.pinned && <Star className="size-3.5 text-amber-400 fill-amber-400 shrink-0" />}
            {team.type === "private"
              ? <Lock className="size-3 text-brand-secondary/50 shrink-0" />
              : <Globe className="size-3 text-brand-secondary/50 shrink-0" />}
            {team.role === "admin" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-wider">
                <Crown className="size-2.5" /> Admin
              </span>
            )}
          </div>
          <p className="text-sm text-brand-secondary line-clamp-1 mt-0.5">{team.description}</p>

          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-brand-secondary font-medium">
              <Users2 className="size-3.5" /> {team.members} members
            </span>
            <span className="flex items-center gap-1.5 text-xs text-brand-secondary font-medium">
              <Hash className="size-3.5" /> {team.channels} channels
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={e => e.stopPropagation()}
            className="p-1.5 rounded-xl hover:bg-brand-neutral text-brand-secondary hover:text-brand-primary transition-colors"
          >
            <MoreVertical className="size-4" />
          </button>
          <ChevronRight className={`size-4 transition-transform ${isActive ? "text-brand-primary rotate-90" : "text-brand-secondary"}`} />
        </div>
      </div>
    </div>
  );
}

export function TeamsPage() {
  const [activeTeam, setActiveTeam] = useState(mockTeams[0]);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [newTeamType, setNewTeamType] = useState("public");

  const filtered = mockTeams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreate(e) {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setShowCreateModal(false);
    setNewTeamName("");
    setNewTeamDesc("");
    setNewTeamType("public");
  }

  return (
    <UserLayout>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-[28px] shadow-2xl border border-brand-line p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-brand-ink">Create a Team</h3>
                <p className="text-xs text-brand-secondary mt-0.5">Set up a new collaboration space</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="size-8 flex items-center justify-center rounded-xl bg-brand-neutral text-brand-secondary hover:bg-brand-soft hover:text-brand-ink transition-colors">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary block mb-1.5">Team Name *</label>
                <input
                  autoFocus
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  placeholder="e.g. Sales Team"
                  className="w-full rounded-xl border border-brand-line bg-brand-neutral/40 px-4 py-2.5 text-sm text-brand-ink focus:ring-2 focus:ring-brand-primary/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary block mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={newTeamDesc}
                  onChange={e => setNewTeamDesc(e.target.value)}
                  placeholder="What's this team about?"
                  className="w-full rounded-xl border border-brand-line bg-brand-neutral/40 px-4 py-2.5 text-sm text-brand-ink focus:ring-2 focus:ring-brand-primary/20 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary block mb-1.5">Privacy</label>
                <div className="flex gap-3">
                  {[
                    { value: "public",  label: "Public",  Icon: Globe, sub: "Anyone can join" },
                    { value: "private", label: "Private", Icon: Lock,  sub: "Invite only" },
                  ].map(({ value, label, Icon, sub }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setNewTeamType(value)}
                      className={`flex-1 flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        newTeamType === value
                          ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                          : "border-brand-line text-brand-secondary hover:bg-brand-neutral"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <div>
                        <p className="text-sm font-bold">{label}</p>
                        <p className="text-[10px] opacity-70">{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 rounded-xl border border-brand-line bg-brand-neutral text-sm font-semibold text-brand-ink hover:bg-brand-soft transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-bold shadow-md shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all active:scale-95">
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="fixed top-20 bottom-0 left-0 lg:left-[72px] right-0 bg-[#f8fafc] z-[20] flex gap-6 p-6 overflow-hidden">

        {/* ── Left: Team List ── */}
        <div className="flex flex-col gap-4 w-full lg:w-[420px] shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-brand-ink">Teams</h2>
              <p className="text-xs text-brand-secondary mt-0.5">{mockTeams.length} teams you're part of</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 h-9 px-4 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-md shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all active:scale-95"
            >
              <Plus className="size-4" /> New Team
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-secondary" />
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-brand-line rounded-2xl py-2.5 pl-9 pr-4 text-sm placeholder:text-brand-secondary/60 focus:ring-2 focus:ring-brand-primary/20 focus:outline-none shadow-sm transition-all"
            />
          </div>

          {/* Team Cards */}
          <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.08)_transparent]">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Users2 className="size-10 text-brand-secondary/30 mb-3" />
                <p className="text-sm font-semibold text-brand-secondary">No teams found</p>
              </div>
            ) : (
              filtered.map(team => (
                <TeamCard
                  key={team.id}
                  team={team}
                  isActive={activeTeam?.id === team.id}
                  onClick={() => setActiveTeam(team)}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Right: Team Detail ── */}
        {activeTeam && (
          <div className="hidden lg:flex flex-1 flex-col bg-white rounded-[28px] border border-brand-line shadow-sm overflow-hidden">
            {/* Team Header */}
            <div className={`bg-gradient-to-r ${activeTeam.color} p-6 text-white`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-black text-xl shadow-inner">
                    {activeTeam.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black">{activeTeam.name}</h3>
                      {activeTeam.type === "private"
                        ? <Lock className="size-4 text-white/70" />
                        : <Globe className="size-4 text-white/70" />}
                    </div>
                    <p className="text-sm text-white/80 mt-0.5">{activeTeam.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-xs text-white/80 font-semibold">
                        <Users2 className="size-3.5" /> {activeTeam.members} members
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-white/80 font-semibold">
                        <Hash className="size-3.5" /> {activeTeam.channels} channels
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors backdrop-blur-sm">
                    <Video className="size-3.5" /> Meet
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors backdrop-blur-sm">
                    <UserPlus className="size-3.5" /> Invite
                  </button>
                  {activeTeam.role === "admin" && (
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors backdrop-blur-sm">
                      <Settings className="size-3.5" /> Manage
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Channels */}
            <div className="flex-1 overflow-y-auto p-6 [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.06)_transparent]">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-secondary/60">Channels</p>
                <button className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline">
                  <Plus className="size-3.5" /> Add Channel
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {activeTeam.channels_list.map((ch, i) => (
                  <button
                    key={ch}
                    className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-brand-line bg-brand-neutral/30 hover:bg-white hover:border-brand-primary/30 hover:shadow-sm transition-all text-left"
                  >
                    <Hash className="size-4 text-brand-secondary group-hover:text-brand-primary transition-colors shrink-0" />
                    <span className="text-sm font-semibold text-brand-ink group-hover:text-brand-primary transition-colors">{ch}</span>
                    <MessageSquare className="size-3.5 text-brand-secondary/40 ml-auto group-hover:text-brand-primary/60 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>

              {/* Members preview */}
              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-secondary/60 mb-4">Members ({activeTeam.members})</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: Math.min(activeTeam.members, 8) }).map((_, i) => {
                    const names = ["Sarah J","Ravi T","Priya S","Alex M","Tom B","Anita K","Dev P","Meena R"];
                    const colors = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-pink-500","bg-amber-500","bg-rose-500","bg-indigo-500","bg-teal-500"];
                    const name = names[i] || `User ${i+1}`;
                    return (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-neutral border border-brand-line text-xs font-semibold text-brand-ink">
                        <div className={`size-5 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-white text-[9px] font-bold`}>
                          {name.charAt(0)}
                        </div>
                        {name}
                      </div>
                    );
                  })}
                  {activeTeam.members > 8 && (
                    <div className="flex items-center px-3 py-1.5 rounded-full bg-brand-neutral border border-brand-line text-xs font-bold text-brand-secondary">
                      +{activeTeam.members - 8} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
