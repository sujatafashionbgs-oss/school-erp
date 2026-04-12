import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { mockStaff } from "@/data/mockStaff";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Edit2,
  KanbanSquare,
  List,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Reference date for "overdue" detection
const REFERENCE_DATE = new Date("2026-10-12");

type Priority = "High" | "Medium" | "Low";
type Status = "To Do" | "In Progress" | "Done";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  linkedEvent: string;
}

const UPCOMING_EVENTS = [
  "Annual Sports Day - 2026-12-15",
  "Parent-Teacher Meeting - 2026-11-20",
  "Annual Day - 2027-01-15",
  "Board Exam Prep - 2026-11-01",
  "Science Exhibition - 2026-12-01",
];

const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    title: "Prepare Annual Day decoration checklist",
    description: "List all items needed for stage decoration and props",
    assignedTo: "Priya Singh",
    dueDate: "2026-11-15",
    priority: "High",
    status: "To Do",
    linkedEvent: "Annual Day - 2027-01-15",
  },
  {
    id: "t2",
    title: "Update student health records database",
    description: "Verify and update vaccination records for all Classes 1-5",
    assignedTo: "Amit Kumar",
    dueDate: "2026-10-20",
    priority: "Medium",
    status: "In Progress",
    linkedEvent: "",
  },
  {
    id: "t3",
    title: "Submit timetable for Q3",
    description:
      "Final timetable for all sections to be submitted to principal",
    assignedTo: "Ravi Gupta",
    dueDate: "2026-09-30",
    priority: "High",
    status: "Done",
    linkedEvent: "",
  },
  {
    id: "t4",
    title: "Coordinate sports equipment order",
    description: "Order new cricket bats, footballs, and track equipment",
    assignedTo: "Rajesh Verma",
    dueDate: "2026-11-01",
    priority: "Medium",
    status: "To Do",
    linkedEvent: "Annual Sports Day - 2026-12-15",
  },
  {
    id: "t5",
    title: "Prepare PTM parent notification letter",
    description: "Draft letter to send home with students 2 weeks before PTM",
    assignedTo: "Sunita Patel",
    dueDate: "2026-11-05",
    priority: "High",
    status: "To Do",
    linkedEvent: "Parent-Teacher Meeting - 2026-11-20",
  },
  {
    id: "t6",
    title: "Review lab safety protocols",
    description: "Annual review of chemistry and physics lab safety guidelines",
    assignedTo: "Anita Nair",
    dueDate: "2026-10-10",
    priority: "High",
    status: "Done",
    linkedEvent: "",
  },
  {
    id: "t7",
    title: "Library inventory audit",
    description:
      "Count and catalogue all books, identify missing/damaged items",
    assignedTo: "Sanjay Sharma",
    dueDate: "2026-10-05",
    priority: "Low",
    status: "Done",
    linkedEvent: "",
  },
  {
    id: "t8",
    title: "Prepare board exam practice schedule",
    description: "Design 6-week study plan for Class X and XII",
    assignedTo: "Priya Singh",
    dueDate: "2026-10-31",
    priority: "High",
    status: "In Progress",
    linkedEvent: "Board Exam Prep - 2026-11-01",
  },
  {
    id: "t9",
    title: "Organize science exhibition participants",
    description:
      "Register students and assign project categories for exhibition",
    assignedTo: "Ravi Gupta",
    dueDate: "2026-11-20",
    priority: "Medium",
    status: "To Do",
    linkedEvent: "Science Exhibition - 2026-12-01",
  },
  {
    id: "t10",
    title: "Update alumni contact records",
    description: "Contact 2025 batch alumni and update LinkedIn profiles",
    assignedTo: "Amit Kumar",
    dueDate: "2026-10-08",
    priority: "Low",
    status: "In Progress",
    linkedEvent: "",
  },
  {
    id: "t11",
    title: "Review fee concession applications",
    description: "Evaluate 12 pending scholarship and concession applications",
    assignedTo: "Rajesh Verma",
    dueDate: "2026-09-25",
    priority: "High",
    status: "Done",
    linkedEvent: "",
  },
  {
    id: "t12",
    title: "Conduct fire drill coordination",
    description: "Plan and execute monthly fire safety drill for all students",
    assignedTo: "Sunita Patel",
    dueDate: "2026-10-30",
    priority: "Medium",
    status: "To Do",
    linkedEvent: "",
  },
];

