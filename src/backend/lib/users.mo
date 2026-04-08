import Map "mo:core/Map";
import Types "../types/common";

module {
  public type UserMap = Map.Map<Text, Types.UserRecord>;
  public type PermMap = Map.Map<Text, [Text]>;

  /// Insert or update a user by user.id
  public func saveUser(
    users : UserMap,
    user : Types.UserRecord,
  ) : Types.Result<Types.UserRecord, Text> {
    users.add(user.id, user);
    #ok(user);
  };

  /// Return all stored users as an array
  public func loadAllUsers(users : UserMap) : [Types.UserRecord] {
    users.values().toArray();
  };

  /// Return a single user by id
  public func loadUserById(
    users : UserMap,
    id : Text,
  ) : Types.Result<Types.UserRecord, Text> {
    switch (users.get(id)) {
      case (?user) { #ok(user) };
      case null { #err("User not found: " # id) };
    };
  };

  /// Remove a user by id
  public func deleteUser(
    users : UserMap,
    id : Text,
  ) : Types.Result<Bool, Text> {
    switch (users.get(id)) {
      case null { #err("User not found: " # id) };
      case (?_) {
        users.remove(id);
        #ok(true);
      };
    };
  };

  /// Replace the permissions list for a user
  public func savePermissions(
    perms : PermMap,
    userId : Text,
    permissions : [Text],
  ) : Types.Result<Bool, Text> {
    perms.add(userId, permissions);
    #ok(true);
  };

  /// Return the permissions list for a user (empty if not found)
  public func loadPermissions(perms : PermMap, userId : Text) : [Text] {
    switch (perms.get(userId)) {
      case (?p) { p };
      case null { [] };
    };
  };

  /// Remove the permissions entry for a user
  public func deletePermissions(
    perms : PermMap,
    userId : Text,
  ) : Types.Result<Bool, Text> {
    switch (perms.get(userId)) {
      case null { #err("Permissions not found for user: " # userId) };
      case (?_) {
        perms.remove(userId);
        #ok(true);
      };
    };
  };

  /// Return aggregate stats about stored users and permissions
  public func getStats(
    users : UserMap,
    perms : PermMap,
  ) : Types.Stats {
    {
      totalUsers = users.size();
      totalWithPermissions = perms.size();
    };
  };
};
