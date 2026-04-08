import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/common";

module {
  public type SessionMap = Map.Map<Text, Types.UserSession>;

  /// Upsert a session for a user, marking them as online with current timestamp.
  public func updateSession(
    sessions : SessionMap,
    userId : Text,
    role : Text,
  ) {
    let now = Time.now();
    sessions.add(userId, { userId; role; lastActivity = now; isOnline = true });
  };

  /// Return all sessions whose lastActivity is within thresholdSeconds of now.
  public func loadOnlineSessions(
    sessions : SessionMap,
    thresholdSeconds : Int,
  ) : [Types.UserSession] {
    let now = Time.now();
    let thresholdNs : Int = thresholdSeconds * 1_000_000_000;
    sessions.values().filter(func(s) {
      now - s.lastActivity <= thresholdNs
    }).toArray();
  };

  /// Remove a session entry for a user.
  public func clearSession(sessions : SessionMap, userId : Text) {
    sessions.remove(userId);
  };
};