const TEACHER_NAME = "Amit Kumar";

function isOverdue(dueDate: string, status: Status): boolean {
  if (status === "Done") return false;
  return new Date(dueDate) < REFERENCE_DATE;
}

function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === "High")
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
        High
      </Badge>
    );
  if (priority === "Medium")
    return (
      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
        Medium
      </Badge>
    );
  return (
    <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
      Low
    </Badge>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "To Do")
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
        To Do
      </Badge>
    );
  if (status === "In Progress")
    return (
      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
        In Progress
      </Badge>
    );
  return (
    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
      Done
    </Badge>
  );
}

function AvatarInitial({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex-shrink-0">
      {initials}
    </span>
  );
}

const STATUS_SEQUENCE: Status[] = ["To Do", "In Progress", "Done"];

interface TaskFormState {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: Priority;
  linkedEvent: string;
}

const EMPTY_FORM: TaskFormState = {
  title: "",
  description: "",
  assignedTo: "",
  dueDate: "",
  priority: "Medium",
  linkedEvent: "",
};

function TaskDialog({
  open,
  onClose,
  onSave,
  initial,
  mode,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: TaskFormState) => void;
  initial: TaskFormState;
  mode: "add" | "edit";
}) {
  const [form, setForm] = useState<TaskFormState>(initial);

  // Sync form when dialog opens with new initial values
  const handleOpenChange = (o: boolean) => {
    if (!o) onClose();
  };

  // Reset when initial changes (new open)
  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function set(field: keyof TaskFormState, val: string) {
    setForm((p) => ({ ...p, [field]: val }));
  }

  function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.assignedTo) {
      toast.error("Please assign this task to a staff member");
      return;
    }
    onSave(form);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              data-ocid="task-title-input"
              placeholder="Task title..."
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              data-ocid="task-description-input"
              placeholder="Brief description..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>
                Assign To <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.assignedTo}
                onValueChange={(v) => set("assignedTo", v)}
              >
                <SelectTrigger data-ocid="task-assignee-select">
                  <SelectValue placeholder="Select staff..." />
                </SelectTrigger>
                <SelectContent>
                  {mockStaff.map((s) => (
                    <SelectItem key={s.id} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Due Date</Label>
              <Input
                data-ocid="task-duedate-input"
                type="date"
                value={form.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => set("priority", v as Priority)}
              >
                <SelectTrigger data-ocid="task-priority-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Link to Event</Label>
              <Select
                value={form.linkedEvent || "__none__"}
                onValueChange={(v) =>
                  set("linkedEvent", v === "__none__" ? "" : v)
                }
              >
                <SelectTrigger data-ocid="task-event-select">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {UPCOMING_EVENTS.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button data-ocid="task-save-btn" onClick={handleSave}>
            {mode === "add" ? "Add Task" : "Update Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TaskCard({
  task,
  onEdit,
  onDelete,
  onMove,
  isAdmin,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: "left" | "right") => void;
  isAdmin: boolean;
}) {
  const idx = STATUS_SEQUENCE.indexOf(task.status);
  const canMoveLeft = idx > 0;
  const canMoveRight = idx < STATUS_SEQUENCE.length - 1;
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      data-ocid={`task-card-${task.id}`}
      className="bg-card border border-border rounded-lg p-3 space-y-2 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-sm text-foreground leading-tight line-clamp-2">
          {task.title}
        </p>
        <PriorityBadge priority={task.priority} />
      </div>
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-1">
          {task.description}
        </p>
      )}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <AvatarInitial name={task.assignedTo} />
        <span className="truncate">{task.assignedTo}</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {task.dueDate && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={11} />
            {task.dueDate}
          </span>
        )}
        {overdue && (
          <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] px-1.5 py-0">
            Overdue
          </Badge>
        )}
      </div>
      {task.linkedEvent && (
        <p className="text-[11px] text-primary bg-primary/8 px-2 py-0.5 rounded-full inline-block max-w-full truncate">
          📅 {task.linkedEvent}
        </p>
      )}
      <div className="flex items-center justify-between pt-1 border-t border-border/50">
        <div className="flex gap-1">
          <button
            type="button"
            data-ocid={`task-move-left-${task.id}`}
            disabled={!canMoveLeft}
            onClick={() => onMove(task.id, "left")}
            className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground transition-colors"
            title="Move left"
            aria-label="Move task left"
          >
            <ArrowLeft size={13} />
          </button>
          <button
            type="button"
            data-ocid={`task-move-right-${task.id}`}
            disabled={!canMoveRight}
            onClick={() => onMove(task.id, "right")}
            className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground transition-colors"
            title="Move right"
            aria-label="Move task right"
          >
            <ArrowRight size={13} />
          </button>
        </div>
        {(isAdmin || true) && (
          <div className="flex gap-1">
            <button
              type="button"
              data-ocid={`task-edit-${task.id}`}
              onClick={() => onEdit(task)}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Edit task"
              aria-label="Edit task"
            >
              <Edit2 size={13} />
            </button>
            <button
              type="button"
              data-ocid={`task-delete-${task.id}`}
              onClick={() => onDelete(task.id)}
              className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
              title="Delete task"
              aria-label="Delete task"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const COLUMN_CONFIG: {
  status: Status;
  label: string;
  headerClass: string;
  icon: React.ReactNode;
}[] = [
  {
    status: "To Do",
    label: "To Do",
    headerClass: "bg-blue-600",
    icon: <Circle size={14} />,
  },
  {
    status: "In Progress",
    label: "In Progress",
    headerClass: "bg-yellow-500",
    icon: <Loader2 size={14} />,
  },
  {
    status: "Done",
    label: "Done",
    headerClass: "bg-green-600",
    icon: <CheckCircle2 size={14} />,
  },
];

export function TasksPage() {
  const isAdmin = !window.location.hash.startsWith("#/teacher/");
  const basePath = isAdmin ? "/admin" : "/teacher";

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [filterAssignee, setFilterAssignee] = useState("__all__");
  const [filterPriority, setFilterPriority] = useState("__all__");
  const [filterStatus, setFilterStatus] = useState("__all__");
  const [filterDueFrom, setFilterDueFrom] = useState("");
  const [filterDueTo, setFilterDueTo] = useState("");
  const [myTasksOnly, setMyTasksOnly] = useState(!isAdmin);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [dialogInitial, setDialogInitial] = useState<TaskFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const allAssignees = Array.from(
    new Set(tasks.map((t) => t.assignedTo)),
  ).sort();

  const filtered = tasks.filter((t) => {
    if (myTasksOnly && t.assignedTo !== TEACHER_NAME) return false;
    if (filterAssignee !== "__all__" && t.assignedTo !== filterAssignee)
      return false;
    if (filterPriority !== "__all__" && t.priority !== filterPriority)
      return false;
    if (filterStatus !== "__all__" && t.status !== filterStatus) return false;
    if (filterDueFrom && t.dueDate < filterDueFrom) return false;
    if (filterDueTo && t.dueDate > filterDueTo) return false;
    return true;
  });

  const counts = {
    todo: tasks.filter((t) => t.status === "To Do").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    done: tasks.filter((t) => t.status === "Done").length,
    overdue: tasks.filter((t) => isOverdue(t.dueDate, t.status)).length,
  };

  function openAdd() {
    setDialogMode("add");
    setDialogInitial(EMPTY_FORM);
    setEditingId(null);
    setDialogOpen(true);
  }

  function openEdit(task: Task) {
    setDialogMode("edit");
    setDialogInitial({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      priority: task.priority,
      linkedEvent: task.linkedEvent,
    });
    setEditingId(task.id);
    setDialogOpen(true);
  }

  function handleSave(form: TaskFormState) {
    if (dialogMode === "add") {
      const newTask: Task = {
        id: `t${Date.now()}`,
        ...form,
        status: "To Do",
      };
      setTasks((prev) => [...prev, newTask]);
      toast.success("Task added successfully");
    } else if (editingId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...form } : t)),
      );
      toast.success("Task updated successfully");
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    setDeleteId(id);
  }

  function confirmDelete() {
    if (deleteId) {
      setTasks((prev) => prev.filter((t) => t.id !== deleteId));
      toast.success("Task deleted");
      setDeleteId(null);
    }
  }

  function handleMove(id: string, dir: "left" | "right") {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const idx = STATUS_SEQUENCE.indexOf(t.status);
        const newIdx = dir === "left" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= STATUS_SEQUENCE.length) return t;
        return { ...t, status: STATUS_SEQUENCE[newIdx] };
      }),
    );
  }

  function moveStatus(id: string, status: Status) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    toast.success(`Task moved to ${status}`);
  }

  const breadcrumbBase = isAdmin ? "Dashboard" : "Dashboard";

  return (
    <div className="space-y-5">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <a
          href={`#${basePath}/dashboard`}
          className="hover:text-foreground transition-colors"
          data-ocid="breadcrumb-dashboard"
        >
          {breadcrumbBase}
        </a>
        <span>/</span>
        <span className="text-foreground font-medium">Tasks</span>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task List</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? "Manage and track all staff tasks"
              : "Your assigned tasks and reminders"}
          </p>
        </div>
        <Button data-ocid="add-task-btn" onClick={openAdd} className="gap-2">
          <Plus size={16} />
          Add Task
        </Button>
      </div>

      {/* Summary Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge
          data-ocid="badge-todo"
          className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 text-sm"
        >
          <Circle size={12} className="mr-1.5" />
          {counts.todo} To Do
        </Badge>
        <Badge
          data-ocid="badge-inprogress"
          className="bg-yellow-100 text-yellow-700 border-yellow-200 px-3 py-1 text-sm"
        >
          <Loader2 size={12} className="mr-1.5" />
          {counts.inProgress} In Progress
        </Badge>
        <Badge
          data-ocid="badge-done"
          className="bg-green-100 text-green-700 border-green-200 px-3 py-1 text-sm"
        >
          <CheckCircle2 size={12} className="mr-1.5" />
          {counts.done} Done
        </Badge>
        {counts.overdue > 0 && (
          <Badge
            data-ocid="badge-overdue"
            className="bg-red-100 text-red-700 border-red-200 px-3 py-1 text-sm"
          >
            {counts.overdue} Overdue
          </Badge>
        )}
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-xl p-3">
        {/* View Toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            type="button"
            data-ocid="view-kanban-btn"
            onClick={() => setView("kanban")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "kanban"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
            aria-pressed={view === "kanban"}
          >
            <KanbanSquare size={14} />
            Kanban
          </button>
          <button
            type="button"
            data-ocid="view-list-btn"
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors border-l border-border ${
              view === "list"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
            aria-pressed={view === "list"}
          >
            <List size={14} />
            List
          </button>
        </div>

        {/* Assignee filter — admin only */}
        {isAdmin && (
          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger
              data-ocid="filter-assignee"
              className="w-[160px] h-8 text-sm"
            >
              <SelectValue placeholder="By Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Assignees</SelectItem>
              {allAssignees.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger
            data-ocid="filter-priority"
            className="w-[130px] h-8 text-sm"
          >
            <SelectValue placeholder="By Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Priorities</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger
            data-ocid="filter-status"
            className="w-[130px] h-8 text-sm"
          >
            <SelectValue placeholder="By Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Statuses</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">
            From
          </Label>
          <Input
            data-ocid="filter-due-from"
            type="date"
            value={filterDueFrom}
            onChange={(e) => setFilterDueFrom(e.target.value)}
            className="h-8 w-[130px] text-sm"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">
            To
          </Label>
          <Input
            data-ocid="filter-due-to"
            type="date"
            value={filterDueTo}
            onChange={(e) => setFilterDueTo(e.target.value)}
            className="h-8 w-[130px] text-sm"
          />
        </div>

        {/* My Tasks toggle for teacher */}
        {!isAdmin && (
          <label className="flex items-center gap-2 cursor-pointer ml-auto">
            <input
              data-ocid="my-tasks-toggle"
              type="checkbox"
              checked={myTasksOnly}
              onChange={(e) => setMyTasksOnly(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm font-medium text-foreground">
              My Tasks Only
            </span>
          </label>
        )}
      </div>

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMN_CONFIG.map(({ status, label, headerClass, icon }) => {
            const colTasks = filtered.filter((t) => t.status === status);
            return (
              <div
                key={status}
                className="bg-muted/30 border border-border rounded-xl overflow-hidden"
              >
                <div
                  className={`${headerClass} text-white px-4 py-2.5 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    {icon}
                    {label}
                  </div>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">
                    {colTasks.length}
                  </span>
                </div>
                <div
                  className="p-3 space-y-3 min-h-[200px]"
                  data-ocid={`kanban-col-${status.toLowerCase().replace(" ", "-")}`}
                >
                  {colTasks.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-6">
                      No tasks
                    </p>
                  ) : (
                    colTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        onMove={handleMove}
                        isAdmin={isAdmin}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Assigned To
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Due Date
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Priority
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Linked Event
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No tasks match the current filters
                    </td>
                  </tr>
                ) : (
                  filtered.map((task) => {
                    const overdue = isOverdue(task.dueDate, task.status);
                    return (
                      <tr
                        key={task.id}
                        data-ocid={`task-row-${task.id}`}
                        className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div
                            className="font-medium text-foreground leading-tight max-w-[200px] truncate"
                            title={task.title}
                          >
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate">
                              {task.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <AvatarInitial name={task.assignedTo} />
                            <span className="text-foreground">
                              {task.assignedTo}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={
                                overdue
                                  ? "text-red-600 font-medium"
                                  : "text-foreground"
                              }
                            >
                              {task.dueDate || "—"}
                            </span>
                            {overdue && (
                              <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] px-1.5 py-0">
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={task.priority} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-muted-foreground truncate max-w-[140px] block">
                            {task.linkedEvent || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Select
                              value={task.status}
                              onValueChange={(v) =>
                                moveStatus(task.id, v as Status)
                              }
                            >
                              <SelectTrigger
                                data-ocid={`list-move-${task.id}`}
                                className="h-7 w-[110px] text-xs"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="To Do">To Do</SelectItem>
                                <SelectItem value="In Progress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="Done">Done</SelectItem>
                              </SelectContent>
                            </Select>
                            <button
                              type="button"
                              data-ocid={`list-edit-${task.id}`}
                              onClick={() => openEdit(task)}
                              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              data-ocid={`list-delete-${task.id}`}
                              onClick={() => handleDelete(task.id)}
                              className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                              aria-label="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Dialog */}
      {dialogOpen && (
        <TaskDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
          initial={dialogInitial}
          mode={dialogMode}
        />
      )}

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => {
          if (!o) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="delete-cancel-btn">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="delete-confirm-btn"
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
