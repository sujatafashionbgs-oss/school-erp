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
  ChevronDown,
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
  Shield,
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
import { useState } from "react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface NavGroup {
  groupLabel: string;
  groupIcon: React.ReactNode;
  items: NavItem[];
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

// Returns grouped nav for admin/teacher/student/parent roles
function getNavGroups(role: UserRole): NavGroup[] | null {
  switch (role) {
    case "admin":
    case "super-admin":
      return [
        {
          groupLabel: "Students",
          groupIcon: <GraduationCap size={18} />,
          items: [
            {
              label: "All Students",
              icon: <GraduationCap size={16} />,
              path: "/admin/students",
            },
            {
              label: "Admissions",
              icon: <ClipboardCheck size={16} />,
              path: "/admin/admissions",
            },
            {
              label: "Transfer",
              icon: <ArrowRightLeft size={16} />,
              path: "/admin/student-transfer",
            },
            {
              label: "Performance",
              icon: <TrendingUp size={16} />,
              path: "/admin/student-performance",
            },
            {
              label: "Attendance",
              icon: <UserCheck size={16} />,
              path: "/admin/attendance",
            },
            {
              label: "Health Records",
              icon: <Heart size={16} />,
              path: "/admin/health",
            },
            {
              label: "Documents",
              icon: <FileText size={16} />,
              path: "/admin/documents",
            },
            {
              label: "Alumni",
              icon: <GraduationCap size={16} />,
              path: "/admin/alumni",
            },
            {
              label: "ID Cards",
              icon: <CreditCard size={16} />,
              path: "/admin/id-cards",
            },
          ],
        },
        {
          groupLabel: "Fee Management",
          groupIcon: <CreditCard size={18} />,
          items: [
            {
              label: "Fee Structure",
              icon: <IndianRupee size={16} />,
              path: "/admin/fees",
            },
            {
              label: "Collect Fee",
              icon: <Calculator size={16} />,
              path: "/admin/fees/collect",
            },
            {
              label: "Online Fee Payment",
              icon: <Monitor size={16} />,
              path: "/admin/online-fee-payment",
            },
            {
              label: "Fee Reminders",
              icon: <Bell size={16} />,
              path: "/admin/fee-reminders",
            },
            {
              label: "Scholarships",
              icon: <Award size={16} />,
              path: "/admin/scholarships",
            },
          ],
        },
        {
          groupLabel: "Teacher & Staff",
          groupIcon: <Users size={18} />,
          items: [
            { label: "Staff", icon: <Users size={16} />, path: "/admin/staff" },
            {
              label: "Leave Management",
              icon: <CalendarCheck size={16} />,
              path: "/admin/leave",
            },
            {
              label: "Teacher Workload",
              icon: <Activity size={16} />,
              path: "/admin/workload",
            },
            {
              label: "Staff Appraisal",
              icon: <Star size={16} />,
              path: "/admin/appraisal",
            },
          ],
        },
        {
          groupLabel: "Academics",
          groupIcon: <BookOpen size={18} />,
          items: [
            {
              label: "Timetable",
              icon: <Clock size={16} />,
              path: "/admin/timetable",
            },
            {
              label: "Academic Planner",
              icon: <CalendarDays size={16} />,
              path: "/admin/academic-planner",
            },
            {
              label: "Syllabus",
              icon: <ListChecks size={16} />,
              path: "/admin/syllabus",
            },
            {
              label: "Homework",
              icon: <BookOpenCheck size={16} />,
              path: "/admin/homework",
            },
            {
              label: "Examinations",
              icon: <ClipboardList size={16} />,
              path: "/admin/exams",
            },
            {
              label: "Report Cards",
              icon: <FileText size={16} />,
              path: "/admin/exams/reportcard",
            },
            {
              label: "Certificates",
              icon: <Award size={16} />,
              path: "/admin/certificates",
            },
            {
              label: "Online Classes",
              icon: <Monitor size={16} />,
              path: "/admin/online-classes",
            },
          ],
        },
        {
          groupLabel: "Communication",
          groupIcon: <MessageCircle size={18} />,
          items: [
            {
              label: "Notices",
              icon: <Bell size={16} />,
              path: "/admin/notices",
            },
            {
              label: "Communication",
              icon: <MessageCircle size={16} />,
              path: "/admin/communication",
            },
            {
              label: "Live Chat",
              icon: <MessageSquare size={16} />,
              path: "/admin/live-chat",
            },
            {
              label: "Enquiries",
              icon: <MessageSquare size={16} />,
              path: "/admin/enquiry",
            },
            {
              label: "Grievances",
              icon: <AlertCircle size={16} />,
              path: "/admin/grievances",
            },
            {
              label: "Events",
              icon: <CalendarDays size={16} />,
              path: "/admin/events",
            },
          ],
        },
        {
          groupLabel: "Resources",
          groupIcon: <Warehouse size={18} />,
          items: [
            {
              label: "Library",
              icon: <Library size={16} />,
              path: "/admin/library",
            },
            {
              label: "Inventory",
              icon: <Warehouse size={16} />,
              path: "/admin/inventory",
            },
            {
              label: "Pharmacy",
              icon: <Pill size={16} />,
              path: "/admin/pharmacy",
            },
            {
              label: "Transport",
              icon: <Bus size={16} />,
              path: "/admin/transport",
            },
            {
              label: "Photo Gallery",
              icon: <Image size={16} />,
              path: "/admin/gallery",
            },
          ],
        },
        {
          groupLabel: "Reports & Analytics",
          groupIcon: <BarChart2 size={18} />,
          items: [
            {
              label: "Reports",
              icon: <BarChart2 size={16} />,
              path: "/admin/reports",
            },
            {
              label: "AI Analytics",
              icon: <TrendingUp size={16} />,
              path: "/admin/ai-analytics",
            },
          ],
        },
        {
          groupLabel: "Administration",
          groupIcon: <Settings size={18} />,
          items: [
            {
              label: "User Management",
              icon: <ShieldCheck size={16} />,
              path: "/admin/users",
            },
            {
              label: "Audit Log",
              icon: <Shield size={16} />,
              path: "/admin/audit-log",
            },
            {
              label: "Class Configuration",
              icon: <Settings2 size={16} />,
              path: "/admin/class-config",
            },
            {
              label: "Visitor / Gate Pass",
              icon: <UserCheck size={16} />,
              path: "/admin/visitors",
            },
            {
              label: "Settings",
              icon: <Settings size={16} />,
              path: "/admin/settings",
            },
            {
              label: "Online Users",
              icon: <Users size={16} />,
              path: "/admin/online-users",
            },
            {
              label: "Change Password",
              icon: <KeyRound size={16} />,
              path: "/change-password",
            },
          ],
        },
      ];
    case "teacher":
      return [
        {
          groupLabel: "Teaching",
          groupIcon: <BookOpen size={18} />,
          items: [
            {
              label: "My Classes",
              icon: <BookOpen size={16} />,
              path: "/teacher/classes",
            },
            {
              label: "Attendance",
              icon: <UserCheck size={16} />,
              path: "/teacher/attendance",
            },
            {
              label: "Assignments",
              icon: <ClipboardList size={16} />,
              path: "/teacher/assignments",
            },
            {
              label: "Exams",
              icon: <FileText size={16} />,
              path: "/teacher/exams",
            },
            {
              label: "Online Exams",
              icon: <Monitor size={16} />,
              path: "/teacher/online-exam",
            },
            {
              label: "Lesson Plans",
              icon: <BookOpenCheck size={16} />,
              path: "/teacher/lesson-plan",
            },
            {
              label: "Study Materials",
              icon: <BookMarked size={16} />,
              path: "/teacher/materials",
            },
          ],
        },
        {
          groupLabel: "Personal",
          groupIcon: <User size={18} />,
          items: [
            {
              label: "Leave",
              icon: <CalendarCheck size={16} />,
              path: "/teacher/leave",
            },
            {
              label: "My Appraisal",
              icon: <Star size={16} />,
              path: "/teacher/appraisal",
            },
            {
              label: "Notices",
              icon: <Bell size={16} />,
              path: "/teacher/notices",
            },
            {
              label: "Grievance",
              icon: <AlertCircle size={16} />,
              path: "/grievance",
            },
            {
              label: "Change Password",
              icon: <KeyRound size={16} />,
              path: "/change-password",
            },
          ],
        },
      ];
    case "student":
      return [
        {
          groupLabel: "Academics",
          groupIcon: <BookOpen size={18} />,
          items: [
            {
              label: "Study Materials",
              icon: <BookMarked size={16} />,
              path: "/student/materials",
            },
            {
              label: "Assignments",
              icon: <ClipboardList size={16} />,
              path: "/student/assignments",
            },
            {
              label: "Results",
              icon: <FileText size={16} />,
              path: "/student/results",
            },
            {
              label: "Online Exams",
              icon: <Monitor size={16} />,
              path: "/student/online-exam",
            },
            {
              label: "Online Classes",
              icon: <Monitor size={16} />,
              path: "/student/online-classes",
            },
          ],
        },
        {
          groupLabel: "School Life",
          groupIcon: <Calendar size={18} />,
          items: [
            {
              label: "Attendance",
              icon: <UserCheck size={16} />,
              path: "/student/attendance",
            },
            {
              label: "Fee Details",
              icon: <CreditCard size={16} />,
              path: "/student/fees",
            },
            {
              label: "Leave",
              icon: <CalendarCheck size={16} />,
              path: "/student/leave",
            },
            {
              label: "Notices",
              icon: <Bell size={16} />,
              path: "/student/notices",
            },
            {
              label: "Events",
              icon: <CalendarDays size={16} />,
              path: "/student/events",
            },
            {
              label: "Gallery",
              icon: <Image size={16} />,
              path: "/student/gallery",
            },
            {
              label: "Grievance",
              icon: <AlertCircle size={16} />,
              path: "/grievance",
            },
          ],
        },
        {
          groupLabel: "Profile",
          groupIcon: <User size={18} />,
          items: [
            {
              label: "My Profile",
              icon: <User size={16} />,
              path: "/student/profile",
            },
          ],
        },
      ];
    case "parent":
      return [
        {
          groupLabel: "My Child",
          groupIcon: <Baby size={18} />,
          items: [
            {
              label: "My Children",
              icon: <Baby size={16} />,
              path: "/parent/children",
            },
            {
              label: "Attendance",
              icon: <UserCheck size={16} />,
              path: "/parent/attendance",
            },
            {
              label: "Results",
              icon: <FileText size={16} />,
              path: "/parent/results",
            },
            {
              label: "Fee Dues",
              icon: <CreditCard size={16} />,
              path: "/parent/fees",
            },
          ],
        },
        {
          groupLabel: "Communication",
          groupIcon: <Bell size={18} />,
          items: [
            {
              label: "Notices",
              icon: <Bell size={16} />,
              path: "/parent/notices",
            },
            {
              label: "Events",
              icon: <CalendarDays size={16} />,
              path: "/parent/events",
            },
            {
              label: "Grievance",
              icon: <AlertCircle size={16} />,
              path: "/grievance",
            },
            {
              label: "Change Password",
              icon: <KeyRound size={16} />,
              path: "/change-password",
            },
          ],
        },
      ];
    default:
      return null;
  }
}

