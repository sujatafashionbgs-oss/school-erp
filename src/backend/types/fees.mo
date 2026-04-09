import StudentTypes "students";

module {
  public type StudentId = StudentTypes.StudentId;

  public type FeeId = Text;
  public type FeeStructureId = Text;

  public type FeeCategory = {
    id : FeeStructureId;
    name : Text;
    amount : Float;
    className : Text;
    section : Text; // "" means all sections
    academicYear : Text; // "2026-27"
    dueDate : Text; // "YYYY-MM-DD"
    isOptional : Bool;
  };

  public type FeeCategoryPayment = {
    categoryId : FeeStructureId;
    categoryName : Text;
    amount : Float;
    paid : Float;
  };

  public type FeePayment = {
    id : FeeId;
    studentId : StudentId;
    admissionNo : Text;
    studentName : Text;
    className : Text;
    section : Text;
    receiptNo : Text; // format: RCP-XXXXXX
    paymentDate : Text; // "YYYY-MM-DD"
    categories : [FeeCategoryPayment];
    totalAmount : Float;
    paidAmount : Float;
    balance : Float;
    paymentMode : Text; // "cash" | "online" | "cheque" | "dd"
    txnId : Text;
    status : Text; // "paid" | "partial" | "pending"
    academicYear : Text; // "2026-27"
  };

  public type FeeQuery = {
    studentId : ?Text;
    className : ?Text;
    section : ?Text;
    status : ?Text;
    dateFrom : ?Text;
    dateTo : ?Text;
    academicYear : ?Text;
    page : Nat;
    pageSize : Nat;
  };

  public type FeeSummary = {
    totalCollected : Float;
    totalOutstanding : Float;
    totalStudents : Nat;
    paidStudents : Nat;
  };
};
