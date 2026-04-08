import UsersLib "../lib/users";
import Types "../types/common";

mixin (
  users : UsersLib.UserMap,
  perms : UsersLib.PermMap,
) {

  /// Insert or update a user record. Returns the saved record on success.
  public func saveUser(user : Types.UserRecord) : async Types.Result<Types.UserRecord, Text> {
    UsersLib.saveUser(users, user);
  };

  /// Return all stored users.
  public query func loadAllUsers() : async [Types.UserRecord] {
    UsersLib.loadAllUsers(users);
  };

  /// Return a single user by id.
  public query func loadUserById(id : Text) : async Types.Result<Types.UserRecord, Text> {
    UsersLib.loadUserById(users, id);
  };

  /// Delete a user by id.
  public func deleteUser(id : Text) : async Types.Result<Bool, Text> {
    UsersLib.deleteUser(users, id);
  };

  /// Overwrite the permissions list for a user.
  public func savePermissions(userId : Text, permissions : [Text]) : async Types.Result<Bool, Text> {
    UsersLib.savePermissions(perms, userId, permissions);
  };

  /// Return the permissions list for a user (empty array if user has none).
  public query func loadPermissions(userId : Text) : async [Text] {
    UsersLib.loadPermissions(perms, userId);
  };

  /// Remove permissions for a user.
  public func deletePermissions(userId : Text) : async Types.Result<Bool, Text> {
    UsersLib.deletePermissions(perms, userId);
  };

  /// Return aggregate stats: total users and total users with at least one permission.
  public query func getStats() : async Types.Stats {
    UsersLib.getStats(users, perms);
  };
};
