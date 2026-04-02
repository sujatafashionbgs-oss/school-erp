import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, MessageSquare, Paperclip, Search, Send } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ChatMessage {
  from: "admin" | "parent" | "teacher";
  text: string;
  time: string;
}

interface ChatThread {
  id: string;
  participant: string;
  role: "parent" | "teacher";
  student?: string;
  class?: string;
  lastMessage: string;
  time: string;
  unread: number;
  resolved: boolean;
  messages: ChatMessage[];
}

const mockChats: ChatThread[] = [
  {
    id: "c1",
    participant: "Suresh Mehta",
    role: "parent",
    student: "Rohan Mehta",
    class: "VII-A",
    lastMessage: "Can you share Rohan's attendance report?",
    time: "10:32 AM",
    unread: 2,
    resolved: false,
    messages: [
      {
        from: "parent",
        text: "Good morning. Is Rohan's fee receipt available?",
        time: "9:00 AM",
      },
      { from: "admin", text: "Yes, we will email it today.", time: "9:05 AM" },
      {
        from: "parent",
        text: "Can you share Rohan's attendance report?",
        time: "10:32 AM",
      },
    ],
  },
  {
    id: "c2",
    participant: "Anita Patel",
    role: "parent",
    student: "Priya Patel",
    class: "VI-B",
    lastMessage: "Thank you for the update.",
    time: "Yesterday",
    unread: 0,
    resolved: true,
    messages: [
      {
        from: "teacher",
        text: "Priya has been doing great in Math this week.",
        time: "Yesterday 2PM",
      },
      {
        from: "parent",
        text: "Thank you for the update, very happy to hear that!",
        time: "Yesterday 3PM",
      },
    ],
  },
  {
    id: "c3",
    participant: "Amit Kumar (Class Teacher)",
    role: "teacher",
    class: "VIII-A",
    lastMessage: "I have submitted the marks for Unit Test 1.",
    time: "2 days ago",
    unread: 0,
    resolved: false,
    messages: [
      {
        from: "teacher",
        text: "I have submitted the Unit Test 1 marks for VIII-A.",
        time: "2 days ago",
      },
      {
        from: "admin",
        text: "Received. Will update the portal shortly.",
        time: "2 days ago",
      },
    ],
  },
  {
    id: "c4",
    participant: "Rakesh Gupta",
    role: "parent",
    student: "Kabir Gupta",
    class: "IX-A",
    lastMessage: "When is the next PTM scheduled?",
    time: "3 days ago",
    unread: 1,
    resolved: false,
    messages: [
      {
        from: "parent",
        text: "When is the next Parent-Teacher Meeting scheduled?",
        time: "3 days ago",
      },
    ],
  },
  {
    id: "c5",
    participant: "Neha Singh (Science Teacher)",
    role: "teacher",
    class: "X-B",
    lastMessage: "Lab equipment request has been processed.",
    time: "4 days ago",
    unread: 0,
    resolved: true,
    messages: [
      {
        from: "teacher",
        text: "Could you please arrange lab equipment for the upcoming practicals?",
        time: "4 days ago",
      },
      {
        from: "admin",
        text: "Lab equipment request has been processed. Available from Monday.",
        time: "4 days ago",
      },
      { from: "teacher", text: "Thank you!", time: "4 days ago" },
    ],
  },
];

const SENDER_LABELS: Record<string, string> = {
  admin: "You (Admin)",
  parent: "Parent",
  teacher: "Teacher",
};

