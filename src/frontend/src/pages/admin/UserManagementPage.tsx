import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  EyeOff,
  KeyRound,
  Plus,
  Search,
  Shield,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Full Module / Sub-module / Page permission tree ───────────────────────
// Each entry is a flat permission key. Groups are used only for UI rendering.
export interface PermissionGroup {
  group: string;
  permissions: { key: string; label: string; sub?: string }[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    group: "Dashboard",
    permissions: [{ key: "Dashboard", label: "Dashboard" }],
  },
  {
    group: "Students",
    permissions: [
      { key: "Students", label: "All Students" },
      { key: "Students.Add", label: "Add Student", sub: "Students" },
      { key: "Students.Edit", label: "Edit Student", sub: "Students" },
      { key: "Students.Delete", label: "Delete Student", sub: "Students" },
      { key: "Students.Import", label: "Bulk Import", sub: "Students" },
      { key: "Admissions", label: "Admissions" },
      {
        key: "Admissions.Kanban",
        label: "Admissions Kanban View",
        sub: "Admissions",
      },
      { key: "Admissions.Admit", label: "Admit / Reject", sub: "Admissions" },
      { key: "StudentTransfer", label: "Student Transfer / Promotion" },
      { key: "StudentPerformance", label: "Student Performance Analytics" },
      { key: "Attendance", label: "Attendance" },
      {
        key: "Attendance.MarkAll",
        label: "Mark All Present",
        sub: "Attendance",
      },
      {
        key: "Attendance.Edit",
        label: "Edit Past Attendance",
        sub: "Attendance",
      },
      { key: "HealthRecords", label: "Health Records" },
      {
        key: "HealthRecords.Vaccinations",
        label: "Vaccination Records",
        sub: "HealthRecords",
      },
      {
        key: "HealthRecords.ClinicVisit",
        label: "Clinic Visit Logs",
        sub: "HealthRecords",
      },
      { key: "Documents", label: "Student Documents" },
      {
        key: "Documents.Approve",
        label: "Approve / Reject Docs",
        sub: "Documents",
      },
      { key: "Alumni", label: "Alumni Management" },
      { key: "IDCards", label: "ID Card Generator" },
      { key: "IDCards.Print", label: "Print ID Cards", sub: "IDCards" },
    ],
  },
  {
    group: "Fee Management",
    permissions: [
      { key: "FeeStructure", label: "Fee Structure" },
      {
        key: "FeeStructure.Add",
        label: "Add Fee Category",
        sub: "FeeStructure",
      },
      {
        key: "FeeStructure.Edit",
        label: "Edit Fee Structure",
        sub: "FeeStructure",
      },
      { key: "FeeCollect", label: "Collect Fee" },
      {
        key: "FeeCollect.Online",
        label: "Online Payment Gateway",
        sub: "FeeCollect",
      },
      {
        key: "FeeCollect.Receipt",
        label: "Generate Receipt",
        sub: "FeeCollect",
      },
      { key: "OnlineFeePayment", label: "Online Fee Payment Portal" },
      { key: "FeeReminders", label: "Fee Reminders" },
      {
        key: "FeeReminders.Automation",
        label: "Automation Rules",
        sub: "FeeReminders",
      },
      {
        key: "FeeReminders.WhatsApp",
        label: "Send WhatsApp Reminders",
        sub: "FeeReminders",
      },
      { key: "Scholarships", label: "Scholarships & Concessions" },
      {
        key: "Scholarships.Approve",
        label: "Approve / Reject",
        sub: "Scholarships",
      },
    ],
  },
  {
    group: "Teacher & Staff",
    permissions: [
      { key: "Staff", label: "Staff Management" },
      { key: "Staff.Add", label: "Add Staff", sub: "Staff" },
      { key: "Staff.Edit", label: "Edit Staff", sub: "Staff" },
      { key: "Staff.Delete", label: "Delete Staff", sub: "Staff" },
      { key: "Staff.Retire", label: "Retire / Transfer Staff", sub: "Staff" },
      { key: "LeaveManagement", label: "Leave Management" },
      {
        key: "LeaveManagement.Approve",
        label: "Approve / Reject Leave",
        sub: "LeaveManagement",
      },
      { key: "TeacherWorkload", label: "Teacher Workload Manager" },
      { key: "StaffAppraisal", label: "Staff Appraisal" },
      {
        key: "StaffAppraisal.Grade",
        label: "Grade & Export Appraisal",
        sub: "StaffAppraisal",
      },
      { key: "SalaryManagement", label: "Salary Management" },
      {
        key: "SalaryManagement.GenerateSlip",
        label: "Generate Salary Slip",
        sub: "SalaryManagement",
      },
    ],
  },
  {
    group: "Academics",
    permissions: [
      { key: "Timetable", label: "Timetable" },
      {
        key: "Timetable.AutoGenerate",
        label: "Auto-Generate Timetable",
        sub: "Timetable",
      },
      {
        key: "Timetable.Substitute",
        label: "Substitute Teacher",
        sub: "Timetable",
      },
      { key: "AcademicPlanner", label: "Academic Planner" },
      {
        key: "AcademicPlanner.AddEvent",
        label: "Add / Edit Events",
        sub: "AcademicPlanner",
      },
      { key: "Syllabus", label: "Syllabus Management" },
      {
        key: "Syllabus.Edit",
        label: "Edit Syllabus Progress",
        sub: "Syllabus",
      },
      { key: "Homework", label: "Homework Management" },
      { key: "Homework.Create", label: "Create Homework", sub: "Homework" },
      { key: "Homework.Track", label: "Track Submissions", sub: "Homework" },
      { key: "Examinations", label: "Examinations" },
      { key: "Examinations.Create", label: "Create Exam", sub: "Examinations" },
      {
        key: "Examinations.MarksEntry",
        label: "Marks Entry",
        sub: "Examinations",
      },
      {
        key: "Examinations.MarksEdit",
        label: "Edit Marks",
        sub: "Examinations",
      },
      { key: "ReportCards", label: "Report Cards" },
      {
        key: "ReportCards.BulkExport",
        label: "Bulk Export Report Cards",
        sub: "ReportCards",
      },
      {
        key: "ReportCards.Print",
        label: "Print Report Cards",
        sub: "ReportCards",
      },
      { key: "Certificates", label: "Certificate Generator" },
      {
        key: "Certificates.Bonafide",
        label: "Bonafide Certificate",
        sub: "Certificates",
      },
      {
        key: "Certificates.Transfer",
        label: "Transfer Certificate",
        sub: "Certificates",
      },
      {
        key: "Certificates.Character",
        label: "Character Certificate",
        sub: "Certificates",
      },
      { key: "OnlineClasses", label: "Online Classes / Virtual Classroom" },
      {
        key: "OnlineClasses.Create",
        label: "Create Online Class",
        sub: "OnlineClasses",
      },
      {
        key: "OnlineClasses.Recordings",
        label: "Manage Recordings",
        sub: "OnlineClasses",
      },
      { key: "OnlineExams", label: "Online Exams" },
      {
        key: "OnlineExams.Create",
        label: "Create Online Exam",
        sub: "OnlineExams",
      },
    ],
  },
  {
    group: "Communication",
    permissions: [
      { key: "Notices", label: "Notices" },
      { key: "Notices.Create", label: "Create Notice", sub: "Notices" },
      { key: "Notices.Delete", label: "Delete Notice", sub: "Notices" },
      { key: "Communication", label: "Communication / Messaging" },
      {
        key: "Communication.WhatsApp",
        label: "WhatsApp Messaging",
        sub: "Communication",
      },
      {
        key: "Communication.PushNotify",
        label: "Push Notifications",
        sub: "Communication",
      },
      {
        key: "Communication.Templates",
        label: "Message Templates",
        sub: "Communication",
      },
      { key: "LiveChat", label: "Live Chat (iTalk)" },
      { key: "LiveChat.Resolve", label: "Resolve Chat", sub: "LiveChat" },
      { key: "Enquiries", label: "Enquiry CRM" },
      { key: "Enquiries.Kanban", label: "Kanban View", sub: "Enquiries" },
      {
        key: "Enquiries.LeadSource",
        label: "Lead Source Analytics",
        sub: "Enquiries",
      },
      { key: "Grievances", label: "Grievance Management" },
      {
        key: "Grievances.Assign",
        label: "Assign & Resolve",
        sub: "Grievances",
      },
      { key: "Events", label: "Events & Calendar" },
      { key: "Events.Create", label: "Create Event", sub: "Events" },
      { key: "PTM", label: "PTM Scheduler" },
      { key: "PTM.Create", label: "Create PTM Slots", sub: "PTM" },
      { key: "Feedback", label: "Parent Feedback / Ratings" },
    ],
  },
  {
    group: "Resources",
    permissions: [
      { key: "Library", label: "Library" },
      { key: "Library.Catalog", label: "Book Catalog", sub: "Library" },
      {
        key: "Library.IssueReturn",
        label: "Issue / Return Books",
        sub: "Library",
      },
      { key: "Library.Members", label: "Library Members", sub: "Library" },
      { key: "Inventory", label: "Inventory / Store" },
      {
        key: "Inventory.PurchaseOrder",
        label: "Purchase Orders",
        sub: "Inventory",
      },
      { key: "Inventory.Issue", label: "Issue Stock", sub: "Inventory" },
      { key: "Pharmacy", label: "Pharmacy" },
      {
        key: "Pharmacy.MedicineStock",
        label: "Medicine Stock",
        sub: "Pharmacy",
      },
      { key: "Pharmacy.IssueTrack", label: "Issue Tracking", sub: "Pharmacy" },
      { key: "Transport", label: "Transport" },
      { key: "Transport.Routes", label: "Route Management", sub: "Transport" },
      {
        key: "Transport.Vehicles",
        label: "Vehicle Management",
        sub: "Transport",
      },
      {
        key: "Transport.Students",
        label: "Transport Students",
        sub: "Transport",
      },
      { key: "Gallery", label: "Photo Gallery" },
      { key: "Gallery.CreateAlbum", label: "Create Album", sub: "Gallery" },
      { key: "Hostel", label: "Hostel Management" },
      { key: "Hostel.Rooms", label: "Room Management", sub: "Hostel" },
      { key: "Hostel.MessMenu", label: "Mess Menu", sub: "Hostel" },
    ],
  },
  {
    group: "Reports & Analytics",
    permissions: [
      { key: "Reports", label: "Reports Hub" },
      { key: "Reports.Overview", label: "Overview Report", sub: "Reports" },
      { key: "Reports.Fee", label: "Fee Reports", sub: "Reports" },
      {
        key: "Reports.FeeDaily",
        label: "Daily Fee Collection Report",
        sub: "Reports",
      },
      {
        key: "Reports.FeeOutstanding",
        label: "Outstanding Fee Report",
        sub: "Reports",
      },
      {
        key: "Reports.Attendance",
        label: "Attendance Reports",
        sub: "Reports",
      },
      {
        key: "Reports.AttendanceClass",
        label: "Class-wise Attendance Report",
        sub: "Reports",
      },
      {
        key: "Reports.AttendanceStudent",
        label: "Student Attendance Report",
        sub: "Reports",
      },
      { key: "Reports.Academic", label: "Academic Reports", sub: "Reports" },
      {
        key: "Reports.AcademicExam",
        label: "Exam / Marks Report",
        sub: "Reports",
      },
      {
        key: "Reports.AcademicSyllabus",
        label: "Syllabus Completion Report",
        sub: "Reports",
      },
      { key: "Reports.Expense", label: "Expense Reports", sub: "Reports" },
      { key: "Reports.Staff", label: "Staff Reports", sub: "Reports" },
      {
        key: "Reports.StaffAttendance",
        label: "Staff Attendance Report",
        sub: "Reports",
      },
      { key: "Reports.StaffSalary", label: "Salary Report", sub: "Reports" },
      { key: "Reports.Transport", label: "Transport Reports", sub: "Reports" },
      {
        key: "Reports.Export",
        label: "Export Reports (PDF/Excel)",
        sub: "Reports",
      },
      { key: "AIAnalytics", label: "AI Analytics Dashboard" },
      {
        key: "AIAnalytics.Academic",
        label: "AI Academic Analytics",
        sub: "AIAnalytics",
      },
      { key: "AIAnalytics.Fee", label: "AI Fee Analytics", sub: "AIAnalytics" },
      {
        key: "AIAnalytics.Teacher",
        label: "AI Teacher Analytics",
        sub: "AIAnalytics",
      },
    ],
  },
  {
    group: "Administration",
    permissions: [
      { key: "UserManagement", label: "User Management" },
      { key: "UserManagement.Add", label: "Add Users", sub: "UserManagement" },
      {
        key: "UserManagement.Edit",
        label: "Edit Users",
        sub: "UserManagement",
      },
      {
        key: "UserManagement.Delete",
        label: "Delete Users",
        sub: "UserManagement",
      },
      {
        key: "UserManagement.Permissions",
        label: "Assign Permissions",
        sub: "UserManagement",
      },
      {
        key: "UserManagement.ResetPassword",
        label: "Reset Password",
        sub: "UserManagement",
      },
      { key: "ClassConfig", label: "Class Configuration" },
      {
        key: "ClassConfig.Sections",
        label: "Manage Sections",
        sub: "ClassConfig",
      },
      { key: "VisitorGatePass", label: "Visitor / Gate Pass" },
      {
        key: "VisitorGatePass.CheckIn",
        label: "Check In / Out",
        sub: "VisitorGatePass",
      },
      {
        key: "VisitorGatePass.Print",
        label: "Print Gate Pass",
        sub: "VisitorGatePass",
      },
      { key: "Settings", label: "Settings" },
      {
        key: "Settings.SchoolProfile",
        label: "School Profile",
        sub: "Settings",
      },
      { key: "Settings.Branding", label: "Branding Settings", sub: "Settings" },
    ],
  },
];

