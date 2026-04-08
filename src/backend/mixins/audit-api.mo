import AuditLib "../lib/audit";
import Types "../types/common";

mixin (auditLog : AuditLib.AuditMap) {

  /// Insert an audit record into the log. Trims oldest beyond 1000 entries.
  public func saveAuditRecord(record : Types.AuditRecord) : async Types.Result<Text, Text> {
    AuditLib.saveAuditRecord(auditLog, record);
  };

  /// Return all audit records, sorted oldest-first by timestamp.
  public query func loadAuditRecords() : async [Types.AuditRecord] {
    AuditLib.loadAuditRecords(auditLog);
  };

  /// Remove all audit records.
  public func clearAuditRecords() : async Types.Result<Text, Text> {
    AuditLib.clearAuditRecords(auditLog);
  };
};
