import { useState, useRef, useEffect } from "react";
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
  Phone,
  Paperclip,
  Smile,
  Send,
  Plus as PlusIcon,
  CheckCheck,
  ChevronLeft,
} from "lucide-react";
import { UserLayout } from "../components/user-layout";

function Avatar({ name, online, size = "size-8" }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-pink-500", "bg-amber-500"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`relative shrink-0 ${size} rounded-full ${color} flex items-center justify-center font-bold text-white text-[10px] shadow-sm`}>
      {initials}
      {online && (
        <span className="absolute bottom-0 right-0 size-2 bg-emerald-400 border border-white rounded-full" />
      )}
    </div>
  );
}

const mockChannels = [
  {
    id: 1,
    name: "general",
    description: "Company-wide announcements and discussion",
    members: 45,
    private: false,
    messages: [
      { id: 1, from: "Alex", text: "Hey team, welcome to the general channel!", time: "09:00", isMe: false },
      { id: 2, from: "me", text: "Thanks Alex! Excited to be here.", time: "09:05", isMe: true },
      { id: 3, from: "Sarah", text: "Did everyone see the Q3 report?", time: "10:30", isMe: false },
    ]
  },
  {
    id: 2,
    name: "design",
    description: "Design critiques, UI/UX discussions",
    members: 12,
    private: true,
    messages: [
      { id: 1, from: "Jordan", text: "Just uploaded the new high-fidelity mocks.", time: "Yesterday", isMe: false },
      { id: 2, from: "me", text: "Looking great, especially the dark mode version.", time: "Yesterday", isMe: true },
    ]
  },
  {
    id: 3,
    name: "dev-backend",
    description: "Backend architecture, APIs, and services",
    members: 20,
    private: true,
    messages: [
      { id: 1, from: "Mike", text: "The new API endpoint is live on staging.", time: "2 days ago", isMe: false },
    ]
  },
  {
    id: 4,
    name: "marketing",
    description: "Campaign planning, content, and analytics",
    members: 8,
    private: false,
    messages: []
  },
  {
    id: 5,
    name: "marketing",
    description: "Campaign planning, content, and analytics",
    members: 8,
    private: false,
    messages: []
  },
  {
    id: 6,
    name: "marketing",
    description: "Campaign planning, content, and analytics",
    members: 8,
    private: false,
    messages: []
  },
  {
    id: 7,
    name: "marketing",
    description: "Campaign planning, content, and analytics",
    members: 8,
    private: false,
    messages: []
  },
  {
    id: 8,
    name: "marketing",
    description: "Campaign planning, content, and analytics",
    members: 8,
    private: false,
    messages: []
  },
];

