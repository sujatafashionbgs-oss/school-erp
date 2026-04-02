import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { mockStudents } from "@/data/mockStudents";
import { useLoadingData } from "@/hooks/useLoadingData";
import { Bell, CreditCard, FileText, User, UserCheck } from "lucide-react";

interface StudentDashboardProps {
  navigate: (path: string) => void;
}

export function StudentDashboard({ navigate }: StudentDashboardProps) {
  const { user } = useAuth();
  const { loading } = useLoadingData(null);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {["sk0", "sk1", "sk2", "sk3"].map((k) => (
            <Skeleton key={k} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const student =
    mockStudents.find(
      (s) =>
        s.admissionNo === user?.admissionNo || s.admissionNo === user?.email,
    ) || mockStudents[0];

  const cards = [
    {
      label: "Attendance",
      value: `${student.attendance}%`,
      icon: <UserCheck size={22} />,
      path: "/student/attendance",
      color: "text-green-600",
      bg: "bg-green-500/10",
    },
    {
      label: "Fee Due",
      value: student.feeDue > 0 ? `₹${student.feeDue}` : "Paid",
      icon: <CreditCard size={22} />,
      path: "/student/fees",
      color: student.feeDue > 0 ? "text-red-600" : "text-green-600",
      bg: student.feeDue > 0 ? "bg-red-500/10" : "bg-green-500/10",
    },
    {
      label: "Results",
      value: "View",
      icon: <FileText size={22} />,
      path: "/student/results",
      color: "text-purple-600",
      bg: "bg-purple-500/10",
    },
    {
      label: "Notices",
      value: "3 New",
      icon: <Bell size={22} />,
      path: "/student/notices",
      color: "text-orange-600",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="student_dashboard.page">
      <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
          {student.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{student.name}</h1>
          <p className="text-sm text-muted-foreground">
            Class {student.className}-{student.section} · {student.admissionNo}
          </p>
          <Badge className="mt-1 text-xs">{student.status}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <button
            type="button"
            key={c.label}
            onClick={() => navigate(c.path)}
            data-ocid={`student_dashboard.stat.${i + 1}`}
            className="bg-card border border-border rounded-2xl p-4 flex flex-col items-start gap-2 hover:shadow-md transition-shadow text-left"
          >
            <div className={`${c.bg} ${c.color} p-2 rounded-lg`}>{c.icon}</div>
            <p className="text-lg font-bold text-foreground">{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
