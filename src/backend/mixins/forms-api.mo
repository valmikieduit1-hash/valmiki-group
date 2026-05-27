import List "mo:core/List";
import FormTypes "../types/forms";
import Common "../types/common";
import FormsLib "../lib/forms";

mixin (
  counselingBookings : List.List<FormTypes.CounselingBooking>,
  contactSubmissions : List.List<FormTypes.ContactSubmission>,
  newsletterSubscriptions : List.List<FormTypes.NewsletterSubscription>,
  demoClassBookings : List.List<FormTypes.DemoClassBooking>,
  immigrationConsultations : List.List<FormTypes.ImmigrationConsultation>,
  visaEligibilityResults : List.List<FormTypes.VisaEligibilityResult>,
  formState : { var nextId : Nat },
) {

  // --- Counseling Booking ---

  public func submitCounselingBooking(
    name : Text,
    email : Text,
    phone : Text,
    countryInterests : [Text],
    educationLevel : Text,
    preferredTime : Text,
  ) : async Common.SubmissionResult {
    FormsLib.addCounselingBooking(counselingBookings, formState, name, email, phone, countryInterests, educationLevel, preferredTime);
  };

  public query func getCounselingBookings() : async [FormTypes.CounselingBooking] {
    FormsLib.getCounselingBookings(counselingBookings);
  };

  // --- Contact Form ---

  public func submitContactForm(
    name : Text,
    email : Text,
    phone : Text,
    inquiryType : Text,
    message : Text,
  ) : async Common.SubmissionResult {
    FormsLib.addContactSubmission(contactSubmissions, formState, name, email, phone, inquiryType, message);
  };

  public query func getContactSubmissions() : async [FormTypes.ContactSubmission] {
    FormsLib.getContactSubmissions(contactSubmissions);
  };

  // --- Newsletter Subscription ---

  public func subscribeNewsletter(email : Text) : async Common.SubmissionResult {
    FormsLib.addNewsletterSubscription(newsletterSubscriptions, formState, email);
  };

  public query func getNewsletterSubscriptions() : async [FormTypes.NewsletterSubscription] {
    FormsLib.getNewsletterSubscriptions(newsletterSubscriptions);
  };

  // --- Demo Class Booking ---

  public func submitDemoClassBooking(
    testType : Text,
    preferredTime : Text,
    name : Text,
    email : Text,
    phone : Text,
  ) : async Common.SubmissionResult {
    FormsLib.addDemoClassBooking(demoClassBookings, formState, testType, preferredTime, name, email, phone);
  };

  public query func getDemoClassBookings() : async [FormTypes.DemoClassBooking] {
    FormsLib.getDemoClassBookings(demoClassBookings);
  };

  // --- Immigration Consultation ---

  public func submitImmigrationConsultation(
    visaType : Text,
    country : Text,
    name : Text,
    email : Text,
    phone : Text,
    preferredTime : Text,
  ) : async Common.SubmissionResult {
    FormsLib.addImmigrationConsultation(immigrationConsultations, formState, visaType, country, name, email, phone, preferredTime);
  };

  public query func getImmigrationConsultations() : async [FormTypes.ImmigrationConsultation] {
    FormsLib.getImmigrationConsultations(immigrationConsultations);
  };

  // --- Visa Eligibility ---

  public func submitVisaEligibility(
    visaType : Text,
    country : Text,
    age : Nat,
    education : Text,
    workExperienceYears : Nat,
    testScores : Text,
    resultPercentage : Nat,
  ) : async Common.SubmissionResult {
    FormsLib.addVisaEligibilityResult(visaEligibilityResults, formState, visaType, country, age, education, workExperienceYears, testScores, resultPercentage);
  };

  public query func getVisaEligibilityResults() : async [FormTypes.VisaEligibilityResult] {
    FormsLib.getVisaEligibilityResults(visaEligibilityResults);
  };
};
