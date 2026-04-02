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
import { Textarea } from "@/components/ui/textarea";
import { CLASSES, SECTIONS } from "@/data/classConfig";
import { type Student, mockStudents } from "@/data/mockStudents";
import {
  AlertTriangle,
  Brain,
  FileText,
  Flag,
  Search,
  Send,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Deterministic data generators ─────────────────────────────────────────

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
];
const EXAM_TERMS = ["Unit Test 1", "Half Yearly", "Unit Test 2", "Annual"];
const MONTHS = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

function seed(studentId: string): number {
  return studentId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
}

function getExamHistory(studentId: string) {
  const s = seed(studentId);
  return EXAM_TERMS.map((exam, i) => ({
    exam,
    percentage: 45 + ((s * (i + 3)) % 50),
  }));
}

function getSubjectMarksMatrix(studentId: string) {
  const s = seed(studentId);
  return SUBJECTS.map((_subject, si) =>
    EXAM_TERMS.map((_, ti) =>
      Math.min(100, 40 + ((s * (si + 2) * (ti + 1)) % 55)),
    ),
  );
}

function getMonthlyAttendance(studentId: string) {
  const s = seed(studentId);
  return MONTHS.map((month, i) => ({
    month,
    pct: 60 + ((s * (i + 5)) % 38),
  }));
}

function getInsights(studentId: string) {
  const matrix = getSubjectMarksMatrix(studentId);
  // Compare last two exams for each subject
  const deltas = SUBJECTS.map((subject, si) => ({
    subject,
    delta: matrix[si][3] - matrix[si][1], // Annual - Half Yearly
  }));
  const best = deltas.reduce((a, b) => (a.delta > b.delta ? a : b));
  const worst = deltas.reduce((a, b) => (a.delta < b.delta ? a : b));
  const attMonths = getMonthlyAttendance(studentId);
  const lowAttMonth = attMonths.find((m) => m.pct < 75);
  const insights = [
    {
      type: best.delta >= 0 ? "positive" : "neutral",
      icon: best.delta >= 0 ? "up" : "neutral",
      text: `${best.delta >= 0 ? "Improving" : "Stable"} in ${best.subject} ${best.delta >= 0 ? `+${best.delta}%` : `${best.delta}%`}`,
    },
    {
      type: worst.delta < 0 ? "negative" : "neutral",
      icon: worst.delta < 0 ? "down" : "neutral",
      text: `Needs attention in ${worst.subject} ${worst.delta}%`,
    },
  ];
  if (lowAttMonth) {
    insights.push({
      type: "negative",
      icon: "warn",
      text: `Attendance dropped below 75% in ${lowAttMonth.month}`,
    });
  } else {
    const hiAtt = attMonths.reduce((a, b) => (a.pct > b.pct ? a : b));
    insights.push({
      type: "positive",
      icon: "up",
      text: `Best attendance in ${hiAtt.month}: ${hiAtt.pct}%`,
    });
  }
  return insights;
}

// ─── Bar Chart (pure CSS) ────────────────────────────────────────────────────

