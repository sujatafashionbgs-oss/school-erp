module {
  public type StudentId = Text;

  public type StudentRecord = {
    id : StudentId;
    admissionNo : Text;
    name : Text;
    className : Text;
    section : Text;
    rollNo : Nat;
    dob : Text;
    gender : Text;
    phone : Text;
    parentName : Text;
    parentMobile : Text;
    address : Text;
    feeStatus : Text; // "paid" | "partial" | "pending"
    admissionDate : Text;
    status : Text; // "active" | "inactive" | "transferred"
    bloodGroup : Text;
    religion : Text;
    category : Text; // "General" | "OBC" | "SC" | "ST" | "EWS"
  };

  public type StudentSearchQuery = {
    nameQuery : ?Text;
    admissionNo : ?Text;
    className : ?Text;
    section : ?Text;
    page : Nat;
    pageSize : Nat;
  };

  public type StudentPage = {
    students : [StudentRecord];
    total : Nat;
    page : Nat;
    pageSize : Nat;
  };
};
