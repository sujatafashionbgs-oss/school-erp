import { ExportButtons } from "@/components/ExportButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CLASSES } from "@/data/classConfig";
import { mockStudents } from "@/data/mockStudents";
import { useClassConfig } from "@/hooks/useClassConfig";
import { useActor } from "@caffeineai/core-infrastructure";
import { Check, Search, WifiOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import { AttendanceStatus } from "../../backend";
import type { AttendanceRecord, StudentRecord } from "../../backend.d.ts";

type UIAttendanceStatus = "Present" | "Absent" | "Late" | "Leave";

const TODAY = new Date().toISOString().split("T")[0];

const STATUS_STYLES: Record<UIAttendanceStatus, string> = {
  Present: "bg-green-100 text-green-700 hover:bg-green-200",
  Absent: "bg-red-100 text-red-700 hover:bg-red-200",
  Late: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  Leave: "bg-blue-100 text-blue-700 hover:bg-blue-200",
};

// Map UI status → Candid AttendanceStatus enum
function toBackendStatus(s: UIAttendanceStatus): AttendanceStatus {
  switch (s) {
    case "Present":
      return AttendanceStatus.present;
    case "Absent":
      return AttendanceStatus.absent;
    case "Late":
      return AttendanceStatus.late;
    case "Leave":
      return AttendanceStatus.halfDay;
  }
}

// Map backend AttendanceStatus → UI status
function fromBackendStatus(s: AttendanceStatus): UIAttendanceStatus {
  switch (s) {
    case AttendanceStatus.present:
      return "Present";
    case AttendanceStatus.absent:
      return "Absent";
    case AttendanceStatus.late:
      return "Late";
    case AttendanceStatus.halfDay:
      return "Leave";
  }
}

// Minimal student shape needed for attendance UI
interface AttendanceStudent {
  id: string;
  name: string;
  rollNo: string;
  admissionNo: string;
}

function fromBackendStudent(r: StudentRecord): AttendanceStudent {
  return {
    id: r.id,
    name: r.name,
    rollNo: String(r.rollNo),
    admissionNo: r.admissionNo,
  };
}

function AttendanceSkeleton() {
  const clsKeys = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"];
  const rowKeys = ["r1", "r2", "r3", "r4", "r5", "r6"];
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="flex gap-2 flex-wrap">
        {clsKeys.map((k) => (
          <Skeleton key={k} className="h-8 w-20 rounded-lg" />
        ))}
      </div>
      <div className="space-y-2">
        {rowKeys.map((k) => (
          <Skeleton key={k} className="h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function AttendancePage({
  navigate,
}: { navigate?: (p: string) => void }) {
  const { actor, isFetching: isActorLoading } = useActor(createActor);
  const { getActiveSections } = useClassConfig();

  const [date, setDate] = useState(TODAY);
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedSection, setSelectedSection] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  const [classStudents, setClassStudents] = useState<AttendanceStudent[]>([]);
  const [attendance, setAttendance] = useState<
    Record<string, UIAttendanceStatus>
  >({});
  const [isPreviouslySaved, setIsPreviouslySaved] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Use all CLASSES from config
  const classes = CLASSES;

  const getSections = (cls: string): string[] => {
    if (cls === "XI" || cls === "XII") {
      return ["Science", "Commerce", "Arts"];
    }
    return getActiveSections(cls);
  };

  const sections = getSections(selectedClass);

  // ─── Load students for the selected class/section ─────────────────────────
  const loadClassStudents = useCallback(
    async (cls: string, sec: string) => {
      setIsLoadingStudents(true);
      try {
        if (!actor || isActorLoading) throw new Error("actor unavailable");
        const records = await actor.loadStudentsByClass(cls, sec || null);
        setClassStudents(records.map(fromBackendStudent));
        setIsDemoMode(false);
      } catch {
        // Fallback to mock
        const filtered = mockStudents.filter((s) => {
          if (s.className !== cls) return false;
          if (sec && s.section !== sec) return false;
          return true;
        });
        setClassStudents(
          filtered.map((s) => ({
            id: s.id,
            name: s.name,
            rollNo: s.rollNo,
            admissionNo: s.admissionNo,
          })),
        );
        setIsDemoMode(true);
      } finally {
        setIsLoadingStudents(false);
      }
    },
    [actor, isActorLoading],
  );

  // ─── Load attendance for date/class/section ───────────────────────────────
  const loadAttendance = useCallback(
    async (d: string, cls: string, sec: string) => {
      setIsLoadingAttendance(true);
      try {
        if (!actor || isActorLoading) throw new Error("actor unavailable");

        // Check if previously saved
        const hasSaved = await actor.hasAttendanceForDate(d, cls, sec);
        setIsPreviouslySaved(hasSaved);

        if (hasSaved) {
          const records = await actor.loadAttendanceByDate(d, cls, sec);
          const map: Record<string, UIAttendanceStatus> = {};
          for (const r of records) {
            map[r.studentId] = fromBackendStatus(r.status);
          }
          setAttendance(map);
        } else {
          // Default all present
          setAttendance(
            Object.fromEntries(
              classStudents.map((s) => [s.id, "Present" as UIAttendanceStatus]),
            ),
          );
        }
      } catch {
        // Fallback: default all present
        setAttendance(
          Object.fromEntries(
            classStudents.map((s) => [s.id, "Present" as UIAttendanceStatus]),
          ),
        );
        setIsPreviouslySaved(false);
      } finally {
        setIsLoadingAttendance(false);
        setSaved(false);
      }
    },
    [actor, isActorLoading, classStudents],
  );

  // Load students when class/section changes
  useEffect(() => {
    if (!isActorLoading) {
      loadClassStudents(selectedClass, selectedSection);
    }
  }, [selectedClass, selectedSection, isActorLoading, loadClassStudents]);

  // Load attendance when date/class/section changes (after students loaded)
  useEffect(() => {
    if (!isLoadingStudents && !isActorLoading) {
      loadAttendance(date, selectedClass, selectedSection);
    }
  }, [
    date,
    selectedClass,
    selectedSection,
    isLoadingStudents,
    isActorLoading,
    loadAttendance,
  ]);

  const displayStudents = classStudents.filter((s) => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.rollNo.includes(q) ||
      s.admissionNo.toLowerCase().includes(q)
    );
  });

  const toggle = (id: string) => {
    setAttendance((prev) => {
      const cur = prev[id] ?? "Present";
      const next: UIAttendanceStatus =
        cur === "Present"
          ? "Absent"
          : cur === "Absent"
            ? "Late"
            : cur === "Late"
              ? "Leave"
              : "Present";
      return { ...prev, [id]: next };
    });
    setSaved(false);
  };

  const handleDateChange = (value: string) => {
    if (value > TODAY) {
      toast.error("Cannot mark attendance for a future date.");
      return;
    }
    setDate(value);
    setSaved(false);
  };

  const markAllPresent = () => {
    setAttendance(
      Object.fromEntries(
        classStudents.map((s) => [s.id, "Present" as UIAttendanceStatus]),
      ),
    );
    setSaved(false);
    toast.success("All students marked Present");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (actor && !isActorLoading) {
        const records: AttendanceRecord[] = classStudents.map((s) => ({
          id: `att-${date}-${s.id}`,
          studentId: s.id,
          date,
          className: selectedClass,
          section: selectedSection,
          status: toBackendStatus(attendance[s.id] ?? "Present"),
          markedBy: "admin",
          remarks: "",
        }));

        const result = await actor.saveDailyAttendance(
          date,
          selectedClass,
          selectedSection,
          records,
        );
        if (result.__kind__ === "err") throw new Error(result.err);
        setIsPreviouslySaved(true);
        toast.success("Attendance saved successfully!");
      } else {
        toast.success("Attendance saved (demo mode)");
      }
      setSaved(true);
    } catch (err) {
      toast.error(
        `Save failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const counts = {
    Present: classStudents.filter(
      (s) => (attendance[s.id] ?? "Present") === "Present",
    ).length,
    Absent: classStudents.filter(
      (s) => (attendance[s.id] ?? "Present") === "Absent",
    ).length,
    Late: classStudents.filter(
      (s) => (attendance[s.id] ?? "Present") === "Late",
    ).length,
    Leave: classStudents.filter(
      (s) => (attendance[s.id] ?? "Present") === "Leave",
    ).length,
  };

  const exportData = classStudents.map((s) => ({
    Name: s.name,
    "Admission No": s.admissionNo,
    "Roll No": s.rollNo,
    Status: attendance[s.id] ?? "Present",
    Date: date,
    Class: `${selectedClass}${selectedSection ? `-${selectedSection}` : ""}`,
  }));

  return (
    <div className="space-y-5" data-ocid="attendance.page">
      {isDemoMode && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          <WifiOff size={15} />
          <span>Demo mode — showing sample data. Backend unavailable.</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground text-sm">
            Mark daily attendance for students
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <ExportButtons
            title={`Attendance_${date}_${selectedClass}`}
            data={exportData}
          />
          <input
            type="date"
            value={date}
            max={TODAY}
            onChange={(e) => handleDateChange(e.target.value)}
            className="h-10 px-3 rounded-lg border border-input bg-background text-sm"
            data-ocid="attendance.date.input"
          />
        </div>
      </div>

      {/* Class tabs — ALL classes from config, scrollable */}
      <div
        className="flex gap-2 flex-wrap max-h-28 overflow-y-auto pb-1"
        data-ocid="attendance.class.tabs"
      >
        {classes.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => {
              setSelectedClass(c);
              setSelectedSection("");
              setStudentSearch("");
            }}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors whitespace-nowrap ${
              selectedClass === c
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:bg-secondary"
            }`}
            data-ocid="attendance.class.tab"
          >
            {c === "I" ||
            c === "II" ||
            c === "III" ||
            c === "IV" ||
            c === "V" ||
            c === "VI" ||
            c === "VII" ||
            c === "VIII" ||
            c === "IX" ||
            c === "X" ||
            c === "XI" ||
            c === "XII"
              ? `Class ${c}`
              : c}
          </button>
        ))}
      </div>

      {/* Section filter + search */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={selectedSection}
          onChange={(e) => {
            setSelectedSection(e.target.value);
            setStudentSearch("");
          }}
          className="h-9 px-3 rounded-lg border border-input bg-background text-sm"
          data-ocid="attendance.section.select"
        >
          <option value="">All Sections</option>
          {sections.map((sec) => (
            <option key={sec} value={sec}>
              {selectedClass === "XI" || selectedClass === "XII"
                ? sec
                : `Section ${sec}`}
            </option>
          ))}
        </select>

        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search by name, roll no or admission no..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
            data-ocid="attendance.student_search.input"
          />
        </div>

        <span className="text-sm text-muted-foreground">
          {displayStudents.length} / {classStudents.length} students
        </span>

        {classStudents.length === 0 && !isLoadingStudents && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md">
            No students enrolled in this class/section yet
          </span>
        )}
      </div>

      {/* Summary bar */}
      <div className="flex gap-3 flex-wrap items-center">
        {(Object.entries(counts) as [UIAttendanceStatus, number][]).map(
          ([status, count]) => (
            <div
              key={status}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                status === "Present"
                  ? "bg-green-100 text-green-700"
                  : status === "Absent"
                    ? "bg-red-100 text-red-700"
                    : status === "Late"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
              }`}
            >
              {status}: {count}
            </div>
          ),
        )}
        {isPreviouslySaved && date < TODAY && (
          <span className="text-xs bg-purple-100 text-purple-700 border border-purple-200 px-2 py-1 rounded-md font-medium">
            ✓ Previously Saved
          </span>
        )}
      </div>

      {isLoadingStudents || isLoadingAttendance ? (
        <AttendanceSkeleton />
      ) : (
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              {selectedClass}
              {selectedSection ? ` — ${selectedSection}` : ""} &nbsp;·&nbsp;
              {counts.Present}/{classStudents.length} present
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={markAllPresent}
                disabled={classStudents.length === 0}
                data-ocid="attendance.mark_all.button"
              >
                ✅ Mark All Present
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={classStudents.length === 0 || isSaving}
                data-ocid="attendance.save.button"
              >
                {saved ? (
                  <>
                    <Check size={14} className="mr-1" /> Saved
                  </>
                ) : isSaving ? (
                  "Saving…"
                ) : (
                  "Save Attendance"
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {displayStudents.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/30 transition-colors"
                data-ocid={`attendance.item.${i + 1}`}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold shrink-0">
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <button
                    type="button"
                    className="text-sm font-medium text-foreground cursor-pointer hover:text-primary hover:underline text-left truncate block max-w-full"
                    onClick={() =>
                      navigate?.(`/admin/students?highlight=${s.id}`)
                    }
                  >
                    {s.name}
                  </button>
                  <p className="text-xs text-muted-foreground">
                    Roll {s.rollNo} &nbsp;·&nbsp; {s.admissionNo}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(s.id)}
                  data-ocid={`attendance.toggle.${i + 1}`}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                    STATUS_STYLES[attendance[s.id] ?? "Present"]
                  }`}
                >
                  {attendance[s.id] ?? "Present"}
                </button>
              </div>
            ))}

            {classStudents.length === 0 && (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="attendance.empty_state"
              >
                <p className="text-base font-medium">
                  No students found in {selectedClass}
                  {selectedSection ? ` — ${selectedSection}` : ""}
                </p>
                <p className="text-sm mt-1">
                  Add students to this class from the Students module.
                </p>
              </div>
            )}

            {classStudents.length > 0 && displayStudents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No students match your search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
