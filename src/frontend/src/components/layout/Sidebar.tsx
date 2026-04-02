import { type UserRole, useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertCircle,
  ArrowRightLeft,
  Award,
  Baby,
  BarChart2,
  Bell,
  BookMarked,
  BookOpen,
  BookOpenCheck,
  Bus,
  Calculator,
  Calendar,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Clock,
  CreditCard,
  FileText,
  FlaskConical,
  GraduationCap,
  Heart,
  Image,
  IndianRupee,
  KeyRound,
  LayoutDashboard,
  Library,
  ListChecks,
  LogOut,
  MessageCircle,
  MessageSquare,
  Monitor,
  Package,
  Pill,
  Settings,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Star,
  TrendingUp,
  Truck,
  User,
  UserCheck,
  Users,
  Warehouse,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

function sortNavItems(items: NavItem[]): NavItem[] {
  const dashboard = items.filter((i) => i.label === "Dashboard");
  const logout = items.filter(
    (i) => i.label === "Logout" || i.path.includes("logout"),
  );
  const rest = items
    .filter((i) => i.label !== "Dashboard" && !i.path.includes("logout"))
    .sort((a, b) => a.label.localeCompare(b.label));
  return [...dashboard, ...rest, ...logout];
}

function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case "admin":
    case "super-admin":
      return sortNavItems([
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          path: "/admin/dashboard",
        },
        {
          label: "AI Analytics",
          icon: <BarChart2 size={18} />,
          path: "/admin/ai-analytics",
        },
        {
          label: "Teacher Workload",
          icon: <Activity size={18} />,
          path: "/admin/workload",
        },
        {
          label: "Staff Appraisal",
          icon: <Star size={18} />,
          path: "/admin/appraisal",
        },
        {
          label: "Students",
          icon: <GraduationCap size={18} />,
          path: "/admin/students",
        },
        {
          label: "Student Transfer",
          icon: <ArrowRightLeft size={18} />,
          path: "/admin/student-transfer",
        },
        {
          label: "Student Performance",
          icon: <TrendingUp size={18} />,
          path: "/admin/student-performance",
        },
        { label: "Staff", icon: <Users size={18} />, path: "/admin/staff" },
        {
          label: "Attendance",
          icon: <UserCheck size={18} />,
          path: "/admin/attendance",
        },
        {
          label: "Leave Management",
          icon: <CalendarCheck size={18} />,
          path: "/admin/leave",
        },
        {
          label: "Fee Management",
          icon: <CreditCard size={18} />,
          path: "/admin/fees",
        },
        {
          label: "Collect Fee",
          icon: <Calculator size={18} />,
          path: "/admin/fees/collect",
        },
        {
          label: "Scholarships",
          icon: <Award size={18} />,
          path: "/admin/scholarships",
        },
        {
          label: "Examinations",
          icon: <ClipboardList size={18} />,
          path: "/admin/exams",
        },
        {
          label: "Report Cards",
          icon: <FileText size={18} />,
          path: "/admin/exams/reportcard",
        },
        {
          label: "Certificates",
          icon: <FileText size={18} />,
          path: "/admin/certificates",
        },
        {
          label: "Timetable",
          icon: <Calendar size={18} />,
          path: "/admin/timetable",
        },
        {
          label: "Academic Planner",
          icon: <CalendarDays size={18} />,
          path: "/admin/academic-planner",
        },
        {
          label: "Events",
          icon: <CalendarDays size={18} />,
          path: "/admin/events",
        },
        {
          label: "Communication",
          icon: <MessageCircle size={18} />,
          path: "/admin/communication",
        },
        {
          label: "Health Records",
          icon: <Heart size={18} />,
          path: "/admin/health",
        },
        {
          label: "Pharmacy",
          icon: <Pill size={18} />,
          path: "/admin/pharmacy",
        },
        {
          label: "Syllabus",
          icon: <ListChecks size={18} />,
          path: "/admin/syllabus",
        },
        {
          label: "Enquiries",
          icon: <MessageSquare size={18} />,
          path: "/admin/enquiry",
        },
        {
          label: "Live Chat",
          icon: <MessageSquare size={18} />,
          path: "/admin/live-chat",
        },
        {
          label: "Admissions",
          icon: <ClipboardCheck size={18} />,
          path: "/admin/admissions",
        },
        {
          label: "Photo Gallery",
          icon: <Image size={18} />,
          path: "/admin/gallery",
        },
        {
          label: "Grievances",
          icon: <AlertCircle size={18} />,
          path: "/admin/grievances",
        },
        {
          label: "Library",
          icon: <Library size={18} />,
          path: "/admin/library",
        },
        {
          label: "Transport",
          icon: <Bus size={18} />,
          path: "/admin/transport",
        },
        { label: "Notices", icon: <Bell size={18} />, path: "/admin/notices" },
        {
          label: "Reports",
          icon: <BarChart2 size={18} />,
          path: "/admin/reports",
        },
        {
          label: "User Management",
          icon: <ShieldCheck size={18} />,
          path: "/admin/users",
        },
        {
          label: "Visitor / Gate Pass",
          icon: <UserCheck size={18} />,
          path: "/admin/visitors",
        },
        {
          label: "Class Configuration",
          icon: <Settings2 size={18} />,
          path: "/admin/class-config",
        },
        {
          label: "Settings",
          icon: <Settings size={18} />,
          path: "/admin/settings",
        },
        {
          label: "Alumni",
          icon: <GraduationCap size={18} />,
          path: "/admin/alumni",
        },
        {
          label: "Homework",
          icon: <BookOpenCheck size={18} />,
          path: "/admin/homework",
        },
        {
          label: "ID Cards",
          icon: <CreditCard size={18} />,
          path: "/admin/id-cards",
        },
        {
          label: "Inventory",
          icon: <Warehouse size={18} />,
          path: "/admin/inventory",
        },
        {
          label: "Online Fee Payment",
          icon: <IndianRupee size={18} />,
          path: "/admin/online-fee-payment",
        },
        {
          label: "Online Classes",
          icon: <Monitor size={18} />,
          path: "/admin/online-classes",
        },
        {
          label: "Fee Reminders",
          icon: <Bell size={18} />,
          path: "/admin/fee-reminders",
        },
        {
          label: "Documents",
          icon: <FileText size={18} />,
          path: "/admin/documents",
        },
        {
          label: "Change Password",
          icon: <KeyRound size={18} />,
          path: "/change-password",
        },
      ]);
    case "teacher":
      return sortNavItems([
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          path: "/teacher/dashboard",
        },
        {
          label: "My Classes",
          icon: <BookOpen size={18} />,
          path: "/teacher/classes",
        },
        {
          label: "Attendance",
          icon: <UserCheck size={18} />,
          path: "/teacher/attendance",
        },
        {
          label: "Assignments",
          icon: <ClipboardList size={18} />,
          path: "/teacher/assignments",
        },
        {
          label: "Study Materials",
          icon: <BookMarked size={18} />,
          path: "/teacher/materials",
        },
        {
          label: "Exams",
          icon: <FileText size={18} />,
          path: "/teacher/exams",
        },
        {
          label: "Notices",
          icon: <Bell size={18} />,
          path: "/teacher/notices",
        },
        {
          label: "Online Exams",
          icon: <Monitor size={18} />,
          path: "/teacher/online-exam",
        },
        {
          label: "Leave",
          icon: <CalendarCheck size={18} />,
          path: "/teacher/leave",
        },
        {
          label: "Lesson Plans",
          icon: <BookOpenCheck size={18} />,
          path: "/teacher/lesson-plan",
        },
        {
          label: "My Appraisal",
          icon: <Star size={18} />,
          path: "/teacher/appraisal",
        },
        {
          label: "Grievance",
          icon: <AlertCircle size={18} />,
          path: "/grievance",
        },
        {
          label: "Change Password",
          icon: <KeyRound size={18} />,
          path: "/change-password",
        },
      ]);
    case "student":
      return sortNavItems([
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          path: "/student/dashboard",
        },
        {
          label: "My Profile",
          icon: <User size={18} />,
          path: "/student/profile",
        },
        {
          label: "Attendance",
          icon: <UserCheck size={18} />,
          path: "/student/attendance",
        },
        {
          label: "Study Materials",
          icon: <BookMarked size={18} />,
          path: "/student/materials",
        },
        {
          label: "Assignments",
          icon: <ClipboardList size={18} />,
          path: "/student/assignments",
        },
        {
          label: "Results",
          icon: <FileText size={18} />,
          path: "/student/results",
        },
        {
          label: "Fee Details",
          icon: <CreditCard size={18} />,
          path: "/student/fees",
        },
        {
          label: "Leave",
          icon: <CalendarCheck size={18} />,
          path: "/student/leave",
        },
        {
          label: "Notices",
          icon: <Bell size={18} />,
          path: "/student/notices",
        },
        {
          label: "Online Exams",
          icon: <Monitor size={18} />,
          path: "/student/online-exam",
        },
        {
          label: "Events",
          icon: <CalendarDays size={18} />,
          path: "/student/events",
        },
        {
          label: "Gallery",
          icon: <Image size={18} />,
          path: "/student/gallery",
        },
        {
          label: "Online Classes",
          icon: <Monitor size={18} />,
          path: "/student/online-classes",
        },
        {
          label: "Grievance",
          icon: <AlertCircle size={18} />,
          path: "/grievance",
        },
      ]);
    case "parent":
      return sortNavItems([
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          path: "/parent/dashboard",
        },
        {
          label: "My Children",
          icon: <Baby size={18} />,
          path: "/parent/children",
        },
        {
          label: "Attendance",
          icon: <UserCheck size={18} />,
          path: "/parent/attendance",
        },
        {
          label: "Fee Dues",
          icon: <CreditCard size={18} />,
          path: "/parent/fees",
        },
        {
          label: "Results",
          icon: <FileText size={18} />,
          path: "/parent/results",
        },
        { label: "Notices", icon: <Bell size={18} />, path: "/parent/notices" },
        {
          label: "Events",
          icon: <CalendarDays size={18} />,
          path: "/parent/events",
        },
        {
          label: "Grievance",
          icon: <AlertCircle size={18} />,
          path: "/grievance",
        },
        {
          label: "Change Password",
          icon: <KeyRound size={18} />,
          path: "/change-password",
        },
      ]);
    case "accountant":
      return sortNavItems([
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          path: "/accountant/dashboard",
        },
        {
          label: "Fee Collection",
          icon: <CreditCard size={18} />,
          path: "/admin/fees/collect",
        },
        {
          label: "Fee Records",
          icon: <FileText size={18} />,
          path: "/admin/fees",
        },
        {
          label: "Salary",
          icon: <Calculator size={18} />,
          path: "/accountant/salary",
        },
        {
          label: "Reports",
          icon: <BarChart2 size={18} />,
          path: "/accountant/reports",
        },
        {
          label: "Change Password",
          icon: <KeyRound size={18} />,
          path: "/change-password",
        },
      ]);
    case "librarian":
      return sortNavItems([
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          path: "/librarian/dashboard",
        },
        {
          label: "Books",
          icon: <BookOpen size={18} />,
          path: "/librarian/books",
        },
        {
          label: "Issue / Return",
          icon: <BookMarked size={18} />,
          path: "/librarian/issue",
        },
        {
          label: "Members",
          icon: <Users size={18} />,
          path: "/librarian/members",
        },
        {
          label: "Change Password",
          icon: <KeyRound size={18} />,
          path: "/change-password",
        },
      ]);
    case "lab-incharge":
      return sortNavItems([
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          path: "/lab-incharge/dashboard",
        },
        {
          label: "Lab Schedule",
          icon: <Calendar size={18} />,
          path: "/lab-incharge/schedule",
        },
        {
          label: "Inventory",
          icon: <Package size={18} />,
          path: "/lab-incharge/inventory",
        },
        {
          label: "Experiments",
          icon: <FlaskConical size={18} />,
          path: "/lab-incharge/experiments",
        },
        {
          label: "Change Password",
          icon: <KeyRound size={18} />,
          path: "/change-password",
        },
      ]);
    case "transport-manager":
      return sortNavItems([
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          path: "/transport/dashboard",
        },
        {
          label: "Routes",
          icon: <Truck size={18} />,
          path: "/transport/routes",
        },
        {
          label: "Vehicles",
          icon: <Bus size={18} />,
          path: "/transport/vehicles",
        },
        {
          label: "Students",
          icon: <GraduationCap size={18} />,
          path: "/transport/students",
        },
        {
          label: "Change Password",
          icon: <KeyRound size={18} />,
          path: "/change-password",
        },
      ]);
    case "vendor":
      return sortNavItems([
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          path: "/vendor/dashboard",
        },
        {
          label: "Purchase Orders",
          icon: <ShoppingCart size={18} />,
          path: "/vendor/orders",
        },
        {
          label: "Inventory",
          icon: <Warehouse size={18} />,
          path: "/vendor/inventory",
        },
        {
          label: "Reports",
          icon: <BarChart2 size={18} />,
          path: "/vendor/reports",
        },
        {
          label: "Change Password",
          icon: <KeyRound size={18} />,
          path: "/change-password",
        },
      ]);
    default:
      return [];
  }
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  navigate: (path: string) => void;
  currentPath: string;
}

