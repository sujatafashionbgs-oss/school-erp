import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { mockStudents } from "@/data/mockStudents";
import { useLoadingData } from "@/hooks/useLoadingData";
import { Calendar, CheckCircle, XCircle } from "lucide-react";

const subjectAttendance = [
  { subject: "Mathematics", present: 42, total: 46, percent: 91 },
  { subject: "Science", present: 38, total: 46, percent: 83 },
  { subject: "English", present: 44, total: 46, percent: 96 },
  { subject: "Social Studies", present: 36, total: 46, percent: 78 },
  { subject: "Hindi", present: 40, total: 46, percent: 87 },
  { subject: "Computer", present: 22, total: 23, percent: 96 },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calendarData: Record<string, boolean | null> = {
  "1": true,
  "2": true,
  "3": false,
  "4": true,
  "5": true,
  "8": true,
  "9": true,
  "10": true,
  "11": false,
  "12": true,
  "15": true,
  "16": true,
  "17": true,
  "18": true,
  "19": true,
  "22": false,
  "23": true,
  "24": true,
  "25": true,
  "26": true,
  "29": true,
  "30": true,
  "31": true,
};

export function ParentAttendancePage() {
  const { user } = useAuth();
  const student =
    mockStudents.find((s) => s.admissionNo === user?.admissionNo) ??
    mockStudents[0];
  const { loading } = useLoadingData(student);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const presentDays = Object.values(calendarData).filter(Boolean).length;
  const totalDays = Object.values(calendarData).filter(
    (v) => v !== null,
  ).length;
  const attendancePct = Math.round((presentDays / totalDays) * 100);

  return (
    <div className="space-y-6" data-ocid="parent-attendance.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Attendance History
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {student.name} &bull; {student.className}-{student.section}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Overall Attendance",
            value: `${attendancePct}%`,
            color: "text-green-500",
          },
          { label: "Days Present", value: presentDays, color: "text-blue-500" },
          {
            label: "Days Absent",
            value: totalDays - presentDays,
            color: "text-red-500",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-2xl p-4 text-center"
          >
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">November 2024</h2>
        </div>
        <div className="grid grid-cols-6 gap-1 mb-2">
          {days.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-1">
          <div key="pad-1" />
          <div key="pad-2" />
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const status = calendarData[String(day)];
            if (status === undefined) return <div key={`blank-${day}`} />;
            return (
              <div
                key={day}
                className={`rounded-lg text-center py-1 text-xs font-medium ${
                  status
                    ? "bg-green-500/20 text-green-700 dark:text-green-400"
                    : "bg-red-500/20 text-red-700 dark:text-red-400"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle className="w-3 h-3 text-green-500" /> Present
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <XCircle className="w-3 h-3 text-red-500" /> Absent
          </span>
        </div>
      </div>

      {/* Subject-wise */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-foreground">
            Subject-wise Attendance
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                Subject
              </th>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                Present
              </th>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                Total
              </th>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                Percentage
              </th>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {subjectAttendance.map((row, idx) => (
              <tr
                key={row.subject}
                className="border-t border-border"
                data-ocid={`parent-attendance.item.${idx + 1}`}
              >
                <td className="px-5 py-3 font-medium text-foreground">
                  {row.subject}
                </td>
                <td className="px-5 py-3 text-foreground">{row.present}</td>
                <td className="px-5 py-3 text-muted-foreground">{row.total}</td>
                <td className="px-5 py-3 text-foreground">{row.percent}%</td>
                <td className="px-5 py-3">
                  <Badge
                    variant={
                      row.percent >= 85
                        ? "default"
                        : row.percent >= 75
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {row.percent >= 85
                      ? "Good"
                      : row.percent >= 75
                        ? "Average"
                        : "Low"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
