import Map "mo:core/Map";
import Types "types/common";
import StudentTypes "types/students";
import AttTypes "types/attendance";
import FeeTypes "types/fees";
import ExamTypes "types/exams";
import UsersLib "lib/users";
import AuditLib "lib/audit";
import SessionLib "lib/session";
import StudentsLib "lib/students";
import FeesLib "lib/fees";
import UsersApi "mixins/users-api";
import AuditApi "mixins/audit-api";
import SessionApi "mixins/session-api";
import StudentsApi "mixins/students-api";
import AttendanceApi "mixins/attendance-api";
import FeesApi "mixins/fees-api";
import ExamsApi "mixins/exams-api";
import ReportsApi "mixins/reports-api";

actor {
  // ── Existing: Users, Permissions, Audit, Sessions ──────────────────────────
  let users    : UsersLib.UserMap    = Map.empty<Text, Types.UserRecord>();
  let perms    : UsersLib.PermMap    = Map.empty<Text, [Text]>();
  let auditLog : AuditLib.AuditMap   = Map.empty<Text, Types.AuditRecord>();
  let sessions : SessionLib.SessionMap = Map.empty<Text, Types.UserSession>();

  // ── New: Students ───────────────────────────────────────────────────────────
  let students : StudentsLib.StableStudents = Map.empty<Text, StudentTypes.StudentRecord>();

  // ── New: Attendance ─────────────────────────────────────────────────────────
  let attendance : Map.Map<Text, AttTypes.AttendanceRecord> = Map.empty<Text, AttTypes.AttendanceRecord>();

  // ── New: Fees ───────────────────────────────────────────────────────────────
  let feeStructures : FeesLib.StableFeeStructures = Map.empty<Text, FeeTypes.FeeCategory>();
  let feePayments   : FeesLib.StableFeePayments   = Map.empty<Text, FeeTypes.FeePayment>();

  // ── New: Exams & Marks ──────────────────────────────────────────────────────
  let exams     : Map.Map<Text, ExamTypes.ExamRecord>    = Map.empty<Text, ExamTypes.ExamRecord>();
  let examMarks : Map.Map<Text, ExamTypes.StudentMarks>  = Map.empty<Text, ExamTypes.StudentMarks>();

  // ── Mixin composition ───────────────────────────────────────────────────────
  include UsersApi(users, perms);
  include AuditApi(auditLog);
  include SessionApi(sessions);
  include StudentsApi(students);
  include AttendanceApi(attendance);
  include FeesApi(feeStructures, feePayments);
  include ExamsApi(exams, examMarks);
  include ReportsApi(feePayments, attendance, exams, examMarks);
};
