import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Layout } from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";

// Public Pages
import { AdminLogin } from "@/pages/public/AdminLogin";
import { StudentLogin } from "@/pages/public/StudentLogin";

import { AIAnalyticsDashboard } from "@/pages/admin/AIAnalyticsDashboard";
import { AcademicPlannerPage } from "@/pages/admin/AcademicPlannerPage";
import { AddStaffPage } from "@/pages/admin/AddStaffPage";
import { AddStudentPage } from "@/pages/admin/AddStudentPage";
import { AdminInventoryPage } from "@/pages/admin/AdminInventoryPage";
import { AdmissionsPage } from "@/pages/admin/AdmissionsPage";
import { AlumniPage } from "@/pages/admin/AlumniPage";
import { AppraisalPage } from "@/pages/admin/AppraisalPage";
import { AttendancePage } from "@/pages/admin/AttendancePage";
import { CertificatesPage } from "@/pages/admin/CertificatesPage";
import { CommunicationPage } from "@/pages/admin/CommunicationPage";
// Admin Pages
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { DocumentsPage } from "@/pages/admin/DocumentsPage";
import { EnquiryPage } from "@/pages/admin/EnquiryPage";
import { EventsPage } from "@/pages/admin/EventsPage";
import { ExamsPage } from "@/pages/admin/ExamsPage";
import { FeeCollect } from "@/pages/admin/FeeCollect";
import { FeeRemindersPage } from "@/pages/admin/FeeRemindersPage";
import { FeesPage } from "@/pages/admin/FeesPage";
import { GalleryPage } from "@/pages/admin/GalleryPage";
import { GrievancePage } from "@/pages/admin/GrievancePage";
import { HealthRecordsPage } from "@/pages/admin/HealthRecordsPage";
import { HomeworkPage } from "@/pages/admin/HomeworkPage";
import { IDCardPage } from "@/pages/admin/IDCardPage";
import { LeaveManagementPage } from "@/pages/admin/LeaveManagementPage";
import { LibraryPage } from "@/pages/admin/LibraryPage";
import { LiveChatPage } from "@/pages/admin/LiveChatPage";
import { NoticesPage } from "@/pages/admin/NoticesPage";
import { OnlineClassPage } from "@/pages/admin/OnlineClassPage";
import { OnlineFeePaymentPage } from "@/pages/admin/OnlineFeePaymentPage";
import { PharmacyPage } from "@/pages/admin/PharmacyPage";
import { ReportCardPage } from "@/pages/admin/ReportCardPage";
import { ReportsPage } from "@/pages/admin/ReportsPage";
import { ScholarshipPage } from "@/pages/admin/ScholarshipPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";
import { StaffPage } from "@/pages/admin/StaffPage";
import { StudentPerformancePage } from "@/pages/admin/StudentPerformancePage";
import { StudentsPage } from "@/pages/admin/StudentsPage";
import { SyllabusPage } from "@/pages/admin/SyllabusPage";
import { TimetablePage } from "@/pages/admin/TimetablePage";
import { TransportPage } from "@/pages/admin/TransportPage";
import { UserManagementPage } from "@/pages/admin/UserManagementPage";
import { VisitorPage } from "@/pages/admin/VisitorPage";
import { WorkloadPage } from "@/pages/admin/WorkloadPage";
import { AssignmentsPage } from "@/pages/shared/AssignmentsPage";
import { ChangePasswordPage } from "@/pages/shared/ChangePasswordPage";
import { GrievanceFormPage } from "@/pages/shared/GrievanceFormPage";
import { StudentDiaryPage } from "@/pages/student/StudentDiaryPage";

import { LessonPlanPage } from "@/pages/teacher/LessonPlanPage";
import { SelfAppraisalPage } from "@/pages/teacher/SelfAppraisalPage";
import { StudyMaterials } from "@/pages/teacher/StudyMaterials";
// Teacher Pages
import { TeacherClassesPage } from "@/pages/teacher/TeacherClassesPage";
import { TeacherDashboard } from "@/pages/teacher/TeacherDashboard";
import { TeacherLeavePage } from "@/pages/teacher/TeacherLeavePage";

