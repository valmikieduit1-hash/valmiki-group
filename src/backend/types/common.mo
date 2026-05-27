import Time "mo:core/Time";

module {
  public type RecordId = Nat;
  public type Timestamp = Int;

  public func now() : Timestamp {
    Time.now();
  };

  public type SubmissionResult = {
    id : RecordId;
    timestamp : Timestamp;
  };
};
