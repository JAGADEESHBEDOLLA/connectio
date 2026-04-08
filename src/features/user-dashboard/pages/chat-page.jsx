import { useState, useRef, useEffect } from "react";
import {
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Search,
  Plus,
  Check,
  CheckCheck,
  Hash,
  Circle,
} from "lucide-react";
import { UserLayout } from "../components/user-layout";

const contacts = [
  { id: 1, name: "Sarah Jenkins", role: "Product Designer", online: true, unread: 3,
    messages: [
      { id: 1, from: "them", text: "Hey! Did you review the latest design files?", time: "9:15 AM", read: true },
      { id: 2, from: "me",   text: "Yes! Looking great. I'll share feedback by EOD.", time: "9:18 AM", read: true },
      { id: 3, from: "them", text: "Perfect, thanks! Let me know if you need anything.", time: "9:20 AM", read: true },
    ],
  },
  { id: 2, name: "Finance Team", role: "Group · 6 members", online: false, unread: 1,
    messages: [
      { id: 1, from: "them", text: "Q4 budget has been submitted for approval.", time: "Yesterday", read: false },
    ],
  },
  { id: 3, name: "Ravi Teja", role: "Engineering Lead", online: true, unread: 0,
    messages: [
      { id: 1, from: "me",   text: "Can you review the PR when you get a chance?", time: "Mon", read: true },
      { id: 2, from: "them", text: "On it! Will do by evening.", time: "Mon", read: true },
    ],
  },
  { id: 4, name: "Priya Sharma", role: "Marketing Manager", online: false, unread: 0,
    messages: [
      { id: 1, from: "them", text: "Sent over the campaign brief.", time: "Sun", read: true },
    ],
  },
];

function Avatar({ name, online, size = "size-10" }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-pink-500","bg-amber-500"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`relative shrink-0 ${size} rounded-full ${color} flex items-center justify-center font-bold text-white text-sm shadow-sm`}>
      {initials}
      {online && (
        <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-400 border-2 border-white rounded-full" />
      )}
    </div>
  );
}