export function ChannelsPage() {
  const [activeChannelId, setActiveChannelId] = useState(mockChannels[0].id);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrivate, setNewPrivate] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [conversations, setConversations] = useState(
    Object.fromEntries(mockChannels.map(c => [c.id, c.messages]))
  );

  const bottomRef = useRef(null);
  const activeChannel = mockChannels.find(c => c.id === activeChannelId);
  const currentMessages = conversations[activeChannelId] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const filtered = mockChannels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreate(e) {
    e.preventDefault();
    setShowCreate(false);
    setNewName("");
    setNewDesc("");
    setNewPrivate(false);
  }

  function sendMessage() {
    const text = messageInput.trim();
    if (!text) return;

    const newMsg = {
      id: Date.now(),
      from: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    setConversations(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
    }));
    setMessageInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <UserLayout>
      {/* Create Channel Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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

      {/* Main Container breakout */}
      <div className="fixed top-20 bottom-0 left-0 lg:left-[72px] right-0 bg-white z-[20] flex flex-row overflow-hidden">

        {/* ─── Left Sidebar - Channel List ─── */}
        <aside className={`shrink-0 border-r border-gray-200 flex-col bg-gray-50 ${isMobileChatOpen ? "hidden sm:flex" : "flex w-full sm:w-80"}`}>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-gray-900">Channels</h2>
              <button
                onClick={() => setShowCreate(true)}
                className="p-2 hover:bg-brand-primary/10 rounded-lg transition-colors text-brand-primary"
              >
                <PlusIcon className="size-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-primary/30 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-1 [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.15)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
            {filtered.map(channel => {
              const isActive = activeChannelId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => {
                    setActiveChannelId(channel.id);
                    setIsMobileChatOpen(true);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-white shadow-sm ring-1 ring-gray-200" : "hover:bg-white/50"
                    }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? "bg-brand-primary/10 text-brand-primary" : "bg-gray-200 text-gray-500"}`}>
                    {channel.private ? <Lock className="size-4" /> : <Hash className="size-4" />}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className={`text-sm font-bold truncate ${isActive ? "text-brand-primary" : "text-gray-700"}`}>
                      {channel.name}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">{channel.members} members</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ─── Main Chat Area ─── */}
        <div className={`flex-1 flex-col min-w-0 bg-white ${isMobileChatOpen ? "flex" : "hidden sm:flex"}`}>
          {/* Header */}
          <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-white shrink-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsMobileChatOpen(false)}
                className="sm:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg text-gray-600"
              >
                <ChevronLeft className="size-5" />
              </button>
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary shrink-0">
                {activeChannel.private ? <Lock className="size-6" /> : <Hash className="size-6" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  {activeChannel.name}
                  <ChevronRight className="size-3.5 text-gray-400" />
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    <Users2 className="size-3 text-brand-primary" /> {activeChannel.members}
                  </span>
                  <p className="text-[11px] text-gray-400 truncate max-w-[200px]">{activeChannel.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-brand-primary/10 rounded-lg transition-colors text-gray-700 hover:text-brand-primary">
                <Video className="size-5" />
              </button>
              <button className="p-2 hover:bg-brand-primary/10 rounded-lg transition-colors text-gray-700 hover:text-brand-primary font-bold text-xs px-3">
                Meet
              </button>
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                <Settings className="size-5" />
              </button>
            </div>
          </header>

          {/* Tabs */}
          <div className="flex items-center gap-6 px-6 py-2.5 border-b border-gray-200 bg-gray-50/50">
            {["Posts", "Files", "Notes", "+"].map((tab, idx) => (
              <button
                key={tab}
                className={`text-[13px] font-bold pb-2 border-b-2 transition-colors ${idx === 0
                  ? "text-brand-primary border-brand-primary"
                  : "text-gray-500 border-transparent hover:text-gray-900"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-[#f8fafc] [scrollbar-width:thin]">
            {currentMessages.map((msg, idx) => {
              const isMe = msg.isMe;
              return (
                <div key={msg.id} className={`flex items-start gap-4 ${isMe ? "flex-row-reverse" : ""}`}>
                  <Avatar name={msg.from === "me" ? "My Name" : msg.from} />
                  <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-xs font-bold text-gray-900">{msg.from === "me" ? "You" : msg.from}</span>
                      <span className="text-[10px] text-gray-500">{msg.time}</span>
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ring-1 ring-gray-200/50 ${isMe ? "bg-brand-primary text-white rounded-tr-none" : "bg-white text-gray-700 rounded-tl-none"
                      }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Message Input */}
          <div className="shrink-0 pl-6 pr-24 py-4 border-t border-gray-200 bg-white">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
              <textarea
                rows={1}
                value={messageInput}
                onChange={e => {
                  setMessageInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder={`Start a new conversation in #${activeChannel.name}`}
                className="w-full bg-transparent border-none resize-none text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none leading-relaxed px-3 pt-2 max-h-[120px] [scrollbar-width:thin]"
              />
              <div className="flex items-center justify-between border-t border-gray-100 mt-2 pt-2 px-2">
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg text-gray-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors">
                    <PlusIcon className="size-4.5" />
                  </button>
                  <button className="p-2 rounded-lg text-gray-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors">
                    <Paperclip className="size-4.5" />
                  </button>
                  <button className="p-2 rounded-lg text-gray-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors">
                    <Smile className="size-4.5" />
                  </button>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="size-9 flex items-center justify-center rounded-xl bg-brand-primary text-white shadow-md shadow-brand-primary/20 hover:bg-brand-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  <Send className="size-4.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
