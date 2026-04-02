import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CLASSES } from "@/data/classConfig";
import {
  Eye,
  MessageCircle,
  Paperclip,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
  "Computer",
];
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H"];

interface Homework {
  id: string;
  title: string;
  cls: string;
  section: string;
  subject: string;
  dueDate: string;
  maxMarks: number | null;
  description: string;
  submissions: number;
  total: number;
}

const initialHomework: Homework[] = [
  {
    id: "1",
    title: "Chapter 5 — Quadratic Equations",
    cls: "X",
    section: "A",
    subject: "Mathematics",
    dueDate: "2026-04-05",
    maxMarks: 20,
    description: "Solve exercises 5.1 to 5.3",
    submissions: 28,
    total: 42,
  },
  {
    id: "2",
    title: "Essay: My Favourite Season",
    cls: "VII",
    section: "B",
    subject: "English",
    dueDate: "2026-04-06",
    maxMarks: 10,
    description: "Write a 200-word essay",
    submissions: 18,
    total: 38,
  },
  {
    id: "3",
    title: "Draw Cell Diagram",
    cls: "VIII",
    section: "A",
    subject: "Science",
    dueDate: "2026-04-07",
    maxMarks: 5,
    description: "Draw and label plant and animal cells",
    submissions: 35,
    total: 40,
  },
  {
    id: "4",
    title: "Hindi Poem Recitation Practice",
    cls: "VI",
    section: "C",
    subject: "Hindi",
    dueDate: "2026-04-08",
    maxMarks: null,
    description: "Practise poem from chapter 3",
    submissions: 12,
    total: 36,
  },
  {
    id: "5",
    title: "Ancient Civilisations Map",
    cls: "IX",
    section: "A",
    subject: "Social Studies",
    dueDate: "2026-04-09",
    maxMarks: 15,
    description: "Mark all major ancient civilisations on a world map",
    submissions: 22,
    total: 44,
  },
  {
    id: "6",
    title: "Python Variables Practice",
    cls: "XI",
    section: "B",
    subject: "Computer",
    dueDate: "2026-04-10",
    maxMarks: 10,
    description: "Write 5 programs using variables and loops",
    submissions: 30,
    total: 35,
  },
  {
    id: "7",
    title: "Periodic Table Elements",
    cls: "IX",
    section: "C",
    subject: "Science",
    dueDate: "2026-04-11",
    maxMarks: 10,
    description: "Memorise first 20 elements",
    submissions: 20,
    total: 40,
  },
  {
    id: "8",
    title: "Algebra Word Problems",
    cls: "VIII",
    section: "B",
    subject: "Mathematics",
    dueDate: "2026-04-12",
    maxMarks: 20,
    description: "Solve 10 word problems from textbook page 78",
    submissions: 15,
    total: 39,
  },
];

const mockSubmissions = [
  {
    name: "Aarav Sharma",
    submitted: true,
    at: "2026-04-03 09:15",
    marks: 18,
    status: "Graded",
  },
  {
    name: "Priya Verma",
    submitted: true,
    at: "2026-04-03 10:22",
    marks: null,
    status: "Submitted",
  },
  {
    name: "Rohan Kumar",
    submitted: false,
    at: null,
    marks: null,
    status: "Pending",
  },
  {
    name: "Sneha Patel",
    submitted: true,
    at: "2026-04-04 08:55",
    marks: 15,
    status: "Graded",
  },
  {
    name: "Arjun Singh",
    submitted: false,
    at: null,
    marks: null,
    status: "Pending",
  },
  {
    name: "Meera Joshi",
    submitted: true,
    at: "2026-04-04 11:30",
    marks: 20,
    status: "Graded",
  },
  {
    name: "Kabir Nair",
    submitted: true,
    at: "2026-04-05 07:45",
    marks: null,
    status: "Submitted",
  },
  {
    name: "Tanvi Gupta",
    submitted: false,
    at: null,
    marks: null,
    status: "Pending",
  },
  {
    name: "Dev Mehta",
    submitted: true,
    at: "2026-04-04 14:20",
    marks: 17,
    status: "Graded",
  },
  {
    name: "Ananya Roy",
    submitted: false,
    at: null,
    marks: null,
    status: "Pending",
  },
  {
    name: "Vikram Chauhan",
    submitted: true,
    at: "2026-04-05 09:00",
    marks: 19,
    status: "Graded",
  },
  {
    name: "Ishita Saxena",
    submitted: false,
    at: null,
    marks: null,
    status: "Pending",
  },
];

