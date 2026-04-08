import { useState } from "react";
import {
  Hash,
  Users2,
  Plus,
  Search,
  MoreVertical,
  Settings,
  UserPlus,
  Video,
  ChevronRight,
  X, Lock,
} from "lucide-react";
import { UserLayout } from "../components/user-layout";

const mockChannels = [
  {
    id: 1,
    name: "general",
    description: "Company-wide announcements and discussion",
    members: 45,
    private: false,
  },
  {
    id: 2,
    name: "design",
    description: "Design critiques, UI/UX discussions",
    members: 12,
    private: true,
  },
  {
    id: 3,
    name: "dev-backend",
    description: "Backend architecture, APIs, and services",
    members: 20,
    private: true,
  },
  {
    id: 4,
    name: "marketing",
    description: "Campaign planning, content, and analytics",
    members: 8,
    private: false,
  },
];

export function ChannelsPage() {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrivate, setNewPrivate] = useState(false);

  const filtered = mockChannels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreate(e) {
    e.preventDefault();
    // In a real app, you'd persist the new channel. Here we just close the modal.
    setShowCreate(false);
    setNewName("");
    setNewDesc("");
    setNewPrivate(false);
  }

  return (
    <UserLayout>
      {/* Create Channel Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-[28px] shadow-2xl border border-brand-line p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-brand-ink">Create a Channel</h3>
              <button onClick={() => setShowCreate(false)} className="size-8 flex items-center justify-center rounded-xl bg-brand-neutral text-brand-secondary hover:bg-brand-soft hover:text-brand-ink transition-colors">
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-secondary mb-1.5">Channel Name *</label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. product-updates"
                  className="w-full rounded-xl border border-brand-line bg-brand-neutral/40 px-4 py-2.5 text-sm text-brand-ink focus:ring-2 focus:ring-brand-primary/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-secondary mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief description of the channel"
                  className="w-full rounded-xl border border-brand-line bg-brand-neutral/40 px-4 py-2.5 text-sm text-brand-ink focus:ring-2 focus:ring-brand-primary/20 focus:outline-none resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNewPrivate(!newPrivate)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border ${newPrivate ? "bg-brand-primary/10 border-brand-primary text-brand-primary" : "border-brand-line text-brand-secondary hover:bg-brand-neutral"}`}
                >
                  {newPrivate ? "Private" : "Public"}
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl border border-brand-line bg-brand-neutral text-sm font-semibold text-brand-ink hover:bg-brand-soft transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-bold shadow-md hover:bg-brand-primary/90 transition-all active:scale-95">
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5 h-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-ink">Channels</h2>
            <p className="text-sm text-brand-secondary">{mockChannels.length} channels available</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 h-9 px-4 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-md hover:bg-brand-primary/90 transition-all"
          >
            <Plus className="size-4" /> New Channel
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-secondary" />
          <input
            type="text"
            placeholder="Search channels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-brand-line rounded-2xl py-2.5 pl-9 pr-4 text-sm placeholder:text-brand-secondary/60 focus:ring-2 focus:ring-brand-primary/20 focus:outline-none"
          />
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.08)_transparent]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Hash className="size-12 text-brand-secondary/30 mb-3" />
              <p className="text-sm font-semibold text-brand-secondary">No channels match your search</p>
            </div>
          ) : (
            filtered.map((ch) => (
              <div
                key={ch.id}
                className="group flex items-center justify-between rounded-[24px] border border-brand-line bg-white p-4 hover:bg-brand-soft/30 hover:border-brand-primary/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Hash className="size-5 text-brand-secondary" />
                  <div>
                    <h3 className="text-sm font-bold text-brand-ink group-hover:text-brand-primary transition-colors">
                      {ch.name}
                    </h3>
                    <p className="text-xs text-brand-secondary">{ch.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex items-center gap-1 text-xs text-brand-secondary">
                    <Users2 className="size-3.5" /> {ch.members}
                  </span>
                  {ch.private && <Lock className="size-4 text-brand-secondary" />}
                  <button className="p-1.5 rounded-lg hover:bg-brand-neutral text-brand-secondary hover:text-brand-primary transition-colors">
                    <MoreVertical className="size-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </UserLayout>
  );
}
