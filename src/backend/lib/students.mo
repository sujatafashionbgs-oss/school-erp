import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Types "../types/students";

module {
  public type StableStudents = Map.Map<Text, Types.StudentRecord>;

  // Class sort order for Indian school context
  func classOrder(cls : Text) : Nat {
    switch cls {
      case "Pre-Nursery" 0;
      case "Nursery"     1;
      case "KG"          2;
      case "I"           3;
      case "II"          4;
      case "III"         5;
      case "IV"          6;
      case "V"           7;
      case "VI"          8;
      case "VII"         9;
      case "VIII"        10;
      case "IX"          11;
      case "X"           12;
      case "XI"          13;
      case "XII"         14;
      case _             99;
    };
  };

  func compareStudents(a : Types.StudentRecord, b : Types.StudentRecord) : { #less; #equal; #greater } {
    let ca = classOrder(a.className);
    let cb = classOrder(b.className);
    if (ca < cb) return #less;
    if (ca > cb) return #greater;
    let sc = Text.compare(a.section, b.section);
    if (sc != #equal) return sc;
    Nat.compare(a.rollNo, b.rollNo);
  };

  // Upsert by id
  public func saveStudent(store : StableStudents, student : Types.StudentRecord) : () {
    store.add(student.id, student);
  };

  // All students, sorted, paginated
  public func loadAllStudents(store : StableStudents, page : Nat, pageSize : Nat) : Types.StudentPage {
    let all = store.values()
      |> _.toArray()
      |> _.sort(compareStudents);
    let total = all.size();
    let start = page * pageSize;
    if (start >= total) {
      return { students = []; total; page; pageSize };
    };
    let end_ = Nat.min(start + pageSize, total);
    let slice = all.sliceToArray(start, end_);
    { students = slice; total; page; pageSize };
  };

  // Case-insensitive substring match helper
  func textContains(haystack : Text, needle : Text) : Bool {
    haystack.toLower().contains(#text (needle.toLower()));
  };

  // Filtered + paginated search
  public func searchStudents(store : StableStudents, q : Types.StudentSearchQuery) : Types.StudentPage {
    let filtered = store.values()
      |> _.toArray()
      |> _.filter(func(s : Types.StudentRecord) : Bool {
        let nameOk = switch (q.nameQuery) {
          case null true;
          case (?n)  textContains(s.name, n);
        };
        let admOk = switch (q.admissionNo) {
          case null   true;
          case (?a)   Text.equal(s.admissionNo, a);
        };
        let clsOk = switch (q.className) {
          case null  true;
          case (?c)  Text.equal(s.className, c);
        };
        let secOk = switch (q.section) {
          case null  true;
          case (?sc) Text.equal(s.section, sc);
        };
        nameOk and admOk and clsOk and secOk;
      })
      |> _.sort(compareStudents);

    let total = filtered.size();
    let start = q.page * q.pageSize;
    if (start >= total) {
      return { students = []; total; page = q.page; pageSize = q.pageSize };
    };
    let end_ = Nat.min(start + q.pageSize, total);
    let slice = filtered.sliceToArray(start, end_);
    { students = slice; total; page = q.page; pageSize = q.pageSize };
  };

  // Exact id lookup
  public func loadStudentById(store : StableStudents, id : Text) : ?Types.StudentRecord {
    store.get(id);
  };

  // Admission number lookup (linear scan — unique index semantics)
  public func loadStudentByAdmissionNo(store : StableStudents, admissionNo : Text) : ?Types.StudentRecord {
    store.values().find(func(s : Types.StudentRecord) : Bool {
      Text.equal(s.admissionNo, admissionNo);
    });
  };

  // Filter by class and optional section, sorted
  public func loadStudentsByClass(store : StableStudents, className : Text, section : ?Text) : [Types.StudentRecord] {
    store.values()
      |> _.toArray()
      |> _.filter(func(s : Types.StudentRecord) : Bool {
        if (not Text.equal(s.className, className)) return false;
        switch section {
          case null   true;
          case (?sec) Text.equal(s.section, sec);
        };
      })
      |> _.sort(compareStudents);
  };

  // Remove by id
  public func deleteStudent(store : StableStudents, id : Text) : () {
    store.remove(id);
  };

  // Aggregate stats
  public func getStudentStats(store : StableStudents) : { total : Nat; active : Nat; inactive : Nat } {
    var total = 0;
    var active = 0;
    var inactive = 0;
    store.values().forEach(func(s : Types.StudentRecord) : () {
      total += 1;
      if (Text.equal(s.status, "active")) {
        active += 1;
      } else {
        inactive += 1;
      };
    });
    { total; active; inactive };
  };
};
