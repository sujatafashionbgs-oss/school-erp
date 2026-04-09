import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Types "../types/attendance";

module {
  public type StableAttendance = Map.Map<Text, Types.AttendanceRecord>;

  // Key format: "{date}_{className}_{section}_{studentId}"
  func makeKey(date : Text, className : Text, section : Text, studentId : Text) : Text {
    date # "_" # className # "_" # section # "_" # studentId;
  };

  // Prefix used for filtering records belonging to a date/class/section
  func makePrefix(date : Text, className : Text, section : Text) : Text {
    date # "_" # className # "_" # section # "_";
  };

  // Check whether a key starts with the given prefix
  func keyStartsWith(key : Text, prefix : Text) : Bool {
    key.startsWith(#text prefix);
  };

  // ── writes ─────────────────────────────────────────────────────────────────

  // Upsert a single student attendance record
  public func saveAttendanceRecord(store : StableAttendance, record : Types.AttendanceRecord) : () {
    let key = makeKey(record.date, record.className, record.section, record.studentId);
    store.add(key, record);
  };

  // Batch upsert all records for a class/section/date
  public func saveDailyAttendance(store : StableAttendance, records : [Types.AttendanceRecord]) : () {
    for (record in records.values()) {
      saveAttendanceRecord(store, record);
    };
  };

  // ── reads ──────────────────────────────────────────────────────────────────

  // All records for a given date/class/section
  public func loadAttendanceByDate(store : StableAttendance, date : Text, className : Text, section : Text) : [Types.AttendanceRecord] {
    let prefix = makePrefix(date, className, section);
    store.entries()
      .filter(func((k, _v) : (Text, Types.AttendanceRecord)) : Bool {
        keyStartsWith(k, prefix);
      })
      .map(func((_k, v) : (Text, Types.AttendanceRecord)) : Types.AttendanceRecord { v })
      .toArray();
  };

  // All records for a student, optionally filtered by date range (YYYY-MM-DD lexicographic comparison)
  public func loadStudentAttendance(store : StableAttendance, studentId : Text, dateFrom : ?Text, dateTo : ?Text) : [Types.AttendanceRecord] {
    store.values()
      .filter(func(r : Types.AttendanceRecord) : Bool {
        if (not Text.equal(r.studentId, studentId)) return false;
        let fromOk = switch (dateFrom) {
          case null true;
          case (?f) r.date.greaterOrEqual(f);
        };
        let toOk = switch (dateTo) {
          case null true;
          case (?t) r.date.lessOrEqual(t);
        };
        fromOk and toOk;
      })
      .toArray()
      .sort(func(a : Types.AttendanceRecord, b : Types.AttendanceRecord) : { #less; #equal; #greater } {
        Text.compare(a.date, b.date);
      });
  };

  // Aggregate attendance statistics for a student over an inclusive date range
  public func getAttendanceSummary(store : StableAttendance, studentId : Text, dateFrom : Text, dateTo : Text) : Types.AttendanceSummary {
    var present = 0;
    var absent = 0;
    var late = 0;
    var halfDay = 0;

    store.values().forEach(func(r : Types.AttendanceRecord) : () {
      if (
        Text.equal(r.studentId, studentId) and
        r.date.greaterOrEqual(dateFrom) and
        r.date.lessOrEqual(dateTo)
      ) {
        switch (r.status) {
          case (#present)  { present  += 1 };
          case (#absent)   { absent   += 1 };
          case (#late)     { late     += 1 };
          case (#halfDay)  { halfDay  += 1 };
        };
      };
    });

    let totalDays = present + absent + late + halfDay;
    // Present + half-day(0.5) + late counted as present for percentage
    let presentEquivalent = (present + late).toFloat() + halfDay.toFloat() * 0.5;
    let percentage = if (totalDays == 0) {
      0.0;
    } else {
      presentEquivalent / totalDays.toFloat() * 100.0;
    };

    { studentId; totalDays; present; absent; late; halfDay; percentage };
  };

  // True if at least one record exists for the given date/class/section
  public func hasAttendanceForDate(store : StableAttendance, date : Text, className : Text, section : Text) : Bool {
    let prefix = makePrefix(date, className, section);
    switch (store.entries().find(func((k, _v) : (Text, Types.AttendanceRecord)) : Bool {
      keyStartsWith(k, prefix);
    })) {
      case null   false;
      case (?_)   true;
    };
  };

  // Distinct sorted list of dates that have attendance records for a class/section
  public func getDatesWithAttendance(store : StableAttendance, className : Text, section : Text) : [Text] {
    // Collect unique dates using a Set-like accumulation via sorted dedup
    let dates = store.values()
      .filter(func(r : Types.AttendanceRecord) : Bool {
        Text.equal(r.className, className) and Text.equal(r.section, section);
      })
      .map(func(r : Types.AttendanceRecord) : Text { r.date })
      .toArray()
      .sort();

    // Deduplicate consecutive equal values
    if (dates.size() == 0) return [];
    var result : [Text] = [dates[0]];
    var prev = dates[0];
    for (i in Nat.range(1, dates.size())) {
      let d = dates[i];
      if (not Text.equal(d, prev)) {
        result := result.concat([d]);
        prev := d;
      };
    };
    result;
  };
};
