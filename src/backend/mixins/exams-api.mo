import Types "../types/exams";
import ExamsLib "../lib/exams";

mixin (exams : ExamsLib.StableExams, marks : ExamsLib.StableMarks) {

  // ── Writes ─────────────────────────────────────────────────────────────────

  public shared func saveExam(exam : Types.ExamRecord) : async ExamsLib.Result<Types.ExamRecord, Text> {
    ExamsLib.saveExam(exams, exam);
    #ok(exam)
  };

  public shared func deleteExam(id : Text) : async ExamsLib.Result<Bool, Text> {
    switch (ExamsLib.loadExamById(exams, id)) {
      case null { #err("Exam not found: " # id) };
      case (?_) {
        ExamsLib.deleteExam(exams, marks, id);
        #ok(true)
      };
    }
  };

  public shared func saveMarks(entry : Types.StudentMarks) : async ExamsLib.Result<Types.StudentMarks, Text> {
    ExamsLib.saveMarks(exams, marks, entry)
  };

  public shared func saveAllMarks(entries : [Types.StudentMarks]) : async [ExamsLib.Result<Types.StudentMarks, Text>] {
    ExamsLib.saveAllMarks(exams, marks, entries)
  };

  // ── Queries ────────────────────────────────────────────────────────────────

  public query func loadExams(q : Types.ExamQuery) : async { exams : [Types.ExamRecord]; total : Nat } {
    ExamsLib.loadExams(exams, q)
  };

  public query func loadMarksByExam(examId : Text) : async [Types.StudentMarks] {
    ExamsLib.loadMarksByExam(marks, examId)
  };

  public query func loadStudentReportCard(studentId : Text, className : Text, academicYear : Text) : async Types.ReportCardData {
    ExamsLib.loadStudentReportCard(exams, marks, studentId, className, academicYear)
  };
};
