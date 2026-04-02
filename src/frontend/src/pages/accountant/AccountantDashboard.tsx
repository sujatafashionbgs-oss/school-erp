import { Skeleton } from "@/components/ui/skeleton";
import { mockStaff } from "@/data/mockStaff";
import { mockStudents } from "@/data/mockStudents";
import { useLoadingData } from "@/hooks/useLoadingData";
import { AlertCircle, CreditCard, TrendingUp, Users } from "lucide-react";

interface Props {
  navigate: (path: string) => void;
}

export function AccountantDashboard({ navigate }: Props) {
  const { loading } = useLoadingData(null);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {["sk0", "sk1", "sk2", "sk3"].map((k) => (
            <Skeleton key={k} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const totalDue = mockStudents.reduce((a, s) => a + s.feeDue, 0);
  const totalSalary = mockStaff
    .filter((s) => s.status === "Active")
    .reduce((a, s) => a + s.salary, 0);
  const collectionRate = Math.round(
    (mockStudents.filter((s) => s.feeDue === 0).length / mockStudents.length) *
      100,
  );

  const stats = [
    {
      label: "Fee Due",
      value: `₹${(totalDue / 1000).toFixed(1)}k`,
      icon: <AlertCircle size={22} />,
      color: "text-red-600",
      bg: "bg-red-500/10",
      path: "/admin/fees",
    },
    {
      label: "Monthly Salary",
      value: `₹${(totalSalary / 1000).toFixed(0)}k`,
      icon: <Users size={22} />,
      color: "text-purple-600",
      bg: "bg-purple-500/10",
      path: "/accountant/salary",
    },
    {
      label: "Collection Rate",
      value: `${collectionRate}%`,
      icon: <TrendingUp size={22} />,
      color: "text-green-600",
      bg: "bg-green-500/10",
      path: "/admin/fees",
    },
    {
      label: "Collect Fee",
      value: "Now",
      icon: <CreditCard size={22} />,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      path: "/admin/fees/collect",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="accountant_dashboard.page">
      <h1 className="text-2xl font-bold text-foreground">
        Accountant Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((c, i) => (
          <button
            type="button"
            key={c.label}
            onClick={() => navigate(c.path)}
            data-ocid={`accountant_dashboard.stat.${i + 1}`}
            className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow text-left"
          >
            <div className={`${c.bg} ${c.color} p-3 rounded-xl`}>{c.icon}</div>
            <div>
              <p className="text-xl font-bold text-foreground">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