import { StudentAttendance } from "@/pages/student/StudentAttendance";
// Student Pages
import { StudentDashboard } from "@/pages/student/StudentDashboard";
import { StudentFees } from "@/pages/student/StudentFees";
import { StudentLeavePage } from "@/pages/student/StudentLeavePage";
import { StudentProfilePage } from "@/pages/student/StudentProfilePage";
import { StudentResults } from "@/pages/student/StudentResults";

import { ParentAttendancePage } from "@/pages/parent/ParentAttendancePage";
import { ParentChildrenPage } from "@/pages/parent/ParentChildrenPage";
// Parent Pages
import { ParentDashboard } from "@/pages/parent/ParentDashboard";

import { NotFoundPage } from "@/pages/NotFoundPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
// Other role pages
import { AccountantDashboard } from "@/pages/accountant/AccountantDashboard";
import { SalaryPage } from "@/pages/accountant/SalaryPage";
import { BulkReportCardPage } from "@/pages/admin/BulkReportCardPage";
import { ClassConfigPage } from "@/pages/admin/ClassConfigPage";
import { StudentTransferPage } from "@/pages/admin/StudentTransferPage";
import { LabDashboard } from "@/pages/lab-incharge/LabDashboard";
import { LabExperimentsPage } from "@/pages/lab-incharge/LabExperimentsPage";
import { LabInventoryPage } from "@/pages/lab-incharge/LabInventoryPage";
import { LabSchedulePage } from "@/pages/lab-incharge/LabSchedulePage";
import { BookCatalogPage } from "@/pages/librarian/BookCatalogPage";
import { BookIssueReturnPage } from "@/pages/librarian/BookIssueReturnPage";
import { LibrarianDashboard } from "@/pages/librarian/LibrarianDashboard";
import { LibraryMembersPage } from "@/pages/librarian/LibraryMembersPage";
import { VerifyDocumentPage } from "@/pages/public/VerifyDocumentPage";
import { StudentOnlineClassPage } from "@/pages/student/StudentOnlineClassPage";
import { StudentOnlineExamPage } from "@/pages/student/StudentOnlineExamPage";
import { OnlineExamPage } from "@/pages/teacher/OnlineExamPage";
import { RouteManagementPage } from "@/pages/transport/RouteManagementPage";
import { TransportDashboard } from "@/pages/transport/TransportDashboard";
import { TransportStudentsPage } from "@/pages/transport/TransportStudentsPage";
import { VehicleManagementPage } from "@/pages/transport/VehicleManagementPage";
import { VendorDashboard } from "@/pages/vendor/VendorDashboard";
import { VendorInventoryPage } from "@/pages/vendor/VendorInventoryPage";
import { VendorOrdersPage } from "@/pages/vendor/VendorOrdersPage";

type BreadcrumbEntry = { label: string; path?: string }[];

