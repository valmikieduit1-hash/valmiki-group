import List "mo:core/List";
import Map "mo:core/Map";
import AdminTypes "../types/admin";
import Common "../types/common";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import FormTypes "../types/forms";

module {

  // -------------------------------------------------------
  // Blog Posts
  // -------------------------------------------------------

  public func getAllBlogPosts(
    posts : List.List<AdminTypes.BlogPost>,
  ) : [AdminTypes.BlogPost] {
    let arr = posts.toArray();
    arr.sort<AdminTypes.BlogPost>(func(a, b) = Int.compare(b.createdAt, a.createdAt));
  };

  public func getPublishedBlogPosts(
    posts : List.List<AdminTypes.BlogPost>,
  ) : [AdminTypes.BlogPost] {
    let published = posts.filter(func(p) { p.isPublished });
    let arr = published.toArray();
    arr.sort<AdminTypes.BlogPost>(func(a, b) = Int.compare(b.publishedAt, a.publishedAt));
  };

  public func getBlogPostById(
    posts : List.List<AdminTypes.BlogPost>,
    id : Common.RecordId,
  ) : ?AdminTypes.BlogPost {
    posts.find(func(p) { p.id == id });
  };

  public func addBlogPost(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    posts : List.List<AdminTypes.BlogPost>,
    contentState : { var nextContentId : Nat },
    token : AdminTypes.SessionToken,
    input : AdminTypes.BlogPostInput,
  ) : { #ok : Common.RecordId; #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    if (input.title == "") return #err "Title cannot be empty";
    if (input.slug == "") return #err "Slug cannot be empty";
    let id = contentState.nextContentId;
    contentState.nextContentId += 1;
    let now = Common.now();
    let post : AdminTypes.BlogPost = {
      id;
      title = input.title;
      slug = input.slug;
      content = input.content;
      featuredImageUrl = input.featuredImageUrl;
      category = input.category;
      tags = [];
      isPublished = input.isPublished;
      publishedAt = if (input.isPublished) { now.toNat() } else { 0 };
      createdAt = now;
      updatedAt = now;
    };
    posts.add(post);
    #ok id;
  };

  public func updateBlogPost(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    posts : List.List<AdminTypes.BlogPost>,
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
    input : AdminTypes.BlogPostInput,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    var found = false;
    posts.mapInPlace(
      func(p) {
        if (p.id == id) {
          found := true;
          {
            p with
            title = input.title;
            slug = input.slug;
            content = input.content;
            featuredImageUrl = input.featuredImageUrl;
            category = input.category;
            isPublished = input.isPublished;
            updatedAt = Common.now();
          };
        } else { p };
      }
    );
    if (found) #ok () else #err "Not found";
  };

  public func deleteBlogPost(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    posts : List.List<AdminTypes.BlogPost>,
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    let sizeBefore = posts.size();
    posts.retain(func(p) { p.id != id });
    if (posts.size() < sizeBefore) #ok () else #err "Not found";
  };

  public func toggleBlogPostPublish(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    posts : List.List<AdminTypes.BlogPost>,
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    var found = false;
    let now = Common.now();
    posts.mapInPlace(
      func(p) {
        if (p.id == id) {
          found := true;
          let newPublished = not p.isPublished;
          {
            p with
            isPublished = newPublished;
            publishedAt = if (newPublished) { now.toNat() } else { p.publishedAt };
            updatedAt = now;
          };
        } else { p };
      }
    );
    if (found) #ok () else #err "Not found";
  };

  // -------------------------------------------------------
  // Test Prep Exams
  // -------------------------------------------------------

  public func getTestPrepExams(
    exams : Map.Map<Text, AdminTypes.TestPrepExam>,
  ) : [AdminTypes.TestPrepExam] {
    let vals = exams.values();
    vals.toArray();
  };

  public func getTestPrepExamById(
    exams : Map.Map<Text, AdminTypes.TestPrepExam>,
    id : Text,
  ) : ?AdminTypes.TestPrepExam {
    exams.get(id);
  };

  public func updateTestPrepExam(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    exams : Map.Map<Text, AdminTypes.TestPrepExam>,
    token : AdminTypes.SessionToken,
    exam : AdminTypes.TestPrepExam,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    switch (exams.get(exam.id)) {
      case null { return #err "Not found" };
      case (?existing) {
        exams.add(exam.id, { exam with batchTimings = existing.batchTimings });
        #ok ();
      };
    };
  };

  public func addBatchTiming(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    exams : Map.Map<Text, AdminTypes.TestPrepExam>,
    contentState : { var nextContentId : Nat },
    token : AdminTypes.SessionToken,
    examId : Text,
    batch : { startDate : Text; endDate : Text; schedule : Text; capacity : Nat; enrolled : Nat },
  ) : { #ok : Common.RecordId; #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    switch (exams.get(examId)) {
      case null { #err "Exam not found" };
      case (?exam) {
        let batchId = contentState.nextContentId;
        contentState.nextContentId += 1;
        let newBatch : AdminTypes.BatchTiming = {
          id = batchId;
          startDate = batch.startDate;
          endDate = batch.endDate;
          schedule = batch.schedule;
          capacity = batch.capacity;
          enrolled = batch.enrolled;
        };
        let updatedBatches = exam.batchTimings.concat([newBatch]);
        exams.add(examId, { exam with batchTimings = updatedBatches });
        #ok batchId;
      };
    };
  };

  public func updateBatchTiming(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    exams : Map.Map<Text, AdminTypes.TestPrepExam>,
    token : AdminTypes.SessionToken,
    examId : Text,
    batchId : Common.RecordId,
    batch : { startDate : Text; endDate : Text; schedule : Text; capacity : Nat; enrolled : Nat },
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    switch (exams.get(examId)) {
      case null { #err "Exam not found" };
      case (?exam) {
        var found = false;
        let updatedBatches = exam.batchTimings.map(
          func(b) {
            if (b.id == batchId) {
              found := true;
              { id = batchId; startDate = batch.startDate; endDate = batch.endDate; schedule = batch.schedule; capacity = batch.capacity; enrolled = batch.enrolled };
            } else { b };
          }
        );
        if (not found) return #err "Batch not found";
        exams.add(examId, { exam with batchTimings = updatedBatches });
        #ok ();
      };
    };
  };

  public func deleteBatchTiming(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    exams : Map.Map<Text, AdminTypes.TestPrepExam>,
    token : AdminTypes.SessionToken,
    examId : Text,
    batchId : Common.RecordId,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    switch (exams.get(examId)) {
      case null { #err "Exam not found" };
      case (?exam) {
        let filtered = exam.batchTimings.filter(func(b) { b.id != batchId });
        exams.add(examId, { exam with batchTimings = filtered });
        #ok ();
      };
    };
  };

  // -------------------------------------------------------
  // Immigration Visas
  // -------------------------------------------------------

  public func getImmigrationVisas(
    visas : Map.Map<Text, AdminTypes.ImmigrationVisa>,
  ) : [AdminTypes.ImmigrationVisa] {
    visas.values().toArray();
  };

  public func getImmigrationVisaById(
    visas : Map.Map<Text, AdminTypes.ImmigrationVisa>,
    id : Text,
  ) : ?AdminTypes.ImmigrationVisa {
    visas.get(id);
  };

  public func updateImmigrationVisa(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    visas : Map.Map<Text, AdminTypes.ImmigrationVisa>,
    token : AdminTypes.SessionToken,
    visa : AdminTypes.ImmigrationVisa,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    if (visas.get(visa.id) == null) return #err "Not found";
    visas.add(visa.id, visa);
    #ok ();
  };

  // -------------------------------------------------------
  // About Page Content
  // -------------------------------------------------------

  public func getAboutPageContent(
    contentState : { var aboutPageContent : AdminTypes.AboutPageContent },
  ) : AdminTypes.AboutPageContent {
    contentState.aboutPageContent;
  };

  public func updateAboutPageContent(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    contentState : { var aboutPageContent : AdminTypes.AboutPageContent },
    token : AdminTypes.SessionToken,
    content : AdminTypes.AboutPageContent,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    contentState.aboutPageContent := content;
    #ok ();
  };

  // -------------------------------------------------------
  // Study Abroad Content
  // -------------------------------------------------------

  public func getStudyAbroadContent(
    contentState : { var studyAbroadContent : AdminTypes.StudyAbroadContent },
  ) : AdminTypes.StudyAbroadContent {
    contentState.studyAbroadContent;
  };

  public func updateStudyAbroadContent(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    contentState : { var studyAbroadContent : AdminTypes.StudyAbroadContent },
    token : AdminTypes.SessionToken,
    content : AdminTypes.StudyAbroadContent,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    contentState.studyAbroadContent := content;
    #ok ();
  };

  // -------------------------------------------------------
  // Partner Universities
  // -------------------------------------------------------

  public func getPartnerUniversities(
    partners : List.List<AdminTypes.PartnerUniversity>,
  ) : [AdminTypes.PartnerUniversity] {
    let arr = partners.toArray();
    arr.sort<AdminTypes.PartnerUniversity>(func(a, b) = Nat.compare(a.order, b.order));
  };

  public func addPartnerUniversity(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    partners : List.List<AdminTypes.PartnerUniversity>,
    contentState : { var nextContentId : Nat },
    token : AdminTypes.SessionToken,
    uni : AdminTypes.PartnerUniversity,
  ) : { #ok : Common.RecordId; #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    let id = contentState.nextContentId;
    contentState.nextContentId += 1;
    let newUni : AdminTypes.PartnerUniversity = {
      uni with
      id;
      order = partners.size() + 1;
    };
    partners.add(newUni);
    #ok id;
  };

  public func updatePartnerUniversity(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    partners : List.List<AdminTypes.PartnerUniversity>,
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
    uni : AdminTypes.PartnerUniversity,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    var found = false;
    partners.mapInPlace(
      func(p) {
        if (p.id == id) {
          found := true;
          { uni with id };
        } else { p };
      }
    );
    if (found) #ok () else #err "Not found";
  };

  public func deletePartnerUniversity(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    partners : List.List<AdminTypes.PartnerUniversity>,
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    let sizeBefore = partners.size();
    partners.retain(func(p) { p.id != id });
    if (partners.size() < sizeBefore) #ok () else #err "Not found";
  };

  public func reorderPartnerUniversities(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    partners : List.List<AdminTypes.PartnerUniversity>,
    token : AdminTypes.SessionToken,
    orderedIds : [Common.RecordId],
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    var order : Nat = 1;
    for (targetId in orderedIds.vals()) {
      let pos = order;
      partners.mapInPlace(
        func(p) {
          if (p.id == targetId) { { p with order = pos } } else { p };
        }
      );
      order += 1;
    };
    #ok ();
  };

  // -------------------------------------------------------
  // Country Detail Content
  // -------------------------------------------------------

  public func getCountryDetailAll(
    countries : Map.Map<Text, AdminTypes.CountryDetailContent>,
  ) : [AdminTypes.CountryDetailContent] {
    countries.values().toArray();
  };

  public func getCountryDetailBySlug(
    countries : Map.Map<Text, AdminTypes.CountryDetailContent>,
    slug : Text,
  ) : ?AdminTypes.CountryDetailContent {
    countries.get(slug);
  };

  public func updateCountryDetailBySlug(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    countries : Map.Map<Text, AdminTypes.CountryDetailContent>,
    token : AdminTypes.SessionToken,
    content : AdminTypes.CountryDetailContent,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    countries.add(content.countrySlug, content);
    #ok ();
  };
  // -------------------------------------------------------
  // Gallery Entries
  // -------------------------------------------------------

  public func getGalleryEntries(
    entries : List.List<AdminTypes.GalleryEntry>,
  ) : [AdminTypes.GalleryEntry] {
    entries.toArray();
  };

  public func getVisibleGalleryEntries(
    entries : List.List<AdminTypes.GalleryEntry>,
  ) : [AdminTypes.GalleryEntry] {
    entries.filter(func(e) { e.isVisible }).toArray();
  };

  public func addGalleryEntry(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    entries : List.List<AdminTypes.GalleryEntry>,
    contentState : { var nextContentId : Nat },
    token : AdminTypes.SessionToken,
    input : AdminTypes.GalleryEntryInput,
  ) : { #ok : Nat; #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    let id = contentState.nextContentId;
    contentState.nextContentId += 1;
    let now = Common.now();
    let entry : AdminTypes.GalleryEntry = {
      id;
      studentName = input.studentName;
      destinationCountry = input.destinationCountry;
      universityAdmitted = input.universityAdmitted;
      visaStatus = input.visaStatus;
      imageUrl = input.imageUrl;
      order = input.order;
      isVisible = input.isVisible;
      createdAt = now;
    };
    entries.add(entry);
    #ok id;
  };

  public func updateGalleryEntry(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    entries : List.List<AdminTypes.GalleryEntry>,
    token : AdminTypes.SessionToken,
    id : Nat,
    input : AdminTypes.GalleryEntryInput,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    var found = false;
    entries.mapInPlace(
      func(e) {
        if (e.id == id) {
          found := true;
          { e with
            studentName = input.studentName;
            destinationCountry = input.destinationCountry;
            universityAdmitted = input.universityAdmitted;
            visaStatus = input.visaStatus;
            imageUrl = input.imageUrl;
            order = input.order;
            isVisible = input.isVisible;
          };
        } else { e };
      }
    );
    if (found) #ok () else #err "Not found";
  };

  public func deleteGalleryEntry(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    entries : List.List<AdminTypes.GalleryEntry>,
    token : AdminTypes.SessionToken,
    id : Nat,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    let sizeBefore = entries.size();
    entries.retain(func(e) { e.id != id });
    if (entries.size() < sizeBefore) #ok () else #err "Not found";
  };

  public func toggleGalleryEntryVisibility(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    entries : List.List<AdminTypes.GalleryEntry>,
    token : AdminTypes.SessionToken,
    id : Nat,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    var found = false;
    entries.mapInPlace(
      func(e) {
        if (e.id == id) {
          found := true;
          { e with isVisible = not e.isVisible };
        } else { e };
      }
    );
    if (found) #ok () else #err "Not found";
  };

  // -------------------------------------------------------
  // Job Openings
  // -------------------------------------------------------

  public func getJobOpenings(
    jobs : List.List<AdminTypes.JobOpening>,
  ) : [AdminTypes.JobOpening] {
    jobs.toArray();
  };

  public func getActiveJobOpenings(
    jobs : List.List<AdminTypes.JobOpening>,
  ) : [AdminTypes.JobOpening] {
    jobs.filter(func(j) { j.isActive }).toArray();
  };

  public func addJobOpening(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    jobs : List.List<AdminTypes.JobOpening>,
    contentState : { var nextContentId : Nat },
    token : AdminTypes.SessionToken,
    input : AdminTypes.JobOpeningInput,
  ) : { #ok : Nat; #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    let id = contentState.nextContentId;
    contentState.nextContentId += 1;
    let now = Common.now();
    let job : AdminTypes.JobOpening = {
      id;
      title = input.title;
      department = input.department;
      location = input.location;
      description = input.description;
      requirements = input.requirements;
      isActive = input.isActive;
      createdAt = now;
    };
    jobs.add(job);
    #ok id;
  };

  public func updateJobOpening(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    jobs : List.List<AdminTypes.JobOpening>,
    token : AdminTypes.SessionToken,
    id : Nat,
    input : AdminTypes.JobOpeningInput,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    var found = false;
    jobs.mapInPlace(
      func(j) {
        if (j.id == id) {
          found := true;
          { j with
            title = input.title;
            department = input.department;
            location = input.location;
            description = input.description;
            requirements = input.requirements;
            isActive = input.isActive;
          };
        } else { j };
      }
    );
    if (found) #ok () else #err "Not found";
  };

  public func deleteJobOpening(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    jobs : List.List<AdminTypes.JobOpening>,
    token : AdminTypes.SessionToken,
    id : Nat,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    let sizeBefore = jobs.size();
    jobs.retain(func(j) { j.id != id });
    if (jobs.size() < sizeBefore) #ok () else #err "Not found";
  };

  // -------------------------------------------------------
  // Job Applications
  // -------------------------------------------------------

  public func submitJobApplication(
    apps : List.List<AdminTypes.JobApplication>,
    contentState : { var nextContentId : Nat },
    input : AdminTypes.JobApplicationInput,
  ) : AdminTypes.JobApplication {
    let id = contentState.nextContentId;
    contentState.nextContentId += 1;
    let now = Common.now();
    let app : AdminTypes.JobApplication = {
      id;
      applicantName = input.applicantName;
      email = input.email;
      phone = input.phone;
      positionApplied = input.positionApplied;
      coverLetter = input.coverLetter;
      resumeUrl = input.resumeUrl;
      jobOpeningId = input.jobOpeningId;
      submittedAt = now;
    };
    apps.add(app);
    app;
  };

  public func getJobApplications(
    apps : List.List<AdminTypes.JobApplication>,
  ) : [AdminTypes.JobApplication] {
    apps.toArray();
  };

  // -------------------------------------------------------
  // Leadership Members
  // -------------------------------------------------------

  public func getLeadershipMembers(
    leadershipState : { var members : [AdminTypes.LeadershipMember] },
  ) : [AdminTypes.LeadershipMember] {
    leadershipState.members;
  };

  public func updateLeadershipMembers(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    leadershipState : { var members : [AdminTypes.LeadershipMember] },
    token : AdminTypes.SessionToken,
    members : [AdminTypes.LeadershipMember],
  ) : { #ok; #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    leadershipState.members := members;
    #ok;
  };

  // -------------------------------------------------------
  // Service Detail Content
  // -------------------------------------------------------

  public func getServiceDetail(
    serviceDetails : Map.Map<Text, AdminTypes.ServiceDetailContent>,
    serviceId : Text,
  ) : ?AdminTypes.ServiceDetailContent {
    serviceDetails.get(serviceId);
  };

  public func setServiceDetail(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    serviceDetails : Map.Map<Text, AdminTypes.ServiceDetailContent>,
    token : AdminTypes.SessionToken,
    content : AdminTypes.ServiceDetailContent,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    serviceDetails.add(content.serviceId, content);
    #ok ();
  };

  // -------------------------------------------------------
  // Be Our Partner Content
  // -------------------------------------------------------

  public func getBeOurPartnerContent(
    beOurPartnerState : { var content : ?AdminTypes.BeOurPartnerContent },
  ) : ?AdminTypes.BeOurPartnerContent {
    beOurPartnerState.content;
  };

  public func setBeOurPartnerContent(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    beOurPartnerState : { var content : ?AdminTypes.BeOurPartnerContent },
    token : AdminTypes.SessionToken,
    content : AdminTypes.BeOurPartnerContent,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    beOurPartnerState.content := ?content;
    #ok ();
  };

  public func submitPartnerInquiry(
    inquiries : List.List<FormTypes.BeOurPartnerInquiry>,
    contentState : { var nextContentId : Nat },
    input : FormTypes.BeOurPartnerInquiryInput,
  ) : Common.SubmissionResult {
    let id = contentState.nextContentId;
    contentState.nextContentId += 1;
    let now = Common.now();
    let inquiry : FormTypes.BeOurPartnerInquiry = {
      id;
      companyName = input.companyName;
      contactName = input.contactName;
      email = input.email;
      phone = input.phone;
      partnershipType = input.partnershipType;
      message = input.message;
      submittedAt = now;
    };
    inquiries.add(inquiry);
    { id; timestamp = now };
  };

  public func getPartnerInquiries(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    inquiries : List.List<FormTypes.BeOurPartnerInquiry>,
    token : AdminTypes.SessionToken,
  ) : [FormTypes.BeOurPartnerInquiry] {
    if (sessions.get(token) == null) return [];
    inquiries.toArray();
  };

  public func deleteJobApplication(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    apps : List.List<AdminTypes.JobApplication>,
    token : AdminTypes.SessionToken,
    id : Nat,
  ) : { #ok : (); #err : Text } {
    if (sessions.get(token) == null) return #err "Unauthorized";
    let sizeBefore = apps.size();
    apps.retain(func(a) { a.id != id });
    if (apps.size() < sizeBefore) #ok () else #err "Not found";
  };
};