// All flat permission keys
export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) =>
  g.permissions.map((p) => p.key),
);

// ─── Role Defaults ─────────────────────────────────────────────────────────
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ALL_PERMISSIONS,
  "super-admin": ALL_PERMISSIONS,
  teacher: [
    "Dashboard",
    "Attendance",
    "Attendance.MarkAll",
    "Examinations",
    "Examinations.MarksEntry",
    "ReportCards",
    "ReportCards.Print",
    "Timetable",
    "LeaveManagement",
    "Communication",
    "Communication.WhatsApp",
    "Notices",
    "Homework",
    "Homework.Create",
    "Homework.Track",
    "OnlineClasses",
    "OnlineClasses.Create",
    "OnlineExams",
    "OnlineExams.Create",
    "Syllabus",
    "StaffAppraisal",
    "Grievances",
    "Events",
    "Reports.Academic",
    "Reports.Attendance",
  ],
  accountant: [
    "Dashboard",
    "FeeStructure",
    "FeeStructure.Add",
    "FeeStructure.Edit",
    "FeeCollect",
    "FeeCollect.Online",
    "FeeCollect.Receipt",
    "OnlineFeePayment",
    "FeeReminders",
    "FeeReminders.WhatsApp",
    "Scholarships",
    "Scholarships.Approve",
    "SalaryManagement",
    "SalaryManagement.GenerateSlip",
    "Reports",
    "Reports.Fee",
    "Reports.FeeDaily",
    "Reports.FeeOutstanding",
    "Reports.Expense",
    "Reports.Staff",
    "Reports.StaffSalary",
    "Reports.Export",
  ],
  librarian: [
    "Dashboard",
    "Library",
    "Library.Catalog",
    "Library.IssueReturn",
    "Library.Members",
    "Reports.Overview",
  ],
  "lab-incharge": [
    "Dashboard",
    "Students",
    "OnlineClasses",
    "Examinations",
    "Reports.Academic",
  ],
  "transport-manager": [
    "Dashboard",
    "Transport",
    "Transport.Routes",
    "Transport.Vehicles",
    "Transport.Students",
    "Reports.Transport",
  ],
  parent: [
    "Dashboard",
    "Students",
    "Attendance",
    "FeeCollect",
    "OnlineFeePayment",
    "Communication",
    "Notices",
    "Events",
    "Grievances",
    "Reports.Attendance",
    "Reports.Academic",
  ],
  student: [
    "Dashboard",
    "ReportCards",
    "Examinations",
    "Attendance",
    "Notices",
    "Events",
    "OnlineClasses",
    "OnlineExams",
    "Homework",
    "Grievances",
  ],
  vendor: ["Dashboard", "Inventory"],
};

