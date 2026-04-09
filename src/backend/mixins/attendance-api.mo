import Types "../types/attendance";
import AttendanceLib "../lib/attendance";

mixin (attendance : AttendanceLib.StableAttendance) {

  // ── writes ──────────────────────────────────────────────────────────────────

  // Batch save attendance records for a class/section on a given date.
  // Returns #err if any required fields are empty.
  public shared func saveDailyAttendance(
    date      : Text,
    className : Text,
    section   : Text,
    records   : [Types.AttendanceRecord],
  ) : async { #ok : Bool; #err : Text } {
    if (date      == "") return #err("date cannot be empty");
    if (className == "") return #err("className cannot be empty");
    if (section   == "") return #err("section cannot be empty");
    AttendanceLib.saveDailyAttendance(attendance, records);
    #ok(true);
  };

  // ── reads (query) ────────────────────────────────────────────────────────────

  // All attendance records for a class/section on a specific date.
  public query func loadAttendanceByDate(
    date      : Text,
    className : Text,
    section   : Text,
  ) : async [Types.AttendanceRecord] {
    AttendanceLib.loadAttendanceByDate(attendance, date, className, section);
  };

  // Attendance history for a single student, optionally bounded by date range.
  public query func loadStudentAttendance(
    studentId : Text,
    dateFrom  : ?Text,
    dateTo    : ?Text,
  ) : async [Types.AttendanceRecord] {
    AttendanceLib.loadStudentAttendance(attendance, studentId, dateFrom, dateTo);
  };

  // Aggregate stats (present / absent / late / halfDay / percentage) for a student
  // over an inclusive date range.
  public query func getAttendanceSummary(
    studentId : Text,
    dateFrom  : Text,
    dateTo    : Text,
  ) : async Types.AttendanceSummary {
    AttendanceLib.getAttendanceSummary(attendance, studentId, dateFrom, dateTo);
  };

  // Returns true when attendance has already been saved for the given date/class/section.
  public query func hasAttendanceForDate(
    date      : Text,
    className : Text,
    section   : Text,
  ) : async Bool {
    AttendanceLib.hasAttendanceForDate(attendance, date, className, section);
  };

  // Sorted list of dates for which attendance exists for a class/section.
  public query func getDatesWithAttendance(
    className : Text,
    section   : Text,
  ) : async [Text] {
    AttendanceLib.getDatesWithAttendance(attendance, className, section);
  };
};