const BREADCRUMBS: Record<string, BreadcrumbEntry> = {
  "/login": [{ label: "Login" }],
  "/login/student": [{ label: "Student Login" }],
  "/admin/dashboard": [{ label: "Admin" }, { label: "Dashboard" }],
  "/admin/students": [{ label: "Admin" }, { label: "Students" }],
  "/admin/students/add": [
    { label: "Admin" },
    { label: "Students", path: "/admin/students" },
    { label: "Add Student" },
  ],
  "/admin/staff": [{ label: "Admin" }, { label: "Staff" }],
  "/admin/staff/add": [
    { label: "Admin" },
    { label: "Staff", path: "/admin/staff" },
    { label: "Add Staff" },
  ],
  "/admin/attendance": [{ label: "Admin" }, { label: "Attendance" }],
  "/admin/fees": [{ label: "Admin" }, { label: "Fee Management" }],
  "/admin/fees/collect": [
    { label: "Admin" },
    { label: "Fee Management", path: "/admin/fees" },
    { label: "Collect Fee" },
  ],
  "/admin/exams": [{ label: "Admin" }, { label: "Examinations" }],
  "/admin/exams/reportcard": [
    { label: "Admin" },
    { label: "Examinations", path: "/admin/exams" },
    { label: "Report Cards" },
  ],
  "/admin/timetable": [{ label: "Admin" }, { label: "Timetable" }],
  "/admin/library": [{ label: "Admin" }, { label: "Library" }],
  "/admin/transport": [{ label: "Admin" }, { label: "Transport" }],
  "/admin/notices": [{ label: "Admin" }, { label: "Notices" }],
  "/admin/reports": [{ label: "Admin" }, { label: "Reports" }],
  "/admin/settings": [{ label: "Admin" }, { label: "Settings" }],
  "/admin/leave": [{ label: "Admin" }, { label: "Leave Management" }],
  "/admin/academic-planner": [
    { label: "Admin" },
    { label: "Academic Planner" },
  ],
  "/admin/syllabus": [{ label: "Admin" }, { label: "Syllabus" }],
  "/admin/enquiry": [{ label: "Admin" }, { label: "Enquiry CRM" }],
  "/admin/admissions": [{ label: "Admin" }, { label: "Admissions" }],
  "/admin/events": [{ label: "Admin" }, { label: "Events" }],
  "/admin/communication": [{ label: "Admin" }, { label: "Communication" }],
  "/admin/health": [{ label: "Admin" }, { label: "Health Records" }],
  "/admin/pharmacy": [{ label: "Admin" }, { label: "Pharmacy" }],
  "/admin/users": [{ label: "Admin" }, { label: "User Management" }],
  "/admin/ai-analytics": [{ label: "Admin" }, { label: "AI Analytics" }],
  "/admin/workload": [{ label: "Admin" }, { label: "Teacher Workload" }],
  "/admin/scholarships": [{ label: "Admin" }, { label: "Scholarships" }],
  "/admin/visitors": [{ label: "Admin" }, { label: "Visitor / Gate Pass" }],
  "/admin/class-config": [{ label: "Admin" }, { label: "Class Configuration" }],
  "/admin/student-transfer": [
    { label: "Admin" },
    { label: "Student Transfer" },
  ],
  "/admin/exams/bulk-reportcard": [
    { label: "Admin" },
    { label: "Examinations", path: "/admin/exams" },
    { label: "Bulk Report Cards" },
  ],
  "/admin/appraisal": [{ label: "Admin" }, { label: "Staff Appraisal" }],
  "/admin/certificates": [{ label: "Admin" }, { label: "Certificates" }],
  "/admin/gallery": [{ label: "Admin" }, { label: "Photo Gallery" }],
  "/admin/grievances": [{ label: "Admin" }, { label: "Grievances" }],
  "/teacher/dashboard": [{ label: "Teacher" }, { label: "Dashboard" }],
  "/teacher/classes": [{ label: "Teacher" }, { label: "My Classes" }],
  "/teacher/attendance": [{ label: "Teacher" }, { label: "Attendance" }],
  "/teacher/assignments": [{ label: "Teacher" }, { label: "Assignments" }],
  "/teacher/materials": [{ label: "Teacher" }, { label: "Study Materials" }],
  "/teacher/exams": [{ label: "Teacher" }, { label: "Exams" }],
  "/teacher/notices": [{ label: "Teacher" }, { label: "Notices" }],
  "/teacher/leave": [{ label: "Teacher" }, { label: "Leave" }],
  "/teacher/lesson-plan": [{ label: "Teacher" }, { label: "Lesson Plans" }],
  "/teacher/appraisal": [{ label: "Teacher" }, { label: "My Appraisal" }],
  "/student/dashboard": [{ label: "Student" }, { label: "Dashboard" }],
  "/student/profile": [{ label: "Student" }, { label: "My Profile" }],
  "/student/attendance": [{ label: "Student" }, { label: "Attendance" }],
  "/student/materials": [{ label: "Student" }, { label: "Study Materials" }],
  "/student/assignments": [{ label: "Student" }, { label: "Assignments" }],
  "/student/results": [{ label: "Student" }, { label: "Results" }],
  "/student/fees": [{ label: "Student" }, { label: "Fee Details" }],
  "/student/notices": [{ label: "Student" }, { label: "Notices" }],
  "/student/leave": [{ label: "Student" }, { label: "Leave" }],
  "/student/events": [{ label: "Student" }, { label: "Events" }],
  "/student/gallery": [{ label: "Student" }, { label: "Gallery" }],
  "/parent/dashboard": [{ label: "Parent" }, { label: "Dashboard" }],
  "/parent/children": [{ label: "Parent" }, { label: "My Children" }],
  "/parent/attendance": [{ label: "Parent" }, { label: "Attendance" }],
  "/parent/fees": [{ label: "Parent" }, { label: "Fee Dues" }],
  "/parent/results": [{ label: "Parent" }, { label: "Results" }],
  "/parent/notices": [{ label: "Parent" }, { label: "Notices" }],
  "/parent/events": [{ label: "Parent" }, { label: "Events" }],
  "/accountant/dashboard": [{ label: "Accountant" }, { label: "Dashboard" }],
  "/accountant/salary": [{ label: "Accountant" }, { label: "Salary" }],
  "/accountant/reports": [{ label: "Accountant" }, { label: "Reports" }],
  "/librarian/dashboard": [{ label: "Librarian" }, { label: "Dashboard" }],
  "/librarian/books": [{ label: "Librarian" }, { label: "Books" }],
  "/librarian/issue": [{ label: "Librarian" }, { label: "Issue / Return" }],
  "/librarian/members": [{ label: "Librarian" }, { label: "Members" }],
  "/lab-incharge/dashboard": [
    { label: "Lab Incharge" },
    { label: "Dashboard" },
  ],
  "/lab-incharge/schedule": [
    { label: "Lab Incharge" },
    { label: "Lab Schedule" },
  ],
  "/lab-incharge/inventory": [
    { label: "Lab Incharge" },
    { label: "Inventory" },
  ],
  "/lab-incharge/experiments": [
    { label: "Lab Incharge" },
    { label: "Experiments" },
  ],
  "/transport/dashboard": [{ label: "Transport" }, { label: "Dashboard" }],
  "/transport/routes": [{ label: "Transport" }, { label: "Routes" }],
  "/transport/vehicles": [{ label: "Transport" }, { label: "Vehicles" }],
  "/transport/students": [{ label: "Transport" }, { label: "Students" }],
  "/vendor/dashboard": [{ label: "Vendor" }, { label: "Dashboard" }],
  "/vendor/orders": [{ label: "Vendor" }, { label: "Purchase Orders" }],
  "/vendor/inventory": [{ label: "Vendor" }, { label: "Inventory" }],
  "/vendor/reports": [{ label: "Vendor" }, { label: "Reports" }],
  "/unauthorized": [{ label: "Access Denied" }],
  "/teacher/online-exam": [{ label: "Teacher" }, { label: "Online Exams" }],
  "/student/online-exam": [{ label: "Student" }, { label: "Online Exams" }],
  "/verify": [{ label: "Document Verification" }],
  "/change-password": [{ label: "Account" }, { label: "Change Password" }],
  "/grievance": [{ label: "Grievance" }],
  "/admin/online-fee-payment": [
    { label: "Admin" },
    { label: "Online Fee Payment" },
  ],
  "/admin/homework": [{ label: "Admin" }, { label: "Homework" }],
  "/admin/id-cards": [{ label: "Admin" }, { label: "ID Cards" }],
  "/admin/alumni": [{ label: "Admin" }, { label: "Alumni" }],
  "/admin/inventory": [{ label: "Admin" }, { label: "Inventory" }],
  "/admin/documents": [{ label: "Admin" }, { label: "Documents" }],
  "/admin/fee-reminders": [{ label: "Admin" }, { label: "Fee Reminders" }],
  "/admin/live-chat": [{ label: "Admin" }, { label: "Live Chat" }],
  "/admin/online-classes": [{ label: "Admin" }, { label: "Online Classes" }],
  "/admin/student-performance": [
    { label: "Admin" },
    { label: "Student Performance" },
  ],
  "/student/diary": [{ label: "Student" }, { label: "My Diary" }],
  "/student/online-classes": [
    { label: "Student" },
    { label: "Online Classes" },
  ],
};