function ExamBarChart({
  data,
}: { data: { exam: string; percentage: number }[] }) {
  const max = 100;
  return (
    <div
      className="flex items-end gap-2 h-40 w-full"
      data-ocid="student_perf.exam_chart"
    >
      {data.map(({ exam, percentage }) => {
        const barColor =
          percentage >= 75
            ? "bg-green-500"
            : percentage >= 50
              ? "bg-yellow-500"
              : "bg-red-500";
        const heightPct = Math.round((percentage / max) * 100);
        return (
          <div key={exam} className="flex flex-col items-center flex-1 gap-1">
            <span className="text-xs font-semibold text-foreground">
              {percentage}%
            </span>
            <div
              className={`w-full rounded-t-md ${barColor} transition-all duration-500`}
              style={{ height: `${heightPct}%` }}
            />
            <span className="text-[10px] text-muted-foreground text-center leading-tight">
              {exam.replace("Unit Test", "UT")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AttendanceBarChart({
  data,
}: { data: { month: string; pct: number }[] }) {
  return (
    <div
      className="flex items-end gap-1.5 h-28 w-full"
      data-ocid="student_perf.attendance_chart"
    >
      {data.map(({ month, pct }) => {
        const barColor =
          pct >= 85
            ? "bg-green-500"
            : pct >= 75
              ? "bg-yellow-400"
              : "bg-red-500";
        const heightPct = Math.round((pct / 100) * 100);
        return (
          <div key={month} className="flex flex-col items-center flex-1 gap-1">
            <span className="text-[10px] font-medium text-foreground">
              {pct}%
            </span>
            <div
              className={`w-full rounded-t-sm ${barColor} transition-all duration-500`}
              style={{ height: `${heightPct}%` }}
            />
            <span className="text-[10px] text-muted-foreground">{month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function StudentPerformancePage() {
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterSection, setFilterSection] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string>(mockStudents[0].id);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [remarks, setRemarks] = useState<
    Record<string, Record<string, string>>
  >({});

  const filteredStudents = mockStudents.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.admissionNo.includes(q) ||
      s.rollNo.includes(q);
    const matchClass = filterClass === "all" || s.className === filterClass;
    const matchSection = filterSection === "all" || s.section === filterSection;
    return matchSearch && matchClass && matchSection;
  });

  const student =
    mockStudents.find((s) => s.id === selectedId) ?? mockStudents[0];
  const examHistory = getExamHistory(student.id);
  const marksMatrix = getSubjectMarksMatrix(student.id);
  const attendanceTrend = getMonthlyAttendance(student.id);
  const insights = getInsights(student.id);
  const isFlagged = flagged.has(student.id);

  function getRemarks(studentId: string, subject: string) {
    return remarks[studentId]?.[subject] ?? "";
  }
  function setRemark(studentId: string, subject: string, value: string) {
    setRemarks((prev) => ({
      ...prev,
      [studentId]: { ...(prev[studentId] ?? {}), [subject]: value },
    }));
  }

  function handleSendReport() {
    const avg = Math.round(
      examHistory.reduce((a, e) => a + e.percentage, 0) / examHistory.length,
    );
    const msg = encodeURIComponent(
      `Dear Parent,\n\nProgress Report for ${student.name} (Class ${student.className}-${student.section}):\n${examHistory.map((e) => `${e.exam}: ${e.percentage}%`).join(", ")}\nOverall Average: ${avg}%\nAttendance: ${student.attendance}%\n\n- SmartSkale School`,
    );
    window.open(`https://wa.me/91${student.mobile}?text=${msg}`, "_blank");
  }

  function handleFlag() {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(student.id)) {
        next.delete(student.id);
        toast.info(`${student.name} unflagged for counseling.`);
      } else {
        next.add(student.id);
        toast.warning(`${student.name} flagged for counseling.`);
      }
      return next;
    });
  }

  return (
    <div className="space-y-4" data-ocid="student_performance.page">
      <h1 className="text-2xl font-bold text-foreground">
        Student Performance
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* ── LEFT: Student Selector ── */}
        <div className="lg:col-span-1 bg-card border border-border rounded-2xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border space-y-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                className="pl-8 h-8 text-sm"
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="student_performance.search.input"
              />
            </div>
            <div className="flex gap-1.5">
              <Select
                value={filterClass}
                onValueChange={(v) => {
                  setFilterClass(v);
                  setFilterSection("all");
                }}
              >
                <SelectTrigger
                  className="h-7 text-xs flex-1"
                  data-ocid="student_performance.class_filter"
                >
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  <SelectItem value="all">All Classes</SelectItem>
                  {CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterSection} onValueChange={setFilterSection}>
                <SelectTrigger
                  className="h-7 text-xs w-16"
                  data-ocid="student_performance.section_filter"
                >
                  <SelectValue placeholder="Sec" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {SECTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filteredStudents.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground text-center">
                No students found
              </p>
            )}
            {filteredStudents.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedId(s.id)}
                className={`w-full text-left px-3 py-2.5 hover:bg-secondary/60 transition-colors ${
                  s.id === selectedId
                    ? "bg-primary/5 border-l-2 border-primary"
                    : ""
                }`}
                data-ocid={`student_performance.student_item.${s.id}`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.className}-{s.section} · Roll {s.rollNo}
                    </p>
                  </div>
                  {flagged.has(s.id) && (
                    <Badge className="text-[10px] shrink-0 bg-orange-500/10 text-orange-600 border-orange-200">
                      <Flag size={10} className="mr-0.5" /> Flag
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Performance Dashboard ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Student header */}
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">
                  {student.name}
                </h2>
                {isFlagged && (
                  <Badge className="bg-orange-500/10 text-orange-600 border-orange-200">
                    <Flag size={12} className="mr-1" /> Counseling
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Class {student.className}-{student.section} · Roll{" "}
                {student.rollNo} · Adm {student.admissionNo}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSendReport}
                data-ocid="student_performance.send_report.button"
              >
                <Send size={14} className="mr-1" /> Send Report
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success("PDF report generated!")}
                data-ocid="student_performance.generate_pdf.button"
              >
                <FileText size={14} className="mr-1" /> Generate PDF
              </Button>
              <Button
                size="sm"
                variant={isFlagged ? "destructive" : "outline"}
                onClick={handleFlag}
                data-ocid="student_performance.flag.button"
              >
                <Flag size={14} className="mr-1" />
                {isFlagged ? "Unflag" : "Flag for Counseling"}
              </Button>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exam History bar chart */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Exam History
              </h3>
              <ExamBarChart data={examHistory} />
              <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" />
                  ≥75%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500 inline-block" />
                  50–74%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />
                  &lt;50%
                </span>
              </div>
            </div>

            {/* Monthly attendance */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Monthly Attendance Trend
              </h3>
              <AttendanceBarChart data={attendanceTrend} />
              <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" />
                  ≥85%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-yellow-400 inline-block" />
                  75–84%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />
                  &lt;75%
                </span>
              </div>
            </div>
          </div>

          {/* Subject-wise marks matrix */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">
                Subject-wise Marks Matrix
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="p-3 text-left font-medium text-muted-foreground">
                      Subject
                    </th>
                    {EXAM_TERMS.map((term) => (
                      <th
                        key={term}
                        className="p-3 text-center font-medium text-muted-foreground"
                      >
                        {term}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SUBJECTS.map((subject, si) => (
                    <tr
                      key={subject}
                      className="border-t border-border hover:bg-secondary/20"
                    >
                      <td className="p-3 font-medium text-foreground">
                        {subject}
                      </td>
                      {marksMatrix[si].map((mark, ti) => {
                        const color =
                          mark >= 75
                            ? "text-green-600 bg-green-500/10"
                            : mark >= 50
                              ? "text-yellow-700 bg-yellow-500/10"
                              : "text-red-600 bg-red-500/10";
                        return (
                          <td key={EXAM_TERMS[ti]} className="p-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-md text-xs font-semibold ${color}`}
                            >
                              {mark}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={16} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                AI Insights
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {insights.map((insight, i) => {
                const styles = {
                  positive:
                    "bg-green-500/8 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400",
                  negative:
                    "bg-red-500/8 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
                  neutral: "bg-secondary border-border text-muted-foreground",
                };
                const IconEl =
                  insight.icon === "up"
                    ? TrendingUp
                    : insight.icon === "down"
                      ? TrendingDown
                      : AlertTriangle;
                return (
                  <div
                    key={insight.text}
                    className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${styles[insight.type as keyof typeof styles]}`}
                    data-ocid={`student_performance.insight.${i + 1}`}
                  >
                    <IconEl size={15} className="mt-0.5 shrink-0" />
                    <span>{insight.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teacher Remarks */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Teacher Remarks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUBJECTS.map((subject) => (
                <div key={subject} className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">
                    {subject}
                  </Label>
                  <Textarea
                    rows={2}
                    placeholder={`Remark for ${subject}...`}
                    value={getRemarks(student.id, subject)}
                    onChange={(e) =>
                      setRemark(student.id, subject, e.target.value)
                    }
                    className="text-sm resize-none"
                    data-ocid={`student_performance.remark_${subject.toLowerCase().replace(/ /g, "_")}.textarea`}
                  />
                </div>
              ))}
            </div>
            <Button
              size="sm"
              className="mt-3"
              onClick={() => toast.success("Remarks saved successfully")}
              data-ocid="student_performance.save_remarks.button"
            >
              Save Remarks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
