import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Types "../types/fees";

module {
  public type StableFeeStructures = Map.Map<Text, Types.FeeCategory>;
  public type StableFeePayments = Map.Map<Text, Types.FeePayment>;

  // Fee Structure management

  public func saveFeeCategory(store : StableFeeStructures, category : Types.FeeCategory) : () {
    store.add(category.id, category);
  };

  public func loadFeeCategories(store : StableFeeStructures, className : ?Text, academicYear : ?Text) : [Types.FeeCategory] {
    let all = store.values();
    let filtered = all.filter(func(cat : Types.FeeCategory) : Bool {
      let matchClass = switch (className) {
        case null true;
        case (?cls) cat.className == cls or cat.className == "";
      };
      let matchYear = switch (academicYear) {
        case null true;
        case (?yr) cat.academicYear == yr;
      };
      matchClass and matchYear;
    });
    filtered.toArray();
  };

  public func deleteFeeCategory(store : StableFeeStructures, id : Text) : () {
    store.remove(id);
  };

  // Fee Payment management

  public func savePayment(store : StableFeePayments, payment : Types.FeePayment) : () {
    store.add(payment.id, payment);
  };

  public func isDuplicateReceipt(store : StableFeePayments, receiptNo : Text) : Bool {
    let found = store.values().find(func(p : Types.FeePayment) : Bool {
      p.receiptNo == receiptNo;
    });
    switch (found) {
      case (?_) true;
      case null false;
    };
  };

  public func loadPaymentsByStudent(store : StableFeePayments, studentId : Text) : [Types.FeePayment] {
    let matched = store.values().filter(func(p : Types.FeePayment) : Bool {
      p.studentId == studentId;
    });
    let arr = matched.toArray();
    // sort descending by paymentDate (lexicographic on ISO dates)
    arr.sort(func(a : Types.FeePayment, b : Types.FeePayment) : { #less; #equal; #greater } {
      Text.compare(b.paymentDate, a.paymentDate);
    });
  };

  public func loadPaymentsByDateRange(
    store : StableFeePayments,
    dateFrom : Text,
    dateTo : Text,
    className : ?Text,
    section : ?Text,
    page : Nat,
    pageSize : Nat,
  ) : { payments : [Types.FeePayment]; total : Nat } {
    let filtered = store.values().filter(func(p : Types.FeePayment) : Bool {
      let inRange = p.paymentDate >= dateFrom and p.paymentDate <= dateTo;
      let matchClass = switch (className) {
        case null true;
        case (?cls) p.className == cls;
      };
      let matchSection = switch (section) {
        case null true;
        case (?sec) p.section == sec;
      };
      inRange and matchClass and matchSection;
    });
    let all = filtered.toArray();
    let sorted = all.sort(func(a : Types.FeePayment, b : Types.FeePayment) : { #less; #equal; #greater } {
      Text.compare(b.paymentDate, a.paymentDate);
    });
    let total = sorted.size();
    let start = page * pageSize;
    if (start >= total) {
      return { payments = []; total };
    };
    let end_ = if (start + pageSize > total) total else start + pageSize;
    let page_ = sorted.sliceToArray(start, end_);
    { payments = page_; total };
  };

  public func getFeeSummary(store : StableFeePayments, academicYear : ?Text) : Types.FeeSummary {
    let studentsPaid = Map.empty<Text, Bool>();
    var totalCollected : Float = 0.0;
    var totalOutstanding : Float = 0.0;

    store.values().forEach(func(p : Types.FeePayment) : () {
      let matchYear = switch (academicYear) {
        case null true;
        case (?yr) p.academicYear == yr;
      };
      if (matchYear) {
        totalCollected += p.paidAmount;
        totalOutstanding += p.balance;
        if (p.status == "paid") {
          studentsPaid.add(p.studentId, true);
        };
      };
    });

    let paidCount = studentsPaid.size();
    // total unique students across all payments in scope
    let allStudents = Map.empty<Text, Bool>();
    store.values().forEach(func(p : Types.FeePayment) : () {
      let matchYear = switch (academicYear) {
        case null true;
        case (?yr) p.academicYear == yr;
      };
      if (matchYear) {
        allStudents.add(p.studentId, true);
      };
    });

    {
      totalCollected;
      totalOutstanding;
      totalStudents = allStudents.size();
      paidStudents = paidCount;
    };
  };

  public func getStudentFeeStatus(
    _feeStructures : StableFeeStructures,
    payments : StableFeePayments,
    studentId : Text,
    academicYear : Text,
  ) : { paid : Float; due : Float; balance : Float } {
    // Sum up paidAmount from all payments for this student/year
    var paid : Float = 0.0;
    payments.values().forEach(func(p : Types.FeePayment) : () {
      if (p.studentId == studentId and p.academicYear == academicYear) {
        paid += p.paidAmount;
      };
    });

    // The latest payment record holds the balance — use it directly if present
    let studentPayments = loadPaymentsByStudent(payments, studentId);
    let yearPayments = studentPayments.filter(func(p : Types.FeePayment) : Bool {
      p.academicYear == academicYear;
    });
    // balance = outstanding from last payment, else compute from fee structure
    let balance : Float = switch (yearPayments.find(func(_) { true })) {
      case (?latest) latest.balance;
      case null {
        // sum all applicable fee categories for this student's class
        let due : Float = 0.0;
        // we need className — look it up from any payment or return 0
        due;
      };
    };

    // due = paid + balance (total fee obligation)
    let due : Float = paid + balance;
    { paid; due; balance };
  };
};
