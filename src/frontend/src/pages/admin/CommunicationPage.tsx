import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CLASSES } from "@/data/classConfig";
import {
  Copy,
  Edit,
  ExternalLink,
  MessageCircle,
  Plus,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Message {
  id: string;
  date: string;
  subject: string;
  recipients: string;
  recipientCount: number;
  status: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
}

const initialMessages: Message[] = [
  {
    id: "msg1",
    date: "2024-11-20",
    subject: "Fee Reminder - Term 3",
    recipients: "All Parents",
    recipientCount: 245,
    status: "Delivered",
  },
  {
    id: "msg2",
    date: "2024-11-15",
    subject: "Exam Schedule December",
    recipients: "All Parents",
    recipientCount: 245,
    status: "Delivered",
  },
  {
    id: "msg3",
    date: "2024-11-10",
    subject: "Low Attendance Alert - Class 9",
    recipients: "Class 9 Parents",
    recipientCount: 52,
    status: "Delivered",
  },
  {
    id: "msg4",
    date: "2024-11-05",
    subject: "Sports Day Reminder",
    recipients: "All",
    recipientCount: 312,
    status: "Delivered",
  },
];

const initialTemplates: Template[] = [
  {
    id: "t1",
    name: "Fee Reminder",
    category: "Fee Reminder",
    subject: "Fee Payment Reminder",
    body: "Dear {name},\n\nThis is a reminder that the {term} fee payment is due on {date}. The outstanding amount is \u20b9{amount}. Kindly clear the dues at the earliest to avoid late fees.\n\nRegards,\nSchool Administration",
  },
  {
    id: "t2",
    name: "Attendance Alert",
    category: "General",
    subject: "Low Attendance Alert",
    body: "Dear {name},\n\nWe wish to inform you that your child's attendance has fallen below 75%. Please ensure regular attendance to avoid academic issues.\n\nRegards,\nSchool Administration",
  },
  {
    id: "t3",
    name: "Exam Notice",
    category: "Exam Notice",
    subject: "Upcoming Examination Notice",
    body: "Dear {name},\n\nThe upcoming examinations are scheduled starting {date}. Please ensure your child is well-prepared.\n\nRegards,\nSchool Administration",
  },
  {
    id: "t4",
    name: "Event Invitation",
    category: "Event",
    subject: "School Event Invitation",
    body: "Dear {name},\n\nYou are cordially invited to attend {event} on {date}. Please confirm your attendance.\n\nRegards,\nSchool Administration",
  },
];

const TEMPLATE_CATEGORIES = ["Fee Reminder", "Exam Notice", "Event", "General"];

function extractPlaceholders(text: string): string[] {
  const matches = [...text.matchAll(/\{(\w+)\}/g)];
  return Array.from(new Set(matches.map((m) => m[1])));
}

function applySubstitutions(
  text: string,
  subs: Record<string, string>,
): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => subs[key] ?? `{${key}}`);
}

const blankTemplate: Omit<Template, "id"> = {
  name: "",
  category: "General",
  subject: "",
  body: "",
};

const whatsappGroups = [
  ...CLASSES.flatMap((cls) =>
    ["A", "B", "C"].map((sec) => ({
      id: `${cls}-${sec}`,
      name: `Class ${cls}-${sec} Parents`,
      cls,
      section: sec,
      memberCount:
        25 +
        Math.floor(
          Math.abs(
            Math.sin(
              (cls + sec).split("").reduce((a, c) => a + c.charCodeAt(0), 0),
            ),
          ) * 20,
        ),
      numbers: Array.from(
        { length: 5 },
        (_, i) =>
          `9800000${cls.charCodeAt(0) % 100}${sec.charCodeAt(0) % 10}${i}`,
      ),
    })),
  ),
  {
    id: "staff",
    name: "All Teachers",
    cls: "staff",
    section: "",
    memberCount: 18,
    numbers: ["9876543210", "9876543211"],
  },
  {
    id: "class-teachers",
    name: "Class Teachers Only",
    cls: "staff",
    section: "ct",
    memberCount: 8,
    numbers: ["9876543212", "9876543213"],
  },
  {
    id: "all-parents",
    name: "All Parents",
    cls: "all",
    section: "",
    memberCount: 312,
    numbers: [],
  },
];