export function Sidebar({
  collapsed,
  onToggle,
  navigate,
  currentPath,
}: SidebarProps) {
  const { user, logout } = useAuth();
  if (!user) return null;
  const navItems = getNavItems(user.role);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-40",
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center border-b border-sidebar-border h-16 px-4",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <GraduationCap
                size={18}
                className="text-sidebar-primary-foreground"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-sidebar-foreground leading-tight">
                SmartSkale
              </p>
              <p className="text-xs text-sidebar-accent-foreground">
                School ERP
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <GraduationCap
              size={18}
              className="text-sidebar-primary-foreground"
            />
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "p-1 rounded-md hover:bg-sidebar-accent transition-colors",
            collapsed && "ml-0",
          )}
          data-ocid="sidebar.toggle"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-sidebar-foreground">
                {user.name}
              </p>
              <p className="text-xs text-sidebar-accent-foreground capitalize">
                {user.role.replace("-", " ")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.path}
            onClick={() => navigate(item.path)}
            data-ocid={`sidebar.${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.link`}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              currentPath === item.path
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-2",
            )}
            title={collapsed ? item.label : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          type="button"
          onClick={logout}
          data-ocid="sidebar.logout.button"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-red-500/20 hover:text-red-300 transition-all",
            collapsed && "justify-center px-2",
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
