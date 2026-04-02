import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CLASSES, SECTIONS } from "@/data/classConfig";
import { BookOpenCheck, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface LessonPlan {
  id: string;
  subject: string;
  class: string;
  date: string;
  period: number;
  topic: string;
  objectives: string;
  method: string;
  resources: string;
  completed: boolean;
}

const initialPlans: LessonPlan[] = [
  {
    id: "lp1",
    subject: "Mathematics",
    class: "10-A",
    date: "2026-11-25",
    period: 1,
    topic: "Quadratic Equations",
    objectives: "Solve using factorization and formula",
    method: "Lecture",
    resources: "Textbook Ch.4, whiteboard",
    completed: false,
  },
  {
    id: "lp2",
    subject: "Physics",
    class: "9-B",
    date: "2026-11-25",
    period: 3,
    topic: "Newton's Laws of Motion",
    objectives: "Understand all three laws with examples",
    method: "Demonstration",
    resources: "Lab equipment, video",
    completed: true,
  },
  {
    id: "lp3",
    subject: "Chemistry",
    class: "8-A",
    date: "2026-11-26",
    period: 2,
    topic: "Atomic Structure",
    objectives: "Draw Bohr model, identify subatomic particles",
    method: "Discussion",
    resources: "Diagrams, periodic table",
    completed: false,
  },
  {
    id: "lp4",
    subject: "Mathematics",
    class: "10-A",
    date: "2026-11-27",
    period: 1,
    topic: "Coordinate Geometry",
    objectives: "Plot points and find distance",
    method: "Practice",
    resources: "Graph paper",
    completed: false,
  },
  {
    id: "lp5",
    subject: "Biology",
    class: "9-B",
    date: "2026-11-27",
    period: 4,
    topic: "Cell Division",
    objectives: "Differentiate mitosis and meiosis",
    method: "Lecture",
    resources: "Biology textbook Ch.6",
    completed: true,
  },
  {
    id: "lp6",
    subject: "Physics",
    class: "10-A",
    date: "2026-11-28",
    period: 2,
    topic: "Work and Energy",
    objectives: "Apply work-energy theorem",
    method: "Practice",
    resources: "Practice worksheet",
    completed: false,
  },
  {
    id: "lp7",
    subject: "Chemistry",
    class: "9-B",
    date: "2026-11-28",
    period: 3,
    topic: "Chemical Bonding",
    objectives: "Explain ionic and covalent bonds",
    method: "Lecture",
    resources: "Model kits",
    completed: false,
  },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DATE_MAP: Record<string, string> = {
  "2026-11-25": "Mon",
  "2026-11-26": "Tue",
  "2026-11-27": "Wed",
  "2026-11-28": "Thu",
  "2026-11-29": "Fri",
  "2026-11-30": "Sat",
};

export function LessonPlanPage() {
  const [plans, setPlans] = useState<LessonPlan[]>(initialPlans);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    class: "",
    section: "",
    date: "",
    period: "",
    topic: "",
    objectives: "",
    method: "Lecture",
    resources: "",
  });

  const completed = plans.filter((p) => p.completed).length;
  const pending = plans.length - completed;

  const toggleCompleted = (id: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p)),
    );
  };

  const handleSubmit = () => {
    if (!form.subject || !form.class || !form.date || !form.topic) {
      toast.error("Please fill subject, class, date, and topic.");
      return;
    }
    const newPlan: LessonPlan = {
      id: `lp${Date.now()}`,
      subject: form.subject,
      class: form.class,
      date: form.date,
      period: Number(form.period) || 1,
      topic: form.topic,
      objectives: form.objectives,
      method: form.method,
      resources: form.resources,
      completed: false,
    };
    setPlans((prev) => [...prev, newPlan]);
    toast.success("Lesson plan added!");
    setOpen(false);
    setForm({
      subject: "",
      class: "",
      section: "",
      date: "",
      period: "",
      topic: "",
      objectives: "",
      method: "Lecture",
      resources: "",
    });
  };

  // Build week grid
  const grid: Record<string, Record<number, LessonPlan>> = {};
  for (const day of DAYS) grid[day] = {};
  for (const plan of plans) {
    const day = DATE_MAP[plan.date];
    if (day) grid[day][plan.period] = plan;
  }

  return (
    <div className="space-y-6" data-ocid="lesson_plan.page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpenCheck className="text-primary" size={24} />
          <h1 className="text-2xl font-bold text-foreground">Lesson Plans</h1>
        </div>
        <Button
          onClick={() => setOpen(true)}
          data-ocid="lesson_plan.open_modal_button"
        >
          <Plus size={16} className="mr-2" /> Add Lesson Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Plans",
            value: plans.length,
            color: "bg-blue-500/10 text-blue-600",
          },
          {
            label: "Completed",
            value: completed,
            color: "bg-green-500/10 text-green-600",
          },
          {
            label: "Pending",
            value: pending,
            color: "bg-orange-500/10 text-orange-600",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-2xl p-4 text-center"
          >
            <p className={`text-3xl font-bold ${s.color} rounded-xl py-1`}>
              {s.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Week Grid */}
      <div className="bg-card border border-border rounded-2xl p-4 overflow-x-auto">
        <h2 className="text-base font-semibold text-foreground mb-3">
          Week View (Nov 25–30)
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-muted-foreground font-medium p-2 w-16">
                Period
              </th>
              {DAYS.map((d) => (
                <th
                  key={d}
                  className="text-center text-muted-foreground font-medium p-2"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6].map((p) => (
              <tr key={p} className="border-t border-border">
                <td className="p-2 text-muted-foreground font-medium">P{p}</td>
                {DAYS.map((d) => {
                  const plan = grid[d]?.[p];
                  return (
                    <td key={d} className="p-1">
                      {plan ? (
                        <div
                          className={`rounded-lg p-1.5 text-xs font-medium ${
                            plan.completed
                              ? "bg-green-500/15 text-green-700 dark:text-green-400"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          <p className="truncate">{plan.subject}</p>
                          <p className="text-xs opacity-75 truncate">
                            {plan.class}
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-lg p-1.5 text-xs text-muted-foreground/40">
                          —
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Plan List */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">All Plans</h2>
        {plans.map((plan, i) => (
          <div
            key={plan.id}
            data-ocid={`lesson_plan.item.${i + 1}`}
            className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4"
          >
            <Checkbox
              checked={plan.completed}
              onCheckedChange={() => toggleCompleted(plan.id)}
              data-ocid={`lesson_plan.checkbox.${i + 1}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-semibold text-foreground">
                  {plan.topic}
                </span>
                <Badge variant={plan.completed ? "default" : "secondary"}>
                  {plan.completed ? "Completed" : "Pending"}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span>{plan.subject}</span>
                <span>Class {plan.class}</span>
                <span>{plan.date}</span>
                <span>Period {plan.period}</span>
                <span>{plan.method}</span>
              </div>
              {plan.objectives && (
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.objectives}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="lesson_plan.dialog">
          <DialogHeader>
            <DialogTitle>Add Lesson Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Subject</Label>
                <Input
                  value={form.subject}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  data-ocid="lesson_plan.subject.input"
                />
              </div>
              <div className="space-y-1">
                <Label>Class</Label>
                <Select
                  value={form.class}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, class: v, section: "" }))
                  }
                >
                  <SelectTrigger data-ocid="lesson_plan.class.select">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {CLASSES.map((c) => (
                      <SelectItem key={c} value={c}>
                        Class {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Section</Label>
                <Select
                  value={form.section}
                  onValueChange={(v) => setForm((f) => ({ ...f, section: v }))}
                  disabled={!form.class}
                >
                  <SelectTrigger data-ocid="lesson_plan.section.select">
                    <SelectValue placeholder="Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {(form.class === "XI" || form.class === "XII"
                      ? [...SECTIONS, "Science", "Commerce", "Arts"]
                      : SECTIONS
                    ).map((s) => (
                      <SelectItem key={s} value={s}>
                        Section {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  data-ocid="lesson_plan.date.input"
                />
              </div>
              <div className="space-y-1">
                <Label>Period (1–8)</Label>
                <Input
                  type="number"
                  min={1}
                  max={8}
                  value={form.period}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, period: e.target.value }))
                  }
                  data-ocid="lesson_plan.period.input"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Topic</Label>
              <Input
                value={form.topic}
                onChange={(e) =>
                  setForm((f) => ({ ...f, topic: e.target.value }))
                }
                data-ocid="lesson_plan.topic.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Objectives</Label>
              <Textarea
                value={form.objectives}
                onChange={(e) =>
                  setForm((f) => ({ ...f, objectives: e.target.value }))
                }
                data-ocid="lesson_plan.objectives.textarea"
              />
            </div>
            <div className="space-y-1">
              <Label>Method</Label>
              <Select
                value={form.method}
                onValueChange={(v) => setForm((f) => ({ ...f, method: v }))}
              >
                <SelectTrigger data-ocid="lesson_plan.method.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Lecture",
                    "Demonstration",
                    "Discussion",
                    "Practice",
                    "Field Trip",
                  ].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Resources</Label>
              <Input
                value={form.resources}
                onChange={(e) =>
                  setForm((f) => ({ ...f, resources: e.target.value }))
                }
                data-ocid="lesson_plan.resources.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              data-ocid="lesson_plan.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              data-ocid="lesson_plan.submit_button"
            >
              Add Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