// Returns flat nav items for non-grouped roles
function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
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

function isItemActive(itemPath: string, currentPath: string): boolean {
  if (itemPath === currentPath) return true;
  // For nested routes like /admin/exams/reportcard — be careful not to match
  // /admin/exams when path is /admin/exams/reportcard
  if (currentPath.startsWith(`${itemPath}/`)) return true;
  return false;
}

function isGroupActive(group: NavGroup, currentPath: string): boolean {
  return group.items.some((item) => isItemActive(item.path, currentPath));
}

function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "admin":
    case "super-admin":
      return "/admin/dashboard";
    case "teacher":
      return "/teacher/dashboard";
    case "student":
      return "/student/dashboard";
    case "parent":
      return "/parent/dashboard";
    default:
      return "/";
  }
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  navigate: (path: string) => void;
  currentPath: string;
}

function GroupedNav({
  groups,
  currentPath,
  collapsed,
  navigate,
}: {
  groups: NavGroup[];
  currentPath: string;
  collapsed: boolean;
  navigate: (path: string) => void;
}) {
  // Accordion: only one group open at a time
  const [openGroup, setOpenGroup] = useState<string | null>(() => {
    for (const group of groups) {
      if (isGroupActive(group, currentPath)) {
        return group.groupLabel;
      }
    }
    return null;
  });

  const toggleGroup = (label: string) => {
    setOpenGroup((prev) => (prev === label ? null : label));
  };

  return (
    <>
      {groups.map((group) => {
        const isOpen = openGroup === group.groupLabel;

        if (collapsed) {
          // Collapsed: show just icon with flyout on hover
          return (
            <div key={group.groupLabel} className="relative group">
              <button
                type="button"
                title={group.groupLabel}
                className={cn(
                  "w-full flex items-center justify-center p-2.5 rounded-lg transition-all",
                  isGroupActive(group, currentPath)
                    ? "bg-sidebar-primary/20 text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
                data-ocid={`sidebar.${group.groupLabel.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.group`}
              >
                {group.groupIcon}
              </button>
              {/* Flyout panel */}
              <div className="absolute left-full top-0 ml-2 z-50 hidden group-hover:block bg-popover border border-border rounded-lg shadow-lg min-w-48 py-1">
                <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {group.groupLabel}
                </p>
                {group.items.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-sidebar-accent flex items-center gap-2 transition-colors",
                      isItemActive(item.path, currentPath)
                        ? "bg-sidebar-primary/10 text-sidebar-primary font-medium"
                        : "text-foreground",
                    )}
                    data-ocid={`sidebar.${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.link`}
                  >
                    <span className="shrink-0 text-muted-foreground">
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          );
        }

        // Expanded: collapsible section
        return (
          <div key={group.groupLabel}>
            <button
              type="button"
              onClick={() => toggleGroup(group.groupLabel)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all",
                isGroupActive(group, currentPath)
                  ? "text-sidebar-primary"
                  : "text-sidebar-accent-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
              data-ocid={`sidebar.${group.groupLabel.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.group`}
            >
              <span className="shrink-0">{group.groupIcon}</span>
              <span className="flex-1 text-left">{group.groupLabel}</span>
              <ChevronDown
                size={14}
                className={cn(
                  "shrink-0 transition-transform duration-200",
                  isOpen ? "rotate-180" : "",
                )}
              />
            </button>

            {isOpen && (
              <div className="ml-3 pl-3 border-l border-sidebar-border/50 mt-0.5 mb-1 space-y-0.5">
                {group.items.map((item) => (
                  <button
                    type="button"
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all",
                      isItemActive(item.path, currentPath)
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                    data-ocid={`sidebar.${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.link`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export function Sidebar({
  collapsed,
  onToggle,
  navigate,
  currentPath,
}: SidebarProps) {
  const { user, logout } = useAuth();
  if (!user) return null;

  const groups = getNavGroups(user.role);
  const flatItems = groups ? null : getNavItems(user.role);
  const dashboardPath = getDashboardPath(user.role);
  const isDashboardActive = currentPath === dashboardPath;

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
        {/* Dashboard — always flat top-level for grouped roles */}
        {groups && (
          <button
            type="button"
            onClick={() => navigate(dashboardPath)}
            data-ocid="sidebar.dashboard.link"
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              isDashboardActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-2",
            )}
            title={collapsed ? "Dashboard" : undefined}
          >
            <LayoutDashboard size={18} className="shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </button>
        )}

        {/* Grouped navigation */}
        {groups && (
          <div className="mt-1">
            <GroupedNav
              groups={groups}
              currentPath={currentPath}
              collapsed={collapsed}
              navigate={navigate}
            />
          </div>
        )}

        {/* Flat navigation (non-grouped roles) */}
        {flatItems?.map((item) => (
          <button
            type="button"
            key={item.path}
            onClick={() => navigate(item.path)}
            data-ocid={`sidebar.${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.link`}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              isItemActive(item.path, currentPath)
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
