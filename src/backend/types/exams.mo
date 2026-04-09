import StudentTypes "students";
import AttendanceTypes "attendance";

module {
  public type StudentId = StudentTypes.StudentId;
  public type AttendanceSummary = AttendanceTypes.AttendanceSummary;

  public type ExamId = Text;

  public type ExamRecord = {
    id : ExamId;
    title : Text;
    subject : Text;
    className : Text;
    section : Text;
    examDate : Text; // "YYYY-MM-DD"
    maxMarks : Nat;
    duration : Nat; // minutes
    academicYear : Text; // "2026-27"
    term : Text; // "Unit Test 1" | "Half Yearly" | "Unit Test 2" | "Annual"
    createdBy : Text;
  };

  public type StudentMarks = {
    examId : ExamId;
    studentId : StudentId;
    studentName : Text;
    admissionNo : Text;
    obtainedMarks : Float;
    grade : Text; // "A+" | "A" | "B+" | "B" | "C" | "D" | "F"
    rank : Nat;
    remarks : Text;
  };

  public type ExamQuery = {
    className : ?Text;
    section : ?Text;
    subject : ?Text;
    term : ?Text;
    academicYear : ?Text;
    page : Nat;
    pageSize : Nat;
  };

  public type ExamResult = {
    examTitle : Text;
    subject : Text;
    maxMarks : Nat;
    obtainedMarks : Float;
    grade : Text;
  };

  public type ReportCardData = {
    studentId : StudentId;
    studentName : Text;
    className : Text;
    section : Text;
    rollNo : Nat;
    exams : [ExamResult];
    attendance : AttendanceSummary;
    overallGrade : Text;
    rank : Nat;
    remarks : Text;
    academicYear : Text; // "2026-27"
  };
};