export function HomeworkPage() {
  const [homework, setHomework] = useState<Homework[]>(initialHomework);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewHw, setViewHw] = useState<Homework | null>(null);
  const [clsFilter, setClsFilter] = useState("all");
  const [secFilter, setSecFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    cls: "",
    section: "",
    subject: "",
    dueDate: "",
    maxMarks: "",
    description: "",
    fileName: "",
  });

  const filtered = homework.filter((h) => {
    if (clsFilter !== "all" && h.cls !== clsFilter) return false;
    if (secFilter !== "all" && h.section !== secFilter) return false;
    if (subFilter !== "all" && h.subject !== subFilter) return false;
    return true;
  });

  const handleCreate = () => {
    if (
      !form.title ||
      !form.cls ||
      !form.section ||
      !form.subject ||
      !form.dueDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    const newHw: Homework = {
      id: String(Date.now()),
      title: form.title,
      cls: form.cls,
      section: form.section,
      subject: form.subject,
      dueDate: form.dueDate,
      maxMarks: form.maxMarks ? Number(form.maxMarks) : null,
      description: form.description,
      submissions: 0,
      total: 40,
    };
    setHomework((prev) => [newHw, ...prev]);
    setCreateOpen(false);
    setForm({
      title: "",
      cls: "",
      section: "",
      subject: "",
      dueDate: "",
      maxMarks: "",
      description: "",
      fileName: "",
    });
    toast.success("Homework created successfully");
  };

  const statusBadge = (sub: number, total: number) => {
    const pct = total ? Math.round((sub / total) * 100) : 0;
    if (pct >= 80)
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
          {sub}/{total}
        </Badge>
      );
    if (pct >= 50)
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
          {sub}/{total}
        </Badge>
      );
    return (
      <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
        {sub}/{total}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Homework & Assignments</h1>
          <p className="text-muted-foreground text-sm">
            Manage homework, track submissions, send reminders
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          data-ocid="homework.open_modal_button"
        >
          <Plus size={16} className="mr-2" /> Create Homework
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={clsFilter} onValueChange={setClsFilter}>
          <SelectTrigger className="w-36" data-ocid="homework.class.select">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            <SelectItem value="all">All Classes</SelectItem>
            {CLASSES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={secFilter} onValueChange={setSecFilter}>
          <SelectTrigger className="w-32" data-ocid="homework.section.select">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {SECTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={subFilter} onValueChange={setSubFilter}>
          <SelectTrigger className="w-40" data-ocid="homework.subject.select">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {SUBJECTS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Max Marks</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((h, i) => (
                <TableRow key={h.id} data-ocid={`homework.item.${i + 1}`}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {h.title}
                  </TableCell>
                  <TableCell>
                    {h.cls}-{h.section}
                  </TableCell>
                  <TableCell>{h.subject}</TableCell>
                  <TableCell>{h.dueDate}</TableCell>
                  <TableCell>{h.maxMarks ?? "—"}</TableCell>
                  <TableCell>{statusBadge(h.submissions, h.total)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => setViewHw(h)}
                        data-ocid={`homework.view.button.${i + 1}`}
                      >
                        <Eye size={12} className="mr-1" /> Submissions
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        data-ocid={`homework.edit_button.${i + 1}`}
                      >
                        <Pencil size={12} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive"
                        onClick={() => setDeleteId(h.id)}
                        data-ocid={`homework.delete_button.${i + 1}`}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg" data-ocid="homework.dialog">
          <DialogHeader>
            <DialogTitle>Create Homework</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                data-ocid="homework.title.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label>Class *</Label>
                <Select
                  value={form.cls}
                  onValueChange={(v) => setForm((p) => ({ ...p, cls: v }))}
                >
                  <SelectTrigger data-ocid="homework.form.class.select">
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
              </div>
              <div className="grid gap-1">
                <Label>Section *</Label>
                <Select
                  value={form.section}
                  onValueChange={(v) => setForm((p) => ({ ...p, section: v }))}
                >
                  <SelectTrigger data-ocid="homework.form.section.select">
                    <SelectValue placeholder="Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label>Subject *</Label>
                <Select
                  value={form.subject}
                  onValueChange={(v) => setForm((p) => ({ ...p, subject: v }))}
                >
                  <SelectTrigger data-ocid="homework.form.subject.select">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, dueDate: e.target.value }))
                  }
                  data-ocid="homework.due_date.input"
                />
              </div>
            </div>
            <div className="grid gap-1">
              <Label>Max Marks (optional)</Label>
              <Input
                type="number"
                value={form.maxMarks}
                onChange={(e) =>
                  setForm((p) => ({ ...p, maxMarks: e.target.value }))
                }
                data-ocid="homework.marks.input"
              />
            </div>
            <div className="grid gap-1">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                data-ocid="homework.description.textarea"
              />
            </div>
            <div className="grid gap-1">
              <Label>Attach File (optional)</Label>
              <label className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 hover:bg-muted transition-colors">
                <Paperclip size={14} />
                <span className="text-sm text-muted-foreground">
                  {form.fileName || "Choose file..."}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      fileName: e.target.files?.[0]?.name ?? "",
                    }))
                  }
                />
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              data-ocid="homework.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} data-ocid="homework.submit_button">
              Save Homework
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submissions Sheet */}
      <Sheet open={!!viewHw} onOpenChange={() => setViewHw(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{viewHw?.title}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {viewHw?.cls}-{viewHw?.section} • {viewHw?.subject}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => {
                  const pending = mockSubmissions.filter((s) => !s.submitted);
                  window.open(
                    `https://wa.me/?text=Reminder: Please submit homework '${viewHw?.title}' for ${pending.length} pending students`,
                    "_blank",
                  );
                  toast.success(
                    `Reminder sent to ${pending.length} pending students`,
                  );
                }}
                data-ocid="homework.reminder.button"
              >
                <MessageCircle size={14} /> Send Reminder
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubmissions.map((s) => (
                  <TableRow key={s.name}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>
                      {s.submitted ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          Yes
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">{s.at ?? "—"}</TableCell>
                    <TableCell>{s.marks ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          s.status === "Graded"
                            ? "default"
                            : s.status === "Submitted"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {s.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent data-ocid="homework.delete.dialog">
          <DialogHeader>
            <DialogTitle>Delete Homework?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="homework.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setHomework((p) => p.filter((h) => h.id !== deleteId));
                setDeleteId(null);
                toast.success("Homework deleted");
              }}
              data-ocid="homework.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
