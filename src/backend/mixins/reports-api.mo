import Map "mo:core/Map";
import ReportTypes "../types/reports";
import FeeTypes "../types/fees";
import AttTypes "../types/attendance";
import ExamTypes "../types/exams";
import ReportsLib "../lib/reports";

mixin (
  feePayments : Map.Map<Text, FeeTypes.FeePayment>,
  attendance  : Map.Map<Text, AttTypes.AttendanceRecord>,
  exams       : Map.Map<Text, ExamTypes.ExamRecord>,
  marks       : Map.Map<Text, ExamTypes.StudentMarks>
) {

  /// Fee collection summary grouped by date for the given date range.
  /// Optionally scoped to a single class.
  public query func getFeeReport(
    dateFrom  : Text,
    dateTo    : Text,
    className : ?Text,
    page      : Nat,
    pageSize  : Nat
  ) : async ReportTypes.FeeReportPage {
    let dateRange : ReportTypes.DateRange = { from = dateFrom; to = dateTo };
    let all = ReportsLib.generateFeeReport(feePayments, dateRange, className);
    ReportsLib.paginateResults<ReportTypes.FeeReport>(all, page, pageSize)
  };

  /// Attendance percentage by class/section grouped by date.
  /// Optionally scoped to a single class and/or section.
  public query func getAttendanceReport(
    dateFrom  : Text,
    dateTo    : Text,
    className : ?Text,
    section   : ?Text,
    page      : Nat,
    pageSize  : Nat
  ) : async ReportTypes.AttendanceReportPage {
    let dateRange : ReportTypes.DateRange = { from = dateFrom; to = dateTo };
    let all = ReportsLib.generateAttendanceReport(attendance, dateRange, className, section);
    ReportsLib.paginateResults<ReportTypes.AttendanceReport>(all, page, pageSize)
  };

  /// Exam performance statistics (average, top score, pass %) per exam.
  /// Optionally scoped to a single class and/or academic year.
  public query func getAcademicReport(
    className    : ?Text,
    academicYear : ?Text,
    page         : Nat,
    pageSize     : Nat
  ) : async ReportTypes.AcademicReportPage {
    let all = ReportsLib.generateAcademicReport(exams, marks, className, academicYear);
    ReportsLib.paginateResults<ReportTypes.AcademicReport>(all, page, pageSize)
  };

};
