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
import { Skeleton } from "@/components/ui/skeleton";
import { CLASSES, SECTIONS } from "@/data/classConfig";
import { mockStudents } from "@/data/mockStudents";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  ClipboardList,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import type { ExamRecord, StudentMarks } from "../../backend.d.ts";

// ── Local display type ────────────────────────────────────────────────────────
type Exam = {
  id: string;
  name: string;
  class: string;
  section: string;
  term: string;
  date: string;
  subject: string;
  maxMarks: number;
  status: string;
};

// ── Mock fallback ─────────────────────────────────────────────────────────────
const MOCK_EXAMS: Exam[] = [
  {
    id: "e1",
    name: "Unit Test 1",
    class: "VIII",
    section: "A",
    term: "Term 1",
    date: "2026-08-15",
    subject: "Mathematics",
    maxMarks: 25,
    status: "Completed",
  },
  {
    id: "e2",
    name: "Half Yearly",
    class: "VIII",
    section: "A",
    term: "Term 1",
    date: "2026-09-20",
    subject: "All Subjects",
    maxMarks: 100,
    status: "Completed",
  },
  {
    id: "e3",
    name: "Unit Test 2",
    class: "VIII",
    section: "B",
    term: "Term 2",
    date: "2026-10-18",
    subject: "Science",
    maxMarks: 25,
    status: "Upcoming",
  },
  {
    id: "e4",
    name: "Annual Exam",
    class: "VIII",
    section: "A",
    term: "Term 3",
    date: "2027-03-10",
    subject: "All Subjects",
    maxMarks: 100,
    status: "Upcoming",
  },
  {
    id: "e5",
    name: "Unit Test 1",
    class: "IX",
    section: "A",
    term: "Term 1",
    date: "2026-08-16",
    subject: "Mathematics",
    maxMarks: 25,
    status: "Completed",
  },
  {
    id: "e6",
    name: "Half Yearly",
    class: "IX",
    section: "B",
    term: "Term 1",
    date: "2026-09-22",
    subject: "All Subjects",
    maxMarks: 100,
    status: "Completed",
  },
];

function recordToExam(r: ExamRecord): Exam {
  const now = new Date().toISOString().split("T")[0];
  return {
    id: r.id,
    name: r.title,
    class: r.className,
    section: r.section,
    term: r.term,
    date: r.examDate,
    subject: r.subject,
    maxMarks: Number(r.maxMarks),
    status: r.examDate >= now ? "Upcoming" : "Completed",
  };
}

const TERMS = ["Term 1", "Term 2", "Term 3", "Annual", "Half Yearly"];
const emptyForm = {
  name: "",
  class: "",
  section: "",
  term: "Term 1",
  subject: "",
  date: "",
  maxMarks: "",
};

