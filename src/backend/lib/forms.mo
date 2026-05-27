import List "mo:core/List";
import Types "../types/forms";
import Common "../types/common";

module {
  // Counseling bookings
  public func addCounselingBooking(
    store : List.List<Types.CounselingBooking>,
    state : { var nextId : Nat },
    name : Text,
    email : Text,
    phone : Text,
    countryInterests : [Text],
    educationLevel : Text,
    preferredTime : Text,
  ) : Common.SubmissionResult {
    let id = state.nextId;
    state.nextId += 1;
    let ts = Common.now();
    store.add({ id; name; email; phone; countryInterests; educationLevel; preferredTime; timestamp = ts });
    { id; timestamp = ts };
  };

  public func getCounselingBookings(
    store : List.List<Types.CounselingBooking>
  ) : [Types.CounselingBooking] {
    store.toArray();
  };

  // Contact form
  public func addContactSubmission(
    store : List.List<Types.ContactSubmission>,
    state : { var nextId : Nat },
    name : Text,
    email : Text,
    phone : Text,
    inquiryType : Text,
    message : Text,
  ) : Common.SubmissionResult {
    let id = state.nextId;
    state.nextId += 1;
    let ts = Common.now();
    store.add({ id; name; email; phone; inquiryType; message; timestamp = ts });
    { id; timestamp = ts };
  };

  public func getContactSubmissions(
    store : List.List<Types.ContactSubmission>
  ) : [Types.ContactSubmission] {
    store.toArray();
  };

  // Newsletter
  public func addNewsletterSubscription(
    store : List.List<Types.NewsletterSubscription>,
    state : { var nextId : Nat },
    email : Text,
  ) : Common.SubmissionResult {
    let id = state.nextId;
    state.nextId += 1;
    let ts = Common.now();
    store.add({ id; email; timestamp = ts });
    { id; timestamp = ts };
  };

  public func getNewsletterSubscriptions(
    store : List.List<Types.NewsletterSubscription>
  ) : [Types.NewsletterSubscription] {
    store.toArray();
  };

  // Demo class booking
  public func addDemoClassBooking(
    store : List.List<Types.DemoClassBooking>,
    state : { var nextId : Nat },
    testType : Text,
    preferredTime : Text,
    name : Text,
    email : Text,
    phone : Text,
  ) : Common.SubmissionResult {
    let id = state.nextId;
    state.nextId += 1;
    let ts = Common.now();
    store.add({ id; testType; preferredTime; name; email; phone; timestamp = ts });
    { id; timestamp = ts };
  };

  public func getDemoClassBookings(
    store : List.List<Types.DemoClassBooking>
  ) : [Types.DemoClassBooking] {
    store.toArray();
  };

  // Immigration consultation
  public func addImmigrationConsultation(
    store : List.List<Types.ImmigrationConsultation>,
    state : { var nextId : Nat },
    visaType : Text,
    country : Text,
    name : Text,
    email : Text,
    phone : Text,
    preferredTime : Text,
  ) : Common.SubmissionResult {
    let id = state.nextId;
    state.nextId += 1;
    let ts = Common.now();
    store.add({ id; visaType; country; name; email; phone; preferredTime; timestamp = ts });
    { id; timestamp = ts };
  };

  public func getImmigrationConsultations(
    store : List.List<Types.ImmigrationConsultation>
  ) : [Types.ImmigrationConsultation] {
    store.toArray();
  };

  // Visa eligibility
  public func addVisaEligibilityResult(
    store : List.List<Types.VisaEligibilityResult>,
    state : { var nextId : Nat },
    visaType : Text,
    country : Text,
    age : Nat,
    education : Text,
    workExperienceYears : Nat,
    testScores : Text,
    resultPercentage : Nat,
  ) : Common.SubmissionResult {
    let id = state.nextId;
    state.nextId += 1;
    let ts = Common.now();
    store.add({ id; visaType; country; age; education; workExperienceYears; testScores; resultPercentage; timestamp = ts });
    { id; timestamp = ts };
  };

  public func getVisaEligibilityResults(
    store : List.List<Types.VisaEligibilityResult>
  ) : [Types.VisaEligibilityResult] {
    store.toArray();
  };
};