// ─── User type ──────────────────────────────────────────────────────────────
type UserEntry = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: "Active" | "Inactive";
  lastLogin: string;
  permissions?: string[];
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "super-admin":
    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  teacher: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  accountant:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  librarian:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "lab-incharge":
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "transport-manager":
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  vendor: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

const INITIAL_USERS: UserEntry[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@school.com",
    username: "admin",
    role: "admin",
    status: "Active",
    lastLogin: "2026-04-01",
  },
  {
    id: "2",
    name: "Super Admin",
    email: "super@school.com",
    username: "super",
    role: "super-admin",
    status: "Active",
    lastLogin: "2026-03-31",
  },
  {
    id: "3",
    name: "Ravi Sharma",
    email: "teacher@school.com",
    username: "teacher1",
    role: "teacher",
    status: "Active",
    lastLogin: "2026-04-01",
  },
  {
    id: "4",
    name: "Priya Mehta",
    email: "teacher2@school.com",
    username: "teacher2",
    role: "teacher",
    status: "Active",
    lastLogin: "2026-03-30",
  },
  {
    id: "5",
    name: "Anita Kulkarni",
    email: "accountant@school.com",
    username: "accountant",
    role: "accountant",
    status: "Active",
    lastLogin: "2026-03-29",
  },
  {
    id: "6",
    name: "Suresh Patil",
    email: "librarian@school.com",
    username: "librarian",
    role: "librarian",
    status: "Active",
    lastLogin: "2026-03-28",
  },
  {
    id: "7",
    name: "Dr. Kavita Nair",
    email: "lab@school.com",
    username: "lab",
    role: "lab-incharge",
    status: "Active",
    lastLogin: "2026-03-27",
  },
  {
    id: "8",
    name: "Ramesh Yadav",
    email: "transport@school.com",
    username: "transport",
    role: "transport-manager",
    status: "Active",
    lastLogin: "2026-03-25",
  },
  {
    id: "9",
    name: "Vendor Corp",
    email: "vendor@school.com",
    username: "vendor",
    role: "vendor",
    status: "Inactive",
    lastLogin: "2026-03-10",
  },
  {
    id: "10",
    name: "Sunita Joshi",
    email: "teacher3@school.com",
    username: "teacher3",
    role: "teacher",
    status: "Active",
    lastLogin: "2026-04-01",
  },
];

