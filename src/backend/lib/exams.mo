import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Types "../types/exams";

module {
  public type StableExams = Map.Map<Text, Types.ExamRecord>;
  public type StableMarks = Map.Map<Text, Types.StudentMarks>;
  public type Result<T, E> = { #ok : T; #err : E };

  // Composite key for marks: "{examId}_{studentId}"
  func marksKey(examId : Text, studentId : Text) : Text {
    examId # "_" # studentId
  };

  // ── Exam CRUD ──────────────────────────────────────────────────────────────

  public func saveExam(store : StableExams, exam : Types.ExamRecord) : () {
    store.add(exam.id, exam)
  };

  public func loadExams(store : StableExams, q : Types.ExamQuery) : { exams : [Types.ExamRecord]; total : Nat } {
    let all = store.values().toArray();
    let filtered = all.filter(func(e : Types.ExamRecord) : Bool {
      let matchClass = switch (q.className) {
        case (?c) { e.className == c };
        case null { true };
      };
      let matchSection = switch (q.section) {
        case (?s) { e.section == s };
        case null { true };
      };
      let matchSubject = switch (q.subject) {
        case (?sub) { e.subject == sub };
        case null { true };
      };
      let matchTerm = switch (q.term) {
        case (?t) { e.term == t };
        case null { true };
      };
      let matchYear = switch (q.academicYear) {
        case (?y) { e.academicYear == y };
        case null { true };
      };
      matchClass and matchSection and matchSubject and matchTerm and matchYear
    });
    let total = filtered.size();
    let start = q.page * q.pageSize;
    let pageArr : [Types.ExamRecord] = if (start >= total) {
      []
    } else {
      let end = Nat.min(start + q.pageSize, total);
      filtered.sliceToArray(start, end)
    };
    { exams = pageArr; total }
  };

  public func loadExamById(store : StableExams, id : Text) : ?Types.ExamRecord {
    store.get(id)
  };

  public func deleteExam(exams : StableExams, marks : StableMarks, id : Text) : () {
    exams.remove(id);
    let prefix = id # "_";
    let toRemove = marks.keys().toArray().filter(func(k : Text) : Bool {
      k.startsWith(#text prefix)
    });
    toRemove.forEach(func(k : Text) { marks.remove(k) })
  };

  // ── Marks management ──────────────────────────────────────────────────────

  public func saveMarks(exams : StableExams, marks : StableMarks, entry : Types.StudentMarks) : Result<Types.StudentMarks, Text> {
    switch (exams.get(entry.examId)) {
      case null { #err("Exam not found: " # entry.examId) };
      case (?exam) {
        if (entry.obtainedMarks < 0.0) {
          return #err("Obtained marks cannot be negative")
        };
        if (entry.obtainedMarks > exam.maxMarks.toFloat()) {
          return #err("Obtained marks exceed maximum (" # exam.maxMarks.toText() # ")")
        };
        let grade = calculateGrade(entry.obtainedMarks, exam.maxMarks);
        let saved : Types.StudentMarks = { entry with grade };
        marks.add(marksKey(entry.examId, entry.studentId), saved);
        #ok(saved)
      };
    }
  };

  public func saveAllMarks(exams : StableExams, marks : StableMarks, entries : [Types.StudentMarks]) : [Result<Types.StudentMarks, Text>] {
    entries.map<Types.StudentMarks, Result<Types.StudentMarks, Text>>(func(entry : Types.StudentMarks) : Result<Types.StudentMarks, Text> {
      saveMarks(exams, marks, entry)
    })
  };

  public func loadMarksByExam(store : StableMarks, examId : Text) : [Types.StudentMarks] {
    let examMarks = store.values().toArray().filter(func(m : Types.StudentMarks) : Bool {
      m.examId == examId
    });
    // Sort by rank ascending; rank=0 means unranked — put at end
    examMarks.sort(func(a : Types.StudentMarks, b : Types.StudentMarks) : { #less; #equal; #greater } {
      if (a.rank == 0 and b.rank == 0) { #equal }
      else if (a.rank == 0) { #greater }
      else if (b.rank == 0) { #less }
      else { Nat.compare(a.rank, b.rank) }
    })
  };

  public func loadStudentReportCard(
    exams : StableExams,
    marks : StableMarks,
    studentId : Text,
    className : Text,
    academicYear : Text
  ) : Types.ReportCardData {
    let classExams = exams.values().toArray().filter(func(e : Types.ExamRecord) : Bool {
      e.className == className and e.academicYear == academicYear
    });

    var totalObtained : Float = 0.0;
    var totalMax : Nat = 0;
    var studentName : Text = "";
    let section : Text = "";

    let examResults : [Types.ExamResult] = classExams.map<Types.ExamRecord, Types.ExamResult>(func(exam : Types.ExamRecord) : Types.ExamResult {
      let key = marksKey(exam.id, studentId);
      switch (marks.get(key)) {
        case (?m) {
          studentName := m.studentName;
          totalObtained += m.obtainedMarks;
          totalMax += exam.maxMarks;
          { examTitle = exam.title; subject = exam.subject; maxMarks = exam.maxMarks; obtainedMarks = m.obtainedMarks; grade = m.grade }
        };
        case null {
          totalMax += exam.maxMarks;
          { examTitle = exam.title; subject = exam.subject; maxMarks = exam.maxMarks; obtainedMarks = 0.0; grade = "F" }
        };
      }
    });

    // Compute overall grade across all exams
    let overallGrade = calculateGrade(totalObtained, totalMax);

    // Compute rank: count students in this class/year who scored more in total
    let studentTotals = Map.empty<Text, Float>();
    classExams.forEach(func(exam : Types.ExamRecord) {
      marks.forEach(func(_k : Text, m : Types.StudentMarks) {
        if (m.examId == exam.id) {
          switch (studentTotals.get(m.studentId)) {
            case (?prev) { studentTotals.add(m.studentId, prev + m.obtainedMarks) };
            case null    { studentTotals.add(m.studentId, m.obtainedMarks) };
          }
        }
      })
    });
    let myTotal = switch (studentTotals.get(studentId)) { case (?t) t; case null 0.0 };
    let rank = studentTotals.foldLeft(1, func(acc : Nat, _sid : Text, tot : Float) : Nat {
      if (tot > myTotal) { acc + 1 } else { acc }
    });

    // Attendance is owned by the attendance module; return a zero stub
    let attendance : Types.AttendanceSummary = {
      studentId;
      totalDays = 0;
      present = 0;
      absent = 0;
      late = 0;
      halfDay = 0;
      percentage = 0.0;
    };

    {
      studentId;
      studentName;
      className;
      section;
      rollNo = 0;
      exams = examResults;
      attendance;
      overallGrade;
      rank;
      remarks = "";
      academicYear;
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  public func calculateGrade(obtained : Float, maxMarks : Nat) : Text {
    if (maxMarks == 0) { return "F" };
    let pct = (obtained / maxMarks.toFloat()) * 100.0;
    if      (pct >= 90.0) { "A+" }
    else if (pct >= 80.0) { "A"  }
    else if (pct >= 70.0) { "B+" }
    else if (pct >= 60.0) { "B"  }
    else if (pct >= 50.0) { "C"  }
    else if (pct >= 40.0) { "D"  }
    else                  { "F"  }
  };

  public func rankStudents(marks : StableMarks, examId : Text) : [Types.StudentMarks] {
    let examMarks = marks.values().toArray().filter(func(m : Types.StudentMarks) : Bool {
      m.examId == examId
    });
    // Sort descending by obtainedMarks (higher score = lower rank number)
    let sorted = examMarks.sort(func(a : Types.StudentMarks, b : Types.StudentMarks) : { #less; #equal; #greater } {
      if      (a.obtainedMarks > b.obtainedMarks) { #less    }
      else if (a.obtainedMarks < b.obtainedMarks) { #greater }
      else                                         { #equal   }
    });
    // Assign ranks with tie handling (tied students share the same rank)
    let ranked = List.empty<Types.StudentMarks>();
    var currentRank : Nat = 1;
    var prevScore : ?Float = null;
    var tieCount : Nat = 0;
    sorted.forEach(func(m : Types.StudentMarks) {
      switch (prevScore) {
        case (?prev) {
          if (m.obtainedMarks == prev) {
            tieCount := tieCount + 1
          } else {
            currentRank := currentRank + tieCount + 1;
            tieCount := 0
          }
        };
        case null {};
      };
      prevScore := ?m.obtainedMarks;
      ranked.add({ m with rank = currentRank })
    });
    ranked.toArray()
  };
}