export function LiveChatPage() {
  const [threads, setThreads] = useState<ChatThread[]>(mockChats);
  const [activeId, setActiveId] = useState<string>(mockChats[0].id);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [reply, setReply] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find((t) => t.id === activeId)!;

  const filteredThreads = threads.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.participant.toLowerCase().includes(q) ||
      (t.student?.toLowerCase().includes(q) ?? false) ||
      (t.class?.toLowerCase().includes(q) ?? false);
    const matchTab =
      tab === "all" ||
      (tab === "unread" && t.unread > 0) ||
      (tab === "teachers" && t.role === "teacher") ||
      (tab === "parents" && t.role === "parent");
    return matchSearch && matchTab;
  });

  function sendReply() {
    if (!reply.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    const now = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? {
              ...t,
              unread: 0,
              lastMessage: reply.trim(),
              time: now,
              messages: [
                ...t.messages,
                { from: "admin" as const, text: reply.trim(), time: now },
              ],
            }
          : t,
      ),
    );
    setReply("");
    toast.success("Message sent");
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  }

  function markResolved(id: string) {
    const thread = threads.find((t) => t.id === id);
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, resolved: !t.resolved } : t)),
    );
    toast.success(
      thread?.resolved ? "Conversation reopened" : "Marked as resolved",
    );
  }

  function selectThread(id: string) {
    setActiveId(id);
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)),
    );
  }

  const totalUnread = threads.reduce((acc, t) => acc + t.unread, 0);

  return (
    <div className="space-y-4" data-ocid="live_chat.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Chat</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Parent-Teacher-Admin communication hub
          </p>
        </div>
        {totalUnread > 0 && (
          <Badge className="bg-primary text-primary-foreground">
            {totalUnread} unread
          </Badge>
        )}
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        style={{ height: "calc(100vh - 220px)", minHeight: 480 }}
      >
        {/* LEFT PANEL — Thread List */}
        <div className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden">
          {/* Search + Tabs */}
          <div className="p-3 border-b border-border space-y-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                className="pl-8 h-8 text-sm"
                placeholder="Search chats..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="live_chat.search.input"
              />
            </div>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="w-full h-7">
                <TabsTrigger value="all" className="flex-1 text-xs">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1 text-xs">
                  Unread
                  {totalUnread > 0 && (
                    <span className="ml-1 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 inline-flex items-center justify-center font-bold">
                      {totalUnread}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="parents" className="flex-1 text-xs">
                  Parents
                </TabsTrigger>
                <TabsTrigger value="teachers" className="flex-1 text-xs">
                  Teachers
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Thread list */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filteredThreads.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectThread(t.id)}
                className={`w-full text-left p-3 hover:bg-secondary/60 transition-colors ${
                  t.id === activeId
                    ? "bg-primary/5 border-l-2 border-primary"
                    : ""
                }`}
                data-ocid={`live_chat.thread.${t.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {t.participant}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] shrink-0 py-0 px-1.5 ${
                          t.role === "teacher"
                            ? "border-blue-300 text-blue-600"
                            : "border-green-300 text-green-600"
                        }`}
                      >
                        {t.role === "teacher" ? "Teacher" : "Parent"}
                      </Badge>
                    </div>
                    {t.student && (
                      <p className="text-xs text-muted-foreground">
                        {t.student} · {t.class}
                      </p>
                    )}
                    {!t.student && t.class && (
                      <p className="text-xs text-muted-foreground">
                        Class {t.class}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {t.lastMessage}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {t.time}
                    </span>
                    {t.unread > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {t.unread}
                      </span>
                    )}
                    {t.resolved && (
                      <Badge className="text-[10px] py-0 px-1.5 bg-green-500/10 text-green-700 border border-green-200">
                        Resolved
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
            {filteredThreads.length === 0 && (
              <div className="p-8 text-center">
                <MessageSquare
                  size={32}
                  className="mx-auto text-muted-foreground/40 mb-2"
                />
                <p className="text-sm text-muted-foreground">No chats found</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL — Chat Window */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="p-4 border-b border-border flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground truncate">
                  {activeThread.participant}
                </p>
                {activeThread.resolved && (
                  <Badge className="text-xs bg-green-500/10 text-green-700 border-green-200">
                    Resolved
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {activeThread.role === "parent"
                  ? `Parent of ${activeThread.student} · Class ${activeThread.class}`
                  : `Teacher · Class ${activeThread.class}`}
              </p>
            </div>
            <Button
              size="sm"
              variant={activeThread.resolved ? "outline" : "secondary"}
              onClick={() => markResolved(activeId)}
              data-ocid="live_chat.resolve.button"
              className="shrink-0"
            >
              <Check size={14} className="mr-1" />
              {activeThread.resolved ? "Reopen" : "Mark Resolved"}
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeThread.messages.map((msg, i) => {
              const isAdmin = msg.from === "admin";
              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: messages have no stable id
                  key={i}
                  className={`flex flex-col max-w-[75%] ${
                    isAdmin ? "ml-auto items-end" : "items-start"
                  }`}
                >
                  <span className="text-xs text-muted-foreground mb-1">
                    {SENDER_LABELS[msg.from]} · {msg.time}
                  </span>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      isAdmin
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : msg.from === "teacher"
                          ? "bg-blue-500/10 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800 rounded-bl-sm"
                          : "bg-secondary text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          {!activeThread.resolved ? (
            <div className="p-3 border-t border-border flex gap-2 items-center">
              <Button
                size="sm"
                variant="ghost"
                className="shrink-0"
                onClick={() => toast.info("File attachment coming soon")}
                data-ocid="live_chat.attach.button"
              >
                <Paperclip size={16} />
              </Button>
              <Input
                className="flex-1"
                placeholder="Type a message..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendReply();
                  }
                }}
                data-ocid="live_chat.reply.input"
              />
              <Button
                size="sm"
                onClick={sendReply}
                className="shrink-0"
                data-ocid="live_chat.send.button"
              >
                <Send size={14} className="mr-1" /> Send
              </Button>
            </div>
          ) : (
            <div className="p-3 border-t border-border text-center text-sm text-muted-foreground">
              This conversation is resolved.{" "}
              <button
                type="button"
                className="text-primary underline underline-offset-2 hover:no-underline"
                onClick={() => markResolved(activeId)}
              >
                Click to reopen
              </button>
              .
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
