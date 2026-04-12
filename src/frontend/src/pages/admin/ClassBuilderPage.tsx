import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASSES } from "@/data/classConfig";
import { mockStaff } from "@/data/mockStaff";
import { type Student, mockStudents } from "@/data/mockStudents";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Layers,
  Printer,
  Search,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getAcademicLevel(studentId: string): "A" | "B" | "C" {
  const seed = studentId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const bucket = seed % 10;
  if (bucket < 3) return "A";
  if (bucket < 7) return "B";
  return "C";
}

function getSectionsForClass(cls: string): string[] {
  if (cls === "XI" || cls === "XII")
    return ["Science", "Commerce", "Arts", "A", "B", "C", "D"];
  return ["A", "B", "C", "D"];
}

const ALL_SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Science",
  "Physical Education",
  "Computer Science",
  "Art & Craft",
];

const STAFF_NAMES = mockStaff
  .filter((s) => s.status === "Active")
  .map((s) => s.name);

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ClassBuild {
  students: Student[];
  teacher: string;
  subjectTeachers: Record<string, string>;
}

type ClassBuilds = Record<string, ClassBuild>;

// ─── Build initial state with 3 pre-built classes ───────────────────────────

function buildInitialState(): ClassBuilds {
  const viiA = mockStudents
    .filter((s) => s.className === "VII" && s.section === "A")
    .slice(0, 8);
  const viB = mockStudents
    .filter((s) => s.className === "VI" && s.section === "B")
    .slice(0, 6);
  const ixC = mockStudents
    .filter((s) => s.className === "IX" && s.section === "C")
    .slice(0, 5);
  return {
    "VII-A": {
      students: viiA,
      teacher: "Amit Verma",
      subjectTeachers: { Mathematics: "Sunita Devi" },
    },
    "VI-B": {
      students: viB,
      teacher: "Poonam Rani",
      subjectTeachers: { Hindi: "Poonam Rani" },
    },
    "IX-C": {
      students: ixC,
      teacher: "Ramesh Tiwari",
      subjectTeachers: { Science: "Ramesh Tiwari" },
    },
  };
}

