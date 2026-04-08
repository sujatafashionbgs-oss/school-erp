import Map "mo:core/Map";
import Types "types/common";
import UsersLib "lib/users";
import AuditLib "lib/audit";
import SessionLib "lib/session";
import UsersApi "mixins/users-api";
import AuditApi "mixins/audit-api";
import SessionApi "mixins/session-api";

actor {
  let users : UsersLib.UserMap = Map.empty<Text, Types.UserRecord>();
  let perms : UsersLib.PermMap = Map.empty<Text, [Text]>();
  let auditLog : AuditLib.AuditMap = Map.empty<Text, Types.AuditRecord>();
  let sessions : SessionLib.SessionMap = Map.empty<Text, Types.UserSession>();

  include UsersApi(users, perms);
  include AuditApi(auditLog);
  include SessionApi(sessions);
};
