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
import { CLASSES, SECTIONS } from "@/data/classConfig";
import { mockStudents } from "@/data/mockStudents";
import { ClipboardList, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Exam = {
  id: number;
  name: string;
  class: string;
  date: string;
  subject: string;
  maxMarks: number;
  status: string;
};

const initialExams: Exam[] = [
  {
    id: 1,
    name: "Unit Test 1",
    class: "VIII",
    date: "2026-08-15",
    subject: "Mathematics",
    maxMarks: 25,
    status: "Completed",
  },
  {
    id: 2,
    name: "Half Yearly",
    class: "VIII",
    date: "2026-09-20",
    subject: "All Subjects",
    maxMarks: 100,
    status: "Completed",
  },
  {
    id: 3,
    name: "Unit Test 2",
    class: "VIII",
    date: "2026-10-18",
    subject: "Science",
    maxMarks: 25,
    status: "Upcoming",
  },
  {
    id: 4,
    name: "Annual Exam",
    class: "VIII",
    date: "2027-03-10",
    subject: "All Subjects",
    maxMarks: 100,
    status: "Upcoming",
  },
  {
    id: 5,
    name: "Unit Test 1",
    class: "IX",
    date: "2026-08-16",
    subject: "Mathematics",
    maxMarks: 25,
    status: "Completed",
  },
  {
    id: 6,
    name: "Half Yearly",
    class: "IX",
    date: "2026-09-22",
    subject: "All Subjects",
    maxMarks: 100,
    status: "Completed",
  },
];

const emptyForm = { name: "", class: "", subject: "", date: "", maxMarks: "" };

export function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const [marksEntry, setMarksEntry] = useState<
    Record<string, Record<string, string>>
  >({});
  const [marksErrors, setMarksErrors] = useState<
    Record<string, Record<string, string>>
  >({});
  const [expandedExam, setExpandedExam] = useState<number | null>(null);
  const [examSectionFilter, setExamSectionFilter] = useState<
    Record<number, string>
  >({});
  const [maxMarksError, setMaxMarksError] = useState("");

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function openAdd() {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(exam: Exam) {
    setEditId(exam.id);
    setForm({
      name: exam.name,
      class: exam.class,
      subject: exam.subject,
      date: exam.date,
      maxMarks: String(exam.maxMarks),
    });
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (
      !form.name ||
      !form.class ||
      !form.subject ||
      !form.date ||
      !form.maxMarks
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    if (editId !== null) {
      setExams((prev) =>
        prev.map((e) =>
          e.id === editId
            ? { ...e, ...form, maxMarks: Number(form.maxMarks) }
            : e,
        ),
      );
      toast.success("Exam updated successfully!");
    } else {
      const newExam: Exam = {
        id: Date.now(),
        ...form,
        maxMarks: Number(form.maxMarks),
        status: "Upcoming",
      };
      setExams((prev) => [...prev, newExam]);
      toast.success("Exam scheduled successfully!");
    }
    setDialogOpen(false);
  }

  function handleDelete(id: number, name: string) {
    if (window.confirm(`Delete exam "${name}"?`)) {
      setExams((prev) => prev.filter((e) => e.id !== id));
      toast.success("Exam deleted.");
    }
  }

  return (
    <div className="space-y-5" data-ocid="exams.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Examinations</h1>
          <p className="text-muted-foreground text-sm">
            Manage exams and results
          </p>
        </div>
        <Button onClick={openAdd} data-ocid="exams.add.button">
          <Plus size={16} className="mr-1" /> Schedule Exam
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((e, i) => (
          <div key={e.id} className="col-span-1">
            <div
              className="bg-card border border-border rounded-2xl p-5"
              data-ocid={`exams.item.${i + 1}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {e.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Class {e.class} · {e.subject}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={e.status === "Completed" ? "secondary" : "default"}
                    className="text-xs"
                  >
                    {e.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() =>
                      setExpandedExam(expandedExam === e.id ? null : e.id)
                    }
                    data-ocid={`exams.enter_marks.button.${i + 1}`}
                  >
                    Enter Marks
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => openEdit(e)}
                    data-ocid={`exams.edit_button.${i + 1}`}
                  >
                    <Pencil size={13} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(e.id, e.name)}
                    data-ocid={`exams.delete_button.${i + 1}`}
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                <span>
                  Date: <span className="text-foreground">{e.date}</span>
                </span>
                <span>
                  Max Marks:{" "}
                  <span className="text-foreground">{e.maxMarks}</span>
                </span>
              </div>
            </div>
            {expandedExam === e.id && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h4 className="text-sm font-semibold">
                    Marks Entry — {e.name}
                  </h4>
                  <select
                    value={examSectionFilter[e.id] ?? "all"}
                    onChange={(ev) =>
                      setExamSectionFilter((prev) => ({
                        ...prev,
                        [e.id]: ev.target.value,
                      }))
                    }
                    className="h-8 px-2 rounded border border-input bg-background text-xs"
                    data-ocid="exams.section_filter.select"
                  >
                    <option value="all">All Sections</option>
                    {(e.class === "XI" || e.class === "XII"
                      ? [...SECTIONS, "Science", "Commerce", "Arts"]
                      : SECTIONS
                    ).map((s) => (
                      <option key={s} value={s}>
                        Section {s}
                      </option>
                    ))}
                  </select>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground text-xs">
                      <th className="pb-2">Student</th>
                      <th className="pb-2">Max Marks</th>
                      <th className="pb-2">Obtained Marks</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStudents
                      .filter((s) => {
                        if (s.className !== e.class) return false;
                        const sec = examSectionFilter[e.id] ?? "all";
                        if (sec !== "all" && s.section !== sec) return false;
                        return true;
                      })
                      .slice(0, 10)
                      .map((s) => {
                        const val = marksEntry[e.id]?.[s.id] ?? "";
                        const err = marksErrors[e.id]?.[s.id] ?? "";
                        const maxM = Number.parseInt(String(e.maxMarks)) || 100;
                        return (
                          <tr key={s.id} className="border-t">
                            <td className="py-2">{s.name}</td>
                            <td className="py-2">{e.maxMarks}</td>
                            <td className="py-2">
                              <input
                                type="number"
                                min={0}
                                max={maxM}
                                value={val}
                                className={`border rounded px-2 py-1 w-24 text-sm bg-background ${
                                  err ? "border-red-500 focus:ring-red-500" : ""
                                }`}
                                onChange={(ev) => {
                                  const v = ev.target.value;
                                  const num = Number.parseFloat(v);
                                  setMarksEntry((prev) => ({
                                    ...prev,
                                    [e.id]: {
                                      ...(prev[e.id] ?? {}),
                                      [s.id]: v,
                                    },
                                  }));
                                  if (v !== "" && (num < 0 || num > maxM)) {
                                    toast.error(
                                      num < 0
                                        ? "Marks cannot be negative"
                                        : `Marks cannot exceed maximum (${maxM})`,
                                    );
                                    setMarksErrors((prev) => ({
                                      ...prev,
                                      [e.id]: {
                                        ...(prev[e.id] ?? {}),
                                        [s.id]: `Must be 0\u2013${maxM}`,
                                      },
                                    }));
                                  } else {
                                    setMarksErrors((prev) => {
                                      const n = { ...prev };
                                      if (n[e.id]) delete n[e.id][s.id];
                                      return n;
                                    });
                                  }
                                }}
                              />
                              {err && (
                                <span className="text-xs text-red-500 ml-1">
                                  {err}
                                </span>
                              )}
                            </td>
                            <td className="py-2">
                              {val !== "" && !err ? (
                                Number.parseFloat(val) >= maxM * 0.33 ? (
                                  <span className="text-green-600 text-xs font-medium">
                                    Pass
                                  </span>
                                ) : (
                                  <span className="text-red-500 text-xs font-medium">
                                    Fail
                                  </span>
                                )
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    toast.success("Marks saved successfully");
                    setExpandedExam(null);
                  }}
                >
                  Save Marks
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="exams.dialog">
          <DialogHeader>
            <DialogTitle>
              {editId !== null ? "Edit Exam" : "Schedule New Exam"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Exam Name</Label>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Unit Test 1"
                data-ocid="exams.name.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Class</Label>
                <select
                  value={form.class}
                  onChange={(e) => update("class", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  data-ocid="exams.class.select"
                >
                  <option value="">Select Class</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Subject</Label>
                <Input
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="e.g. Mathematics"
                  data-ocid="exams.subject.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  data-ocid="exams.date.input"
                />
              </div>
              <div className="space-y-1">
                <Label>Max Marks</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.maxMarks}
                  onChange={(e) => {
                    const val = e.target.value;
                    update("maxMarks", val);
                    if (val && Number.parseInt(val) < 1) {
                      setMaxMarksError("Max marks must be at least 1");
                    } else {
                      setMaxMarksError("");
                    }
                  }}
                  placeholder="100"
                  data-ocid="exams.maxmarks.input"
                />
                {maxMarksError && (
                  <p className="text-xs text-red-500 mt-1">{maxMarksError}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="exams.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} data-ocid="exams.submit_button">
              {editId !== null ? "Save Changes" : "Schedule Exam"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
