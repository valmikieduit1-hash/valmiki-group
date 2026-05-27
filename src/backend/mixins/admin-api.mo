import List "mo:core/List";
import Map "mo:core/Map";
import AdminTypes "../types/admin";
import Common "../types/common";
import AdminLib "../lib/admin";

mixin (
  adminSessions : Map.Map<AdminTypes.SessionToken, Common.Timestamp>,
  adminState : {
    var passwordHash : Text;
    var heroContent : AdminTypes.HeroContent;
    var contactInfo : AdminTypes.ContactInfo;
    var nextAdminId : Nat;
  },
  adminServices : List.List<AdminTypes.ServiceItem>,
  adminCountries : Map.Map<Text, AdminTypes.CountryInfo>,
  adminTestimonials : List.List<AdminTypes.TestimonialItem>,
  adminEvents : List.List<AdminTypes.EventItem>,
  adminTeam : List.List<AdminTypes.TeamMember>,
  pageHeroesState : { var heroes : Map.Map<Text, AdminTypes.PageHeroContent> },
  lifeAtValmikiState : { var content : AdminTypes.LifeAtValmikiContent },
  freeCounselingState : { var content : AdminTypes.FreeCounselingContent },
  homeSectionsState : { var content : AdminTypes.HomeSectionsContent },
  websiteThemeState : { var theme : AdminTypes.WebsiteTheme },
  footerContentState : { var content : AdminTypes.FooterContent },
) {

  // --- Authentication ---

  public func adminLogin(
    username : Text,
    password : Text,
  ) : async { #ok : AdminTypes.SessionToken; #err : Text } {
    AdminLib.adminLogin(adminSessions, adminState, username, password);
  };

  public func adminLogout(token : Text) : async () {
    AdminLib.adminLogout(adminSessions, token);
  };

  public query func verifyAdminToken(token : Text) : async Bool {
    AdminLib.verifyAdminToken(adminSessions, token);
  };

  // --- Hero Content ---

  public query func getHeroContent() : async AdminTypes.HeroContent {
    AdminLib.getHeroContent(adminState);
  };

  public func updateHeroContent(
    token : Text,
    content : AdminTypes.HeroContent,
  ) : async { #ok : (); #err : Text } {
    AdminLib.updateHeroContent(adminSessions, adminState, token, content);
  };

  // --- Services ---

  public query func getServices() : async [AdminTypes.ServiceItem] {
    AdminLib.getServices(adminServices);
  };

  public func addService(
    token : Text,
    service : AdminTypes.ServiceItemInput,
  ) : async { #ok : Common.RecordId; #err : Text } {
    AdminLib.addService(adminSessions, adminServices, adminState, token, service);
  };

  public func updateService(
    token : Text,
    id : Common.RecordId,
    service : AdminTypes.ServiceItemInput,
  ) : async { #ok : (); #err : Text } {
    AdminLib.updateService(adminSessions, adminServices, token, id, service);
  };

  public func deleteService(
    token : Text,
    id : Common.RecordId,
  ) : async { #ok : (); #err : Text } {
    AdminLib.deleteService(adminSessions, adminServices, token, id);
  };

  // --- Country Info ---

  public query func getCountryInfoAll() : async [AdminTypes.CountryInfo] {
    AdminLib.getCountryInfoAll(adminCountries);
  };

  public query func getCountryInfo(slug : Text) : async ?AdminTypes.CountryInfo {
    adminCountries.get(slug);
  };

  public query func getAllCountries() : async [AdminTypes.CountryInfo] {
    AdminLib.getCountryInfoAll(adminCountries);
  };

  public func updateCountryInfo(
    token : Text,
    info : AdminTypes.CountryInfo,
  ) : async { #ok : (); #err : Text } {
    AdminLib.updateCountryInfo(adminSessions, adminCountries, token, info);
  };

  public func reorderCountries(
    token : Text,
    slugOrder : [Text],
  ) : async { #ok : (); #err : Text } {
    AdminLib.reorderCountries(adminSessions, adminCountries, token, slugOrder);
  };

  public func addCountry(
    token : Text,
    slug : Text,
    name : Text,
  ) : async { #ok : (); #err : Text } {
    AdminLib.addCountry(adminSessions, adminCountries, token, slug, name);
  };

  public func deleteCountry(
    token : Text,
    slug : Text,
  ) : async { #ok : (); #err : Text } {
    AdminLib.deleteCountry(adminSessions, adminCountries, token, slug);
  };

  // --- Testimonials ---

  public query func getTestimonials() : async [AdminTypes.TestimonialItem] {
    AdminLib.getTestimonials(adminTestimonials);
  };

  public func addTestimonial(
    token : Text,
    item : AdminTypes.TestimonialInput,
  ) : async { #ok : Common.RecordId; #err : Text } {
    AdminLib.addTestimonial(adminSessions, adminTestimonials, adminState, token, item);
  };

  public func updateTestimonial(
    token : Text,
    id : Common.RecordId,
    item : AdminTypes.TestimonialInput,
  ) : async { #ok : (); #err : Text } {
    AdminLib.updateTestimonial(adminSessions, adminTestimonials, token, id, item);
  };

  public func deleteTestimonial(
    token : Text,
    id : Common.RecordId,
  ) : async { #ok : (); #err : Text } {
    AdminLib.deleteTestimonial(adminSessions, adminTestimonials, token, id);
  };

  // --- Events ---

  public query func getEvents() : async [AdminTypes.EventItem] {
    AdminLib.getEvents(adminEvents);
  };

  public func addEvent(
    token : Text,
    item : AdminTypes.EventItemInput,
  ) : async { #ok : Common.RecordId; #err : Text } {
    AdminLib.addEvent(adminSessions, adminEvents, adminState, token, item);
  };

  public func updateEvent(
    token : Text,
    id : Common.RecordId,
    item : AdminTypes.EventItemInput,
  ) : async { #ok : (); #err : Text } {
    AdminLib.updateEvent(adminSessions, adminEvents, token, id, item);
  };

  public func deleteEvent(
    token : Text,
    id : Common.RecordId,
  ) : async { #ok : (); #err : Text } {
    AdminLib.deleteEvent(adminSessions, adminEvents, token, id);
  };

  // --- Team Members ---

  public query func getTeamMembers() : async [AdminTypes.TeamMember] {
    AdminLib.getTeamMembers(adminTeam);
  };

  public func addTeamMember(
    token : Text,
    member : AdminTypes.TeamMemberInput,
  ) : async { #ok : Common.RecordId; #err : Text } {
    AdminLib.addTeamMember(adminSessions, adminTeam, adminState, token, member);
  };

  public func updateTeamMember(
    token : Text,
    id : Common.RecordId,
    member : AdminTypes.TeamMemberInput,
  ) : async { #ok : (); #err : Text } {
    AdminLib.updateTeamMember(adminSessions, adminTeam, token, id, member);
  };

  public func deleteTeamMember(
    token : Text,
    id : Common.RecordId,
  ) : async { #ok : (); #err : Text } {
    AdminLib.deleteTeamMember(adminSessions, adminTeam, token, id);
  };

  // --- Contact Info ---

  public query func getContactInfo() : async AdminTypes.ContactInfo {
    AdminLib.getContactInfo(adminState);
  };

  public func updateContactInfo(
    token : Text,
    info : AdminTypes.ContactInfo,
  ) : async { #ok : (); #err : Text } {
    AdminLib.updateContactInfo(adminSessions, adminState, token, info);
  };

  // --- Page Hero Content ---

  public query func getPageHeroContent(pageId : Text) : async ?AdminTypes.PageHeroContent {
    pageHeroesState.heroes.get(pageId);
  };

  public func updatePageHeroContent(
    token : Text,
    content : AdminTypes.PageHeroContent,
  ) : async { #ok : (); #err : Text } {
    if (AdminLib.verifyAdminToken(adminSessions, token) == false) {
      return #err("Unauthorized");
    };
    pageHeroesState.heroes.add(content.pageId, content);
    #ok(());
  };

  // --- Life At Valmiki ---

  public query func getLifeAtValmikiContent() : async AdminTypes.LifeAtValmikiContent {
    lifeAtValmikiState.content;
  };

  public func updateLifeAtValmikiContent(
    token : Text,
    content : AdminTypes.LifeAtValmikiContent,
  ) : async { #ok : (); #err : Text } {
    if (AdminLib.verifyAdminToken(adminSessions, token) == false) {
      return #err("Unauthorized");
    };
    lifeAtValmikiState.content := content;
    #ok(());
  };

  // --- Free Counseling ---

  public query func getFreeCounselingContent() : async AdminTypes.FreeCounselingContent {
    freeCounselingState.content;
  };

  public func updateFreeCounselingContent(
    token : Text,
    content : AdminTypes.FreeCounselingContent,
  ) : async { #ok : (); #err : Text } {
    if (AdminLib.verifyAdminToken(adminSessions, token) == false) {
      return #err("Unauthorized");
    };
    freeCounselingState.content := content;
    #ok(());
  };

  // --- Home Sections ---

  public query func getHomeSectionsContent() : async AdminTypes.HomeSectionsContent {
    homeSectionsState.content;
  };

  public func updateHomeSectionsContent(
    token : Text,
    content : AdminTypes.HomeSectionsContent,
  ) : async { #ok : (); #err : Text } {
    if (AdminLib.verifyAdminToken(adminSessions, token) == false) {
      return #err("Unauthorized");
    };
    homeSectionsState.content := content;
    #ok(());
  };

  // --- Website Theme ---

  public query func getWebsiteTheme() : async AdminTypes.WebsiteTheme {
    websiteThemeState.theme;
  };

  public func updateWebsiteTheme(
    token : Text,
    theme : AdminTypes.WebsiteTheme,
  ) : async { #ok : (); #err : Text } {
    if (AdminLib.verifyAdminToken(adminSessions, token) == false) {
      return #err("Unauthorized");
    };
    websiteThemeState.theme := theme;
    #ok(());
  };

  // --- Footer Content ---

  public query func getFooterContent() : async AdminTypes.FooterContent {
    footerContentState.content;
  };

  public func updateFooterContent(
    token : Text,
    content : AdminTypes.FooterContent,
  ) : async { #ok : (); #err : Text } {
    if (AdminLib.verifyAdminToken(adminSessions, token) == false) {
      return #err("Unauthorized");
    };
    footerContentState.content := content;
    #ok(());
  };

  // --- Dashboard Stats ---

  public query func getAdminDashboardStats() : async AdminTypes.AdminDashboardStats {
    // Forms state is managed by FormsMixin; return session count as a proxy for active sessions
    AdminLib.getAdminDashboardStats(adminSessions, 0, 0);
  };
};