const mockPushHistory = [
  {
    id: "1",
    title: "Fee Reminder",
    target: "All Parents",
    sentAt: "2026-04-01 09:00",
    status: "Delivered",
  },
  {
    id: "2",
    title: "Exam Schedule Released",
    target: "All Students",
    sentAt: "2026-03-30 10:30",
    status: "Delivered",
  },
  {
    id: "3",
    title: "PTM Tomorrow",
    target: "Class X Parents",
    sentAt: "2026-03-28 08:00",
    status: "Delivered",
  },
  {
    id: "4",
    title: "Holiday Notice",
    target: "All Users",
    sentAt: "2026-03-25 11:00",
    status: "Delivered",
  },
  {
    id: "5",
    title: "Result Uploaded",
    target: "Class IX Students",
    sentAt: "2026-03-22 14:00",
    status: "Scheduled",
  },
];

export function CommunicationPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [recipientType, setRecipientType] = useState("all");
  const [classInput, setClassInput] = useState("");
  const [studentInput, setStudentInput] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [waGroupSearch, setWaGroupSearch] = useState("");
  const [pushTarget, setPushTarget] = useState("all");
  const [pushRole, setPushRole] = useState("teacher");
  const [pushClass, setPushClass] = useState("");
  const [pushTitle, setPushTitle] = useState("");
  const [pushMessage, setPushMessage] = useState("");
  const [pushSchedule, setPushSchedule] = useState(false);
  const [pushDateTime, setPushDateTime] = useState("");
  const [pushHistory, setPushHistory] = useState(mockPushHistory);
  const [placeholderValues, setPlaceholderValues] = useState<
    Record<string, string>
  >({});

  // Template dialog state
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [templateForm, setTemplateForm] =
    useState<Omit<Template, "id">>(blankTemplate);
  const [deleteTemplate, setDeleteTemplate] = useState<Template | null>(null);

  const [waRecipient, setWaRecipient] = useState("all-parents");
  const [waMessage, setWaMessage] = useState("");
  const [waCustomNumbers, setWaCustomNumbers] = useState("");
  const [waTeacherFilter, setWaTeacherFilter] = useState("All Teachers");
  const [waParentFilter, setWaParentFilter] = useState("All Parents");

  const placeholders = extractPlaceholders(body);
  const activePlaceholderValues = Object.fromEntries(
    placeholders.map((p) => [p, placeholderValues[p] ?? ""]),
  );
  const previewBody = applySubstitutions(body, activePlaceholderValues);
  const charCount = previewBody.length;
  const smsCount = Math.ceil(charCount / 160) || 1;
  const thisMonthCount = messages.filter((m) =>
    m.date.startsWith("2024-11"),
  ).length;

  const handleTemplate = (t: Template) => {
    setSubject(t.subject);
    setBody(t.body);
    setPlaceholderValues({});
  };

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error("Please enter a message subject");
      return;
    }
    if (!body.trim()) {
      toast.error("Message body cannot be empty");
      return;
    }
    if (recipientType === "class" && !classInput.trim()) {
      toast.error("Please select a class before sending.");
      return;
    }
    if (recipientType === "individual" && !studentInput.trim()) {
      toast.error("Please select a student before sending.");
      return;
    }
    const unfilled = placeholders.filter((p) => !activePlaceholderValues[p]);
    if (unfilled.length > 0) {
      toast.error(
        `Please fill placeholders: ${unfilled.map((p) => `{${p}}`).join(", ")}`,
      );
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    const recipientLabel =
      recipientType === "all"
        ? "All Parents"
        : recipientType === "class"
          ? `Class ${classInput}`
          : studentInput;
    const count =
      recipientType === "all" ? 245 : recipientType === "class" ? 52 : 1;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      subject,
      recipients: recipientLabel,
      recipientCount: count,
      status: "Delivered",
    };
    setMessages((prev) => [newMsg, ...prev]);
    setSending(false);
    toast.success(`Message sent to ${count} recipient(s)!`);
    setSubject("");
    setBody("");
    setPlaceholderValues({});
  };

  const openAddTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm(blankTemplate);
    setTemplateDialogOpen(true);
  };

  const openEditTemplate = (t: Template) => {
    setEditingTemplate(t);
    setTemplateForm({
      name: t.name,
      category: t.category,
      subject: t.subject,
      body: t.body,
    });
    setTemplateDialogOpen(true);
  };

  const handleSaveTemplate = () => {
    if (!templateForm.name || !templateForm.body) {
      toast.error("Template name and content are required");
      return;
    }
    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id ? { ...t, ...templateForm } : t,
        ),
      );
      toast.success("Template updated");
    } else {
      const newT: Template = { id: `t-${Date.now()}`, ...templateForm };
      setTemplates((prev) => [...prev, newT]);
      toast.success("Template added");
    }
    setTemplateDialogOpen(false);
  };

  const handleDeleteTemplate = () => {
    if (!deleteTemplate) return;
    setTemplates((prev) => prev.filter((t) => t.id !== deleteTemplate.id));
    toast.success("Template deleted");
    setDeleteTemplate(null);
  };

  return (
    <div className="space-y-6" data-ocid="communication.page">
      <div className="flex items-center gap-3">
        <MessageCircle className="text-primary" size={24} />
        <h1 className="text-2xl font-bold text-foreground">Communication</h1>
      </div>

      <Tabs defaultValue="compose" data-ocid="communication.tab">
        <TabsList>
          <TabsTrigger value="compose">Compose Message</TabsTrigger>
          <TabsTrigger value="history">Message History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="whatsapp" data-ocid="communication.whatsapp.tab">
            <MessageCircle size={14} className="mr-1" /> WhatsApp
          </TabsTrigger>
          <TabsTrigger value="push" data-ocid="communication.push.tab">
            🔔 Push Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Compose panel */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-1.5">
                <Label>Recipients</Label>
                <Select value={recipientType} onValueChange={setRecipientType}>
                  <SelectTrigger data-ocid="communication.recipients.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Parents</SelectItem>
                    <SelectItem value="class">Class-wise</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {recipientType === "class" && (
                <div className="space-y-1.5">
                  <Label>Class</Label>
                  <Input
                    value={classInput}
                    onChange={(e) => setClassInput(e.target.value)}
                    placeholder="e.g. 10-A"
                    data-ocid="communication.class.input"
                  />
                </div>
              )}
              {recipientType === "individual" && (
                <div className="space-y-1.5">
                  <Label>Student Name / Admission No.</Label>
                  <Input
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    placeholder="Enter name or admission number"
                    data-ocid="communication.student.input"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Message subject"
                  data-ocid="communication.subject.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Message</Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  placeholder="Type your message here... Use {name}, {date}, {amount}, {class} as merge tags"
                  data-ocid="communication.message.textarea"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {charCount} / 160 characters ({smsCount} SMS)
                </p>
              </div>

              {placeholders.length > 0 && (
                <div className="space-y-3 p-4 bg-muted/40 rounded-xl border border-border">
                  <p className="text-sm font-medium text-foreground">
                    Fill in template placeholders
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {placeholders.map((ph) => (
                      <div key={ph} className="space-y-1">
                        <Label htmlFor={`ph-${ph}`}>
                          {ph.charAt(0).toUpperCase() + ph.slice(1)}
                        </Label>
                        <Input
                          id={`ph-${ph}`}
                          value={activePlaceholderValues[ph] ?? ""}
                          onChange={(e) =>
                            setPlaceholderValues((prev) => ({
                              ...prev,
                              [ph]: e.target.value,
                            }))
                          }
                          placeholder={`Enter ${ph}`}
                          data-ocid={`communication.placeholder.${ph}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Preview
                    </p>
                    <pre className="text-xs text-foreground bg-background border border-border rounded-lg p-3 whitespace-pre-wrap font-sans">
                      {previewBody}
                    </pre>
                  </div>
                </div>
              )}

              <Button
                onClick={handleSend}
                disabled={sending}
                className="w-full"
                data-ocid="communication.send_button"
              >
                <Send size={16} className="mr-2" />
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </div>

            {/* Quick Templates sidebar */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-foreground">
                  Quick Templates
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openAddTemplate}
                  data-ocid="communication.add_template.button"
                >
                  <Plus size={13} className="mr-1" /> Add
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                    data-ocid={`communication.template.${t.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        className="text-left flex-1"
                        onClick={() => handleTemplate(t)}
                      >
                        <p className="text-sm font-medium text-foreground">
                          {t.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {t.subject}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {t.category}
                        </Badge>
                      </button>
                      <div className="flex gap-0.5">
                        <button
                          type="button"
                          onClick={() => openEditTemplate(t)}
                          className="p-1 text-muted-foreground hover:text-foreground"
                          data-ocid={`communication.template.edit.${t.id}`}
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTemplate(t)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                          data-ocid={`communication.template.delete.${t.id}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {thisMonthCount}
                  </span>{" "}
                  messages sent this month
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                      Subject
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                      Recipients
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                      Count
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m, i) => (
                    <tr
                      key={m.id}
                      className="border-b border-border last:border-0 hover:bg-muted/20"
                      data-ocid={`communication.row.${i + 1}`}
                    >
                      <td className="px-5 py-3 text-muted-foreground">
                        {new Date(`${m.date}T00:00:00`).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="px-5 py-3 text-foreground font-medium">
                        {m.subject}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {m.recipients}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {m.recipientCount}
                      </td>
                      <td className="px-5 py-3">
                        <Badge className="bg-green-500/15 text-green-600">
                          {m.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Message Templates</h2>
            <Button
              onClick={openAddTemplate}
              data-ocid="communication.templates.add.button"
            >
              <Plus size={15} className="mr-1" /> Add Template
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((t, i) => (
              <div
                key={t.id}
                className="bg-card border border-border rounded-2xl p-4"
                data-ocid={`communication.templates.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{t.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {t.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.subject}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {t.body}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => openEditTemplate(t)}
                      data-ocid={`communication.templates.edit_button.${i + 1}`}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTemplate(t)}
                      data-ocid={`communication.templates.delete_button.${i + 1}`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {templates.length === 0 && (
              <div
                className="col-span-2 text-center py-10 text-muted-foreground"
                data-ocid="communication.templates.empty_state"
              >
                No templates yet.
              </div>
            )}
          </div>
        </TabsContent>

        {/* WhatsApp Tab */}
        <TabsContent value="whatsapp" className="mt-6 space-y-6">
          {/* Section 1: Group Cards */}
          <div>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h3 className="font-semibold text-base">
                WhatsApp Groups (
                {
                  whatsappGroups.filter(
                    (g) =>
                      !waGroupSearch ||
                      g.name
                        .toLowerCase()
                        .includes(waGroupSearch.toLowerCase()),
                  ).length
                }
                )
              </h3>
              <Input
                placeholder="Search by class name..."
                value={waGroupSearch}
                onChange={(e) => setWaGroupSearch(e.target.value)}
                className="max-w-xs h-8 text-sm"
                data-ocid="communication.whatsapp.search_input"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {whatsappGroups
                .filter(
                  (g) =>
                    !waGroupSearch ||
                    g.name.toLowerCase().includes(waGroupSearch.toLowerCase()),
                )
                .map((group) => (
                  <div
                    key={group.id}
                    className="bg-card border border-border rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{group.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {group.memberCount} members
                        </p>
                      </div>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                        {group.cls === "staff" || group.cls === "all"
                          ? group.cls
                          : `Class ${group.cls}-${group.section}`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setWaRecipient(group.id);
                          toast.success(`Selected: ${group.name}`);
                        }}
                        data-ocid="communication.whatsapp.send_button"
                      >
                        <Send size={11} className="mr-1" /> Send
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => {
                          if (!group.numbers.length) {
                            toast.error("No numbers available");
                            return;
                          }
                          navigator.clipboard.writeText(
                            group.numbers.join(", "),
                          );
                          toast.success("Numbers copied!");
                        }}
                        data-ocid="communication.whatsapp.copy_button"
                      >
                        <Copy size={11} className="mr-1" /> Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => {
                          if (!group.numbers.length) {
                            toast.error("No numbers available for this group");
                            return;
                          }
                          window.open(
                            `https://wa.me/${group.numbers[0]}`,
                            "_blank",
                          );
                        }}
                        data-ocid="communication.whatsapp.open_button"
                      >
                        <ExternalLink size={11} className="mr-1" /> Open
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Section 2: Compose Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-border pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-base">Send WhatsApp Message</h3>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Recipient Group
                </p>
                <Select value={waRecipient} onValueChange={setWaRecipient}>
                  <SelectTrigger data-ocid="communication.whatsapp.recipient.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {whatsappGroups.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name} ({g.memberCount})
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Numbers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {waRecipient === "custom" && (
                <Textarea
                  placeholder="Enter numbers separated by commas: 9876543210, 9876543211..."
                  value={waCustomNumbers}
                  onChange={(e) => setWaCustomNumbers(e.target.value)}
                  rows={2}
                  data-ocid="communication.whatsapp.custom_numbers.textarea"
                />
              )}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Load Template
                </p>
                <Select
                  onValueChange={(t) =>
                    setWaMessage(
                      templates.find((x) => x.name === t)?.body || "",
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Load a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={t.name}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Insert Variable
                </p>
                <div className="flex flex-wrap gap-1">
                  {["{student_name}", "{class}", "{fee_amount}", "{date}"].map(
                    (v) => (
                      <Button
                        key={v}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 font-mono"
                        onClick={() => setWaMessage((m) => m + v)}
                      >
                        {v}
                      </Button>
                    ),
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Message
                </p>
                <Textarea
                  placeholder="Type your WhatsApp message..."
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  rows={5}
                  maxLength={4096}
                  data-ocid="communication.whatsapp.message.textarea"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {waMessage.length} / 4096 characters
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!waMessage.trim()}
                  onClick={() => {
                    const encoded = encodeURIComponent(waMessage);
                    const group = whatsappGroups.find(
                      (g) => g.id === waRecipient,
                    );
                    const phone = group?.numbers?.[0] || "";
                    window.open(
                      `https://web.whatsapp.com/send?text=${encoded}${phone ? `&phone=${phone}` : ""}`,
                      "_blank",
                    );
                  }}
                  data-ocid="communication.whatsapp.send_web.button"
                >
                  <MessageCircle size={14} className="mr-1" /> Send via WhatsApp
                  Web
                </Button>
                <Button
                  variant="outline"
                  disabled={!waMessage.trim()}
                  onClick={() => {
                    const group = whatsappGroups.find(
                      (g) => g.id === waRecipient,
                    );
                    const numbers =
                      waRecipient === "custom"
                        ? waCustomNumbers
                            .split(",")
                            .map((n) => n.trim())
                            .filter(Boolean)
                        : group?.numbers || [];
                    if (!numbers.length) {
                      toast.error("No numbers available for this group");
                      return;
                    }
                    const encoded = encodeURIComponent(waMessage);
                    numbers.forEach((num, i) => {
                      setTimeout(
                        () =>
                          window.open(
                            `https://wa.me/${num}?text=${encoded}`,
                            "_blank",
                          ),
                        i * 300,
                      );
                    });
                    toast.success(`Opened ${numbers.length} WhatsApp chats`);
                  }}
                  data-ocid="communication.whatsapp.broadcast.button"
                >
                  Broadcast List
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-base mb-3">Message Preview</h3>
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-4 min-h-32 whitespace-pre-wrap text-sm">
                {waMessage || (
                  <span className="text-muted-foreground italic">
                    Your message will appear here...
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Recipient:{" "}
                <strong>
                  {whatsappGroups.find((g) => g.id === waRecipient)?.name ||
                    "Custom Numbers"}
                </strong>
              </p>
            </div>
          </div>

          {/* Section 3: Teacher Messaging */}
          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-base mb-3">Teacher Messaging</h3>
            <div className="flex gap-2 flex-wrap mb-3">
              {["All Teachers", "Class Teachers", "Subject Teachers"].map(
                (opt) => (
                  <Button
                    key={opt}
                    variant={waTeacherFilter === opt ? "default" : "outline"}
                    size="sm"
                    onClick={() => setWaTeacherFilter(opt)}
                    data-ocid="communication.whatsapp.teacher.toggle"
                  >
                    {opt}
                  </Button>
                ),
              )}
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
              disabled={!waMessage.trim()}
              onClick={() => {
                if (!waMessage.trim()) {
                  toast.error("Please enter a WhatsApp message");
                  return;
                }
                const encoded = encodeURIComponent(waMessage);
                window.open(
                  `https://web.whatsapp.com/send?text=${encoded}`,
                  "_blank",
                );
              }}
              data-ocid="communication.whatsapp.teacher.send_button"
            >
              <MessageCircle size={14} className="mr-1" /> Send to{" "}
              {waTeacherFilter}
            </Button>
          </div>

          {/* Section 4: Parent Messaging */}
          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-base mb-3">Parent Messaging</h3>
            <div className="flex gap-2 flex-wrap mb-3">
              {[
                "All Parents",
                "By Class",
                "By Section",
                "Fee Defaulters",
                "Low Attendance",
              ].map((opt) => (
                <Button
                  key={opt}
                  variant={waParentFilter === opt ? "default" : "outline"}
                  size="sm"
                  onClick={() => setWaParentFilter(opt)}
                  data-ocid="communication.whatsapp.parent.toggle"
                >
                  {opt}
                </Button>
              ))}
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
              disabled={!waMessage.trim()}
              onClick={() => {
                if (!waMessage.trim()) {
                  toast.error("Please enter a WhatsApp message");
                  return;
                }
                const encoded = encodeURIComponent(waMessage);
                window.open(
                  `https://web.whatsapp.com/send?text=${encoded}`,
                  "_blank",
                );
              }}
              data-ocid="communication.whatsapp.parent.send_button"
            >
              <MessageCircle size={14} className="mr-1" /> Send to{" "}
              {waParentFilter}
            </Button>
          </div>
        </TabsContent>

        {/* Push Notifications Tab */}
        <TabsContent value="push" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compose Panel */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base">
                Send Push Notification
              </h3>

              {/* Target selector */}
              <div className="space-y-1.5">
                <Label>Target Audience</Label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { val: "all", label: "All Users" },
                    { val: "role", label: "By Role" },
                    { val: "class", label: "By Class" },
                  ].map((opt) => (
                    <Button
                      key={opt.val}
                      size="sm"
                      variant={pushTarget === opt.val ? "default" : "outline"}
                      onClick={() => setPushTarget(opt.val)}
                      data-ocid="communication.push.target.toggle"
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
                {pushTarget === "role" && (
                  <Select value={pushRole} onValueChange={setPushRole}>
                    <SelectTrigger
                      className="mt-2"
                      data-ocid="communication.push.role.select"
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {["admin", "teacher", "student", "parent"].map((r) => (
                        <SelectItem key={r} value={r} className="capitalize">
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {pushTarget === "class" && (
                  <Select value={pushClass} onValueChange={setPushClass}>
                    <SelectTrigger
                      className="mt-2"
                      data-ocid="communication.push.class.select"
                    >
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {CLASSES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Notification Title *</Label>
                <Input
                  placeholder="e.g. Fee Reminder"
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  data-ocid="communication.push.title.input"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Message Body *</Label>
                <Textarea
                  placeholder="Enter notification message (max 256 characters)..."
                  maxLength={256}
                  value={pushMessage}
                  onChange={(e) => setPushMessage(e.target.value)}
                  data-ocid="communication.push.message.textarea"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {pushMessage.length}/256
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Label>Schedule for later</Label>
                <button
                  type="button"
                  className={`w-10 h-5 rounded-full transition-colors ${pushSchedule ? "bg-primary" : "bg-muted"} relative`}
                  onClick={() => setPushSchedule((p) => !p)}
                  data-ocid="communication.push.schedule.toggle"
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${pushSchedule ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
                <span className="text-sm text-muted-foreground">
                  {pushSchedule ? "Scheduled" : "Send Now"}
                </span>
              </div>

              {pushSchedule && (
                <div className="space-y-1.5">
                  <Label>Schedule Date & Time</Label>
                  <input
                    type="datetime-local"
                    value={pushDateTime}
                    onChange={(e) => setPushDateTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                    data-ocid="communication.push.datetime.input"
                  />
                </div>
              )}

              <Button
                className="w-full"
                onClick={() => {
                  if (!pushTitle || !pushMessage) {
                    toast.error("Title and message are required");
                    return;
                  }
                  const target =
                    pushTarget === "all"
                      ? "All Users"
                      : pushTarget === "role"
                        ? `${pushRole.charAt(0).toUpperCase()}${pushRole.slice(1)}s`
                        : `Class ${pushClass}`;
                  const status = pushSchedule ? "Scheduled" : "Delivered";
                  setPushHistory((prev) => [
                    {
                      id: String(Date.now()),
                      title: pushTitle,
                      target,
                      sentAt: pushSchedule
                        ? pushDateTime
                        : new Date().toLocaleString("en-IN"),
                      status,
                    },
                    ...prev,
                  ]);
                  toast.success(
                    pushSchedule
                      ? `Notification scheduled for ${pushDateTime}`
                      : "Push notification sent successfully!",
                  );
                  setPushTitle("");
                  setPushMessage("");
                }}
                data-ocid="communication.push.send.button"
              >
                🔔{" "}
                {pushSchedule ? "Schedule Notification" : "Send Notification"}
              </Button>
            </div>

            {/* History */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base">Notification History</h3>
              <div className="space-y-2">
                {pushHistory.map((n) => (
                  <div
                    key={n.id}
                    className="bg-card border rounded-lg p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{n.title}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${n.status === "Delivered" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"}`}
                      >
                        {n.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Target: {n.target}
                    </p>
                    <p className="text-xs text-muted-foreground">{n.sentAt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Template Dialog */}
      <Dialog
        open={templateDialogOpen}
        onOpenChange={(open) => !open && setTemplateDialogOpen(false)}
      >
        <DialogContent
          className="max-w-lg"
          data-ocid="communication.template.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Add New Template"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Template Name *</Label>
                <Input
                  value={templateForm.name}
                  onChange={(e) =>
                    setTemplateForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Fee Reminder"
                  data-ocid="communication.template.name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <select
                  value={templateForm.category}
                  onChange={(e) =>
                    setTemplateForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                  data-ocid="communication.template.category.select"
                >
                  {TEMPLATE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Input
                value={templateForm.subject}
                onChange={(e) =>
                  setTemplateForm((p) => ({ ...p, subject: e.target.value }))
                }
                placeholder="Message subject"
                data-ocid="communication.template.subject.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Content *</Label>
              <Textarea
                value={templateForm.body}
                onChange={(e) =>
                  setTemplateForm((p) => ({ ...p, body: e.target.value }))
                }
                rows={6}
                placeholder="Write template content... Use {name}, {date}, {amount}, {class} as merge tags"
                data-ocid="communication.template.body.textarea"
              />
              <p className="text-xs text-muted-foreground">
                Available merge tags: {"{"}name{"}"}, {"{"}date{"}"}, {"{"}
                amount{"}"}, {"{"}class{"}"}, {"{"}term{"}"}, {"{"}event{
                  "}"
                }{" "}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTemplateDialogOpen(false)}
              data-ocid="communication.template.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTemplate}
              data-ocid="communication.template.save_button"
            >
              {editingTemplate ? "Save Changes" : "Add Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Template Dialog */}
      <Dialog
        open={!!deleteTemplate}
        onOpenChange={(open) => !open && setDeleteTemplate(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete the template{" "}
            <span className="font-semibold text-foreground">
              "{deleteTemplate?.name}"
            </span>
            ?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTemplate(null)}
              data-ocid="communication.template.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTemplate}
              data-ocid="communication.template.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
