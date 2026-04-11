import { useDeferredValue, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Search,
  CheckCheck,
  SquarePen,
  Plus as PlusIcon,
  ChevronLeft,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/client";
import { DM_SEND_MESSAGE, DM_USERS_SEARCH } from "@/config/api";
import { useAuthStore } from "@/store/auth-store";
import { UserLayout } from "../components/user-layout";

const initialContacts = [
  {
    id: 1,
    name: "madhav",
    role: "You: Microsoft Teams-Inspired User Interface ...",
    online: true,
    unread: 0,
    messages: [
      { id: 1, from: "them", text: "You:  User Interface ...", time: "17:46", read: true },
      { id: 2, from: "me", text: "About 1.jsx", time: "27 March 18:31", read: true, isFile: true },
      { id: 3, from: "me", text: "Contact.jsx", time: "27 March 18:31", read: true, isFile: true },
      { id: 4, from: "me", text: "hi", time: "30 March 15:14", read: true },
      { id: 5, from: "me", text: "doubt ", time: "30 March 18:16", read: true },
      { id: 6, from: "me", text: "yes", time: "01 April 17:30", read: true },
      { id: 7, from: "them", text: " 1 min", time: "30 March 18:16", read: true },
    ],
  },
  {
    id: 2,
    name: "john and doe",
    role: "You: ok bro",
    online: true,
    unread: 0,
    messages: [
      { id: 1, from: "me", text: "You: ok bro", time: "16:55", read: true },
    ],
  },
  {
    id: 3,
    name: "madhav",
    role: "git status --porcelain git status > status.txt Get...",
    online: true,
    unread: 0,
    messages: [
      { id: 1, from: "them", text: "git status --porcelain git status > status.txt Get...", time: "16:44", read: true },
    ],
  },
  {
    id: 4,
    name: "Connectio- Levitica Teams frontend",
    role: "Sai: https://connectio-fawn.vercel.app/",
    online: false,
    unread: 0,
    messages: [
      { id: 1, from: "them", text: "Sai: https://connectio-fawn.vercel.app/", time: "15:39", read: true },
    ],
  },
  {
    id: 5,
    name: "HMS React Web Application - Team",
    role: "Abhinaya: Thank you i received",
    online: false,
    unread: 0,
    messages: [
      { id: 1, from: "them", text: "Abhinaya: Thank you i received", time: "12:39", read: true },
    ],
  },
];

function Avatar({ name, online, size = "size-10" }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-pink-500", "bg-amber-500"];
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

function normalizeSearchResults(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.users)) {
    return data.users;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

export function ChatPage() {
  const session = useAuthStore((state) => state.session);
  const [contacts, setContacts] = useState(initialContacts);
  const [activeContact, setActiveContact] = useState(initialContacts[0]);
  const [messageInput, setMessageInput] = useState("");
  const [conversations, setConversations] = useState(
    Object.fromEntries(initialContacts.map((contact) => [contact.id, contact.messages]))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [isNewChatMode, setIsNewChatMode] = useState(false);
  const bottomRef = useRef(null);
  const searchInputRef = useRef(null);
  const deferredNewChatQuery = useDeferredValue(searchQuery.trim());

  const currentMessages = conversations[activeContact.id] || [];

  const sendMessageMutation = useMutation({
    mutationFn: async ({ targetUserId, text }) => {
      const response = await apiClient.post(
        DM_SEND_MESSAGE(targetUserId),
        {
          content: text,
          content_type: "text",
        },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      const sentAt = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const newMsg = {
        id: Date.now(),
        from: "me",
        text: variables.text,
        time: sentAt,
        read: false,
      };

      setConversations((prev) => ({
        ...prev,
        [variables.targetUserId]: [...(prev[variables.targetUserId] || []), newMsg],
      }));

      setContacts((prev) => {
        const nextContacts = prev.map((contact) =>
          contact.id === variables.targetUserId
            ? {
                ...contact,
                role: `You: ${variables.text}`,
                messages: [...(contact.messages || []), newMsg],
              }
            : contact
        );

        const updatedContact = nextContacts.find((contact) => contact.id === variables.targetUserId);
        const otherContacts = nextContacts.filter((contact) => contact.id !== variables.targetUserId);

        return updatedContact ? [updatedContact, ...otherContacts] : prev;
      });

      setActiveContact((current) =>
        current.id === variables.targetUserId
          ? {
              ...current,
              role: `You: ${variables.text}`,
              messages: [...(current.messages || []), newMsg],
            }
          : current
      );

      setMessageInput("");
    },
    onError: () => {
      toast.error("Unable to send the message right now.");
    },
  });

  const searchUsersQuery = useQuery({
    queryKey: ["dm-users-search", deferredNewChatQuery],
    queryFn: async () => {
      const response = await apiClient.get(DM_USERS_SEARCH, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        params: {
          query: deferredNewChatQuery,
        },
      });

      return normalizeSearchResults(response.data);
    },
    enabled: Boolean(session?.accessToken) && deferredNewChatQuery.length > 1 && isNewChatMode,
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (isNewChatMode) {
      searchInputRef.current?.focus();
    }
  }, [isNewChatMode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  function sendMessage() {
    const text = messageInput.trim();
    if (!text || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate({
      targetUserId: activeContact.id,
      text,
    });
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

  function openConversation(contact) {
    setActiveContact(contact);
    setIsMobileChatOpen(true);
    setIsNewChatMode(false);
    setSearchQuery("");
  }

  function handleSelectSearchUser(user) {
    const normalizedContact = {
      id: user.id || user.user_id || user.email,
      name: user.full_name || user.name || user.display_name || user.email || "Unknown user",
      role: user.email || user.user_role || "New conversation",
      online: Boolean(user.online || user.is_online || user.is_active),
      unread: 0,
      messages: conversations[user.id || user.user_id || user.email] || [],
    };

    setContacts((current) => {
      const exists = current.find((item) => item.id === normalizedContact.id);
      if (exists) {
        return current;
      }

      return [normalizedContact, ...current];
    });

    setConversations((current) => ({
      ...current,
      [normalizedContact.id]: current[normalizedContact.id] || [],
    }));

    openConversation(normalizedContact);
  }

  function handleNewChatClick() {
    setIsNewChatMode(true);
    setSearchQuery("");
  }

  const sidebarResults = isNewChatMode ? searchUsersQuery.data || [] : filteredContacts;

  return (
    <UserLayout>
      <div className="fixed top-20 bottom-0 left-0 lg:left-[72px] right-0 bg-white z-[20] flex flex-col overflow-hidden">
        <div className="flex w-full h-full gap-0 overflow-hidden bg-white">
          <aside className={`shrink-0 border-r border-gray-200 flex-col bg-gray-50 ${isMobileChatOpen ? "hidden sm:flex" : "flex w-full sm:w-80"}`}>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-gray-900">Chat</h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    aria-label="New chat"
                    title="New chat"
                    onClick={handleNewChatClick}
                  >
                    <SquarePen className="size-5 text-gray-700" />
                  </button>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={isNewChatMode ? "Search by user name or email" : "Search..."}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-full py-2.5 pl-10 pr-4 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.15)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
              <div className="px-6 py-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                    {isNewChatMode ? "Search results" : "Recent"}
                  </h3>
                  {isNewChatMode ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewChatMode(false);
                        setSearchQuery("");
                      }}
                      className="text-xs font-semibold text-brand-primary hover:underline"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
                <div className="space-y-2">
                  {isNewChatMode && deferredNewChatQuery.length <= 1 ? (
                    <div className="rounded-lg bg-white px-4 py-4 text-sm text-gray-500">
                      Type at least 2 characters to search for a person.
                    </div>
                  ) : null}

                  {isNewChatMode && deferredNewChatQuery.length > 1 && searchUsersQuery.isLoading ? (
                    <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-4 text-sm text-gray-500">
                      <LoaderCircle className="size-4 animate-spin" />
                      Searching users
                    </div>
                  ) : null}

                  {isNewChatMode && deferredNewChatQuery.length > 1 && searchUsersQuery.isError ? (
                    <div className="rounded-lg bg-white px-4 py-4 text-sm text-rose-600">
                      Unable to search users right now.
                    </div>
                  ) : null}

                  {sidebarResults.map(contact => {
                    const contactId = contact.id || contact.user_id || contact.email;
                    const contactName = isNewChatMode
                      ? contact.full_name || contact.name || contact.display_name || "Unknown user"
                      : contact.name;
                    const contactSubtitle = isNewChatMode
                      ? contact.email || "No email available"
                      : contact.role;
                    const contactOnline = isNewChatMode
                      ? Boolean(contact.online || contact.is_online || contact.is_active)
                      : contact.online;
                    const isActive = activeContact.id === contactId;
                    const contactMessages = conversations[contactId] || contact.messages || [];

                    return (
                      <button
                        key={contactId}
                        onClick={() =>
                          isNewChatMode ? handleSelectSearchUser(contact) : openConversation(contact)
                        }
                        className={`w-full flex items-start gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive
                          ? "bg-white shadow-sm"
                          : "hover:bg-white/50"
                          }`}
                      >
                        <Avatar name={contactName} online={contactOnline} size="size-10" />
                        <div className="flex-1 min-w-0 text-left">
                          <p className={`text-sm font-bold truncate ${isActive ? "text-gray-900" : "text-gray-700"}`}>
                            {contactName}
                          </p>
                          <p className="text-xs text-gray-600 truncate">{contactSubtitle}</p>
                        </div>
                        {!isNewChatMode ? (
                          <p className="text-xs text-gray-500 shrink-0">
                            {contactMessages[contactMessages.length - 1]?.time}
                          </p>
                        ) : null}
                      </button>
                    );
                  })}

                  {isNewChatMode &&
                  deferredNewChatQuery.length > 1 &&
                  !searchUsersQuery.isLoading &&
                  !searchUsersQuery.isError &&
                  !sidebarResults.length ? (
                    <div className="rounded-lg bg-white px-4 py-4 text-sm text-gray-500">
                      No users found for this search.
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="p-6">
                <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <PlusIcon className="size-4" />
                  Invite to Connectio
                </button>
              </div>
            </div>
          </aside>

          <div className={`flex-1 flex-col min-w-0 bg-white ${isMobileChatOpen ? "flex" : "hidden sm:flex"}`}>
            <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-white shrink-0">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setIsMobileChatOpen(false)}
                  className="sm:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <Avatar name={activeContact.name} online={activeContact.online} size="size-11" />
                <div>
                  <h3 className="text-base font-bold text-gray-900">{activeContact.name}</h3>
                  <p className="text-xs text-gray-600">{activeContact.messages.length} messages</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-brand-primary/10 rounded-lg transition-colors text-gray-700 hover:text-brand-primary">
                  <Video className="size-5" />
                </button>
                <button className="p-2 hover:bg-brand-primary/10 rounded-lg transition-colors text-gray-700 hover:text-brand-primary">
                  <Phone className="size-5" />
                </button>
                <button className="p-2 hover:bg-brand-primary/10 rounded-lg transition-colors text-gray-700 hover:text-brand-primary">
                  <Search className="size-5" />
                </button>
                <button className="p-2 hover:bg-brand-primary/10 rounded-lg transition-colors text-gray-700 hover:text-brand-primary">
                  <MoreVertical className="size-5" />
                </button>
              </div>
            </header>

            <div className="flex items-center gap-6 px-6 py-3 border-b border-gray-200 bg-gray-50">
              {["Chat", "Files", "Photos"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                    ? "text-brand-primary border-brand-primary"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-white [scrollbar-width:thin]">
              {currentMessages.map((msg, idx) => {
                const isMe = msg.from === "me";
                const prevMsg = currentMessages[idx - 1];
                const showAvatar = !isMe && prevMsg?.from !== "them";

                return (
                  <div key={msg.id} className={`flex items-end gap-3 ${isMe ? "flex-row-reverse justify-end" : "flex-row justify-start"}`}>
                    <div className="w-8 h-8 shrink-0">
                      {!isMe && showAvatar && <Avatar name={activeContact.name} online={false} size="size-8" />}
                    </div>

                    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      {msg.isFile ? (
                        <div className={`px-4 py-3 rounded-xl text-sm font-medium shadow-sm border min-w-[200px] ${isMe
                          ? "bg-brand-primary text-white border-brand-primary"
                          : "bg-white border-gray-300 text-gray-900"
                          }`}>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                              <Paperclip className="size-5" />
                            </div>
                            <span>{msg.text}</span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm max-w-md ${isMe
                            ? "bg-brand-primary text-white rounded-br-none"
                            : "bg-gray-100 text-gray-900 rounded-bl-none"
                            }`}
                        >
                          {msg.text}
                        </div>
                      )}
                      {isMe && msg.time && (
                        <div className="flex items-center gap-1 mt-1 flex-row-reverse">
                          <span className="text-[11px] text-gray-500">{msg.time}</span>
                          <CheckCheck className="size-3.5 text-brand-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="shrink-0 pl-6 pr-24 py-4 border-t border-gray-200 bg-white">
              <div className="flex items-end gap-3 bg-gray-100 border border-gray-300 rounded-full px-4 py-3 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                <button className="shrink-0 p-1.5 rounded-lg text-gray-600 hover:text-brand-primary hover:bg-white transition-colors">
                  <Paperclip className="size-5" />
                </button>
                <textarea
                  rows={1}
                  value={messageInput}
                  onChange={e => {
                    setMessageInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message"
                  className="flex-1 bg-transparent border-none resize-none text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none leading-relaxed py-1 max-h-[100px] [scrollbar-width:thin]"
                />
                <button className="shrink-0 p-1.5 rounded-lg text-gray-600 hover:text-brand-primary hover:bg-white transition-colors">
                  <Smile className="size-5" />
                </button>
                <button className="shrink-0 p-1.5 rounded-lg text-gray-600 hover:text-brand-primary hover:bg-white transition-colors">
                  <PlusIcon className="size-5" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim() || sendMessageMutation.isPending}
                  className="shrink-0 size-9 flex items-center justify-center rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  {sendMessageMutation.isPending ? (
                    <LoaderCircle className="size-5 animate-spin" />
                  ) : (
                    <Send className="size-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
