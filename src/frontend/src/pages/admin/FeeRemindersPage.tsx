import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CLASSES, SECTIONS } from "@/data/classConfig";
import { mockStudents } from "@/data/mockStudents";
import { MessageCircle, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DEFAULT_TEMPLATE =
  "Dear Parent, This is a reminder that fee of Rs.{amount} for {student_name} (Class {class}) is due on {due_date}. Please pay at the earliest to avoid late fees. Regards, {school_name}";

const mockHistory = [
  {
    id: "rh1",
    date: "2026-10-28",
    student: "Aarav Sharma",
    type: "3-Day Notice",
    channel: "WhatsApp",
    status: "Sent",
  },
  {
    id: "rh2",
    date: "2026-09-25",
    student: "Priya Singh",
    type: "Due Date",
    channel: "SMS",
    status: "Sent",
  },
  {
    id: "rh3",
    date: "2026-08-20",
    student: "Rahul Kumar",
    type: "Overdue",
    channel: "WhatsApp",
    status: "Failed",
  },
  {
    id: "rh4",
    date: "2026-11-15",
    student: "Sneha Rao",
    type: "3-Day Notice",
    channel: "WhatsApp",
    status: "Sent",
  },
];

export function FeeRemindersPage() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [rules, setRules] = useState({
    threeDayBefore: true,
    onDueDate: true,
    sevenDayAfter: true,
    monthlyStatement: false,
  });

  const defaulters = mockStudents
    .filter((s) => s.feeDue > 0)
    .filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q);
      const matchClass = classFilter === "all" || s.className === classFilter;
      const matchSection =
        sectionFilter === "all" || s.section === sectionFilter;
      return matchSearch && matchClass && matchSection;
    });

  function toggleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function sendWhatsApp(student: (typeof defaulters)[0]) {
    const msg = template
      .replace("{student_name}", student.name)
      .replace("{class}", `${student.className}-${student.section}`)
      .replace("{amount}", `${student.feeDue}`)
      .replace("{due_date}", "10th of this month")
      .replace("{school_name}", "SmartSkale School");
    window.open(
      `https://wa.me/91${student.mobile}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  }

  function sendBulk() {
    if (selected.length === 0) {
      toast.error("Select at least one student");
      return;
    }
    const students = mockStudents.filter((s) => selected.includes(s.id));
    students.forEach((s, i) => {
      setTimeout(() => sendWhatsApp(s), i * 500);
    });
    toast.success(`Opening WhatsApp for ${selected.length} student(s)...`);
    setSelected([]);
  }

  return (
    <div className="space-y-5" data-ocid="fee_reminders.page">
      <h1 className="text-2xl font-bold text-foreground">Fee Reminders</h1>
      <Tabs defaultValue="send">
        <TabsList>
          <TabsTrigger value="send">Send Reminders</TabsTrigger>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="history">Reminder History</TabsTrigger>
        </TabsList>

        {/* SEND REMINDERS TAB */}
        <TabsContent value="send" className="mt-5 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                className="pl-8"
                placeholder="Search by name or class..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="fee_reminders.search.input"
              />
            </div>
            <Select
              value={classFilter}
              onValueChange={(v) => {
                setClassFilter(v);
                setSectionFilter("all");
              }}
            >
              <SelectTrigger
                className="w-36"
                data-ocid="fee_reminders.class_filter.select"
              >
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                <SelectItem value="all">All Classes</SelectItem>
                {CLASSES.map((c) => (
                  <SelectItem key={c} value={c}>
                    Class {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sectionFilter}
              onValueChange={setSectionFilter}
              disabled={classFilter === "all"}
            >
              <SelectTrigger
                className="w-36"
                data-ocid="fee_reminders.section_filter.select"
              >
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {(classFilter === "XI" || classFilter === "XII"
                  ? [...SECTIONS, "Science", "Commerce", "Arts"]
                  : SECTIONS
                ).map((s) => (
                  <SelectItem key={s} value={s}>
                    Section {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => setSelected(defaulters.map((s) => s.id))}
              variant="outline"
              size="sm"
              data-ocid="fee_reminders.select_all.button"
            >
              Select All ({defaulters.length})
            </Button>
            {selected.length > 0 && (
              <Button
                size="sm"
                onClick={sendBulk}
                data-ocid="fee_reminders.send_bulk.button"
              >
                <MessageCircle size={14} className="mr-1" /> Send to{" "}
                {selected.length} via WhatsApp
              </Button>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="p-3 text-left w-8" />
                  <th className="p-3 text-left font-semibold text-muted-foreground">
                    Student
                  </th>
                  <th className="p-3 text-left font-semibold text-muted-foreground">
                    Class
                  </th>
                  <th className="p-3 text-left font-semibold text-muted-foreground">
                    Parent Mobile
                  </th>
                  <th className="p-3 text-right font-semibold text-muted-foreground">
                    Due Amount
                  </th>
                  <th className="p-3 text-center font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {defaulters.map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-t border-border hover:bg-secondary/20"
                    data-ocid={`fee_reminders.row.${i + 1}`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(s.id)}
                        onChange={() => toggleSelect(s.id)}
                        className="w-4 h-4 cursor-pointer"
                        data-ocid={`fee_reminders.checkbox.${i + 1}`}
                      />
                    </td>
                    <td className="p-3 font-medium text-foreground">
                      {s.name}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {s.className}-{s.section}
                    </td>
                    <td className="p-3 text-muted-foreground font-mono">
                      {s.mobile}
                    </td>
                    <td className="p-3 text-right">
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                        ₹{s.feeDue.toLocaleString()}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendWhatsApp(s)}
                          data-ocid={`fee_reminders.whatsapp.${i + 1}`}
                        >
                          <MessageCircle size={12} className="mr-1" /> WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            toast.info(`SMS queued for ${s.mobile}`)
                          }
                          data-ocid={`fee_reminders.sms.${i + 1}`}
                        >
                          SMS
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {defaulters.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No fee defaulters found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* AUTOMATION RULES TAB */}
        <TabsContent value="rules" className="mt-5 space-y-5">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-foreground">
              Automatic Reminder Triggers
            </h2>
            {(
              [
                {
                  key: "threeDayBefore" as const,
                  label: "3 days before due date",
                  desc: "Sends a gentle reminder before the deadline",
                },
                {
                  key: "onDueDate" as const,
                  label: "On the due date",
                  desc: "Sends a reminder on the payment deadline",
                },
                {
                  key: "sevenDayAfter" as const,
                  label: "7 days after due date (overdue)",
                  desc: "Sends an overdue notice with late fee warning",
                },
                {
                  key: "monthlyStatement" as const,
                  label: "Monthly fee statement",
                  desc: "Sends a monthly summary to all parents",
                },
              ] as const
            ).map((rule) => (
              <div
                key={rule.key}
                className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {rule.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{rule.desc}</p>
                </div>
                <Switch
                  checked={rules[rule.key]}
                  onCheckedChange={(v) =>
                    setRules((prev) => ({ ...prev, [rule.key]: v }))
                  }
                  data-ocid={`fee_reminders.rule_${rule.key}.switch`}
                />
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h2 className="font-semibold text-foreground">Message Template</h2>
            <p className="text-xs text-muted-foreground">
              Variables:{" "}
              {"{student_name} {class} {amount} {due_date} {school_name}"}
            </p>
            <Textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={4}
              className="font-mono text-sm"
              data-ocid="fee_reminders.template.textarea"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setTemplate(DEFAULT_TEMPLATE);
                  toast.success("Template reset to default");
                }}
                data-ocid="fee_reminders.reset_template.button"
              >
                Reset Default
              </Button>
              <Button
                size="sm"
                onClick={() => toast.success("Template saved")}
                data-ocid="fee_reminders.save_template.button"
              >
                Save Template
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => toast.success("Automation rules saved")}
              data-ocid="fee_reminders.save_rules.button"
            >
              Save Rules
            </Button>
          </div>
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history" className="mt-5">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="p-3 text-left font-semibold text-muted-foreground">
                    Date
                  </th>
                  <th className="p-3 text-left font-semibold text-muted-foreground">
                    Student
                  </th>
                  <th className="p-3 text-left font-semibold text-muted-foreground">
                    Type
                  </th>
                  <th className="p-3 text-left font-semibold text-muted-foreground">
                    Channel
                  </th>
                  <th className="p-3 text-center font-semibold text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.map((h, i) => (
                  <tr
                    key={h.id}
                    className="border-t border-border hover:bg-secondary/20"
                    data-ocid={`fee_reminders.history.${i + 1}`}
                  >
                    <td className="p-3 text-muted-foreground">{h.date}</td>
                    <td className="p-3 font-medium text-foreground">
                      {h.student}
                    </td>
                    <td className="p-3 text-muted-foreground">{h.type}</td>
                    <td className="p-3">
                      <Badge variant="outline">{h.channel}</Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge
                        className={
                          h.status === "Sent"
                            ? "bg-green-500/10 text-green-700 border-green-200"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {h.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