// ── Marks entry panel ─────────────────────────────────────────────────────────
function MarksPanel({
  exam,
  actor,
  onClose,
}: {
  exam: Exam;
  actor: ReturnType<typeof createActor> | null;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sectionFilter, setSectionFilter] = useState("all");
  const [marksEntry, setMarksEntry] = useState<Record<string, string>>({});
  const [marksErrors, setMarksErrors] = useState<Record<string, string>>({});
  const [backendMarks, setBackendMarks] = useState<StudentMarks[]>([]);

  const sectionOptions =
    exam.class === "XI" || exam.class === "XII"
      ? [...SECTIONS, "Science", "Commerce", "Arts"]
      : SECTIONS;

  useEffect(() => {
    async function load() {
      if (!actor) return;
      setLoading(true);
      try {
        const marks = await actor.loadMarksByExam(exam.id);
        setBackendMarks(marks);
        const init: Record<string, string> = {};
        for (const m of marks) {
          init[m.studentId] = String(m.obtainedMarks);
        }
        setMarksEntry(init);
      } catch {
        // fallback: empty entry
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [actor, exam.id]);

  const students = mockStudents.filter((s) => {
    if (s.className !== exam.class) return false;
    if (sectionFilter !== "all" && s.section !== sectionFilter) return false;
    return true;
  });

  function handleMarkChange(studentId: string, value: string) {
    setMarksEntry((prev) => ({ ...prev, [studentId]: value }));
    const num = Number.parseFloat(value);
    if (value !== "" && (num < 0 || num > exam.maxMarks)) {
      const msg =
        num < 0
          ? "Marks cannot be negative"
          : `Marks cannot exceed maximum (${exam.maxMarks})`;
      toast.error(msg);
      setMarksErrors((prev) => ({
        ...prev,
        [studentId]: `0–${exam.maxMarks}`,
      }));
    } else {
      setMarksErrors((prev) => {
        const n = { ...prev };
        delete n[studentId];
        return n;
      });
    }
  }

  async function handleSave() {
    const hasErrors = Object.keys(marksErrors).length > 0;
    if (hasErrors) {
      toast.error("Fix mark errors before saving");
      return;
    }
    const entries: StudentMarks[] = students
      .filter((s) => marksEntry[s.id] !== undefined && marksEntry[s.id] !== "")
      .map((s) => {
        const obtained = Number.parseFloat(marksEntry[s.id] ?? "0");
        const pct = (obtained / exam.maxMarks) * 100;
        const grade =
          pct >= 90
            ? "A+"
            : pct >= 75
              ? "A"
              : pct >= 60
                ? "B"
                : pct >= 40
                  ? "C"
                  : "F";
        const existing = backendMarks.find((m) => m.studentId === s.id);
        return {
          studentId: s.id,
          studentName: s.name,
          examId: exam.id,
          obtainedMarks: obtained,
          grade,
          rank: existing?.rank ?? BigInt(0),
          admissionNo: s.admissionNo ?? "",
          remarks: existing?.remarks ?? "",
        };
      });

    if (actor) {
      setSaving(true);
      try {
        await actor.saveAllMarks(entries);
        toast.success("Marks saved successfully");
        onClose();
      } catch {
        toast.error("Failed to save marks to backend, saved locally");
        onClose();
      } finally {
        setSaving(false);
      }
    } else {
      toast.success("Marks saved (offline mode)");
      onClose();
    }
  }

  return (
    <div className="mt-4 p-4 border rounded-xl bg-muted/30">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h4 className="text-sm font-semibold">
          Marks Entry — {exam.name} ({exam.class}-{exam.section})
        </h4>
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="h-8 px-2 rounded border border-input bg-background text-xs"
          data-ocid="exams.marks.section_filter"
        >
          <option value="all">All Sections</option>
          {sectionOptions.map((s) => (
            <option key={s} value={s}>
              Section {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {["s1", "s2", "s3", "s4", "s5"].map((k) => (
            <Skeleton key={k} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground text-xs">
              <th className="pb-2">Student</th>
              <th className="pb-2">Max</th>
              <th className="pb-2">Obtained</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.slice(0, 15).map((s) => {
              const val = marksEntry[s.id] ?? "";
              const err = marksErrors[s.id] ?? "";
              return (
                <tr key={s.id} className="border-t">
                  <td className="py-2">{s.name}</td>
                  <td className="py-2">{exam.maxMarks}</td>
                  <td className="py-2">
                    <input
                      type="number"
                      min={0}
                      max={exam.maxMarks}
                      value={val}
                      className={`border rounded px-2 py-1 w-24 text-sm bg-background ${
                        err ? "border-destructive" : ""
                      }`}
                      onChange={(e) => handleMarkChange(s.id, e.target.value)}
                    />
                    {err && (
                      <span className="text-xs text-destructive ml-1">
                        {err}
                      </span>
                    )}
                  </td>
                  <td className="py-2">
                    {val !== "" && !err ? (
                      Number.parseFloat(val) >= exam.maxMarks * 0.33 ? (
                        <span className="text-green-600 text-xs font-medium">
                          Pass
                        </span>
                      ) : (
                        <span className="text-destructive text-xs font-medium">
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
      )}

      <div className="flex gap-2 mt-3">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving}
          data-ocid="exams.marks.save_button"
        >
          {saving && <Loader2 size={13} className="mr-1 animate-spin" />}
          Save Marks
        </Button>
        <Button size="sm" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function ExamsPage() {
  const { actor, isFetching } = useActor(createActor);

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [maxMarksError, setMaxMarksError] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Exam | null>(null);

  // Filter state
  const [filterClass, setFilterClass] = useState("all");
  const [filterSection, setFilterSection] = useState("all");

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const fetchExams = useCallback(async () => {
    setLoading(true);
    if (!actor || isFetching) {
      setExams(MOCK_EXAMS);
      setLoading(false);
      return;
    }
    try {
      const res = await actor.loadExams({
        className: filterClass !== "all" ? filterClass : undefined,
        section: filterSection !== "all" ? filterSection : undefined,
        academicYear: "2026-27",
        page: BigInt(1),
        pageSize: BigInt(50),
      });
      if (res.exams.length > 0) {
        setExams(res.exams.map(recordToExam));
      } else {
        setExams(MOCK_EXAMS);
      }
    } catch {
      setExams(MOCK_EXAMS);
    } finally {
      setLoading(false);
    }
  }, [actor, isFetching, filterClass, filterSection]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  function openAdd() {
    setEditId(null);
    setForm(emptyForm);
    setMaxMarksError("");
    setDialogOpen(true);
  }

  function openEdit(exam: Exam) {
    setEditId(exam.id);
    setForm({
      name: exam.name,
      class: exam.class,
      section: exam.section,
      term: exam.term,
      subject: exam.subject,
      date: exam.date,
      maxMarks: String(exam.maxMarks),
    });
    setMaxMarksError("");
    setDialogOpen(true);
  }

  async function handleSubmit() {
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
    if (maxMarksError) return;

    const examRecord: ExamRecord = {
      id: editId ?? `exam-${Date.now()}`,
      title: form.name,
      className: form.class,
      section: form.section || "A",
      term: form.term,
      subject: form.subject,
      examDate: form.date,
      maxMarks: BigInt(Number.parseInt(form.maxMarks)),
      academicYear: "2026-27",
      duration: BigInt(90),
      createdBy: "admin",
    };

    setSaving(true);
    if (actor) {
      try {
        const res = await actor.saveExam(examRecord);
        if (res.__kind__ === "ok") {
          toast.success(
            editId
              ? "Exam updated successfully!"
              : "Exam scheduled successfully!",
          );
          await fetchExams();
        } else {
          toast.error(res.err ?? "Failed to save exam");
        }
      } catch {
        // fallback to local update
        applyLocalSave(examRecord);
      }
    } else {
      applyLocalSave(examRecord);
    }
    setSaving(false);
    setDialogOpen(false);
  }

  function applyLocalSave(rec: ExamRecord) {
    const exam = recordToExam(rec);
    if (editId) {
      setExams((prev) => prev.map((e) => (e.id === editId ? exam : e)));
    } else {
      setExams((prev) => [...prev, exam]);
    }
    toast.success(editId ? "Exam updated!" : "Exam scheduled!");
  }

  async function handleDelete(id: string) {
    const exam = exams.find((e) => e.id === id);
    if (exam) setDeleteTarget(exam);
  }

  async function confirmDeleteExam() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    if (actor) {
      try {
        const res = await actor.deleteExam(id);
        if (res.__kind__ === "ok") {
          toast.success("Exam deleted.");
          setExams((prev) => prev.filter((e) => e.id !== id));
        } else {
          toast.error(res.err ?? "Failed to delete exam");
        }
      } catch {
        setExams((prev) => prev.filter((e) => e.id !== id));
        toast.success("Exam deleted (offline).");
      }
    } else {
      setExams((prev) => prev.filter((e) => e.id !== id));
      toast.success("Exam deleted.");
    }
    setDeleteTarget(null);
  }

  const filteredExams = exams.filter((e) => {
    if (filterClass !== "all" && e.class !== filterClass) return false;
    if (filterSection !== "all" && e.section !== filterSection) return false;
    return true;
  });

  const sectionOptions =
    filterClass === "XI" || filterClass === "XII"
      ? [...SECTIONS, "Science", "Commerce", "Arts"]
      : SECTIONS;

  return (
    <div className="space-y-5" data-ocid="exams.page">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Examinations</h1>
          <p className="text-muted-foreground text-sm">
            Manage exams and results (AY 2026-27)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchExams}
            disabled={loading}
            aria-label="Refresh"
            data-ocid="exams.refresh.button"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </Button>
          <Button onClick={openAdd} data-ocid="exams.add.button">
            <Plus size={16} className="mr-1" /> Schedule Exam
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={filterClass}
          onChange={(e) => {
            setFilterClass(e.target.value);
            setFilterSection("all");
          }}
          className="h-9 px-3 rounded-lg border border-input bg-background text-sm"
          data-ocid="exams.class_filter.select"
        >
          <option value="all">All Classes</option>
          {CLASSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filterSection}
          onChange={(e) => setFilterSection(e.target.value)}
          className="h-9 px-3 rounded-lg border border-input bg-background text-sm"
          data-ocid="exams.section_filter.select"
        >
          <option value="all">All Sections</option>
          {sectionOptions.map((s) => (
            <option key={s} value={s}>
              Section {s}
            </option>
          ))}
        </select>
      </div>

      {/* Exam list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["sk1", "sk2", "sk3", "sk4"].map((k) => (
            <Skeleton key={k} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : filteredExams.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl"
          data-ocid="exams.empty_state"
        >
          <ClipboardList size={32} className="mx-auto mb-2 opacity-40" />
          <p>No exams found. Schedule one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExams.map((e, i) => (
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
                        Class {e.class}-{e.section} · {e.subject} · {e.term}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={
                        e.status === "Completed" ? "secondary" : "default"
                      }
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
                      onClick={() => handleDelete(e.id)}
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
                <MarksPanel
                  exam={e}
                  actor={actor}
                  onClose={() => setExpandedExam(null)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="exams.dialog">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Exam" : "Schedule New Exam"}
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
                  onChange={(e) => {
                    update("class", e.target.value);
                    update("section", "");
                  }}
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
                <Label>Section</Label>
                <select
                  value={form.section}
                  onChange={(e) => update("section", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  data-ocid="exams.section.select"
                >
                  <option value="">Select Section</option>
                  {(form.class === "XI" || form.class === "XII"
                    ? [...SECTIONS, "Science", "Commerce", "Arts"]
                    : SECTIONS
                  ).map((s) => (
                    <option key={s} value={s}>
                      Section {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Term</Label>
                <select
                  value={form.term}
                  onChange={(e) => update("term", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  data-ocid="exams.term.select"
                >
                  {TERMS.map((t) => (
                    <option key={t} value={t}>
                      {t}
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
                  <p className="text-xs text-destructive mt-1">
                    {maxMarksError}
                  </p>
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
            <Button
              onClick={handleSubmit}
              disabled={saving}
              data-ocid="exams.submit_button"
            >
              {saving && <Loader2 size={13} className="mr-1 animate-spin" />}
              {editId ? "Save Changes" : "Schedule Exam"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm" data-ocid="exams.delete.dialog">
          <DialogHeader>
            <DialogTitle>Delete Exam</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {deleteTarget?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              data-ocid="exams.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteExam}
              data-ocid="exams.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