export function ChatPage() {
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [messageInput, setMessageInput] = useState("");
  const [conversations, setConversations] = useState(
    Object.fromEntries(contacts.map(c => [c.id, c.messages]))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const bottomRef = useRef(null);

  const currentMessages = conversations[activeContact.id] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  function sendMessage() {
    const text = messageInput.trim();
    if (!text) return;

    const newMsg = {
      id: Date.now(),
      from: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };

    setConversations(prev => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
    }));
    setMessageInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UserLayout>
      <div className="flex h-[calc(100vh-148px)] gap-0 rounded-[28px] border border-brand-line bg-white shadow-[0_16px_50px_rgba(68,83,74,0.06)] overflow-hidden">

        {/* ─── Contact List ─── */}
        <aside className="w-80 shrink-0 border-r border-brand-line flex flex-col bg-brand-neutral/30">
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-brand-line space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-ink">Messages</h2>
              <button className="size-8 flex items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors">
                <Plus className="size-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-secondary" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-brand-line rounded-xl py-2.5 pl-9 pr-4 text-sm placeholder:text-brand-secondary/60 focus:ring-2 focus:ring-brand-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto py-2 [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.08)_transparent]">
            {filteredContacts.map(contact => {
              const msgs = conversations[contact.id] || [];
              const lastMsg = msgs[msgs.length - 1];
              const isActive = activeContact.id === contact.id;

              return (
                <button
                  key={contact.id}
                  onClick={() => setActiveContact(contact)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${
                    isActive
                      ? "bg-brand-primary/8 border-l-4 border-brand-primary"
                      : "hover:bg-white/70 border-l-4 border-transparent"
                  }`}
                >
                  <Avatar name={contact.name} online={contact.online} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-bold truncate ${isActive ? "text-brand-primary" : "text-brand-ink"}`}>
                        {contact.name}
                      </p>
                      <p className="text-[10px] text-brand-secondary shrink-0 ml-2">{lastMsg?.time}</p>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-brand-secondary truncate">{lastMsg?.text}</p>
                      {contact.unread > 0 && (
                        <span className="ml-2 shrink-0 size-5 flex items-center justify-center rounded-full bg-brand-primary text-white text-[10px] font-bold">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ─── Chat Window ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-brand-line bg-white shrink-0">
            <div className="flex items-center gap-4">
              <Avatar name={activeContact.name} online={activeContact.online} size="size-11" />
              <div>
                <h3 className="text-base font-bold text-brand-ink">{activeContact.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Circle className={`size-2 ${activeContact.online ? "fill-emerald-400 text-emerald-400" : "fill-brand-secondary/40 text-brand-secondary/40"}`} />
                  <p className="text-xs text-brand-secondary font-medium">
                    {activeContact.online ? "Active now" : activeContact.role}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="size-9 flex items-center justify-center rounded-xl bg-brand-neutral text-brand-secondary hover:bg-brand-primary/10 hover:text-brand-primary transition-colors">
                <Phone className="size-4" />
              </button>
              <button className="size-9 flex items-center justify-center rounded-xl bg-brand-neutral text-brand-secondary hover:bg-brand-primary/10 hover:text-brand-primary transition-colors">
                <Video className="size-4" />
              </button>
              <button className="size-9 flex items-center justify-center rounded-xl bg-brand-neutral text-brand-secondary hover:bg-brand-primary/10 hover:text-brand-primary transition-colors">
                <Search className="size-4" />
              </button>
              <button className="size-9 flex items-center justify-center rounded-xl bg-brand-neutral text-brand-secondary hover:bg-brand-primary/10 hover:text-brand-primary transition-colors">
                <MoreVertical className="size-4" />
              </button>
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-[linear-gradient(180deg,_#f9fafb_0%,_#ffffff_100%)] [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.08)_transparent]">
            {currentMessages.map((msg, idx) => {
              const isMe = msg.from === "me";
              const prevMsg = currentMessages[idx - 1];
              const showAvatar = !isMe && prevMsg?.from !== "them";
              
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Avatar placeholder for spacing */}
                  <div className="size-8 shrink-0">
                    {!isMe && showAvatar && <Avatar name={activeContact.name} online={false} size="size-8" />}
                  </div>

                  <div className={`max-w-[65%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        isMe
                          ? "bg-brand-primary text-white rounded-br-md"
                          : "bg-white border border-brand-line text-brand-ink rounded-bl-md"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1 mt-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                      <span className="text-[10px] text-brand-secondary">{msg.time}</span>
                      {isMe && (
                        <CheckCheck className="size-3 text-brand-primary" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Message Input */}
          <div className="shrink-0 px-6 py-4 border-t border-brand-line bg-white">
            <div className="flex items-end gap-3 bg-brand-neutral/50 border border-brand-line rounded-[20px] p-3 focus-within:border-brand-primary/40 focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all">
              <button className="shrink-0 p-2 rounded-xl text-brand-secondary hover:text-brand-primary hover:bg-white transition-colors">
                <Paperclip className="size-5" />
              </button>
              <textarea
                rows={1}
                value={messageInput}
                onChange={e => {
                  setMessageInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${activeContact.name}...`}
                className="flex-1 bg-transparent border-none resize-none text-sm text-brand-ink placeholder:text-brand-secondary/60 focus:outline-none leading-relaxed py-1 max-h-[120px] [scrollbar-width:thin]"
              />
              <button className="shrink-0 p-2 rounded-xl text-brand-secondary hover:text-brand-primary hover:bg-white transition-colors">
                <Smile className="size-5" />
              </button>
              <button
                onClick={sendMessage}
                disabled={!messageInput.trim()}
                className="shrink-0 size-10 flex items-center justify-center rounded-xl bg-brand-primary text-white shadow-md shadow-brand-primary/20 hover:bg-brand-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <Send className="size-4" />
              </button>
            </div>
            <p className="text-[10px] text-brand-secondary/50 text-center mt-2">
              Press <kbd className="bg-brand-neutral px-1 rounded text-[10px] font-bold">Enter</kbd> to send · <kbd className="bg-brand-neutral px-1 rounded text-[10px] font-bold">Shift+Enter</kbd> for new line
            </p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
