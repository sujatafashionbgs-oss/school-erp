module {
  public type UserId = Text;
  public type Timestamp = Int;

  public type UserRecord = {
    id : UserId;
    name : Text;
    role : Text;
    email : Text;
    phone : Text;
    permissions : [Text];
    createdAt : Timestamp;
    updatedAt : Timestamp;
    status : Text; // "active" | "inactive"
  };

  public type Stats = {
    totalUsers : Nat;
    totalWithPermissions : Nat;
  };

  public type Result<T, E> = { #ok : T; #err : E };

  public type AuditRecord = {
    id : Text;
    timestamp : Int;
    actorId : Text;
    action : Text;
    resourceType : Text;
    resourceId : Text;
    beforeValue : Text;
    afterValue : Text;
    status : Text;
  };

  public type UserSession = {
    userId : Text;
    role : Text;
    lastActivity : Int;
    isOnline : Bool;
  };
};
