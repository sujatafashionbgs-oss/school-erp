import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useLoadingData } from "@/hooks/useLoadingData";
import { Bell, BookOpen, ClipboardList, UserCheck } from "lucide-react";

interface TeacherDashboardProps {
  navigate: (path: string) => void;
}

export function TeacherDashboard({ navigate }: TeacherDashboardProps) {
  const { user } = useAuth();
  const { loading } = useLoadingData(null);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {["sk0", "sk1", "sk2", "sk3"].map((k) => (
            <Skeleton key={k} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  const cards = [
    {
      label: "My Classes",
      value: "3",
      icon: <BookOpen size={22} />,
      path: "/teacher/classes",
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      label: "Today's Attendance",
      value: "Pending",
      icon: <UserCheck size={22} />,
      path: "/teacher/attendance",
      color: "text-green-600",
      bg: "bg-green-500/10",
    },
    {
      label: "Assignments",
      value: "5",
      icon: <ClipboardList size={22} />,
      path: "/teacher/assignments",
      color: "text-purple-600",
      bg: "bg-purple-500/10",
    },
    {
      label: "Notices",
      value: "2 New",
      icon: <Bell size={22} />,
      path: "/teacher/notices",
      color: "text-orange-600",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="teacher_dashboard.page">
      <h1 className="text-2xl font-bold text-foreground">
        Welcome, {user?.name || "Teacher"}
      </h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <button
            type="button"
            key={c.label}
            onClick={() => navigate(c.path)}
            data-ocid={`teacher_dashboard.stat.${i + 1}`}
            className="bg-card border border-border rounded-2xl p-5 flex flex-col items-start gap-2 hover:shadow-md transition-shadow text-left"
          >
            <div className={`${c.bg} ${c.color} p-2 rounded-lg`}>{c.icon}</div>
            <p className="text-lg font-bold text-foreground">{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="font-semibold text-foreground mb-3">Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: "Take Attendance", path: "/teacher/attendance" },
            { label: "Create Assignment", path: "/teacher/assignments" },
            { label: "Upload Materials", path: "/teacher/materials" },
            { label: "Online Exams", path: "/teacher/online-exam" },
            { label: "Notices", path: "/teacher/notices" },
          ].map((l) => (
            <button
              type="button"
              key={l.label}
              onClick={() => navigate(l.path)}
              className="text-sm text-primary underline-offset-2 hover:underline text-left py-1"
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
