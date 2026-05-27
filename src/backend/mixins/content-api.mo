import List "mo:core/List";
import Map "mo:core/Map";
import AdminTypes "../types/admin";
import Common "../types/common";
import ContentLib "../lib/content";
import FormTypes "../types/forms";

mixin (
  contentSessions : Map.Map<AdminTypes.SessionToken, Int>,
  blogPosts : List.List<AdminTypes.BlogPost>,
  testPrepExams : Map.Map<Text, AdminTypes.TestPrepExam>,
  immigrationVisas : Map.Map<Text, AdminTypes.ImmigrationVisa>,
  partnerUniversities : List.List<AdminTypes.PartnerUniversity>,
  countryDetails : Map.Map<Text, AdminTypes.CountryDetailContent>,
  galleryEntries : List.List<AdminTypes.GalleryEntry>,
  jobOpenings : List.List<AdminTypes.JobOpening>,
  jobApplications : List.List<AdminTypes.JobApplication>,
  leadershipState : { var members : [AdminTypes.LeadershipMember] },
  contentState : {
    var nextContentId : Nat;
    var aboutPageContent : AdminTypes.AboutPageContent;
    var studyAbroadContent : AdminTypes.StudyAbroadContent;
  },
  serviceDetails : Map.Map<Text, AdminTypes.ServiceDetailContent>,
  beOurPartnerState : { var content : ?AdminTypes.BeOurPartnerContent },
  partnerInquiries : List.List<FormTypes.BeOurPartnerInquiry>,
  pageContents : Map.Map<Text, AdminTypes.PageContent>,
) {

  // -------------------------------------------------------
  // Blog Posts
  // -------------------------------------------------------

  public query func getBlogPosts() : async [AdminTypes.BlogPost] {
    ignore contentSessions;
    ContentLib.getAllBlogPosts(blogPosts);
  };

  public query func getPublishedBlogPosts() : async [AdminTypes.BlogPost] {
    ignore contentSessions;
    ContentLib.getPublishedBlogPosts(blogPosts);
  };

  public query func getBlogPostById(id : Common.RecordId) : async ?AdminTypes.BlogPost {
    ignore contentSessions;
    ContentLib.getBlogPostById(blogPosts, id);
  };

  public func addBlogPost(
    token : AdminTypes.SessionToken,
    input : AdminTypes.BlogPostInput,
  ) : async { #ok : Common.RecordId; #err : Text } {
    ContentLib.addBlogPost(contentSessions, blogPosts, contentState, token, input);
  };

  public func updateBlogPost(
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
    input : AdminTypes.BlogPostInput,
  ) : async { #ok : (); #err : Text } {
    ContentLib.updateBlogPost(contentSessions, blogPosts, token, id, input);
  };

  public func deleteBlogPost(
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
  ) : async { #ok : (); #err : Text } {
    ContentLib.deleteBlogPost(contentSessions, blogPosts, token, id);
  };

  public func toggleBlogPostPublish(
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
  ) : async { #ok : (); #err : Text } {
    ContentLib.toggleBlogPostPublish(contentSessions, blogPosts, token, id);
  };

  // -------------------------------------------------------
  // Test Prep Exams
  // -------------------------------------------------------

  public query func getTestPrepExams() : async [AdminTypes.TestPrepExam] {
    ignore contentSessions;
    ContentLib.getTestPrepExams(testPrepExams);
  };

  public query func getTestPrepExamById(id : Text) : async ?AdminTypes.TestPrepExam {
    ignore contentSessions;
    ContentLib.getTestPrepExamById(testPrepExams, id);
  };

  public func updateTestPrepExam(
    token : AdminTypes.SessionToken,
    exam : AdminTypes.TestPrepExam,
  ) : async { #ok : (); #err : Text } {
    ContentLib.updateTestPrepExam(contentSessions, testPrepExams, token, exam);
  };

  public func addBatchTiming(
    token : AdminTypes.SessionToken,
    examId : Text,
    batch : { startDate : Text; endDate : Text; schedule : Text; capacity : Nat; enrolled : Nat },
  ) : async { #ok : Common.RecordId; #err : Text } {
    ContentLib.addBatchTiming(contentSessions, testPrepExams, contentState, token, examId, batch);
  };

  public func updateBatchTiming(
    token : AdminTypes.SessionToken,
    examId : Text,
    batchId : Common.RecordId,
    batch : { startDate : Text; endDate : Text; schedule : Text; capacity : Nat; enrolled : Nat },
  ) : async { #ok : (); #err : Text } {
    ContentLib.updateBatchTiming(contentSessions, testPrepExams, token, examId, batchId, batch);
  };

  public func deleteBatchTiming(
    token : AdminTypes.SessionToken,
    examId : Text,
    batchId : Common.RecordId,
  ) : async { #ok : (); #err : Text } {
    ContentLib.deleteBatchTiming(contentSessions, testPrepExams, token, examId, batchId);
  };

  // -------------------------------------------------------
  // Immigration Visas
  // -------------------------------------------------------

  public query func getImmigrationVisas() : async [AdminTypes.ImmigrationVisa] {
    ignore contentSessions;
    ContentLib.getImmigrationVisas(immigrationVisas);
  };

  public query func getImmigrationVisaById(id : Text) : async ?AdminTypes.ImmigrationVisa {
    ignore contentSessions;
    ContentLib.getImmigrationVisaById(immigrationVisas, id);
  };

  public func updateImmigrationVisa(
    token : AdminTypes.SessionToken,
    visa : AdminTypes.ImmigrationVisa,
  ) : async { #ok : (); #err : Text } {
    ContentLib.updateImmigrationVisa(contentSessions, immigrationVisas, token, visa);
  };

  // -------------------------------------------------------
  // About Page
  // -------------------------------------------------------

  public query func getAboutPageContent() : async AdminTypes.AboutPageContent {
    ignore contentSessions;
    ContentLib.getAboutPageContent(contentState);
  };

  public func updateAboutPageContent(
    token : AdminTypes.SessionToken,
    content : AdminTypes.AboutPageContent,
  ) : async { #ok : (); #err : Text } {
    ContentLib.updateAboutPageContent(contentSessions, contentState, token, content);
  };

  // -------------------------------------------------------
  // Study Abroad
  // -------------------------------------------------------

  public query func getStudyAbroadContent() : async AdminTypes.StudyAbroadContent {
    ignore contentSessions;
    ContentLib.getStudyAbroadContent(contentState);
  };

  public func updateStudyAbroadContent(
    token : AdminTypes.SessionToken,
    content : AdminTypes.StudyAbroadContent,
  ) : async { #ok : (); #err : Text } {
    ContentLib.updateStudyAbroadContent(contentSessions, contentState, token, content);
  };

  // -------------------------------------------------------
  // Partner Universities
  // -------------------------------------------------------

  public query func getPartnerUniversities() : async [AdminTypes.PartnerUniversity] {
    ignore contentSessions;
    ContentLib.getPartnerUniversities(partnerUniversities);
  };

  public func addPartnerUniversity(
    token : AdminTypes.SessionToken,
    uni : AdminTypes.PartnerUniversity,
  ) : async { #ok : Common.RecordId; #err : Text } {
    ContentLib.addPartnerUniversity(contentSessions, partnerUniversities, contentState, token, uni);
  };

  public func updatePartnerUniversity(
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
    uni : AdminTypes.PartnerUniversity,
  ) : async { #ok : (); #err : Text } {
    ContentLib.updatePartnerUniversity(contentSessions, partnerUniversities, token, id, uni);
  };

  public func deletePartnerUniversity(
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
  ) : async { #ok : (); #err : Text } {
    ContentLib.deletePartnerUniversity(contentSessions, partnerUniversities, token, id);
  };

  public func reorderPartnerUniversities(
    token : AdminTypes.SessionToken,
    orderedIds : [Common.RecordId],
  ) : async { #ok : (); #err : Text } {
    ContentLib.reorderPartnerUniversities(contentSessions, partnerUniversities, token, orderedIds);
  };

  // -------------------------------------------------------
  // Gallery Entries
  // -------------------------------------------------------

  public query func getGalleryEntries() : async [AdminTypes.GalleryEntry] {
    ContentLib.getGalleryEntries(galleryEntries);
  };

  public query func getVisibleGalleryEntries() : async [AdminTypes.GalleryEntry] {
    ContentLib.getVisibleGalleryEntries(galleryEntries);
  };

  public func addGalleryEntry(
    token : AdminTypes.SessionToken,
    input : AdminTypes.GalleryEntryInput,
  ) : async { #ok : Nat; #err : Text } {
    ContentLib.addGalleryEntry(contentSessions, galleryEntries, contentState, token, input);
  };

  public func updateGalleryEntry(
    token : AdminTypes.SessionToken,
    id : Nat,
    input : AdminTypes.GalleryEntryInput,
  ) : async { #ok : (); #err : Text } {
    ContentLib.updateGalleryEntry(contentSessions, galleryEntries, token, id, input);
  };

  public func deleteGalleryEntry(
    token : AdminTypes.SessionToken,
    id : Nat,
  ) : async { #ok : (); #err : Text } {
    ContentLib.deleteGalleryEntry(contentSessions, galleryEntries, token, id);
  };

  public func toggleGalleryEntryVisibility(
    token : AdminTypes.SessionToken,
    id : Nat,
  ) : async { #ok : (); #err : Text } {
    ContentLib.toggleGalleryEntryVisibility(contentSessions, galleryEntries, token, id);
  };

  // -------------------------------------------------------
  // Job Openings
  // -------------------------------------------------------

  public query func getJobOpenings() : async [AdminTypes.JobOpening] {
    ContentLib.getJobOpenings(jobOpenings);
  };

  public query func getActiveJobOpenings() : async [AdminTypes.JobOpening] {
    ContentLib.getActiveJobOpenings(jobOpenings);
  };

  public func addJobOpening(
    token : AdminTypes.SessionToken,
    input : AdminTypes.JobOpeningInput,
  ) : async { #ok : Nat; #err : Text } {
    ContentLib.addJobOpening(contentSessions, jobOpenings, contentState, token, input);
  };

  public func updateJobOpening(
    token : AdminTypes.SessionToken,
    id : Nat,
    input : AdminTypes.JobOpeningInput,
  ) : async { #ok : (); #err : Text } {
    ContentLib.updateJobOpening(contentSessions, jobOpenings, token, id, input);
  };

  public func deleteJobOpening(
    token : AdminTypes.SessionToken,
    id : Nat,
  ) : async { #ok : (); #err : Text } {
    ContentLib.deleteJobOpening(contentSessions, jobOpenings, token, id);
  };

  // -------------------------------------------------------
  // Job Applications
  // -------------------------------------------------------

  public func submitJobApplication(
    input : AdminTypes.JobApplicationInput,
  ) : async AdminTypes.JobApplication {
    ContentLib.submitJobApplication(jobApplications, contentState, input);
  };

  public query func getJobApplications(
    token : AdminTypes.SessionToken,
  ) : async [AdminTypes.JobApplication] {
    if (contentSessions.get(token) == null) return [];
    ContentLib.getJobApplications(jobApplications);
  };

  public func deleteJobApplication(
    token : AdminTypes.SessionToken,
    id : Nat,
  ) : async { #ok : (); #err : Text } {
    ContentLib.deleteJobApplication(contentSessions, jobApplications, token, id);
  };

  // -------------------------------------------------------
  // Service Detail Content
  // -------------------------------------------------------

  public query func getServiceDetail(serviceId : Text) : async ?AdminTypes.ServiceDetailContent {
    ignore contentSessions;
    ContentLib.getServiceDetail(serviceDetails, serviceId);
  };

  public func setServiceDetail(
    token : AdminTypes.SessionToken,
    content : AdminTypes.ServiceDetailContent,
  ) : async { #ok : (); #err : Text } {
    ContentLib.setServiceDetail(contentSessions, serviceDetails, token, content);
  };

  // -------------------------------------------------------
  // Be Our Partner
  // -------------------------------------------------------

  public query func getBeOurPartnerContent() : async ?AdminTypes.BeOurPartnerContent {
    ignore contentSessions;
    ContentLib.getBeOurPartnerContent(beOurPartnerState);
  };

  public func setBeOurPartnerContent(
    token : AdminTypes.SessionToken,
    content : AdminTypes.BeOurPartnerContent,
  ) : async { #ok : (); #err : Text } {
    ContentLib.setBeOurPartnerContent(contentSessions, beOurPartnerState, token, content);
  };

  public func submitPartnerInquiry(
    input : FormTypes.BeOurPartnerInquiryInput,
  ) : async Common.SubmissionResult {
    ignore contentSessions;
    ContentLib.submitPartnerInquiry(partnerInquiries, contentState, input);
  };

  public query func getPartnerInquiries(
    token : AdminTypes.SessionToken,
  ) : async [FormTypes.BeOurPartnerInquiry] {
    ContentLib.getPartnerInquiries(contentSessions, partnerInquiries, token);
  };

  // -------------------------------------------------------
  // Leadership Members
  // -------------------------------------------------------

  public query func getLeadershipMembers() : async [AdminTypes.LeadershipMember] {
    ignore contentSessions;
    ContentLib.getLeadershipMembers(leadershipState);
  };

  public func updateLeadershipMembers(
    token : AdminTypes.SessionToken,
    members : [AdminTypes.LeadershipMember],
  ) : async { #ok; #err : Text } {
    ContentLib.updateLeadershipMembers(contentSessions, leadershipState, token, members);
  };

  // -------------------------------------------------------
  // Generic Page Content
  // -------------------------------------------------------

  public query func getPageContent(pageId : Text) : async ?AdminTypes.PageContent {
    ignore contentSessions;
    pageContents.get(pageId);
  };

  public query func getAllPageContents() : async [AdminTypes.PageContent] {
    ignore contentSessions;
    let buf = List.empty<AdminTypes.PageContent>();
    for ((_, pc) in pageContents.entries()) {
      buf.add(pc);
    };
    buf.toArray();
  };

  public func updatePageContent(
    token : AdminTypes.SessionToken,
    pageId : Text,
    content : AdminTypes.PageContent,
  ) : async { #ok : (); #err : Text } {
    if (contentSessions.get(token) == null) {
      return #err("Unauthorized");
    };
    pageContents.add(pageId, { content with pageId });
    #ok(());
  };

  // -------------------------------------------------------
  // Country Detail Content
  // -------------------------------------------------------

  public query func getCountryDetailAll() : async [AdminTypes.CountryDetailContent] {
    ignore contentSessions;
    ContentLib.getCountryDetailAll(countryDetails);
  };

  public query func getCountryDetail(slug : Text) : async ?AdminTypes.CountryDetailContent {
    ignore contentSessions;
    ContentLib.getCountryDetailBySlug(countryDetails, slug);
  };

  public query func getCountryDetailBySlug(slug : Text) : async ?AdminTypes.CountryDetailContent {
    ignore contentSessions;
    ContentLib.getCountryDetailBySlug(countryDetails, slug);
  };

  public func updateCountryDetailBySlug(
    token : AdminTypes.SessionToken,
    content : AdminTypes.CountryDetailContent,
  ) : async { #ok : (); #err : Text } {
    ContentLib.updateCountryDetailBySlug(contentSessions, countryDetails, token, content);
  };
};
