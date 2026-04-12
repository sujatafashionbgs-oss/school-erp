import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { mockStaff } from "@/data/mockStaff";
import { mockStudents } from "@/data/mockStudents";
import { useLoadingData } from "@/hooks/useLoadingData";
import {
  AlertCircle,
  AlertTriangle,
  Banknote,
  Bell,
  Calendar,
  CheckSquare,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  Layers,
  Package,
  RefreshCw,
  TrendingUp,
  UserCheck,
  UserPlus,
  UserX,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardProps {
  navigate: (path: string) => void;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["sk0", "sk1", "sk2", "sk3"].map((k) => (
          <Skeleton key={k} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}

const UPCOMING_EVENTS = [
  {
    date: "Dec 15",
    name: "Annual Day",
    type: "Event",
    color: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800",
  },
  {
    date: "Dec 18",
    name: "Parent-Teacher Meeting",
    type: "Meeting",
    color:
      "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800",
  },
  {
    date: "Dec 22",
    name: "Winter Break",
    type: "Holiday",
    color:
      "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800",
  },
  {
    date: "Jan 5",
    name: "Board Exam Mock Test",
    type: "Exam",
    color:
      "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800",
  },
];

const LOW_STOCK_ITEMS = [
  { name: "A4 Paper Reams", qty: 3, reorder: 10 },
  { name: "Whiteboard Markers", qty: 5, reorder: 20 },
  { name: "Chalk Boxes", qty: 2, reorder: 15 },
];

export function AdminDashboard({ navigate }: DashboardProps) {
  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter(
    (s) => s.status === "Active",
  ).length;
  const totalFeesDue = mockStudents.reduce((acc, s) => acc + s.feeDue, 0);
  const avgAttendance = Math.round(
    mockStudents.reduce((acc, s) => acc + s.attendance, 0) / totalStudents,
  );
  const activeStaff = mockStaff.filter((s) => s.status === "Active").length;

  const today = new Date();
  const todayMD = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const birthdayStudents = mockStudents.filter(
    (s) => s.dob?.slice(5) === todayMD,
  );
  const birthdayEntries: { name: string; role: string }[] =
    birthdayStudents.length > 0
      ? birthdayStudents.map((s) => ({
          name: s.name,
          role: `Class ${s.className}-${s.section}`,
        }))
      : [
          { name: "Aarav Sharma", role: "Class VIII-A" },
          { name: "Sunita Patel", role: "Staff" },
        ];

  const { loading } = useLoadingData(null);
  if (loading) return <DashboardSkeleton />;

  const stats = [
    {
      label: "Total Students",
      value: totalStudents,
      sub: `${activeStudents} active`,
      icon: <GraduationCap size={22} />,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      path: "/admin/students",
    },
    {
      label: "Total Staff",
      value: activeStaff,
      sub: `${mockStaff.length} total`,
      icon: <Users size={22} />,
      color: "text-purple-600",
      bg: "bg-purple-500/10",
      path: "/admin/staff",
    },
    {
      label: "Fee Due",
      value: `₹${(totalFeesDue / 1000).toFixed(1)}k`,
      sub: "This month",
      icon: <CreditCard size={22} />,
      color: "text-orange-600",
      bg: "bg-orange-500/10",
      path: "/admin/fees",
    },
    {
      label: "Avg Attendance",
      value: `${avgAttendance}%`,
      sub: "This month",
      icon: <TrendingUp size={22} />,
      color: "text-green-600",
      bg: "bg-green-500/10",
      path: "/admin/attendance",
    },
  ];

  const alerts = [
    {
      type: "warning",
      msg: `${mockStudents.filter((s) => s.feeDue > 0).length} students have pending fees`,
    },
    {
      type: "info",
      msg: `${mockStudents.filter((s) => s.attendance < 75).length} students below 75% attendance`,
    },
  ];

  const recentStudents = mockStudents.slice(0, 5);

  const PENDING_APPROVALS = [
    {
      label: "Leave Requests",
      count: 7,
      path: "/admin/leave",
      color: "text-orange-600",
    },
    {
      label: "Fee Waivers",
      count: 3,
      path: "/admin/fees",
      color: "text-red-600",
    },
    {
      label: "Admissions",
      count: 5,
      path: "/admin/admissions",
      color: "text-blue-600",
    },
  ];

  const QUICK_ACTIONS = [
    {
      label: "Collect Fee",
      icon: <CreditCard size={20} />,
      path: "/admin/fees/collect",
      bg: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Add Student",
      icon: <UserPlus size={20} />,
      path: "/admin/students",
      bg: "bg-green-500/10 text-green-600",
    },
    {
      label: "Send Notice",
      icon: <Bell size={20} />,
      path: "/admin/notices",
      bg: "bg-purple-500/10 text-purple-600",
    },
    {
      label: "Attendance",
      icon: <ClipboardCheck size={20} />,
      path: "/admin/attendance",
      bg: "bg-orange-500/10 text-orange-600",
    },
  ];

  const feeCollected = 23400;
  const feeTarget = 50000;
  const feePct = Math.round((feeCollected / feeTarget) * 100);

  const moduleStats = [
    {
      label: "Split Billing Active",
      value: "5 students",
      sub: "1 inactive",
      icon: <Users size={20} />,
      color: "text-cyan-600",
      bg: "bg-cyan-500/10",
      path: "/admin/split-billing",
    },
    {
      label: "Payment Plans",
      value: "2 overdue",
      sub: "6 total plans",
      icon: <CreditCard size={20} />,
      color: "text-red-600",
      bg: "bg-red-500/10",
      path: "/admin/payment-plans",
    },
    {
      label: "Reconciliation",
      value: "5 pending",
      sub: "13 auto-reconciled today",
      icon: <RefreshCw size={20} />,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10",
      path: "/admin/reconciliation",
    },
    {
      label: "Cash Desk Today",
      value: "₹26,300",
      sub: "5 transactions",
      icon: <Banknote size={20} />,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      path: "/admin/cash-desk",
    },
    {
      label: "Forms Pending",
      value: "3 forms",
      sub: "242 responses awaited",
      icon: <FileText size={20} />,
      color: "text-violet-600",
      bg: "bg-violet-500/10",
      path: "/admin/forms",
    },
    {
      label: "Unexplained Absences",
      value: "4 today",
      sub: "2 escalated",
      icon: <UserX size={20} />,
      color: "text-rose-600",
      bg: "bg-rose-500/10",
      path: "/admin/absence-workflow",
    },
    {
      label: "Tasks",
      value: "3 overdue",
      sub: "4 due today",
      icon: <CheckSquare size={20} />,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      path: "/admin/tasks",
    },
    {
      label: "Class Builder",
      value: "3/48 classes built",
      sub: "19 students allocated",
      icon: <Layers size={20} />,
      color: "text-teal-600",
      bg: "bg-teal-500/10",
      path: "/admin/class-builder",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="admin_dashboard.page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">School overview</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <button
            type="button"
            key={s.label}
            onClick={() => navigate(s.path)}
            data-ocid={`admin_dashboard.stat.${i + 1}`}
            className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow text-left"
          >
            <div className={`${s.bg} ${s.color} p-3 rounded-xl`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Module Summary Cards — new modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {moduleStats.map((s, i) => (
          <button
            type="button"
            key={s.label}
            onClick={() => navigate(s.path)}
            data-ocid={`admin_dashboard.module_stat.${i + 1}`}
            className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow text-left"
          >
            <div className={`${s.bg} ${s.color} p-3 rounded-xl`}>{s.icon}</div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-yellow-500" />
          <h2 className="font-semibold text-foreground">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <button
              type="button"
              key={a.label}
              onClick={() => navigate(a.path)}
              data-ocid="admin_dashboard.quick_action.button"
              className={`flex flex-col items-center gap-2 rounded-xl p-4 hover:shadow-md transition-shadow ${a.bg}`}
            >
              {a.icon}
              <span className="text-xs font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Row: Fee Collection + Pending Approvals + Birthdays */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Fee Collection */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CreditCard size={15} className="text-green-500" />
              Today's Fee Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>
                  Collected:{" "}
                  <span className="text-foreground font-bold text-base">
                    ₹{feeCollected.toLocaleString("en-IN")}
                  </span>
                </span>
                <span>Target: ₹{feeTarget.toLocaleString("en-IN")}</span>
              </div>
              <Progress value={feePct} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {feePct}% of daily target achieved
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs"
              onClick={() => navigate("/admin/fees/collect")}
              data-ocid="admin_dashboard.fee_collection.button"
            >
              View Details
            </Button>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ClipboardCheck size={15} className="text-orange-500" />
                Pending Approvals
              </span>
              <Badge variant="destructive" className="text-xs">
                {PENDING_APPROVALS.reduce((a, b) => a + b.count, 0)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {PENDING_APPROVALS.map((p) => (
              <button
                type="button"
                key={p.label}
                onClick={() => navigate(p.path)}
                data-ocid="admin_dashboard.pending_approval.button"
                className="w-full flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0 hover:bg-muted/50 rounded px-1 transition-colors"
              >
                <span className="text-foreground">{p.label}</span>
                <Badge variant="secondary" className={`text-xs ${p.color}`}>
                  {p.count}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Today's Birthdays */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <span>🎂</span> Today's Birthdays
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {birthdayEntries.map((b) => (
              <div
                key={b.name}
                className="flex items-center justify-between py-1 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {b.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{b.role}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-7 px-2"
                  onClick={() => toast.success(`Wish sent to ${b.name}! 🎉`)}
                  data-ocid="admin_dashboard.birthday_wish.button"
                >
                  Send Wishes
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-blue-500" />
          <h2 className="font-semibold text-foreground">Upcoming Events</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {UPCOMING_EVENTS.map((ev) => (
            <div
              key={ev.name}
              className={`flex-shrink-0 rounded-xl border p-4 min-w-[160px] ${ev.color}`}
            >
              <p className="text-2xl font-bold">{ev.date}</p>
              <p className="text-sm font-medium mt-1">{ev.name}</p>
              <Badge variant="secondary" className="text-xs mt-2">
                {ev.type}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-orange-500/10 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <AlertTriangle
          size={20}
          className="text-orange-500 shrink-0 mt-0.5 sm:mt-0"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
            ⚠️ {LOW_STOCK_ITEMS.length} items running low in inventory
          </p>
          <p className="text-xs text-orange-600 dark:text-orange-500 mt-0.5">
            {LOW_STOCK_ITEMS.map((i) => i.name).join(", ")}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-400"
          onClick={() => navigate("/admin/inventory")}
          data-ocid="admin_dashboard.low_stock.button"
        >
          <Package size={14} className="mr-1" /> View Inventory
        </Button>
      </div>

      {/* Existing widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Students</h2>
            <button
              type="button"
              onClick={() => navigate("/admin/students")}
              className="text-xs text-primary flex items-center gap-1 hover:underline"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {recentStudents.map((s) => (
              <div
                key={s.admissionNo}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {s.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.admissionNo} · Class {s.className}-{s.section}
                  </p>
                </div>
                <Badge
                  variant={s.status === "Active" ? "secondary" : "destructive"}
                  className="text-xs"
                >
                  {s.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Bell size={16} className="text-orange-500" /> Alerts
            </h2>
            {alerts.map((a) => (
              <div
                key={a.msg}
                className="flex items-start gap-2 py-2 border-b border-border last:border-0"
              >
                <AlertCircle
                  size={14}
                  className={`mt-0.5 ${
                    a.type === "warning" ? "text-orange-500" : "text-blue-500"
                  }`}
                />
                <p className="text-sm text-foreground">{a.msg}</p>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <UserCheck size={16} className="text-green-500" /> Attendance
            </h2>
            <p className="text-3xl font-bold text-green-600">
              {avgAttendance}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Average this month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
