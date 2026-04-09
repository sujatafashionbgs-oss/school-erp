import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CLASSES } from "@/data/classConfig";
import {
  AlertTriangle,
  BookOpen,
  Check,
  Edit2,
  GraduationCap,
  Shuffle,
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const SUBJECTS = [
  "Mathematics",
  "Science",
  "Hindi",
  "English",
  "Social Studies",
  "Computer",
  "PE",
  "Art",
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const PERIODS = [
  "8:00-8:45",
  "8:45-9:30",
  "9:30-10:15",
  "10:30-11:15",
  "11:15-12:00",
  "12:00-12:45",
];

const ALL_TEACHERS = [
  "Mr. Sharma",
  "Ms. Gupta",
  "Mr. Patel",
  "Ms. Singh",
  "Mr. Kumar",
  "Ms. Verma",
  "Mr. Rajan",
  "Ms. Joshi",
  "Mrs. Rao",
  "Mr. Mehta",
  "Ms. Pillai",
  "Mr. Nair",
];

const AVAILABLE_TEACHERS = [
  "Mr. Sharma",
  "Ms. Gupta",
  "Mr. Patel",
  "Ms. Verma",
  "Mr. Rajan",
  "Ms. Joshi",
];

// Sections helper
function getSectionsForClass(cls: string): string[] {
  const base = ["A", "B", "C", "D", "E", "F", "G", "H"];
  if (cls === "XI" || cls === "XII") {
    return [...base, "Science", "Commerce", "Arts"];
  }
  return base;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

type CellEntry = { subject: string; teacher: string };
type TimetableMap = Record<string, CellEntry[][]>;
type ConflictInfo = { teacher: string; day: string } | null;
type ViewMode = "class" | "section" | "teacher";

// ─── Mock Data Generation ──────────────────────────────────────────────────────

function buildMockGrid(
  subjectPool: string[],
  teacherPool: string[],
  numPeriods = 6,
  numDays = 6,
): CellEntry[][] {
  return Array.from({ length: numPeriods }, (_, pi) =>
    Array.from({ length: numDays }, (_, di) => ({
      subject: subjectPool[(pi * numDays + di) % subjectPool.length],
      teacher: teacherPool[(pi + di) % teacherPool.length],
    })),
  );
}

const INITIAL_TIMETABLES: TimetableMap = {
  "VIII-A": buildMockGrid(
    [
      "Mathematics",
      "Science",
      "English",
      "Hindi",
      "Social Studies",
      "Computer",
    ],
    ["Mr. Sharma", "Ms. Gupta", "Mr. Kumar", "Ms. Singh"],
  ),
  "VII-B": buildMockGrid(
    ["Hindi", "English", "Mathematics", "Science", "Art", "PE"],
    ["Mr. Patel", "Ms. Singh", "Ms. Verma", "Mr. Sharma"],
  ),
  "IX-A": buildMockGrid(
    [
      "Mathematics",
      "Science",
      "English",
      "Hindi",
      "Computer",
      "Social Studies",
    ],
    ["Mr. Kumar", "Ms. Verma", "Mr. Sharma", "Ms. Gupta"],
  ),
  "VI-C": buildMockGrid(
    ["English", "Social Studies", "Mathematics", "Science", "Art", "PE"],
    ["Ms. Gupta", "Mr. Patel", "Ms. Singh", "Mr. Rajan"],
  ),
  "XI-Science": buildMockGrid(
    ["Mathematics", "Science", "English", "Computer", "PE", "Hindi"],
    ["Mr. Sharma", "Ms. Verma", "Ms. Pillai", "Mr. Mehta"],
  ),
};

// Auto-generate: distribute subjects across periods using round-robin
function generateTimetable(
  periodsPerDay: number,
  weekdays: string[],
): CellEntry[][] {
  return Array.from({ length: periodsPerDay }, (_, pi) =>
    weekdays.map((_, di) => ({
      subject: SUBJECTS[(pi * weekdays.length + di) % SUBJECTS.length],
      teacher: ALL_TEACHERS[(pi + di) % ALL_TEACHERS.length],
    })),
  );
}

function initEmptyGrid(): CellEntry[][] {
  return PERIODS.map((_, pi) =>
    DAYS.map((_, di) => ({
      subject: SUBJECTS[(pi * DAYS.length + di) % SUBJECTS.length],
      teacher: ALL_TEACHERS[(pi + di) % ALL_TEACHERS.length],
    })),
  );
}

// ─── Substitute data ───────────────────────────────────────────────────────────

interface AbsentPeriod {
  id: string;
  period: string;
  class: string;
  covered: boolean;
  substitute: string;
}
interface AbsentTeacher {
  teacher: string;
  subject: string;
  periods: AbsentPeriod[];
}

const initialAbsent: AbsentTeacher[] = [
  {
    teacher: "Amit Kumar",
    subject: "Mathematics",
    periods: [
      {
        id: "p1",
        period: "Period 2",
        class: "VIII-A",
        covered: false,
        substitute: "",
      },
      {
        id: "p2",
        period: "Period 5",
        class: "IX-B",
        covered: false,
        substitute: "",
      },
    ],
  },
  {
    teacher: "Priya Singh",
    subject: "English",
    periods: [
      {
        id: "p3",
        period: "Period 1",
        class: "VII-B",
        covered: false,
        substitute: "",
      },
    ],
  },
];

const substituteHistory = [
  {
    date: "2026-04-01",
    absentTeacher: "Ravi Gupta",
    period: "Period 3",
    subject: "Science",
    class: "VI-C",
    substitute: "Ms. Verma",
    status: "Covered",
  },
  {
    date: "2026-03-30",
    absentTeacher: "Sunita Rao",
    period: "Period 4",
    subject: "History",
    class: "IX-A",
    substitute: "Mr. Sharma",
    status: "Covered",
  },
];

// ─── Teacher-wise view ─────────────────────────────────────────────────────────

interface TeacherSlot {
  subject: string;
  classSection: string;
}

function buildTeacherSchedule(
  teacher: string,
  timetables: TimetableMap,
  days: string[],
  periods: string[],
): (TeacherSlot | null)[][] {
  // rows = days, cols = periods
  return days.map((_, di) =>
    periods.map((_, pi) => {
      for (const [key, grid] of Object.entries(timetables)) {
        const row = grid[pi];
        if (row && row[di]?.teacher === teacher) {
          return { subject: row[di].subject, classSection: key };
        }
      }
      return null;
    }),
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TimetablePage() {
  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>("class");

  // Class/section selection (class-wise and section-wise modes)
  const [selectedClass, setSelectedClass] = useState("VIII");
  const [selectedSection, setSelectedSection] = useState("A");

  // Teacher-wise
  const [selectedTeacher, setSelectedTeacher] = useState(ALL_TEACHERS[0]);

  // Timetable data map keyed by "Class-Section"
  const [timetables, setTimetables] =
    useState<TimetableMap>(INITIAL_TIMETABLES);

  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [editing, setEditing] = useState<{ pi: number; di: number } | null>(
    null,
  );
  const [draft, setDraft] = useState<CellEntry>({ subject: "", teacher: "" });
  const [conflict, setConflict] = useState<ConflictInfo>(null);
  const [pendingSave, setPendingSave] = useState<{
    pi: number;
    di: number;
    entry: CellEntry;
    key: string;
  } | null>(null);

  // Auto-generate dialog
  const [autoOpen, setAutoOpen] = useState(false);
  const [autoForm, setAutoForm] = useState({
    class: "",
    section: "",
    weekdays: "Mon-Fri",
    periodsPerDay: "6",
    periodDuration: "45",
  });

  // Active days/periods (can change after auto-generate)
  const [activeDays, setActiveDays] = useState(DAYS);
  const [activePeriods, setActivePeriods] = useState(PERIODS);

  // Substitutes
  const [subDate, setSubDate] = useState(new Date().toISOString().slice(0, 10));
  const [absentTeachers, setAbsentTeachers] =
    useState<AbsentTeacher[]>(initialAbsent);

  // ── Derived ──────────────────────────────────────────────────────────────────

  const currentKey = `${selectedClass}-${selectedSection}`;
  const currentGrid: CellEntry[][] = useMemo(
    () => timetables[currentKey] ?? initEmptyGrid(),
    [timetables, currentKey],
  );

  const sectionsForSelected = useMemo(
    () => getSectionsForClass(selectedClass),
    [selectedClass],
  );

  // Teacher schedule for teacher-wise view
  const teacherSchedule = useMemo(
    () =>
      buildTeacherSchedule(
        selectedTeacher,
        timetables,
        activeDays,
        activePeriods,
      ),
    [selectedTeacher, timetables, activeDays, activePeriods],
  );

  const teacherStats = useMemo(() => {
    let totalPeriods = 0;
    const classes = new Set<string>();
    const subjects = new Set<string>();
    for (const row of teacherSchedule) {
      for (const slot of row) {
        if (slot) {
          totalPeriods++;
          classes.add(slot.classSection);
          subjects.add(slot.subject);
        }
      }
    }
    return {
      totalPeriods,
      uniqueClasses: classes.size,
      subjects: [...subjects],
    };
  }, [teacherSchedule]);

  // ── Edit helpers ──────────────────────────────────────────────────────────────

  const startEdit = (pi: number, di: number) => {
    setEditing({ pi, di });
    setDraft({ ...currentGrid[pi][di] });
    setConflict(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setConflict(null);
    setPendingSave(null);
  };

  const trySave = (pi: number, di: number, entry: CellEntry) => {
    // Check conflict: same teacher on same day at another period
    const conflictPeriodIdx = currentGrid.findIndex(
      (row, rowIdx) => rowIdx !== pi && row[di]?.teacher === entry.teacher,
    );
    if (conflictPeriodIdx !== -1) {
      setConflict({ teacher: entry.teacher, day: activeDays[di] });
      setPendingSave({ pi, di, entry, key: currentKey });
    } else {
      applySave(pi, di, entry, currentKey);
    }
  };

  const applySave = (pi: number, di: number, entry: CellEntry, key: string) => {
    setTimetables((prev) => {
      const grid = (prev[key] ?? initEmptyGrid()).map((row) =>
        row.map((c) => ({ ...c })),
      );
      grid[pi][di] = entry;
      return { ...prev, [key]: grid };
    });
    setEditing(null);
    setConflict(null);
    setPendingSave(null);
  };

  // ── Auto-generate ─────────────────────────────────────────────────────────────

  function handleAutoGenerate() {
    const targetClass = autoForm.class || selectedClass;
    const targetSection = autoForm.section || selectedSection;
    if (!targetClass || !targetSection) {
      toast.error("Please select class and section");
      return;
    }
    const periodsCount = Number.parseInt(autoForm.periodsPerDay);
    const days = autoForm.weekdays === "Mon-Sat" ? DAYS : DAYS.slice(0, 5);
    const generated = generateTimetable(periodsCount, days);

    const periodLabels = Array.from({ length: periodsCount }, (_, i) => {
      const startMinutes =
        8 * 60 + i * Number.parseInt(autoForm.periodDuration);
      const endMinutes =
        startMinutes + Number.parseInt(autoForm.periodDuration);
      const fmt = (m: number) =>
        `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
      return `${fmt(startMinutes)}-${fmt(endMinutes)}`;
    });

    const key = `${targetClass}-${targetSection}`;
    setTimetables((prev) => ({ ...prev, [key]: generated }));
    setActiveDays(days);
    setActivePeriods(periodLabels);
    setAutoOpen(false);
    toast.success(
      `Timetable generated for Class ${targetClass}-${targetSection}`,
    );
  }

  // ── Substitutes ───────────────────────────────────────────────────────────────

  function setSubstitute(teacherIdx: number, periodId: string, value: string) {
    setAbsentTeachers((prev) =>
      prev.map((t, ti) =>
        ti !== teacherIdx
          ? t
          : {
              ...t,
              periods: t.periods.map((p) =>
                p.id === periodId ? { ...p, substitute: value } : p,
              ),
            },
      ),
    );
  }

  function toggleCovered(teacherIdx: number, periodId: string) {
    setAbsentTeachers((prev) =>
      prev.map((t, ti) =>
        ti !== teacherIdx
          ? t
          : {
              ...t,
              periods: t.periods.map((p) =>
                p.id === periodId ? { ...p, covered: !p.covered } : p,
              ),
            },
      ),
    );
  }

  // ── Render helpers ────────────────────────────────────────────────────────────

  function renderGridCell(pi: number, di: number) {
    const isEditing = editMode && editing?.pi === pi && editing?.di === di;
    const cell = currentGrid[pi]?.[di] ?? { subject: "-", teacher: "-" };

    if (isEditing) {
      return (
        <div className="space-y-1">
          <Select
            value={draft.subject}
            onValueChange={(v) => setDraft((pr) => ({ ...pr, subject: v }))}
          >
            <SelectTrigger className="h-7 text-xs" data-ocid="timetable.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={draft.teacher}
            onValueChange={(v) => setDraft((pr) => ({ ...pr, teacher: v }))}
          >
            <SelectTrigger className="h-7 text-xs" data-ocid="timetable.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_TEACHERS.map((t) => (
                <SelectItem key={t} value={t} className="text-xs">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1 pt-0.5">
            <button
              type="button"
              className="p-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => trySave(pi, di, draft)}
              data-ocid="timetable.save_button"
            >
              <Check className="h-3 w-3" />
            </button>
            <button
              type="button"
              className="p-1 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80"
              onClick={cancelEdit}
              data-ocid="timetable.cancel_button"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        type="button"
        className={`text-left w-full group ${
          editMode
            ? "cursor-pointer hover:bg-secondary/30 rounded p-1 -m-1"
            : ""
        }`}
        onClick={() => editMode && startEdit(pi, di)}
        data-ocid={editMode ? "timetable.edit_button" : undefined}
      >
        <span className="text-sm text-foreground block">{cell.subject}</span>
        <span className="text-xs text-muted-foreground block">
          {cell.teacher}
        </span>
      </button>
    );
  }

  function renderTimetableGrid(readonly = false) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Period
                </th>
                {activeDays.map((d) => (
                  <th
                    key={d}
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activePeriods.map((p, pi) => (
                <tr
                  key={p}
                  className="border-b border-border hover:bg-secondary/20"
                >
                  <td className="px-4 py-3 text-xs text-muted-foreground font-medium whitespace-nowrap">
                    {p}
                  </td>
                  {activeDays.map((d, di) => (
                    <td key={d} className="px-4 py-2 min-w-[130px]">
                      {readonly ? (
                        <div>
                          <span className="text-sm text-foreground block">
                            {currentGrid[pi]?.[di]?.subject ?? "-"}
                          </span>
                          <span className="text-xs text-muted-foreground block">
                            {currentGrid[pi]?.[di]?.teacher ?? ""}
                          </span>
                        </div>
                      ) : (
                        renderGridCell(pi, di)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderTeacherView() {
    return (
      <div className="space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {teacherStats.totalPeriods}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Periods / Week</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {teacherStats.uniqueClasses}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Classes Taught</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {teacherStats.subjects.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Subjects Taught
            </p>
          </div>
        </div>

        {teacherStats.subjects.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {teacherStats.subjects.map((s) => (
              <Badge key={s} variant="outline" className="text-xs">
                {s}
              </Badge>
            ))}
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                    Day
                  </th>
                  {activePeriods.map((p, pi) => (
                    <th
                      key={p}
                      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap"
                    >
                      P{pi + 1}{" "}
                      <span className="font-normal opacity-70">({p})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeDays.map((day, di) => (
                  <tr
                    key={day}
                    className="border-b border-border hover:bg-secondary/20"
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground font-medium whitespace-nowrap">
                      {day}
                    </td>
                    {activePeriods.map((periodLabel, pi) => {
                      const slot = teacherSchedule[di]?.[pi] ?? null;
                      return (
                        <td
                          key={periodLabel}
                          className="px-4 py-2 min-w-[140px]"
                        >
                          {slot ? (
                            <div>
                              <span className="text-sm text-foreground block font-medium">
                                {slot.subject}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs mt-0.5"
                              >
                                {slot.classSection}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-muted-foreground/40 text-sm">
                              —
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── JSX ───────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5" data-ocid="timetable.page">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Timetable</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoOpen(true)}
            data-ocid="timetable.auto_generate.button"
          >
            <Shuffle size={14} className="mr-2" /> Auto Generate
          </Button>
          {viewMode !== "teacher" && (
            <Button
              variant={editMode ? "secondary" : "outline"}
              size="sm"
              onClick={() => {
                setEditMode((v) => !v);
                cancelEdit();
              }}
              data-ocid="timetable.toggle"
            >
              {editMode ? (
                <>
                  <X className="h-4 w-4 mr-1" /> Exit Edit
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4 mr-1" /> Edit
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Page-level tabs: Timetable | Substitutes */}
      <Tabs defaultValue="timetable">
        <TabsList>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="substitutes">Substitutes</TabsTrigger>
        </TabsList>

        {/* ── TIMETABLE TAB ───────────────────────────────────────────── */}
        <TabsContent value="timetable" className="mt-5 space-y-4">
          {/* View mode segmented control */}
          <div
            className="flex items-center gap-1 bg-secondary/40 rounded-xl p-1 w-fit border border-border"
            data-ocid="timetable.view_mode"
          >
            {(
              [
                {
                  key: "class",
                  label: "Class-wise",
                  icon: <GraduationCap size={14} />,
                },
                {
                  key: "section",
                  label: "Section-wise",
                  icon: <BookOpen size={14} />,
                },
                {
                  key: "teacher",
                  label: "Teacher-wise",
                  icon: <User size={14} />,
                },
              ] as { key: ViewMode; label: string; icon: React.ReactNode }[]
            ).map(({ key, label, icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setViewMode(key);
                  cancelEdit();
                }}
                data-ocid={`timetable.mode.${key}`}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  viewMode === key
                    ? "bg-card shadow text-foreground border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* ── Class filter controls ──────────────────────────────────── */}
          {(viewMode === "class" || viewMode === "section") && (
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Class</Label>
                <Select
                  value={selectedClass}
                  onValueChange={(v) => {
                    setSelectedClass(v);
                    const secs = getSectionsForClass(v);
                    setSelectedSection(secs[0]);
                    cancelEdit();
                  }}
                >
                  <SelectTrigger
                    className="w-[150px]"
                    data-ocid="timetable.class_filter"
                  >
                    <SelectValue />
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

              {viewMode === "section" && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Section
                  </Label>
                  <Select
                    value={selectedSection}
                    onValueChange={(v) => {
                      setSelectedSection(v);
                      cancelEdit();
                    }}
                  >
                    <SelectTrigger
                      className="w-[150px]"
                      data-ocid="timetable.section_filter"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectItem value="All">All Sections</SelectItem>
                      {sectionsForSelected.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Current timetable key badge */}
              <Badge variant="outline" className="mb-0.5 text-xs">
                {viewMode === "section"
                  ? `${selectedClass}-${selectedSection}`
                  : `${selectedClass} (Section A)`}
              </Badge>
            </div>
          )}

          {/* ── Teacher filter control ─────────────────────────────────── */}
          {viewMode === "teacher" && (
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Teacher</Label>
                <Select
                  value={selectedTeacher}
                  onValueChange={setSelectedTeacher}
                >
                  <SelectTrigger
                    className="w-[200px]"
                    data-ocid="timetable.teacher_filter"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {ALL_TEACHERS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Badge className="bg-secondary text-secondary-foreground border-border mb-0.5 text-xs">
                Read-only view
              </Badge>
            </div>
          )}

          {/* ── Conflict warning ───────────────────────────────────────── */}
          {conflict && pendingSave && (
            <div
              className="flex flex-col sm:flex-row sm:items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 rounded-xl px-4 py-3"
              data-ocid="timetable.error_state"
            >
              <div className="flex items-center gap-2 flex-1">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">
                  ⚠️ Conflict: <strong>{conflict.teacher}</strong> is already
                  assigned to <strong>{conflict.day}</strong> at this period.
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-yellow-500/50"
                  onClick={() =>
                    pendingSave &&
                    applySave(
                      pendingSave.pi,
                      pendingSave.di,
                      pendingSave.entry,
                      pendingSave.key,
                    )
                  }
                  data-ocid="timetable.confirm_button"
                >
                  Save Anyway
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={cancelEdit}
                  data-ocid="timetable.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* ── Grid / Teacher schedule ────────────────────────────────── */}
          {viewMode === "teacher"
            ? renderTeacherView()
            : renderTimetableGrid(viewMode === "class")}
        </TabsContent>

        {/* ── SUBSTITUTES TAB ─────────────────────────────────────────── */}
        <TabsContent value="substitutes" className="mt-5 space-y-5">
          <div className="flex items-center gap-3 flex-wrap">
            <Label className="text-sm font-medium">Date</Label>
            <Input
              type="date"
              className="w-auto"
              value={subDate}
              onChange={(e) => setSubDate(e.target.value)}
              data-ocid="timetable.sub_date.input"
            />
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">
              Absent Teachers Today
            </h2>
            {absentTeachers.map((at, ti) => (
              <div
                key={at.teacher}
                className="bg-card border border-border rounded-2xl p-5 space-y-4"
                data-ocid={`timetable.absent.${ti + 1}`}
              >
                <div className="flex items-center gap-2">
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                    Absent
                  </Badge>
                  <span className="font-semibold text-foreground">
                    {at.teacher}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    · {at.subject}
                  </span>
                </div>

                <div className="space-y-3">
                  {at.periods.map((period) => (
                    <div
                      key={period.id}
                      className="flex flex-wrap items-center gap-3 p-3 bg-secondary/30 rounded-xl"
                    >
                      <div className="flex-1 min-w-[120px]">
                        <p className="text-sm font-medium text-foreground">
                          {period.period}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Class {period.class}
                        </p>
                      </div>
                      <Select
                        value={period.substitute}
                        onValueChange={(v) => setSubstitute(ti, period.id, v)}
                      >
                        <SelectTrigger
                          className="w-[160px] h-8 text-sm"
                          data-ocid={`timetable.substitute_select.${period.id}`}
                        >
                          <SelectValue placeholder="Assign substitute" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_TEACHERS.map((t) => (
                            <SelectItem key={t} value={t} className="text-sm">
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={period.covered}
                          onCheckedChange={() => toggleCovered(ti, period.id)}
                          data-ocid={`timetable.covered_toggle.${period.id}`}
                        />
                        <span className="text-xs text-muted-foreground">
                          {period.covered ? (
                            <Badge className="bg-green-500/10 text-green-700 border-green-200">
                              Covered
                            </Badge>
                          ) : (
                            "Mark Covered"
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  size="sm"
                  onClick={() => {
                    const uncovered = at.periods.filter((p) => !p.substitute);
                    if (uncovered.length > 0) {
                      toast.error(
                        "Please assign a substitute for all periods first",
                      );
                      return;
                    }
                    toast.success(`Substitutes saved for ${at.teacher}`);
                  }}
                  data-ocid={`timetable.save_sub.${ti + 1}`}
                >
                  Save Substitutes
                </Button>
              </div>
            ))}
          </div>

          {/* History */}
          <div className="space-y-3">
            <h2 className="font-semibold text-foreground">
              Substitute History
            </h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    {[
                      "Date",
                      "Absent Teacher",
                      "Period",
                      "Subject",
                      "Class",
                      "Substitute",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="p-3 text-left font-semibold text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {substituteHistory.map((h) => (
                    <tr
                      key={h.date + h.absentTeacher + h.period}
                      className="border-t border-border hover:bg-secondary/20"
                    >
                      <td className="p-3 text-muted-foreground">{h.date}</td>
                      <td className="p-3 font-medium text-foreground">
                        {h.absentTeacher}
                      </td>
                      <td className="p-3 text-muted-foreground">{h.period}</td>
                      <td className="p-3 text-muted-foreground">{h.subject}</td>
                      <td className="p-3">
                        <Badge variant="outline">{h.class}</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {h.substitute}
                      </td>
                      <td className="p-3 text-center">
                        <Badge className="bg-green-500/10 text-green-700 border-green-200">
                          {h.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── AUTO GENERATE DIALOG ─────────────────────────────────────────── */}
      <Dialog open={autoOpen} onOpenChange={setAutoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Auto Generate Timetable</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Class *</Label>
                <Select
                  value={autoForm.class || selectedClass}
                  onValueChange={(v) => {
                    setAutoForm((p) => ({ ...p, class: v, section: "" }));
                  }}
                >
                  <SelectTrigger data-ocid="timetable.auto.class">
                    <SelectValue placeholder="Select" />
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
              <div className="space-y-1.5">
                <Label>Section *</Label>
                <Select
                  value={autoForm.section || selectedSection}
                  onValueChange={(v) =>
                    setAutoForm((p) => ({ ...p, section: v }))
                  }
                >
                  <SelectTrigger data-ocid="timetable.auto.section">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {getSectionsForClass(autoForm.class || selectedClass).map(
                      (s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Weekdays</Label>
              <Select
                value={autoForm.weekdays}
                onValueChange={(v) =>
                  setAutoForm((p) => ({ ...p, weekdays: v }))
                }
              >
                <SelectTrigger data-ocid="timetable.auto.weekdays">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mon-Fri">Mon – Fri (5 days)</SelectItem>
                  <SelectItem value="Mon-Sat">Mon – Sat (6 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Periods per Day</Label>
                <Select
                  value={autoForm.periodsPerDay}
                  onValueChange={(v) =>
                    setAutoForm((p) => ({ ...p, periodsPerDay: v }))
                  }
                >
                  <SelectTrigger data-ocid="timetable.auto.periods">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["6", "7", "8"].map((n) => (
                      <SelectItem key={n} value={n}>
                        {n} periods
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Period Duration</Label>
                <Select
                  value={autoForm.periodDuration}
                  onValueChange={(v) =>
                    setAutoForm((p) => ({ ...p, periodDuration: v }))
                  }
                >
                  <SelectTrigger data-ocid="timetable.auto.duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="35">35 min</SelectItem>
                    <SelectItem value="40">40 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setAutoOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleAutoGenerate}
                data-ocid="timetable.auto.generate"
              >
                <Shuffle size={14} className="mr-1" /> Generate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
