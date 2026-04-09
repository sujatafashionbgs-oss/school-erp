import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import ReportTypes "../types/reports";
import FeeTypes "../types/fees";
import AttTypes "../types/attendance";
import ExamTypes "../types/exams";

module {

  // ── helpers ────────────────────────────────────────────────────────────────

  // Lexicographic date comparison ("YYYY-MM-DD" strings sort correctly as Text)
  func dateInRange(date : Text, range : ReportTypes.DateRange) : Bool {
    date >= range.from and date <= range.to
  };

  // ── generateFeeReport ──────────────────────────────────────────────────────

  /// Aggregate daily fee collections over a date range.
  /// Groups by date; each entry sums cash vs online payments and total outstanding balance.
  /// When `className` is provided, only payments for that class are included.
  public func generateFeeReport(
    feePayments : Map.Map<Text, FeeTypes.FeePayment>,
    dateRange : ReportTypes.DateRange,
    className : ?Text
  ) : [ReportTypes.FeeReport] {
    // Collect every payment that falls in range (and optionally matches class)
    let filtered = feePayments.entries()
      .toArray()
      .filter(func((_, p) : (Text, FeeTypes.FeePayment)) : Bool {
          dateInRange(p.paymentDate, dateRange) and
          (switch className { case null true; case (?c) p.className == c })
        });

    // Build a map: date → accumulated sums
    type Acc = { var totalCollected : Float; var students : Nat; var cash : Float; var online : Float; var outstanding : Float };
    let byDate = Map.empty<Text, Acc>();

    for ((_, p) in filtered.values()) {
      let acc : Acc = switch (byDate.get(p.paymentDate)) {
        case (?a) a;
        case null {
          let a : Acc = { var totalCollected = 0.0; var students = 0; var cash = 0.0; var online = 0.0; var outstanding = 0.0 };
          byDate.add(p.paymentDate, a);
          a
        };
      };
      acc.totalCollected += p.paidAmount;
      acc.students += 1;
      if (p.paymentMode == "cash") {
        acc.cash += p.paidAmount;
      } else if (p.paymentMode == "online") {
        acc.online += p.paidAmount;
      };
      acc.outstanding += p.balance;
    };

    // Convert accumulated map to sorted [FeeReport]
    byDate.entries()
      .toArray()
      .sort(func((a, _) : (Text, Acc), (b, _) : (Text, Acc)) : { #less; #equal; #greater } = Text.compare(a, b))
      .map(func((date, a) : (Text, Acc)) : ReportTypes.FeeReport {
          {
            date;
            totalCollected = a.totalCollected;
            totalStudents  = a.students;
            cashPayments   = a.cash;
            onlinePayments = a.online;
            outstanding    = a.outstanding;
          }
        });
  };

  // ── generateAttendanceReport ───────────────────────────────────────────────

  /// Aggregate daily attendance by class/section over a date range.
  /// Groups by (date, className, section); counts present / absent / late and computes %.
  public func generateAttendanceReport(
    attendance : Map.Map<Text, AttTypes.AttendanceRecord>,
    dateRange : ReportTypes.DateRange,
    className : ?Text,
    section : ?Text
  ) : [ReportTypes.AttendanceReport] {
    let filtered = attendance.entries()
      .toArray()
      .filter(func((_, r) : (Text, AttTypes.AttendanceRecord)) : Bool {
          dateInRange(r.date, dateRange) and
          (switch className { case null true; case (?c) r.className == c }) and
          (switch section   { case null true; case (?s) r.section == s   })
        });

    // Group key: "date|className|section"
    type Acc = { var present : Nat; var absent : Nat; var late : Nat };
    let byGroup = Map.empty<Text, Acc>();

    for ((_, r) in filtered.values()) {
      let key = r.date # "|" # r.className # "|" # r.section;
      let acc : Acc = switch (byGroup.get(key)) {
        case (?a) a;
        case null {
          let a : Acc = { var present = 0; var absent = 0; var late = 0 };
          byGroup.add(key, a);
          a
        };
      };
      switch (r.status) {
        case (#present) acc.present += 1;
        case (#absent)  acc.absent  += 1;
        case (#late)    { acc.late += 1; acc.present += 1 }; // late counts as present
        case (#halfDay) acc.present += 1;
      };
    };

    byGroup.entries()
      .toArray()
      .sort(func((a, _) : (Text, Acc), (b, _) : (Text, Acc)) : { #less; #equal; #greater } = Text.compare(a, b))
      .map(func((key, a) : (Text, Acc)) : ReportTypes.AttendanceReport {
          let parts = key.split(#char '|').toArray();
          let date  = if (parts.size() > 0) parts[0] else "";
          let cls   = if (parts.size() > 1) parts[1] else "";
          let sec   = if (parts.size() > 2) parts[2] else "";
          let total = a.present + a.absent;
          let pct   = if (total == 0) 0.0
                      else a.present.toFloat() / total.toFloat() * 100.0;
          {
            date;
            className  = cls;
            section    = sec;
            present    = a.present;
            absent     = a.absent;
            late       = a.late;
            percentage = pct;
          }
        });
  };

  // ── generateAcademicReport ─────────────────────────────────────────────────

  /// Exam performance statistics per class.
  /// Groups marks by examId; filters by className and/or academicYear when provided.
  public func generateAcademicReport(
    exams : Map.Map<Text, ExamTypes.ExamRecord>,
    marks : Map.Map<Text, ExamTypes.StudentMarks>,
    className : ?Text,
    academicYear : ?Text
  ) : [ReportTypes.AcademicReport] {
    // Filter exam records first
    let filteredExams = exams.entries()
      .toArray()
      .filter(func((_, e) : (Text, ExamTypes.ExamRecord)) : Bool {
          (switch className    { case null true; case (?c) e.className == c    }) and
          (switch academicYear { case null true; case (?y) e.academicYear == y })
        });

    // For each exam, aggregate its marks
    filteredExams
      .map(func((examId, exam) : (Text, ExamTypes.ExamRecord)) : ReportTypes.AcademicReport {
          let examMarks = marks.entries()
            .toArray()
            .filter(func((_, m) : (Text, ExamTypes.StudentMarks)) : Bool { m.examId == examId });

          let total = examMarks.size();
          if (total == 0) {
            return {
              examId;
              examTitle      = exam.title;
              className      = exam.className;
              section        = exam.section;
              averageMarks   = 0.0;
              topScore       = 0.0;
              passPercentage = 0.0;
            };
          };

          var sumMarks : Float = 0.0;
          var top      : Float = 0.0;
          var passed   : Nat   = 0;
          let passThreshold = exam.maxMarks.toFloat() * 0.33;

          for ((_, m) in examMarks.values()) {
            sumMarks += m.obtainedMarks;
            if (m.obtainedMarks > top) top := m.obtainedMarks;
            if (m.obtainedMarks >= passThreshold) passed += 1;
          };

          {
            examId;
            examTitle      = exam.title;
            className      = exam.className;
            section        = exam.section;
            averageMarks   = sumMarks / total.toFloat();
            topScore       = top;
            passPercentage = passed.toFloat() / total.toFloat() * 100.0;
          }
        });
  };

  // ── paginateResults ────────────────────────────────────────────────────────

  /// Generic pagination helper.
  /// Returns the requested page slice along with total count.
  public func paginateResults<T>(
    items    : [T],
    page     : Nat,
    pageSize : Nat
  ) : { items : [T]; total : Nat; page : Nat; pageSize : Nat } {
    let total = items.size();
    let safeSize = if (pageSize == 0) 10 else pageSize;
    let start = page * safeSize;
    if (start >= total) {
      return { items = []; total; page; pageSize = safeSize };
    };
    let end = if (start + safeSize > total) total else start + safeSize;
    let slice = items.sliceToArray(start, end);
    { items = slice; total; page; pageSize = safeSize }
  };

};
