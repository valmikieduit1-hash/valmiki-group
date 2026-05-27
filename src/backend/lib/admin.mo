import List "mo:core/List";
import Map "mo:core/Map";
import Int "mo:core/Int";
import AdminTypes "../types/admin";
import Common "../types/common";

module {
  // Admin username is fixed as "admin" (MVP)
  let ADMIN_USERNAME : Text = "admin";

  // --- Helper: generate a simple session token ---
  func makeToken(ts : Common.Timestamp) : AdminTypes.SessionToken {
    "valmiki-" # ts.toText();
  };

  // --- Authentication ---

  public func adminLogin(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    adminState : { var passwordHash : Text },
    username : Text,
    password : Text,
  ) : { #ok : AdminTypes.SessionToken; #err : Text } {
    if (username != ADMIN_USERNAME) {
      return #err("Invalid credentials");
    };
    if (password != adminState.passwordHash) {
      return #err("Invalid credentials");
    };
    let ts = Common.now();
    let token = makeToken(ts);
    sessions.add(token, ts);
    #ok(token);
  };

  public func adminLogout(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    token : AdminTypes.SessionToken,
  ) : () {
    sessions.remove(token);
  };

  public func verifyAdminToken(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    token : AdminTypes.SessionToken,
  ) : Bool {
    switch (sessions.get(token)) {
      case (?_) { true };
      case null { false };
    };
  };

  // --- Hero Content ---

  public func getHeroContent(
    adminState : { var heroContent : AdminTypes.HeroContent },
  ) : AdminTypes.HeroContent {
    adminState.heroContent;
  };

  public func updateHeroContent(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    adminState : { var heroContent : AdminTypes.HeroContent },
    token : AdminTypes.SessionToken,
    content : AdminTypes.HeroContent,
  ) : { #ok : (); #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    adminState.heroContent := content;
    #ok(());
  };

  // --- Services ---

  public func getServices(
    services : List.List<AdminTypes.ServiceItem>,
  ) : [AdminTypes.ServiceItem] {
    services.toArray();
  };

  public func addService(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    services : List.List<AdminTypes.ServiceItem>,
    adminState : { var nextAdminId : Nat },
    token : AdminTypes.SessionToken,
    input : AdminTypes.ServiceItemInput,
  ) : { #ok : Common.RecordId; #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    let id = adminState.nextAdminId;
    adminState.nextAdminId := id + 1;
    services.add({
      id;
      name = input.name;
      description = input.description;
      icon = input.icon;
      features = input.features;
      ctaLink = input.ctaLink;
      order = input.order;
    });
    #ok(id);
  };

  public func updateService(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    services : List.List<AdminTypes.ServiceItem>,
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
    input : AdminTypes.ServiceItemInput,
  ) : { #ok : (); #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    var found = false;
    services.mapInPlace(
      func(item) {
        if (item.id == id) {
          found := true;
          { item with name = input.name; description = input.description; icon = input.icon; features = input.features; ctaLink = input.ctaLink; order = input.order };
        } else { item };
      }
    );
    if (found) { #ok(()) } else { #err("Not found") };
  };

  public func deleteService(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    services : List.List<AdminTypes.ServiceItem>,
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
  ) : { #ok : (); #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    services.retain(func(item) { item.id != id });
    #ok(());
  };

  // --- Country Info ---

  public func getCountryInfoAll(
    countries : Map.Map<Text, AdminTypes.CountryInfo>,
  ) : [AdminTypes.CountryInfo] {
    let buf = List.empty<AdminTypes.CountryInfo>();
    for ((_, info) in countries.entries()) {
      buf.add(info);
    };
    buf.toArray();
  };

  public func updateCountryInfo(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    countries : Map.Map<Text, AdminTypes.CountryInfo>,
    token : AdminTypes.SessionToken,
    info : AdminTypes.CountryInfo,
  ) : { #ok : (); #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    countries.add(info.slug, info);
    #ok(());
  };

  public func addCountry(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    countries : Map.Map<Text, AdminTypes.CountryInfo>,
    token : AdminTypes.SessionToken,
    slug : Text,
    name : Text,
  ) : { #ok : (); #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    switch (countries.get(slug)) {
      case (?_) { return #err("Country already exists") };
      case null {};
    };
    countries.add(slug, {
      slug;
      tuition = "";
      visaSuccessRate = "";
      popularCourses = [];
      workOpportunities = "";
      prPathway = "";
      acceptanceRate = "";
      processingTime = "";
      averageCost = "";
      intakeMonths = "";
      description = name;
      topUniversities = [];
      requirements = [];
      visaSteps = [];
      scholarships = [];
      faqs = [];
      heroImage = "";
      flagImage = "";
      order = 999;
    });
    #ok(());
  };

  public func deleteCountry(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    countries : Map.Map<Text, AdminTypes.CountryInfo>,
    token : AdminTypes.SessionToken,
    slug : Text,
  ) : { #ok : (); #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    switch (countries.get(slug)) {
      case null { return #err("Country not found") };
      case (?_) {};
    };
    countries.remove(slug);
    #ok(());
  };

  public func reorderCountries(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    countries : Map.Map<Text, AdminTypes.CountryInfo>,
    token : AdminTypes.SessionToken,
    slugOrder : [Text],
  ) : { #ok : (); #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    var idx : Nat = 0;
    for (slug in slugOrder.vals()) {
      switch (countries.get(slug)) {
        case (?info) {
          countries.add(slug, { info with order = idx });
        };
        case null {};
      };
      idx := idx + 1;
    };
    #ok(());
  };

  // --- Testimonials ---

  public func getTestimonials(
    testimonials : List.List<AdminTypes.TestimonialItem>,
  ) : [AdminTypes.TestimonialItem] {
    testimonials.toArray();
  };

  public func addTestimonial(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    testimonials : List.List<AdminTypes.TestimonialItem>,
    adminState : { var nextAdminId : Nat },
    token : AdminTypes.SessionToken,
    input : AdminTypes.TestimonialInput,
  ) : { #ok : Common.RecordId; #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    let id = adminState.nextAdminId;
    adminState.nextAdminId := id + 1;
    testimonials.add({
      id;
      name = input.name;
      university = input.university;
      country = input.country;
      course = input.course;
      text = input.text;
      rating = input.rating;
      imageUrl = input.imageUrl;
      isVisible = input.isVisible;
      youtubeUrl = input.youtubeUrl;
    });
    #ok(id);
  };

  public func updateTestimonial(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    testimonials : List.List<AdminTypes.TestimonialItem>,
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
    input : AdminTypes.TestimonialInput,
  ) : { #ok : (); #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    var found = false;
    testimonials.mapInPlace(
      func(item) {
        if (item.id == id) {
          found := true;
          { item with name = input.name; university = input.university; country = input.country; course = input.course; text = input.text; rating = input.rating; imageUrl = input.imageUrl; isVisible = input.isVisible; youtubeUrl = input.youtubeUrl };
        } else { item };
      }
    );
    if (found) { #ok(()) } else { #err("Not found") };
  };

  public func deleteTestimonial(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    testimonials : List.List<AdminTypes.TestimonialItem>,
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
  ) : { #ok : (); #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    testimonials.retain(func(item) { item.id != id });
    #ok(());
  };

  // --- Events ---

  public func getEvents(
    events : List.List<AdminTypes.EventItem>,
  ) : [AdminTypes.EventItem] {
    events.toArray();
  };

  public func addEvent(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    events : List.List<AdminTypes.EventItem>,
    adminState : { var nextAdminId : Nat },
    token : AdminTypes.SessionToken,
    input : AdminTypes.EventItemInput,
  ) : { #ok : Common.RecordId; #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    let id = adminState.nextAdminId;
    adminState.nextAdminId := id + 1;
    events.add({
      id;
      title = input.title;
      date = input.date;
      description = input.description;
      imageUrl = input.imageUrl;
      location = input.location;
      registrationLink = input.registrationLink;
      isActive = input.isActive;
    });
    #ok(id);
  };

  public func updateEvent(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    events : List.List<AdminTypes.EventItem>,
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
    input : AdminTypes.EventItemInput,
  ) : { #ok : (); #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    var found = false;
    events.mapInPlace(
      func(item) {
        if (item.id == id) {
          found := true;
          { item with title = input.title; date = input.date; description = input.description; imageUrl = input.imageUrl; location = input.location; registrationLink = input.registrationLink; isActive = input.isActive };
        } else { item };
      }
    );
    if (found) { #ok(()) } else { #err("Not found") };
  };

  public func deleteEvent(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    events : List.List<AdminTypes.EventItem>,
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
  ) : { #ok : (); #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    events.retain(func(item) { item.id != id });
    #ok(());
  };

  // --- Team Members ---

  public func getTeamMembers(
    team : List.List<AdminTypes.TeamMember>,
  ) : [AdminTypes.TeamMember] {
    team.toArray();
  };

  public func addTeamMember(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    team : List.List<AdminTypes.TeamMember>,
    adminState : { var nextAdminId : Nat },
    token : AdminTypes.SessionToken,
    input : AdminTypes.TeamMemberInput,
  ) : { #ok : Common.RecordId; #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    let id = adminState.nextAdminId;
    adminState.nextAdminId := id + 1;
    team.add({
      id;
      name = input.name;
      role = input.role;
      bio = input.bio;
      imageUrl = input.imageUrl;
      order = input.order;
    });
    #ok(id);
  };

  public func updateTeamMember(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    team : List.List<AdminTypes.TeamMember>,
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
    input : AdminTypes.TeamMemberInput,
  ) : { #ok : (); #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    var found = false;
    team.mapInPlace(
      func(item) {
        if (item.id == id) {
          found := true;
          { item with name = input.name; role = input.role; bio = input.bio; imageUrl = input.imageUrl; order = input.order };
        } else { item };
      }
    );
    if (found) { #ok(()) } else { #err("Not found") };
  };

  public func deleteTeamMember(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    team : List.List<AdminTypes.TeamMember>,
    token : AdminTypes.SessionToken,
    id : Common.RecordId,
  ) : { #ok : (); #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    team.retain(func(item) { item.id != id });
    #ok(());
  };

  // --- Contact Info ---

  public func getContactInfo(
    adminState : { var contactInfo : AdminTypes.ContactInfo },
  ) : AdminTypes.ContactInfo {
    adminState.contactInfo;
  };

  public func updateContactInfo(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    adminState : { var contactInfo : AdminTypes.ContactInfo },
    token : AdminTypes.SessionToken,
    info : AdminTypes.ContactInfo,
  ) : { #ok : (); #err : Text } {
    if (not verifyAdminToken(sessions, token)) {
      return #err("Unauthorized");
    };
    adminState.contactInfo := info;
    #ok(());
  };

  // --- Dashboard Stats ---

  public func getAdminDashboardStats(
    sessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
    totalLeads : Nat,
    thisMonthLeads : Nat,
  ) : AdminTypes.AdminDashboardStats {
    ignore sessions;
    {
      totalLeads;
      thisMonth = thisMonthLeads;
      pending = totalLeads;
    };
  };
};
