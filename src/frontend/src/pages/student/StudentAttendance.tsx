import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { mockStudents } from "@/data/mockStudents";
import { useLoadingData } from "@/hooks/useLoadingData";

export function StudentAttendance() {
  const { user } = useAuth();
  const { loading } = useLoadingData(null);

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const student =
    mockStudents.find((s) => s.admissionNo === user?.admissionNo) ||
    mockStudents[0];

  const days = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    status: i < (student.attendance / 100) * 30 ? "P" : "A",
  }));

  return (
    <div className="space-y-5" data-ocid="student_attendance.page">
      <h1 className="text-2xl font-bold text-foreground">My Attendance</h1>
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl font-bold text-green-600">
            {student.attendance}%
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Overall Attendance
            </p>
            <p className="text-xs text-muted-foreground">
              {student.attendance >= 75 ? "Eligible" : "Below minimum 75%"}
            </p>
          </div>
        </div>
        <p className="text-xs font-medium text-muted-foreground mb-3">
          November 2024
        </p>
        <div className="grid grid-cols-10 gap-1.5">
          {days.map((d) => (
            <div
              key={d.day}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                d.status === "P"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {d.day}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-100 rounded" /> Present
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-100 rounded" /> Absent
          </span>
        </div>
      </div>
    </div>
  );
}
