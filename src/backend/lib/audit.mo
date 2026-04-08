import Map "mo:core/Map";
import Array "mo:core/Array";
import Types "../types/common";

module {
  public let MAX_AUDIT_ENTRIES : Nat = 1000;

  public type AuditMap = Map.Map<Text, Types.AuditRecord>;

  /// Insert an audit record. Trims oldest entries (by timestamp) when over MAX_AUDIT_ENTRIES.
  public func saveAuditRecord(
    auditLog : AuditMap,
    record : Types.AuditRecord,
  ) : Types.Result<Text, Text> {
    auditLog.add(record.id, record);
    if (auditLog.size() > MAX_AUDIT_ENTRIES) {
      let pairs = auditLog.entries().toArray();
      let sorted = pairs.sort(func(a : (Text, Types.AuditRecord), b : (Text, Types.AuditRecord)) : { #less; #equal; #greater } {
        let (_, ra) = a;
        let (_, rb) = b;
        if (ra.timestamp < rb.timestamp) { #less }
        else if (ra.timestamp > rb.timestamp) { #greater }
        else { #equal }
      });
      let overflow : Int = auditLog.size() - MAX_AUDIT_ENTRIES;
      let toRemove = sorted.sliceToArray(0, overflow);
      for ((k, _) in toRemove.values()) {
        auditLog.remove(k);
      };
    };
    #ok(record.id);
  };

  /// Return all audit records as an array, sorted oldest-first by timestamp.
  public func loadAuditRecords(auditLog : AuditMap) : [Types.AuditRecord] {
    auditLog.values().toArray().sort(func(a : Types.AuditRecord, b : Types.AuditRecord) : { #less; #equal; #greater } {
      if (a.timestamp < b.timestamp) { #less }
      else if (a.timestamp > b.timestamp) { #greater }
      else { #equal }
    });
  };

  /// Remove all audit records.
  public func clearAuditRecords(auditLog : AuditMap) : Types.Result<Text, Text> {
    auditLog.clear();
    #ok("Audit log cleared");
  };
};
