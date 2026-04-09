import ExamTypes "exams";

module {
  public type ExamId = ExamTypes.ExamId;

  public type ReportType = {
    #feeCollection;
    #attendance;
    #academic;
    #expense;
  };

  public type DateRange = {
    from : Text; // "YYYY-MM-DD"
    to : Text;   // "YYYY-MM-DD"
  };

  public type FeeReport = {
    date : Text; // "YYYY-MM-DD"
    totalCollected : Float;
    totalStudents : Nat;
    cashPayments : Float;
    onlinePayments : Float;
    outstanding : Float;
  };

  public type AttendanceReport = {
    date : Text; // "YYYY-MM-DD"
    className : Text;
    section : Text;
    present : Nat;
    absent : Nat;
    late : Nat;
    percentage : Float;
  };

  public type AcademicReport = {
    examId : ExamId;
    examTitle : Text;
    className : Text;
    section : Text;
    averageMarks : Float;
    topScore : Float;
    passPercentage : Float;
  };

  public type ReportQuery = {
    reportType : ReportType;
    dateRange : ?DateRange;
    className : ?Text;
    section : ?Text;
    page : Nat;
    pageSize : Nat;
  };

  // Generic paginated result — one concrete version per report type
  // to stay within Motoko's shared type constraints
  public type FeeReportPage = {
    items : [FeeReport];
    total : Nat;
    page : Nat;
    pageSize : Nat;
  };

  public type AttendanceReportPage = {
    items : [AttendanceReport];
    total : Nat;
    page : Nat;
    pageSize : Nat;
  };

  public type AcademicReportPage = {
    items : [AcademicReport];
    total : Nat;
    page : Nat;
    pageSize : Nat;
  };
};
