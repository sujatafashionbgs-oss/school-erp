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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

// Subject panel card colors (cycle through)
const SUBJECT_COLORS = [
  { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8" }, // blue
  { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D" }, // green
  { bg: "#FEFCE8", border: "#FEF08A", text: "#A16207" }, // yellow
  { bg: "#FFF1F2", border: "#FECDD3", text: "#BE123C" }, // red
  { bg: "#FAF5FF", border: "#E9D5FF", text: "#7E22CE" }, // purple
  { bg: "#FDF2F8", border: "#FBCFE8", text: "#9D174D" }, // pink
  { bg: "#FFF7ED", border: "#FED7AA", text: "#C2410C" }, // orange
  { bg: "#F0FDFA", border: "#99F6E4", text: "#0F766E" }, // teal
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

interface UndoSnapshot {
  key: string;
  cells: Array<{ pi: number; di: number }>;
  prev: TimetableMap;
}

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

  // ── Drag / Selection state ─────────────────────────────────────────────────

  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [firstSelected, setFirstSelected] = useState<{
    pi: number;
    di: number;
  } | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Bulk assign modal
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [bulkDraft, setBulkDraft] = useState<CellEntry>({
    subject: "",
    teacher: "",
  });

  // Undo state
  const [undoVisible, setUndoVisible] = useState(false);
  const [undoCountdown, setUndoCountdown] = useState(5);
  const [lastAssignment, setLastAssignment] = useState<UndoSnapshot | null>(
    null,
  );
  const undoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Panel drag
  const [draggedSubject, setDraggedSubject] = useState<string | null>(null);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);

  // Touch device detection
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
  }, []);

  // ── Document-level event listeners ────────────────────────────────────────

  // mouseup → end drag, open bulk assign if cells selected
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Use functional update to read current selectedCells at event time
        setSelectedCells((prev) => {
          if (prev.size > 0) {
            // Delay opening modal slightly to ensure state is settled
            setTimeout(() => setBulkAssignOpen(true), 0);
          }
          return prev;
        });
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [isDragging]);

  // Escape key → clear selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCells(new Set());
        setFirstSelected(null);
        if (bulkAssignOpen) setBulkAssignOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [bulkAssignOpen]);

  // ── Undo countdown ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (undoVisible) {
      setUndoCountdown(5);
      if (undoTimerRef.current) clearInterval(undoTimerRef.current);
      undoTimerRef.current = setInterval(() => {
        setUndoCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(undoTimerRef.current!);
            setUndoVisible(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (undoTimerRef.current) clearInterval(undoTimerRef.current);
    };
  }, [undoVisible]);

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

  // ── Undo helpers ──────────────────────────────────────────────────────────────

  function showUndoSnackbar(snapshot: UndoSnapshot) {
    setLastAssignment(snapshot);
    setUndoVisible(true);
  }

  function handleUndo() {
    if (lastAssignment) {
      setTimetables(lastAssignment.prev);
      toast.success("Assignment undone");
    }
    setUndoVisible(false);
    if (undoTimerRef.current) clearInterval(undoTimerRef.current);
  }

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

  // ── Bulk assign ───────────────────────────────────────────────────────────────

  function handleBulkAssign() {
    if (!bulkDraft.subject || !bulkDraft.teacher) {
      toast.error("Please select both subject and teacher");
      return;
    }
    const cells = Array.from(selectedCells).map((k) => {
      const [pi, di] = k.split("-").map(Number);
      return { pi, di };
    });
    // Snapshot before change
    const prevSnapshot = timetables;
    setTimetables((prev) => {
      const grid = (prev[currentKey] ?? initEmptyGrid()).map((row) =>
        row.map((c) => ({ ...c })),
      );
      for (const { pi, di } of cells) {
        if (grid[pi]?.[di] !== undefined) {
          grid[pi][di] = { ...bulkDraft };
        }
      }
      return { ...prev, [currentKey]: grid };
    });
    showUndoSnackbar({ key: currentKey, cells, prev: prevSnapshot });
    toast.success(
      `Assigned to ${cells.length} slot${cells.length !== 1 ? "s" : ""}`,
    );
    setSelectedCells(new Set());
    setFirstSelected(null);
    setBulkAssignOpen(false);
    setBulkDraft({ subject: "", teacher: "" });
  }

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

    // If selectedCells is non-empty, only fill those specific cells
    if (selectedCells.size > 0) {
      const cells = Array.from(selectedCells).map((k) => {
        const [pi, di] = k.split("-").map(Number);
        return { pi, di };
      });
      const prevSnapshot = timetables;
      setTimetables((prev) => {
        const existingGrid = (prev[key] ?? initEmptyGrid()).map((row) =>
          row.map((c) => ({ ...c })),
        );
        for (const { pi, di } of cells) {
          if (
            generated[pi]?.[di] !== undefined &&
            existingGrid[pi]?.[di] !== undefined
          ) {
            existingGrid[pi][di] = generated[pi][di];
          }
        }
        return { ...prev, [key]: existingGrid };
      });
      showUndoSnackbar({ key, cells, prev: prevSnapshot });
      setSelectedCells(new Set());
      setFirstSelected(null);
      toast.success(
        `Auto-assigned ${cells.length} selected slot${cells.length !== 1 ? "s" : ""} for Class ${targetClass}-${targetSection}`,
      );
    } else {
      // Fill all (existing behavior)
      const prevSnapshot = timetables;
      const allCells: Array<{ pi: number; di: number }> = [];
      for (let pi = 0; pi < periodsCount; pi++) {
        for (let di = 0; di < days.length; di++) {
          allCells.push({ pi, di });
        }
      }
      setTimetables((prev) => ({ ...prev, [key]: generated }));
      showUndoSnackbar({ key, cells: allCells, prev: prevSnapshot });
      setActiveDays(days);
      setActivePeriods(periodLabels);
      toast.success(
        `Timetable generated for Class ${targetClass}-${targetSection}`,
      );
    }

    setAutoOpen(false);
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

  // ── Cell selection helpers ────────────────────────────────────────────────────

  function getCellKey(pi: number, di: number): string {
    return `${pi}-${di}`;
  }

  function isCellSelected(pi: number, di: number): boolean {
    return selectedCells.has(getCellKey(pi, di));
  }

  function handleCellMouseDown(e: React.MouseEvent, pi: number, di: number) {
    // Only in section view (editable, non-readonly)
    if (viewMode === "teacher") return;
    if (e.button !== 0) return; // left click only

    // Don't start drag if clicking inside an editing cell's controls
    if (editing !== null) return;

    if (e.shiftKey && firstSelected) {
      // Shift+click range select
      const minPi = Math.min(firstSelected.pi, pi);
      const maxPi = Math.max(firstSelected.pi, pi);
      const minDi = Math.min(firstSelected.di, di);
      const maxDi = Math.max(firstSelected.di, di);
      const newSelected = new Set(selectedCells);
      for (let r = minPi; r <= maxPi; r++) {
        for (let c = minDi; c <= maxDi; c++) {
          newSelected.add(getCellKey(r, c));
        }
      }
      setSelectedCells(newSelected);
    } else {
      // Start drag selection
      setSelectedCells(new Set([getCellKey(pi, di)]));
      setFirstSelected({ pi, di });
      setIsDragging(true);
    }
    e.preventDefault();
  }

  function handleCellMouseEnter(pi: number, di: number) {
    if (!isDragging) return;
    if (viewMode === "teacher") return;
    // Add to selection
    setSelectedCells((prev) => {
      const next = new Set(prev);
      next.add(getCellKey(pi, di));
      return next;
    });
  }

  function handleCellClick(e: React.MouseEvent, pi: number, di: number) {
    if (viewMode === "teacher") return;

    // Touch-device tap-to-toggle
    if (isTouchDevice) {
      setSelectedCells((prev) => {
        const next = new Set(prev);
        const key = getCellKey(pi, di);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
      return;
    }

    // editMode single-cell edit (existing behavior) - only when no selection active
    if (editMode && selectedCells.size === 0 && !e.shiftKey) {
      startEdit(pi, di);
    }
  }

  // ── Drag from panel ───────────────────────────────────────────────────────────

  function handlePanelDragStart(subject: string) {
    setDraggedSubject(subject);
  }

  function handleCellDragOver(e: React.DragEvent, pi: number, di: number) {
    if (!draggedSubject) return;
    e.preventDefault();
    setDragOverCell(getCellKey(pi, di));
  }

  function handleCellDrop(e: React.DragEvent, pi: number, di: number) {
    e.preventDefault();
    if (!draggedSubject) return;
    const teacher = ALL_TEACHERS[0]; // default teacher

    if (selectedCells.size > 0) {
      // Assign to all selected cells
      const cells = Array.from(selectedCells).map((k) => {
        const [r, c] = k.split("-").map(Number);
        return { pi: r, di: c };
      });
      const prevSnapshot = timetables;
      setTimetables((prev) => {
        const grid = (prev[currentKey] ?? initEmptyGrid()).map((row) =>
          row.map((c_) => ({ ...c_ })),
        );
        for (const { pi: r, di: c } of cells) {
          if (grid[r]?.[c] !== undefined) {
            grid[r][c] = { subject: draggedSubject, teacher };
          }
        }
        return { ...prev, [currentKey]: grid };
      });
      showUndoSnackbar({ key: currentKey, cells, prev: prevSnapshot });
      toast.success(
        `${draggedSubject} assigned to ${cells.length} slot${cells.length !== 1 ? "s" : ""}`,
      );
      setSelectedCells(new Set());
      setFirstSelected(null);
    } else {
      // Assign to single dropped cell
      const prevSnapshot = timetables;
      setTimetables((prev) => {
        const grid = (prev[currentKey] ?? initEmptyGrid()).map((row) =>
          row.map((c_) => ({ ...c_ })),
        );
        if (grid[pi]?.[di] !== undefined) {
          grid[pi][di] = { subject: draggedSubject, teacher };
        }
        return { ...prev, [currentKey]: grid };
      });
      showUndoSnackbar({
        key: currentKey,
        cells: [{ pi, di }],
        prev: prevSnapshot,
      });
      toast.success(`${draggedSubject} assigned`);
    }
    setDraggedSubject(null);
    setDragOverCell(null);
  }

  function handleGridDragLeave() {
    setDragOverCell(null);
  }

  // ── Render helpers ────────────────────────────────────────────────────────────

  function getCellClassName(pi: number, di: number, readonly: boolean): string {
    if (readonly) return "px-4 py-2 min-w-[130px]";
    const key = getCellKey(pi, di);
    const isSelected = selectedCells.has(key);
    const isDragOver = dragOverCell === key;

    let base =
      "px-4 py-2 min-w-[130px] transition-colors duration-100 select-none";

    if (isDragOver && draggedSubject) {
      base += " bg-amber-100";
    } else if (isSelected) {
      // Selected: light blue bg + blue border
      base += " bg-[#E6F1FB]";
    } else if (isDragging) {
      base += " hover:bg-[#E6F1FB]/60";
    }

    return base;
  }

  function getCellStyle(
    pi: number,
    di: number,
    readonly: boolean,
  ): React.CSSProperties {
    if (readonly) return {};
    const key = getCellKey(pi, di);
    const isSelected = selectedCells.has(key);
    if (isSelected) {
      return { outline: "1.5px solid #378ADD", outlineOffset: "-1.5px" };
    }
    return {};
  }

  function renderGridCell(pi: number, di: number) {
    const isEditing = editMode && editing?.pi === pi && editing?.di === di;
    const cell = currentGrid[pi]?.[di] ?? { subject: "-", teacher: "-" };
    const hasContent = !!(cell.subject && cell.teacher && cell.subject !== "-");
    const isSelected = isCellSelected(pi, di);

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
        tabIndex={editMode ? 0 : -1}
        className={`text-left w-full group ${
          isDragging && hasContent
            ? "cursor-not-allowed"
            : isDragging
              ? "cursor-crosshair"
              : editMode && selectedCells.size === 0
                ? "cursor-pointer hover:bg-secondary/30 rounded p-1 -m-1"
                : isSelected
                  ? "cursor-pointer"
                  : "cursor-default"
        }`}
        onClick={(e) => {
          if (
            editMode &&
            selectedCells.size === 0 &&
            !e.shiftKey &&
            !isDragging
          ) {
            startEdit(pi, di);
          }
        }}
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
    const isSelectable = !readonly && viewMode !== "teacher";

    return (
      <div className="flex gap-4 items-start">
        {/* Main timetable grid */}
        <div
          className="flex-1 bg-card border border-border rounded-2xl overflow-hidden"
          onMouseMove={(e) => {
            if (isDragging) {
              setCursorPos({ x: e.clientX, y: e.clientY });
            }
          }}
        >
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
                      <td
                        key={d}
                        className={getCellClassName(pi, di, readonly)}
                        style={getCellStyle(pi, di, readonly)}
                        onMouseDown={
                          isSelectable
                            ? (e) => handleCellMouseDown(e, pi, di)
                            : undefined
                        }
                        onMouseEnter={
                          isSelectable
                            ? () => handleCellMouseEnter(pi, di)
                            : undefined
                        }
                        onClick={
                          isSelectable
                            ? (e) => handleCellClick(e, pi, di)
                            : undefined
                        }
                        onKeyDown={
                          isSelectable
                            ? (e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  handleCellClick(
                                    e as unknown as React.MouseEvent,
                                    pi,
                                    di,
                                  );
                                }
                              }
                            : undefined
                        }
                        onDragOver={
                          !readonly
                            ? (e) => handleCellDragOver(e, pi, di)
                            : undefined
                        }
                        onDrop={
                          !readonly
                            ? (e) => handleCellDrop(e, pi, di)
                            : undefined
                        }
                        onDragLeave={
                          !readonly ? handleGridDragLeave : undefined
                        }
                        data-ocid={`timetable.cell.${pi}.${di}`}
                      >
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

        {/* Subjects & Teachers panel (right side, only for editable views) */}
        {isSelectable && (
          <div
            className="w-44 shrink-0 bg-card border border-border rounded-2xl p-3 space-y-2"
            data-ocid="timetable.subjects_panel"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pb-1 border-b border-border">
              Drag Subjects
            </p>
            {SUBJECTS.map((subject, idx) => {
              const color = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
              return (
                <div
                  key={subject}
                  draggable
                  onDragStart={() => handlePanelDragStart(subject)}
                  onDragEnd={() => {
                    setDraggedSubject(null);
                    setDragOverCell(null);
                  }}
                  style={{
                    backgroundColor: color.bg,
                    borderColor: color.border,
                    color: color.text,
                  }}
                  className="px-2.5 py-2 rounded-lg border text-xs font-medium cursor-grab active:cursor-grabbing select-none transition-opacity hover:opacity-80"
                  data-ocid={`timetable.subject_card.${idx + 1}`}
                >
                  {subject}
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground/70 pt-1 leading-tight">
              Drag onto a cell or selected cells to assign
            </p>
          </div>
        )}
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
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Timetable</h1>
          {selectedCells.size > 0 && (
            <Badge
              className="bg-[#E6F1FB] text-[#378ADD] border-[#378ADD]/40 font-medium"
              data-ocid="timetable.selection_badge"
            >
              {selectedCells.size} slot{selectedCells.size !== 1 ? "s" : ""}{" "}
              selected
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {selectedCells.size > 0 && (
            <>
              <Button
                size="sm"
                onClick={() => setBulkAssignOpen(true)}
                className="bg-[#378ADD] hover:bg-[#2d6bb5] text-white"
                data-ocid="timetable.assign_selected_button"
              >
                Assign {selectedCells.size} Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCells(new Set());
                  setFirstSelected(null);
                }}
                data-ocid="timetable.clear_selection_button"
              >
                <X className="h-3.5 w-3.5 mr-1" /> Clear
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoOpen(true)}
            data-ocid="timetable.auto_generate.button"
          >
            <Shuffle size={14} className="mr-2" />
            {selectedCells.size > 0
              ? `Auto Assign ${selectedCells.size} Slots`
              : "Auto Generate"}
          </Button>
          {viewMode !== "teacher" && (
            <Button
              variant={editMode ? "secondary" : "outline"}
              size="sm"
              onClick={() => {
                setEditMode((v) => !v);
                cancelEdit();
                setSelectedCells(new Set());
                setFirstSelected(null);
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

      {/* Selection hint bar */}
      {viewMode !== "teacher" && selectedCells.size === 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 border border-border rounded-lg px-3 py-2">
          <span>💡</span>
          <span>
            <strong>Click &amp; drag</strong> to select multiple cells ·
            <strong className="ml-1">Shift+click</strong> for range select ·
            Drag subjects from the panel on the right
          </span>
        </div>
      )}

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
                  setSelectedCells(new Set());
                  setFirstSelected(null);
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
                    setSelectedCells(new Set());
                    setFirstSelected(null);
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
                      setSelectedCells(new Set());
                      setFirstSelected(null);
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
            <DialogTitle>
              {selectedCells.size > 0
                ? `Auto Assign ${selectedCells.size} Selected Slot${selectedCells.size !== 1 ? "s" : ""}`
                : "Auto Generate Timetable"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {selectedCells.size > 0 && (
              <div className="bg-[#E6F1FB] border border-[#378ADD]/30 rounded-lg px-3 py-2 text-sm text-[#378ADD]">
                Will auto-fill only the{" "}
                <strong>
                  {selectedCells.size} selected slot
                  {selectedCells.size !== 1 ? "s" : ""}
                </strong>{" "}
                using round-robin assignment.
              </div>
            )}
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

      {/* ── BULK ASSIGN DIALOG ───────────────────────────────────────────── */}
      <Dialog
        open={bulkAssignOpen}
        onOpenChange={(open) => {
          if (!open) {
            setBulkAssignOpen(false);
            setSelectedCells(new Set());
            setFirstSelected(null);
            setBulkDraft({ subject: "", teacher: "" });
          }
        }}
      >
        <DialogContent
          className="max-w-sm"
          data-ocid="timetable.bulk_assign.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              Assign to all {selectedCells.size} selected slot
              {selectedCells.size !== 1 ? "s" : ""}?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="bg-[#E6F1FB] border border-[#378ADD]/30 rounded-lg px-3 py-2 text-sm text-[#378ADD]">
              <strong>
                {selectedCells.size} slot{selectedCells.size !== 1 ? "s" : ""}
              </strong>{" "}
              will be assigned the same subject and teacher.
            </div>
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select
                value={bulkDraft.subject}
                onValueChange={(v) =>
                  setBulkDraft((p) => ({ ...p, subject: v }))
                }
              >
                <SelectTrigger data-ocid="timetable.bulk.subject_select">
                  <SelectValue placeholder="Select subject" />
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
            <div className="space-y-1.5">
              <Label>Teacher</Label>
              <Select
                value={bulkDraft.teacher}
                onValueChange={(v) =>
                  setBulkDraft((p) => ({ ...p, teacher: v }))
                }
              >
                <SelectTrigger data-ocid="timetable.bulk.teacher_select">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_TEACHERS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setBulkAssignOpen(false);
                  setSelectedCells(new Set());
                  setFirstSelected(null);
                  setBulkDraft({ subject: "", teacher: "" });
                }}
                data-ocid="timetable.bulk.cancel_button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleBulkAssign}
                data-ocid="timetable.bulk.assign_button"
              >
                <Check className="h-4 w-4 mr-1.5" /> Assign All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── FLOATING CURSOR TOOLTIP (drag selection count) ───────────────── */}
      {isDragging && selectedCells.size > 0 && (
        <div
          className="fixed z-50 pointer-events-none px-2 py-1 rounded-md text-xs font-medium text-white shadow-lg"
          style={{
            left: cursorPos.x + 12,
            top: cursorPos.y - 10,
            background: "#378ADD",
          }}
          data-ocid="timetable.drag_tooltip"
        >
          {selectedCells.size} slot{selectedCells.size !== 1 ? "s" : ""}{" "}
          selected
        </div>
      )}

      {/* ── MOBILE: Floating "Assign Selected" button ─────────────────────── */}
      {isTouchDevice && selectedCells.size > 0 && (
        <div
          className="fixed bottom-6 right-6 z-50"
          data-ocid="timetable.mobile_assign_button"
        >
          <Button
            onClick={() => setBulkAssignOpen(true)}
            className="shadow-xl px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: "#378ADD" }}
          >
            Assign Selected ({selectedCells.size})
          </Button>
        </div>
      )}

      {/* ── UNDO SNACKBAR ────────────────────────────────────────────────── */}
      {undoVisible && lastAssignment && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl border border-white/10"
          style={{ background: "#1E293B", color: "#F1F5F9", minWidth: 320 }}
          data-ocid="timetable.undo_snackbar"
        >
          <span className="text-sm flex-1">
            Assigned <strong>{lastAssignment.cells.length}</strong> slot
            {lastAssignment.cells.length !== 1 ? "s" : ""}
            {" · "}
            <span className="opacity-60">auto-dismiss in {undoCountdown}s</span>
          </span>
          <button
            type="button"
            onClick={handleUndo}
            className="text-sm font-semibold px-3 py-1 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: "#60A5FA" }}
            data-ocid="timetable.undo_button"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => setUndoVisible(false)}
            className="opacity-50 hover:opacity-100 transition-opacity ml-1"
            data-ocid="timetable.undo_dismiss_button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