const ROLES = [
  "admin",
  "super-admin",
  "teacher",
  "accountant",
  "librarian",
  "lab-incharge",
  "transport-manager",
  "vendor",
];

const blankForm = {
  name: "",
  email: "",
  username: "",
  role: "teacher",
  password: "",
  status: "Active" as "Active" | "Inactive",
};

// ─── Permissions Panel Component ────────────────────────────────────────────
function PermissionsPanel({
  draft,
  role,
  onChange,
}: {
  draft: string[];
  role: string;
  onChange: (perms: string[]) => void;
}) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(["Dashboard"]),
  );
  const [searchPerm, setSearchPerm] = useState("");

  const toggleGroup = (g: string) => {
    setOpenGroups((prev) => {
      const n = new Set(prev);
      n.has(g) ? n.delete(g) : n.add(g);
      return n;
    });
  };

  const toggle = (key: string) => {
    onChange(
      draft.includes(key) ? draft.filter((k) => k !== key) : [...draft, key],
    );
  };

  const toggleGroupAll = (group: PermissionGroup, checked: boolean) => {
    const keys = group.permissions.map((p) => p.key);
    if (checked) {
      const merged = Array.from(new Set([...draft, ...keys]));
      onChange(merged);
    } else {
      onChange(draft.filter((k) => !keys.includes(k)));
    }
  };

  const filteredGroups = PERMISSION_GROUPS.map((g) => ({
    ...g,
    permissions: g.permissions.filter(
      (p) =>
        searchPerm === "" ||
        p.label.toLowerCase().includes(searchPerm.toLowerCase()) ||
        p.key.toLowerCase().includes(searchPerm.toLowerCase()),
    ),
  })).filter((g) => g.permissions.length > 0);

  return (
    <div className="space-y-2">
      {/* Top action bar */}
      <div className="flex flex-wrap gap-2 mb-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="text-xs h-7"
          onClick={() => onChange([...ALL_PERMISSIONS])}
        >
          Select All
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="text-xs h-7"
          onClick={() => onChange([])}
        >
          Clear All
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="text-xs h-7"
          onClick={() =>
            onChange(DEFAULT_ROLE_PERMISSIONS[role] ?? ["Dashboard"])
          }
        >
          Reset to Role Defaults
        </Button>
        <span className="ml-auto text-xs text-muted-foreground self-center">
          {draft.length} / {ALL_PERMISSIONS.length} selected
        </span>
      </div>

      {/* Permission search */}
      <div className="relative">
        <Search
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={13}
        />
        <Input
          className="pl-8 h-8 text-xs"
          placeholder="Search permissions…"
          value={searchPerm}
          onChange={(e) => setSearchPerm(e.target.value)}
        />
      </div>

      {/* Group sections */}
      <div className="space-y-1 max-h-[45vh] overflow-y-auto pr-1">
        {filteredGroups.map((group) => {
          const groupKeys = group.permissions.map((p) => p.key);
          const checkedCount = groupKeys.filter((k) =>
            draft.includes(k),
          ).length;
          const allChecked = checkedCount === groupKeys.length;
          const partialChecked = checkedCount > 0 && !allChecked;
          const isOpen = openGroups.has(group.group);

          return (
            <div
              key={group.group}
              className="border border-border rounded-lg overflow-hidden"
            >
              {/* Group header */}
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 bg-secondary/30 hover:bg-secondary/50 transition-colors text-sm font-semibold"
                onClick={() => toggleGroup(group.group)}
              >
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = partialChecked;
                  }}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleGroupAll(group, e.target.checked);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-3.5 h-3.5 cursor-pointer"
                />
                <span className="flex-1 text-left">{group.group}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {checkedCount}/{groupKeys.length}
                </span>
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {/* Permission items */}
              {isOpen && (
                <div className="p-2 grid grid-cols-1 gap-0.5">
                  {group.permissions.map((perm) => (
                    <label
                      key={perm.key}
                      className={`flex items-center gap-2 text-xs cursor-pointer px-2 py-1 rounded hover:bg-secondary/40 transition-colors ${
                        perm.sub ? "pl-6 text-muted-foreground" : "font-medium"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={draft.includes(perm.key)}
                        onChange={() => toggle(perm.key)}
                        className="w-3.5 h-3.5 cursor-pointer flex-shrink-0"
                      />
                      <span className="leading-tight">
                        {perm.sub && <span className="mr-1 opacity-40">↳</span>}
                        {perm.label}
                      </span>
                      {perm.sub && (
                        <span className="ml-auto opacity-30 text-[10px] font-mono">
                          {perm.key}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export function UserManagementPage() {
  const [users, setUsers] = useState<UserEntry[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [userPermissions, setUserPermissions] = useState<
    Record<string, string[]>
  >(
    Object.fromEntries(
      INITIAL_USERS.map((u) => [
        u.id,
        DEFAULT_ROLE_PERMISSIONS[u.role] ?? ["Dashboard"],
      ]),
    ),
  );

  const [editingUser, setEditingUser] = useState<UserEntry | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [showPw, setShowPw] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [draftPermissions, setDraftPermissions] = useState<string[]>([]);

  const [resetUser, setResetUser] = useState<UserEntry | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [deleteUser, setDeleteUser] = useState<UserEntry | null>(null);

  // View-only permissions dialog
  const [viewPermUser, setViewPermUser] = useState<UserEntry | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openAdd = () => {
    setEditingUser(null);
    setForm(blankForm);
    setShowPw(false);
    setPermissionsOpen(false);
    setDraftPermissions(DEFAULT_ROLE_PERMISSIONS.teacher ?? ["Dashboard"]);
    setIsAddOpen(true);
  };

  const openEdit = (u: UserEntry) => {
    setEditingUser(u);
    setForm({
      name: u.name,
      email: u.email,
      username: u.username,
      role: u.role,
      password: "",
      status: u.status,
    });
    setShowPw(false);
    setPermissionsOpen(false);
    setDraftPermissions(
      userPermissions[u.id] ??
        DEFAULT_ROLE_PERMISSIONS[u.role] ?? ["Dashboard"],
    );
    setIsAddOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.username) {
      toast.error("Name, email, and username are required");
      return;
    }
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: form.name,
                email: form.email,
                username: form.username,
                role: form.role,
                status: form.status,
              }
            : u,
        ),
      );
      setUserPermissions((prev) => ({
        ...prev,
        [editingUser.id]: draftPermissions,
      }));
      toast.success("User updated");
    } else {
      if (!form.password) {
        toast.error("Password is required for new users");
        return;
      }
      const newId = `u-${Date.now()}`;
      const newUser: UserEntry = {
        id: newId,
        name: form.name,
        email: form.email,
        username: form.username,
        role: form.role,
        status: form.status,
        lastLogin: "Never",
      };
      setUsers((prev) => [...prev, newUser]);
      setUserPermissions((prev) => ({ ...prev, [newId]: draftPermissions }));
      toast.success("User added successfully");
    }
    setIsAddOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
    toast.success("User deleted");
    setDeleteUser(null);
  };

  function handleResetPassword() {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success(`Password reset for ${resetUser?.name}`);
    setResetUser(null);
    setNewPassword("");
    setConfirmPassword("");
  }

  function toggleStatus(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u,
      ),
    );
  }

  function handleRoleChange(val: string) {
    setForm((prev) => ({ ...prev, role: val }));
    setDraftPermissions(DEFAULT_ROLE_PERMISSIONS[val] ?? ["Dashboard"]);
    toast.info(
      "Permissions reset to defaults for new role. Customize as needed.",
    );
  }

  // Build a readable summary of permissions grouped by module category
  function getPermSummary(perms: string[]) {
    return PERMISSION_GROUPS.map((g) => {
      const granted = g.permissions.filter((p) => perms.includes(p.key));
      return {
        group: g.group,
        total: g.permissions.length,
        granted: granted.length,
      };
    }).filter((s) => s.granted > 0);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="text-primary" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage users, roles, and granular module permissions
            </p>
          </div>
        </div>
        <Button onClick={openAdd} data-ocid="usermgmt.add.button">
          <Plus size={16} className="mr-1" /> Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length },
          {
            label: "Active",
            value: users.filter((u) => u.status === "Active").length,
          },
          {
            label: "Inactive",
            value: users.filter((u) => u.status === "Inactive").length,
          },
          {
            label: "Roles",
            value: [...new Set(users.map((u) => u.role))].length,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border bg-card p-4 text-center"
          >
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            className="pl-9"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="users.search_input"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48" data-ocid="users.role_filter.select">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email / Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-10"
                  data-ocid="users.empty_state"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
            {filtered.map((u, i) => {
              const perms = userPermissions[u.id] ?? [];
              const summary = getPermSummary(perms);
              return (
                <TableRow key={u.id} data-ocid={`users.item.${i + 1}`}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <div>{u.email}</div>
                    <div className="text-xs opacity-70">@{u.username}</div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${ROLE_COLORS[u.role] || "bg-gray-100 text-gray-700"}`}
                    >
                      {u.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={u.status === "Active"}
                        onCheckedChange={() => toggleStatus(u.id)}
                        data-ocid={`users.status.switch.${i + 1}`}
                      />
                      <Badge
                        variant={
                          u.status === "Active" ? "default" : "secondary"
                        }
                        className={
                          u.status === "Active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0"
                            : ""
                        }
                      >
                        {u.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {u.lastLogin}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      className="text-left"
                      onClick={() => setViewPermUser(u)}
                      title="View permissions"
                    >
                      <Badge
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-secondary/60 transition-colors"
                      >
                        {perms.length}/{ALL_PERMISSIONS.length} permissions
                      </Badge>
                      <div className="flex flex-wrap gap-0.5 mt-1 max-w-[180px]">
                        {summary.slice(0, 3).map((s) => (
                          <span
                            key={s.group}
                            className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full"
                          >
                            {s.group}: {s.granted}/{s.total}
                          </span>
                        ))}
                        {summary.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{summary.length - 3} more
                          </span>
                        )}
                      </div>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => openEdit(u)}
                        data-ocid={`usermgmt.edit.button.${u.id}`}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setResetUser(u);
                          setNewPassword("");
                          setConfirmPassword("");
                          setShowNew(false);
                          setShowConfirm(false);
                        }}
                        data-ocid={`users.reset_password.button.${i + 1}`}
                      >
                        <KeyRound size={14} className="mr-1" /> Reset
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteUser(u)}
                        data-ocid={`users.delete_button.${i + 1}`}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog
        open={isAddOpen}
        onOpenChange={(open) => !open && setIsAddOpen(false)}
      >
        <DialogContent
          className="max-w-2xl max-h-[95vh] overflow-y-auto"
          data-ocid="users.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingUser ? `Edit User — ${editingUser.name}` : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>Full Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="John Doe"
                  data-ocid="users.name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="user@school.com"
                  data-ocid="users.email.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Username *</Label>
                <Input
                  value={form.username}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, username: e.target.value }))
                  }
                  placeholder="username"
                  data-ocid="users.username.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(val) => handleRoleChange(val)}
                >
                  <SelectTrigger data-ocid="users.role.select">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    checked={form.status === "Active"}
                    onCheckedChange={(checked) =>
                      setForm((p) => ({
                        ...p,
                        status: checked ? "Active" : "Inactive",
                      }))
                    }
                    data-ocid="users.status_toggle.switch"
                  />
                  <span className="text-sm">{form.status}</span>
                </div>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>
                  {editingUser
                    ? "New Password (leave blank to keep)"
                    : "Password *"}
                </Label>
                <div className="relative">
                  <Input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, password: e.target.value }))
                    }
                    placeholder="Min 6 characters"
                    data-ocid="users.password.input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPw((v) => !v)}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Permissions Panel */}
            <div className="border border-border rounded-xl overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3 bg-secondary/40 hover:bg-secondary/60 transition-colors text-sm font-semibold"
                onClick={() => setPermissionsOpen((v) => !v)}
                data-ocid="users.permissions.toggle"
              >
                <span>
                  Module & Page Permissions ({draftPermissions.length}/
                  {ALL_PERMISSIONS.length} granted)
                </span>
                {permissionsOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {permissionsOpen && (
                <div className="p-4">
                  <PermissionsPanel
                    draft={draftPermissions}
                    role={form.role}
                    onChange={setDraftPermissions}
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              data-ocid="users.dialog.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              data-ocid={
                editingUser
                  ? "usermgmt.edit.save_button"
                  : "usermgmt.add.save_button"
              }
            >
              {editingUser ? "Save Changes" : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Permissions Dialog */}
      <Dialog
        open={!!viewPermUser}
        onOpenChange={(open) => !open && setViewPermUser(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Permissions — {viewPermUser?.name} ({viewPermUser?.role})
            </DialogTitle>
          </DialogHeader>
          {viewPermUser &&
            (() => {
              const perms = userPermissions[viewPermUser.id] ?? [];
              return (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {perms.length} of {ALL_PERMISSIONS.length} permissions
                    granted.
                  </p>
                  {PERMISSION_GROUPS.map((group) => {
                    const granted = group.permissions.filter((p) =>
                      perms.includes(p.key),
                    );
                    if (granted.length === 0) return null;
                    return (
                      <div
                        key={group.group}
                        className="border border-border rounded-lg overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-3 py-2 bg-secondary/30">
                          <span className="font-semibold text-sm">
                            {group.group}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {granted.length}/{group.permissions.length} granted
                          </span>
                        </div>
                        <div className="p-2 grid grid-cols-2 gap-1">
                          {group.permissions.map((p) => (
                            <div
                              key={p.key}
                              className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${perms.includes(p.key) ? "" : "opacity-30"} ${p.sub ? "pl-5 text-muted-foreground" : "font-medium"}`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${perms.includes(p.key) ? "bg-green-500" : "bg-muted-foreground/30"}`}
                              />
                              {p.sub && (
                                <span className="opacity-40 mr-0.5">↳</span>
                              )}
                              {p.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewPermUser(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                openEdit(viewPermUser!);
                setViewPermUser(null);
              }}
            >
              Edit Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {deleteUser?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteUser(null)}
              data-ocid="users.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              data-ocid="users.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={!!resetUser}
        onOpenChange={(open) => !open && setResetUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password — {resetUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Set a new password for <strong>{resetUser?.email}</strong>.
            </p>
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  data-ocid="users.reset.new_password.input"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowNew((v) => !v)}
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  data-ocid="users.reset.confirm_password.input"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResetUser(null)}
              data-ocid="users.reset.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              data-ocid="users.reset.save_button"
            >
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