// Define which roles can access which route prefixes
const ROUTE_PERMISSIONS: { prefix: string; allowed: string[] }[] = [
  { prefix: "/admin", allowed: ["admin", "super-admin"] },
  { prefix: "/teacher", allowed: ["teacher", "admin", "super-admin"] },
  { prefix: "/student", allowed: ["student"] },
  { prefix: "/parent", allowed: ["parent"] },
  { prefix: "/accountant", allowed: ["accountant", "admin", "super-admin"] },
  { prefix: "/librarian", allowed: ["librarian", "admin", "super-admin"] },
  {
    prefix: "/lab-incharge",
    allowed: ["lab-incharge", "admin", "super-admin"],
  },
  {
    prefix: "/transport",
    allowed: ["transport-manager", "admin", "super-admin"],
  },
  { prefix: "/vendor", allowed: ["vendor", "admin", "super-admin"] },
];

function isAuthorized(role: string, path: string): boolean {
  for (const rule of ROUTE_PERMISSIONS) {
    if (path.startsWith(rule.prefix)) {
      return rule.allowed.includes(role);
    }
  }
  return true;
}

function AppInner() {
  const { user, isAuthenticated } = useAuth();
  const [path, setPath] = useState(
    () => window.location.hash.replace("#", "") || "/login",
  );

  useEffect(() => {
    const handler = () =>
      setPath(window.location.hash.replace("#", "") || "/login");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
    setPath(to);
  }, []);

  const isPublicPath =
    path === "/login" ||
    path === "/login/student" ||
    path.startsWith("/verify");

  const isLoginPath =
    path === "/login" || path === "/login/student" || path === "/";

  useEffect(() => {
    if (!isAuthenticated && !isPublicPath) {
      navigate("/login");
    }
  }, [isAuthenticated, isPublicPath, navigate]);

  useEffect(() => {
    if (isAuthenticated && isLoginPath) {
      const role = user?.role || "admin";
      const dashMap: Record<string, string> = {
        admin: "/admin/dashboard",
        "super-admin": "/admin/dashboard",
        teacher: "/teacher/dashboard",
        student: "/student/dashboard",
        parent: "/parent/dashboard",
        accountant: "/accountant/dashboard",
        librarian: "/librarian/dashboard",
        "lab-incharge": "/lab-incharge/dashboard",
        "transport-manager": "/transport/dashboard",
        vendor: "/vendor/dashboard",
      };
      navigate(dashMap[role] || "/admin/dashboard");
    }
  }, [isAuthenticated, isLoginPath, user?.role, navigate]);

  if (!isAuthenticated && !isPublicPath) return null;
  if (isAuthenticated && isLoginPath) return null;

  if (isAuthenticated && user && path !== "/unauthorized") {
    if (!isAuthorized(user.role, path)) {
      return (
        <Layout
          navigate={navigate}
          currentPath={path}
          breadcrumbs={BREADCRUMBS["/unauthorized"] || []}
        >
          <UnauthorizedPage navigate={navigate} />
        </Layout>
      );
    }
  }

  const withLayout = (el: React.ReactNode) => (
    <Layout
      navigate={navigate}
      currentPath={path}
      breadcrumbs={BREADCRUMBS[path] || []}
    >
      {el}
    </Layout>
  );

  if (path.startsWith("/verify")) return <VerifyDocumentPage />;
  if (path === "/login") return <AdminLogin navigate={navigate} />;
  if (path === "/login/student") return <StudentLogin navigate={navigate} />;

  if (path === "/unauthorized")
    return withLayout(<UnauthorizedPage navigate={navigate} />);

  // Shared routes (all authenticated roles)
  if (path === "/change-password") return withLayout(<ChangePasswordPage />);
  if (path === "/grievance") return withLayout(<GrievanceFormPage />);

  // Admin routes
  if (path === "/admin/dashboard")
    return withLayout(<AdminDashboard navigate={navigate} />);
  if (path === "/admin/students")
    return withLayout(<StudentsPage navigate={navigate} />);
  if (path === "/admin/students/add")
    return withLayout(<AddStudentPage navigate={navigate} />);
  if (path === "/admin/staff")
    return withLayout(<StaffPage navigate={navigate} />);
  if (path === "/admin/staff/add")
    return withLayout(<AddStaffPage navigate={navigate} />);
  if (path === "/admin/attendance")
    return withLayout(<AttendancePage navigate={navigate} />);
  if (path === "/admin/fees")
    return withLayout(<FeesPage navigate={navigate} />);
  if (path === "/admin/fees/collect")
    return withLayout(<FeeCollect navigate={navigate} />);
  if (path === "/admin/exams") return withLayout(<ExamsPage />);
  if (path === "/admin/exams/reportcard") return withLayout(<ReportCardPage />);
  if (path === "/admin/timetable") return withLayout(<TimetablePage />);
  if (path === "/admin/library") return withLayout(<LibraryPage />);
  if (path === "/admin/transport") return withLayout(<TransportPage />);
  if (path === "/admin/notices") return withLayout(<NoticesPage />);
  if (path === "/admin/reports") return withLayout(<ReportsPage />);
  if (path === "/admin/settings") return withLayout(<SettingsPage />);
  if (path === "/admin/leave") return withLayout(<LeaveManagementPage />);
  if (path === "/admin/academic-planner")
    return withLayout(<AcademicPlannerPage />);
  if (path === "/admin/syllabus") return withLayout(<SyllabusPage />);
  if (path === "/admin/enquiry") return withLayout(<EnquiryPage />);
  if (path === "/admin/admissions") return withLayout(<AdmissionsPage />);
  if (path === "/admin/events") return withLayout(<EventsPage />);
  if (path === "/admin/communication") return withLayout(<CommunicationPage />);
  if (path === "/admin/health") return withLayout(<HealthRecordsPage />);
  if (path === "/admin/pharmacy") return withLayout(<PharmacyPage />);
  if (path === "/admin/ai-analytics")
    return withLayout(<AIAnalyticsDashboard navigate={navigate} />);
  if (path === "/admin/workload") return withLayout(<WorkloadPage />);
  if (path === "/admin/scholarships") return withLayout(<ScholarshipPage />);
  if (path === "/admin/users") return withLayout(<UserManagementPage />);
  if (path === "/admin/visitors") return withLayout(<VisitorPage />);
  if (path === "/admin/class-config") return withLayout(<ClassConfigPage />);
  if (path === "/admin/student-transfer")
    return withLayout(<StudentTransferPage navigate={navigate} />);
  if (path === "/admin/exams/bulk-reportcard")
    return withLayout(<BulkReportCardPage />);
  if (path === "/admin/appraisal") return withLayout(<AppraisalPage />);
  if (path === "/admin/certificates") return withLayout(<CertificatesPage />);
  if (path === "/admin/gallery") return withLayout(<GalleryPage />);
  if (path === "/admin/grievances") return withLayout(<GrievancePage />);
  if (path === "/admin/online-fee-payment")
    return withLayout(<OnlineFeePaymentPage />);
  if (path === "/admin/homework") return withLayout(<HomeworkPage />);
  if (path === "/admin/id-cards") return withLayout(<IDCardPage />);
  if (path === "/admin/alumni") return withLayout(<AlumniPage />);
  if (path === "/admin/inventory") return withLayout(<AdminInventoryPage />);
  if (path === "/admin/documents") return withLayout(<DocumentsPage />);
  if (path === "/admin/fee-reminders") return withLayout(<FeeRemindersPage />);
  if (path === "/admin/live-chat") return withLayout(<LiveChatPage />);
  if (path === "/admin/online-classes") return withLayout(<OnlineClassPage />);
  if (path === "/admin/student-performance")
    return withLayout(<StudentPerformancePage />);

  // Teacher routes
  if (path === "/teacher/dashboard")
    return withLayout(<TeacherDashboard navigate={navigate} />);
  if (path === "/teacher/classes") return withLayout(<TeacherClassesPage />);
  if (path === "/teacher/attendance")
    return withLayout(<AttendancePage navigate={navigate} />);
  if (path === "/teacher/assignments")
    return withLayout(<AssignmentsPage navigate={navigate} />);
  if (path === "/teacher/materials") return withLayout(<StudyMaterials />);
  if (path === "/teacher/exams") return withLayout(<ExamsPage />);
  if (path === "/teacher/notices") return withLayout(<NoticesPage />);
  if (path === "/teacher/online-exam") return withLayout(<OnlineExamPage />);
  if (path === "/teacher/leave") return withLayout(<TeacherLeavePage />);
  if (path === "/teacher/lesson-plan") return withLayout(<LessonPlanPage />);
  if (path === "/teacher/appraisal") return withLayout(<SelfAppraisalPage />);

  // Student routes
  if (path === "/student/dashboard")
    return withLayout(<StudentDashboard navigate={navigate} />);
  if (path === "/student/profile") return withLayout(<StudentProfilePage />);
  if (path === "/student/attendance") return withLayout(<StudentAttendance />);
  if (path === "/student/materials") return withLayout(<StudyMaterials />);
  if (path === "/student/assignments")
    return withLayout(<AssignmentsPage navigate={navigate} />);
  if (path === "/student/results") return withLayout(<StudentResults />);
  if (path === "/student/fees") return withLayout(<StudentFees />);
  if (path === "/student/notices") return withLayout(<NoticesPage />);
  if (path === "/student/online-exam")
    return withLayout(<StudentOnlineExamPage />);
  if (path === "/student/leave") return withLayout(<StudentLeavePage />);
  if (path === "/student/events") return withLayout(<EventsPage />);
  if (path === "/student/gallery") return withLayout(<GalleryPage />);
  if (path === "/student/diary") return withLayout(<StudentDiaryPage />);
  if (path === "/student/online-classes")
    return withLayout(<StudentOnlineClassPage />);

  // Parent routes
  if (path === "/parent/dashboard")
    return withLayout(<ParentDashboard navigate={navigate} />);
  if (path === "/parent/children")
    return withLayout(<ParentChildrenPage navigate={navigate} />);
  if (path === "/parent/attendance")
    return withLayout(<ParentAttendancePage />);
  if (path === "/parent/fees") return withLayout(<StudentFees />);
  if (path === "/parent/results") return withLayout(<StudentResults />);
  if (path === "/parent/notices") return withLayout(<NoticesPage />);
  if (path === "/parent/events") return withLayout(<EventsPage />);

  // Accountant routes
  if (path === "/accountant/dashboard")
    return withLayout(<AccountantDashboard navigate={navigate} />);
  if (path === "/accountant/salary") return withLayout(<SalaryPage />);
  if (path === "/accountant/reports") return withLayout(<ReportsPage />);

  // Librarian routes
  if (path === "/librarian/dashboard")
    return withLayout(<LibrarianDashboard />);
  if (path === "/librarian/books") return withLayout(<BookCatalogPage />);
  if (path === "/librarian/issue") return withLayout(<BookIssueReturnPage />);
  if (path === "/librarian/members") return withLayout(<LibraryMembersPage />);

  // Lab routes
  if (path === "/lab-incharge/dashboard") return withLayout(<LabDashboard />);
  if (path === "/lab-incharge/schedule") return withLayout(<LabSchedulePage />);
  if (path === "/lab-incharge/inventory")
    return withLayout(<LabInventoryPage />);
  if (path === "/lab-incharge/experiments")
    return withLayout(<LabExperimentsPage />);

  // Transport routes
  if (path === "/transport/dashboard")
    return withLayout(<TransportDashboard />);
  if (path === "/transport/routes") return withLayout(<RouteManagementPage />);
  if (path === "/transport/vehicles")
    return withLayout(<VehicleManagementPage />);
  if (path === "/transport/students")
    return withLayout(<TransportStudentsPage />);

  // Vendor routes
  if (path === "/vendor/dashboard")
    return withLayout(<VendorDashboard navigate={navigate} />);
  if (path === "/vendor/orders") return withLayout(<VendorOrdersPage />);
  if (path === "/vendor/inventory") return withLayout(<VendorInventoryPage />);
  if (path === "/vendor/reports") return withLayout(<ReportsPage />);

  return withLayout(<NotFoundPage navigate={navigate} />);
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <AppInner />
      </AuthProvider>
    </ErrorBoundary>
  );
}
