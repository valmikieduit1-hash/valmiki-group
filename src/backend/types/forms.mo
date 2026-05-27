import Types "common";

module {
  // Counseling booking
  public type CounselingBooking = {
    id : Types.RecordId;
    name : Text;
    email : Text;
    phone : Text;
    countryInterests : [Text];
    educationLevel : Text;
    preferredTime : Text;
    timestamp : Types.Timestamp;
  };

  // Contact form
  public type ContactSubmission = {
    id : Types.RecordId;
    name : Text;
    email : Text;
    phone : Text;
    inquiryType : Text;
    message : Text;
    timestamp : Types.Timestamp;
  };

  // Newsletter
  public type NewsletterSubscription = {
    id : Types.RecordId;
    email : Text;
    timestamp : Types.Timestamp;
  };

  // Demo class booking
  public type DemoClassBooking = {
    id : Types.RecordId;
    testType : Text;
    preferredTime : Text;
    name : Text;
    email : Text;
    phone : Text;
    timestamp : Types.Timestamp;
  };

  // Immigration consultation
  public type ImmigrationConsultation = {
    id : Types.RecordId;
    visaType : Text;
    country : Text;
    name : Text;
    email : Text;
    phone : Text;
    preferredTime : Text;
    timestamp : Types.Timestamp;
  };

  // Visa eligibility checker result
  public type VisaEligibilityResult = {
    id : Types.RecordId;
    visaType : Text;
    country : Text;
    age : Nat;
    education : Text;
    workExperienceYears : Nat;
    testScores : Text;
    resultPercentage : Nat;
    timestamp : Types.Timestamp;
  };
  // Be Our Partner inquiry
  public type BeOurPartnerInquiry = {
    id : Nat;
    companyName : Text;
    contactName : Text;
    email : Text;
    phone : Text;
    partnershipType : Text;
    message : Text;
    submittedAt : Int;
  };

  public type BeOurPartnerInquiryInput = {
    companyName : Text;
    contactName : Text;
    email : Text;
    phone : Text;
    partnershipType : Text;
    message : Text;
  };
};