// ─── Step Indicator ─────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const steps = ["Select Class", "Build Class List", "Review & Confirm"];
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => {
        const idx = i + 1;
        const active = idx === step;
        const done = idx < step;
        return (
          <div key={label} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : done
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border border-current">
                {done ? "✓" : idx}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 ${done ? "bg-green-500" : "bg-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Class-Section Grid ─────────────────────────────────────────────

interface Step1Props {
  classBuilds: ClassBuilds;
  onSelect: (key: string) => void;
}

function Step1({ classBuilds, onSelect }: Step1Props) {
  const total = CLASSES.reduce(
    (n, cls) => n + getSectionsForClass(cls).length,
    0,
  );
  const built = Object.keys(classBuilds).length;
  const allocated = Object.values(classBuilds).reduce(
    (n, b) => n + b.students.length,
    0,
  );

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="flex flex-wrap gap-3">
        <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-2 text-sm font-medium text-primary">
          <span className="font-bold">{built}</span>/{total} class-sections
          built
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400">
          <span className="font-bold">{allocated}</span> students allocated
        </div>
        <div className="bg-muted border border-border rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground">
          Academic Year:{" "}
          <span className="text-foreground font-semibold">2026-27</span>
        </div>
      </div>

      {/* Class grids */}
      <div className="space-y-6">
        {CLASSES.map((cls) => (
          <div key={cls}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
              <Layers size={14} /> Class {cls}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {getSectionsForClass(cls).map((sec) => {
                const key = `${cls}-${sec}`;
                const build = classBuilds[key];
                const count = build?.students.length ?? 0;
                const teacher = build?.teacher ?? "";
                const hasStudents = count > 0;
                const hasTeacher = !!teacher;

                let cardClass =
                  "border-primary/20 bg-primary/5 hover:bg-primary/10";
                let badgeEl: React.ReactNode = null;
                if (hasStudents && hasTeacher) {
                  cardClass =
                    "border-green-500/30 bg-green-500/5 hover:bg-green-500/10";
                  badgeEl = (
                    <Badge className="text-xs bg-green-500/20 text-green-700 dark:text-green-400 border-0">
                      Built
                    </Badge>
                  );
                } else if (hasStudents) {
                  cardClass =
                    "border-yellow-400/40 bg-yellow-400/5 hover:bg-yellow-400/10";
                  badgeEl = (
                    <Badge className="text-xs bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 border-0">
                      No Teacher
                    </Badge>
                  );
                }

                return (
                  <button
                    type="button"
                    key={key}
                    data-ocid={`class-card-${key.toLowerCase().replace(/\s/g, "-")}`}
                    onClick={() => onSelect(key)}
                    className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${cardClass}`}
                  >
                    <div className="font-semibold text-sm text-foreground">
                      {key}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {count} students
                    </div>
                    {badgeEl && <div className="mt-1.5">{badgeEl}</div>}
                    {teacher && (
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        {teacher}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Build Class List ─────────────────────────────────────────────────

interface Step2Props {
  selectedKey: string;
  classBuilds: ClassBuilds;
  onChange: (key: string, build: ClassBuild) => void;
  onBack: () => void;
}

function Step2({ selectedKey, classBuilds, onChange, onBack }: Step2Props) {
  const build = classBuilds[selectedKey] ?? {
    students: [],
    teacher: "",
    subjectTeachers: {},
  };
  const [poolSearch, setPoolSearch] = useState("");
  const [poolClassFilter, setPoolClassFilter] = useState("all");
  const [selectedPool, setSelectedPool] = useState<Set<string>>(new Set());
  const [showBalance, setShowBalance] = useState(false);
  const [subjectTeachers, setSubjectTeachers] = useState<
    { subject: string; teacher: string }[]
  >(
    ALL_SUBJECTS.map((s) => ({
      subject: s,
      teacher: build.subjectTeachers[s] ?? "",
    })),
  );
  const [customSubjects, setCustomSubjects] = useState<
    { subject: string; teacher: string }[]
  >([]);
  const [classTeacher, setClassTeacher] = useState(build.teacher);

  // Students assigned to any class build (excluding current)
  const assignedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const [k, b] of Object.entries(classBuilds)) {
      if (k !== selectedKey) {
        for (const s of b.students) ids.add(s.id);
      }
    }
    return ids;
  }, [classBuilds, selectedKey]);

  const roster = build.students;
  const rosterIds = useMemo(() => new Set(roster.map((s) => s.id)), [roster]);

  const pool = useMemo(() => {
    return mockStudents.filter((s) => {
      if (rosterIds.has(s.id)) return false;
      if (assignedIds.has(s.id)) return false;
      const q = poolSearch.toLowerCase();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q);
      const matchClass =
        poolClassFilter === "all" || s.className === poolClassFilter;
      return matchSearch && matchClass;
    });
  }, [poolSearch, poolClassFilter, rosterIds, assignedIds]);

  // Gender balance
  const maleCount = roster.filter((s) => s.gender === "Male").length;
  const femaleCount = roster.filter((s) => s.gender === "Female").length;
  const total = roster.length;
  const malePct = total > 0 ? Math.round((maleCount / total) * 100) : 0;
  const genderWarning = total > 0 && (malePct > 60 || malePct < 40);

  // Academic level counts
  const levelCounts = { A: 0, B: 0, C: 0 };
  for (const s of roster) levelCounts[getAcademicLevel(s.id)]++;
  const aLevelPct = total > 0 ? Math.round((levelCounts.A / total) * 100) : 0;
  const levelWarning = total > 0 && aLevelPct > 50;

  function addSelected() {
    if (selectedPool.size === 0) {
      toast.error("Select at least one student from the pool");
      return;
    }
    const toAdd = pool.filter((s) => selectedPool.has(s.id));
    const newBuild = { ...build, students: [...roster, ...toAdd] };
    onChange(selectedKey, newBuild);
    setSelectedPool(new Set());
  }

  function addAllFromClass() {
    if (poolClassFilter === "all") {
      toast.error("Select a class filter first");
      return;
    }
    const toAdd = pool.filter((s) => s.className === poolClassFilter);
    if (toAdd.length === 0) {
      toast.info("No students to add from this class");
      return;
    }
    onChange(selectedKey, { ...build, students: [...roster, ...toAdd] });
  }

  function removeStudent(id: string) {
    onChange(selectedKey, {
      ...build,
      students: roster.filter((s) => s.id !== id),
    });
  }

  function saveTeachers() {
    const allSubjects = [...subjectTeachers, ...customSubjects];
    const subMap: Record<string, string> = {};
    for (const { subject, teacher } of allSubjects) {
      if (subject && teacher) subMap[subject] = teacher;
    }
    onChange(selectedKey, {
      ...build,
      teacher: classTeacher,
      subjectTeachers: subMap,
    });
    toast.success(`Class ${selectedKey} teacher allocation saved`);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          ← Back to Class Selection
        </Button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground">Building:</h2>
          <Badge className="text-base px-3 py-1 bg-primary text-primary-foreground">
            {selectedKey}
          </Badge>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT: Pool */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Users size={16} className="text-muted-foreground" /> Unassigned
              Students
              <Badge variant="secondary">{pool.length}</Badge>
            </h3>
          </div>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-2.5 text-muted-foreground"
            />
            <Input
              data-ocid="pool-search"
              value={poolSearch}
              onChange={(e) => setPoolSearch(e.target.value)}
              placeholder="Search students..."
              className="pl-8 h-8 text-sm"
            />
          </div>
          <Select value={poolClassFilter} onValueChange={setPoolClassFilter}>
            <SelectTrigger
              className="h-8 text-sm"
              data-ocid="pool-class-filter"
            >
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {CLASSES.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  Class {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="max-h-64 overflow-y-auto space-y-1 border border-border rounded-lg p-1">
            {pool.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No unassigned students match filter
              </div>
            ) : (
              pool.map((s) => (
                <label
                  key={s.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPool.has(s.id)}
                    onChange={(e) => {
                      const next = new Set(selectedPool);
                      e.target.checked ? next.add(s.id) : next.delete(s.id);
                      setSelectedPool(next);
                    }}
                    className="rounded"
                    data-ocid={`pool-check-${s.id}`}
                  />
                  <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {s.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">
                      {s.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.className}-{s.section} · {s.admissionNo}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs flex-shrink-0 ${s.gender === "Male" ? "border-blue-400 text-blue-600" : "border-pink-400 text-pink-600"}`}
                  >
                    {s.gender === "Male" ? "M" : "F"}
                  </Badge>
                </label>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={addSelected}
              disabled={selectedPool.size === 0}
              data-ocid="add-selected-btn"
              className="flex-1"
            >
              Add Selected ({selectedPool.size}) → {selectedKey}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={addAllFromClass}
              data-ocid="add-all-class-btn"
              disabled={poolClassFilter === "all"}
            >
              Add All
            </Button>
          </div>
        </div>

        {/* RIGHT: Roster */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Layers size={16} className="text-muted-foreground" />{" "}
              {selectedKey} Roster
              <Badge variant="secondary">{roster.length}</Badge>
            </h3>
          </div>

          <div className="max-h-44 overflow-y-auto space-y-1 border border-border rounded-lg p-1">
            {roster.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No students added yet. Use the pool on the left.
              </div>
            ) : (
              roster.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"
                >
                  <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {s.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">
                      {s.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.admissionNo}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs flex-shrink-0 ${s.gender === "Male" ? "border-blue-400 text-blue-600" : "border-pink-400 text-pink-600"}`}
                  >
                    {s.gender === "Male" ? "M" : "F"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs flex-shrink-0 ${getAcademicLevel(s.id) === "A" ? "border-green-400 text-green-600" : getAcademicLevel(s.id) === "B" ? "border-yellow-500 text-yellow-600" : "border-red-400 text-red-600"}`}
                  >
                    {getAcademicLevel(s.id)}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => removeStudent(s.id)}
                    data-ocid={`remove-student-${s.id}`}
                    aria-label="Remove student"
                    className="text-destructive hover:text-destructive/80 p-0.5 rounded"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Balance Rules */}
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowBalance(!showBalance)}
              data-ocid="balance-rules-toggle"
              className="w-full flex items-center justify-between p-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              <span className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-yellow-500" /> Balance
                Rules
              </span>
              {showBalance ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>
            {showBalance && (
              <div className="p-3 space-y-3 bg-muted/30">
                {/* Gender balance */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">
                      Gender Balance
                    </span>
                    <span>
                      {maleCount}M / {femaleCount}F
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-blue-400 rounded-full transition-all"
                      style={{ width: `${malePct}%` }}
                    />
                  </div>
                  {genderWarning && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 flex items-center gap-1">
                      <AlertTriangle size={12} /> {malePct}% Male — consider
                      balancing
                    </div>
                  )}
                </div>
                {/* Academic level */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">
                      Academic Level
                    </span>
                    <span>
                      A:{levelCounts.A} B:{levelCounts.B} C:{levelCounts.C}
                    </span>
                  </div>
                  {levelWarning && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                      <AlertTriangle size={12} /> {aLevelPct}% A-grade —
                      consider spreading across sections
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Teacher Allocation */}
          <div className="border border-border rounded-lg p-3 space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              Teacher Allocation
            </h4>
            <div>
              <span className="text-xs text-muted-foreground block mb-1">
                Class Teacher
              </span>
              <Select value={classTeacher} onValueChange={setClassTeacher}>
                <SelectTrigger
                  className="h-8 text-sm"
                  data-ocid="class-teacher-select"
                >
                  <SelectValue placeholder="Select class teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">— Not Assigned —</SelectItem>
                  {STAFF_NAMES.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <span className="text-xs text-muted-foreground block mb-1">
                Subject Teachers
              </span>
              <div className="space-y-1.5">
                {[...subjectTeachers, ...customSubjects].map((row, idx) => (
                  <div
                    key={`${row.subject}-${idx}`}
                    className="flex items-center gap-2"
                  >
                    <span className="text-xs text-muted-foreground w-28 flex-shrink-0 truncate">
                      {row.subject}
                    </span>
                    <Select
                      value={row.teacher}
                      onValueChange={(val) => {
                        if (idx < subjectTeachers.length) {
                          const next = [...subjectTeachers];
                          next[idx] = { ...next[idx], teacher: val };
                          setSubjectTeachers(next);
                        } else {
                          const ci = idx - subjectTeachers.length;
                          const next = [...customSubjects];
                          next[ci] = { ...next[ci], teacher: val };
                          setCustomSubjects(next);
                        }
                      }}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1">
                        <SelectValue placeholder="Assign teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">— None —</SelectItem>
                        {STAFF_NAMES.map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {idx >= subjectTeachers.length && (
                      <button
                        type="button"
                        aria-label="Remove subject row"
                        onClick={() =>
                          setCustomSubjects((prev) =>
                            prev.filter(
                              (_, i) => i !== idx - subjectTeachers.length,
                            ),
                          )
                        }
                        className="text-destructive p-0.5"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="mt-1.5 text-xs h-7"
                onClick={() =>
                  setCustomSubjects((prev) => [
                    ...prev,
                    { subject: "New Subject", teacher: "" },
                  ])
                }
                data-ocid="add-subject-row-btn"
              >
                + Add Subject
              </Button>
            </div>

            <Button
              size="sm"
              onClick={saveTeachers}
              data-ocid="save-teachers-btn"
              className="w-full"
            >
              Save Teacher Allocation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Review & Confirm ────────────────────────────────────────────────

interface Step3Props {
  classBuilds: ClassBuilds;
  academicYear: string;
}

function Step3({ classBuilds, academicYear }: Step3Props) {
  const [finalised, setFinalised] = useState(false);

  const entries = Object.entries(classBuilds);
  const totalClasses = entries.length;
  const totalStudents = entries.reduce((n, [, b]) => n + b.students.length, 0);
  const totalTeachers = entries.filter(([, b]) => !!b.teacher).length;
  const anyEmpty = entries.some(([, b]) => b.students.length === 0);

  function handleFinalise() {
    if (anyEmpty) {
      toast.error("Some classes have no students assigned");
      return;
    }
    setFinalised(true);
    toast.success(
      `🎉 Class lists for ${academicYear} finalised! ${totalClasses} classes, ${totalStudents} students, ${totalTeachers} teachers assigned.`,
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Classes Built",
            value: totalClasses,
            color: "bg-primary/10 text-primary",
          },
          {
            label: "Students Allocated",
            value: totalStudents,
            color: "bg-green-500/10 text-green-700 dark:text-green-400",
          },
          {
            label: "Teachers Assigned",
            value: totalTeachers,
            color: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className={`rounded-xl p-4 text-center ${color} border border-current/20`}
          >
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs mt-0.5 opacity-80">{label}</div>
          </div>
        ))}
      </div>

      {/* Summary table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">
                Class-Section
              </th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground">
                Students
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground hidden sm:table-cell">
                Class Teacher
              </th>
              <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground hidden md:table-cell">
                Subjects
              </th>
              <th className="text-center px-4 py-2.5 font-semibold text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No classes built yet. Go back to Step 1 and build some
                  classes.
                </td>
              </tr>
            ) : (
              entries
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, build]) => {
                  const isComplete =
                    build.students.length > 0 && !!build.teacher;
                  const subCount = Object.values(build.subjectTeachers).filter(
                    Boolean,
                  ).length;
                  return (
                    <tr
                      key={key}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {key}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">
                        {build.students.length}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {build.teacher || (
                          <span className="text-yellow-500">Not Assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                        {subCount}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isComplete ? (
                          <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 border-0">
                            <CheckCircle2 size={12} className="mr-1" /> Complete
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-400/15 text-orange-700 dark:text-orange-400 border-0">
                            <AlertTriangle size={12} className="mr-1" />{" "}
                            Incomplete
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          size="lg"
          onClick={handleFinalise}
          disabled={totalClasses === 0 || finalised}
          data-ocid="finalise-btn"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {finalised
            ? "✓ Class Lists Finalised"
            : `Finalise Class Lists for ${academicYear}`}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => toast.info("Exporting class lists to CSV...")}
          data-ocid="export-csv-btn"
        >
          Export as CSV
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.print()}
          data-ocid="print-summary-btn"
          className="gap-2"
        >
          <Printer size={16} /> Print Summary
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function ClassBuilderPage() {
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [step, setStep] = useState(1);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [classBuilds, setClassBuilds] =
    useState<ClassBuilds>(buildInitialState);

  function handleSelectClass(key: string) {
    setSelectedKey(key);
    setStep(2);
  }

  function handleBuildChange(key: string, build: ClassBuild) {
    setClassBuilds((prev) => ({ ...prev, [key]: build }));
  }

  function handleNext() {
    if (step === 1 && !selectedKey) {
      toast.error("Select a class-section to build");
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  }

  function handleBack() {
    if (step === 2) {
      setSelectedKey(null);
    }
    setStep((s) => Math.max(s - 1, 1));
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Class Builder</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Build and finalise class lists for the new academic year
          </p>
        </div>
        <Select value={academicYear} onValueChange={setAcademicYear}>
          <SelectTrigger className="w-36 h-9" data-ocid="academic-year-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026-27">2026-27</SelectItem>
            <SelectItem value="2027-28">2027-28</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Step indicator + nav */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <StepIndicator step={step} />
        <div className="flex gap-2">
          {step > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              data-ocid="back-btn"
            >
              ← Back
            </Button>
          )}
          {step < 3 && (
            <Button
              size="sm"
              onClick={step === 1 ? () => setStep(3) : handleNext}
              data-ocid="next-btn"
            >
              {step === 1 ? "Review Summary →" : "Next →"}
            </Button>
          )}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-card border border-border rounded-xl p-5">
        {step === 1 && (
          <Step1 classBuilds={classBuilds} onSelect={handleSelectClass} />
        )}
        {step === 2 && selectedKey && (
          <Step2
            selectedKey={selectedKey}
            classBuilds={classBuilds}
            onChange={handleBuildChange}
            onBack={() => {
              setSelectedKey(null);
              setStep(1);
            }}
          />
        )}
        {step === 3 && (
          <Step3 classBuilds={classBuilds} academicYear={academicYear} />
        )}
      </div>
    </div>
  );
}
