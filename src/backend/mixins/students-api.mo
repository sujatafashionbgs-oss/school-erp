import Types "../types/students";
import StudentsLib "../lib/students";

mixin (students : StudentsLib.StableStudents) {

  // ── writes ──────────────────────────────────────────────────────────────

  public shared func saveStudent(student : Types.StudentRecord) : async { #ok : Types.StudentRecord; #err : Text } {
    if (student.id == "") return #err("Student id cannot be empty");
    if (student.admissionNo == "") return #err("Admission number cannot be empty");
    if (student.name == "") return #err("Student name cannot be empty");
    StudentsLib.saveStudent(students, student);
    #ok(student);
  };

  public shared func deleteStudent(id : Text) : async { #ok : Bool; #err : Text } {
    if (id == "") return #err("Student id cannot be empty");
    switch (StudentsLib.loadStudentById(students, id)) {
      case null #err("Student not found");
      case (?_) {
        StudentsLib.deleteStudent(students, id);
        #ok(true);
      };
    };
  };

  // ── reads (query) ────────────────────────────────────────────────────────

  public query func loadAllStudents(page : Nat, pageSize : Nat) : async Types.StudentPage {
    let safePageSize = if (pageSize == 0) 20 else pageSize;
    StudentsLib.loadAllStudents(students, page, safePageSize);
  };

  public query func searchStudents(q : Types.StudentSearchQuery) : async Types.StudentPage {
    let safePageSize = if (q.pageSize == 0) 20 else q.pageSize;
    StudentsLib.searchStudents(students, { q with pageSize = safePageSize });
  };

  public query func loadStudentById(id : Text) : async ?Types.StudentRecord {
    StudentsLib.loadStudentById(students, id);
  };

  public query func loadStudentsByClass(className : Text, section : ?Text) : async [Types.StudentRecord] {
    StudentsLib.loadStudentsByClass(students, className, section);
  };

  public query func getStudentStats() : async { total : Nat; active : Nat; inactive : Nat } {
    StudentsLib.getStudentStats(students);
  };
};
