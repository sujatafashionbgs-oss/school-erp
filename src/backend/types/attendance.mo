import StudentTypes "students";

module {
  public type StudentId = StudentTypes.StudentId;

  public type AttendanceId = Text;

  public type AttendanceStatus = {
    #present;
    #absent;
    #late;
    #halfDay;
  };

  public type AttendanceRecord = {
    id : AttendanceId;
    studentId : StudentId;
    date : Text; // "YYYY-MM-DD"
    className : Text;
    section : Text;
    status : AttendanceStatus;
    markedBy : Text;
    remarks : Text;
  };

  public type DailyAttendance = {
    date : Text;
    className : Text;
    section : Text;
    records : [AttendanceRecord];
    markedAt : Text;
    markedBy : Text;
  };

  public type AttendanceQuery = {
    date : ?Text;
    dateFrom : ?Text;
    dateTo : ?Text;
    className : ?Text;
    section : ?Text;
    studentId : ?Text;
    page : Nat;
    pageSize : Nat;
  };

  public type AttendanceSummary = {
    studentId : StudentId;
    totalDays : Nat;
    present : Nat;
    absent : Nat;
    late : Nat;
    halfDay : Nat;
    percentage : Float;
  };
};
