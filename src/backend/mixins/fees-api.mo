import Text "mo:core/Text";
import FeesLib "../lib/fees";
import Types "../types/fees";

mixin (
  feeStructures : FeesLib.StableFeeStructures,
  feePayments : FeesLib.StableFeePayments,
) {

  // --- Receipt format validation helper (RCP-XXXXXX = RCP- + exactly 6 digits) ---
  func isValidReceiptNo(receiptNo : Text) : Bool {
    if (not receiptNo.startsWith(#text "RCP-")) return false;
    let suffix = switch (receiptNo.stripStart(#text "RCP-")) {
      case (?s) s;
      case null return false;
    };
    if (suffix.size() != 6) return false;
    suffix.toArray().all(func(c : Char) : Bool {
      c >= '0' and c <= '9';
    });
  };

  // --- Fee Category ---

  public shared func saveFeeCategory(category : Types.FeeCategory) : async { #ok : Types.FeeCategory; #err : Text } {
    FeesLib.saveFeeCategory(feeStructures, category);
    #ok(category);
  };

  public query func loadFeeCategories(className : ?Text, academicYear : ?Text) : async [Types.FeeCategory] {
    FeesLib.loadFeeCategories(feeStructures, className, academicYear);
  };

  public shared func deleteFeeCategory(id : Text) : async { #ok : Bool; #err : Text } {
    switch (feeStructures.get(id)) {
      case null #err("Fee category not found: " # id);
      case (?_) {
        FeesLib.deleteFeeCategory(feeStructures, id);
        #ok(true);
      };
    };
  };

  // --- Fee Payments ---

  public shared func savePayment(payment : Types.FeePayment) : async { #ok : Types.FeePayment; #err : Text } {
    // Validate receipt format
    if (not isValidReceiptNo(payment.receiptNo)) {
      return #err("Invalid receipt number format. Expected RCP-XXXXXX (6 digits), got: " # payment.receiptNo);
    };
    // Duplicate receipt check — only reject if a *different* payment uses this receipt
    let existingPayment = feePayments.get(payment.id);
    let isEdit = switch (existingPayment) {
      case (?existing) existing.receiptNo == payment.receiptNo;
      case null false;
    };
    if (not isEdit and FeesLib.isDuplicateReceipt(feePayments, payment.receiptNo)) {
      return #err("Duplicate receipt number: " # payment.receiptNo # " is already used.");
    };
    FeesLib.savePayment(feePayments, payment);
    #ok(payment);
  };

  public query func loadPaymentsByStudent(studentId : Text) : async [Types.FeePayment] {
    FeesLib.loadPaymentsByStudent(feePayments, studentId);
  };

  public query func loadPaymentsByDateRange(
    dateFrom : Text,
    dateTo : Text,
    className : ?Text,
    section : ?Text,
    page : Nat,
    pageSize : Nat,
  ) : async { payments : [Types.FeePayment]; total : Nat } {
    FeesLib.loadPaymentsByDateRange(feePayments, dateFrom, dateTo, className, section, page, pageSize);
  };

  public query func getFeeSummary(academicYear : ?Text) : async Types.FeeSummary {
    FeesLib.getFeeSummary(feePayments, academicYear);
  };

  public query func getStudentFeeStatus(studentId : Text, academicYear : Text) : async { paid : Float; due : Float; balance : Float } {
    FeesLib.getStudentFeeStatus(feeStructures, feePayments, studentId, academicYear);
  };
};
