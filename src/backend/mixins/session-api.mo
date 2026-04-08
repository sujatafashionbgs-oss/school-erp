import SessionLib "../lib/session";
import Types "../types/common";

mixin (sessions : SessionLib.SessionMap) {

  /// Upsert the session for a user, recording their role and current timestamp.
  public func updateSession(userId : Text, role : Text) : async () {
    SessionLib.updateSession(sessions, userId, role);
  };

  /// Return all sessions active within the last thresholdSeconds seconds.
  public query func loadOnlineSessions(thresholdSeconds : Int) : async [Types.UserSession] {
    SessionLib.loadOnlineSessions(sessions, thresholdSeconds);
  };

  /// Remove the session entry for a user.
  public func clearSession(userId : Text) : async () {
    SessionLib.clearSession(sessions, userId);
  };
};
