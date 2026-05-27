import { Layout } from "@/components/Layout";
import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ContentProvider } from "@/context/ContentContext";
import About from "@/pages/About";
import BeOurPartner from "@/pages/BeOurPartner";
import Blog from "@/pages/Blog";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import Countries from "@/pages/Countries";
import CountryDetail from "@/pages/CountryDetail";
import CourseFinder from "@/pages/CourseFinder";
import EventDetail from "@/pages/EventDetail";
import FreeCounseling from "@/pages/FreeCounseling";
import Gallery from "@/pages/Gallery";
// Pages
import Home from "@/pages/Home";
import Immigration from "@/pages/Immigration";
import LifeAtValmiki from "@/pages/LifeAtValmiki";
import OurLeadership from "@/pages/OurLeadership";
import ServiceDetail from "@/pages/ServiceDetail";
import Services from "@/pages/Services";
import StudyAbroad from "@/pages/StudyAbroad";
import SuccessStories from "@/pages/SuccessStories";
import TestPrepDetail from "@/pages/TestPrepDetail";
import TestPreparation from "@/pages/TestPreparation";
import VisaChecker from "@/pages/VisaChecker";
import AdminAbout from "@/pages/admin/AdminAbout";
import AdminBeOurPartner from "@/pages/admin/AdminBeOurPartner";
import AdminBlog from "@/pages/admin/AdminBlog";
import AdminContactInfo from "@/pages/admin/AdminContactInfo";
import AdminCountries from "@/pages/admin/AdminCountries";
import AdminCountryDetail from "@/pages/admin/AdminCountryDetail";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminFooter from "@/pages/admin/AdminFooter";
import AdminFreeCounseling from "@/pages/admin/AdminFreeCounseling";
import AdminGallery from "@/pages/admin/AdminGallery";
import AdminHero from "@/pages/admin/AdminHero";
import AdminHomeSections from "@/pages/admin/AdminHomeSections";
import AdminImmigration from "@/pages/admin/AdminImmigration";
import AdminJobs from "@/pages/admin/AdminJobs";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminLeads from "@/pages/admin/AdminLeads";
import AdminLifeAtValmiki from "@/pages/admin/AdminLifeAtValmiki";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminPageHeroes from "@/pages/admin/AdminPageHeroes";
import AdminPartnerUniversities from "@/pages/admin/AdminPartnerUniversities";
import AdminServicePages from "@/pages/admin/AdminServicePages";
import AdminServices from "@/pages/admin/AdminServices";
import AdminStats from "@/pages/admin/AdminStats";
import AdminStudyAbroad from "@/pages/admin/AdminStudyAbroad";
import AdminTeam from "@/pages/admin/AdminTeam";
import AdminTestPrep from "@/pages/admin/AdminTestPrep";
import AdminTestimonials from "@/pages/admin/AdminTestimonials";
import AdminTheme from "@/pages/admin/AdminTheme";

const AdminAccommodation = lazy(
  () => import("./pages/admin/AdminAccommodation"),
);

function NotFound() {
  return (
    <Layout>
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Page not found</p>
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
          <Route
            path="/study-abroad"
            element={
              <Layout>
                <StudyAbroad />
              </Layout>
            }
          />
          <Route
            path="/countries"
            element={
              <Layout>
                <Countries />
              </Layout>
            }
          />
          <Route
            path="/countries/:countrySlug"
            element={
              <Layout>
                <CountryDetail />
              </Layout>
            }
          />
          <Route
            path="/services"
            element={
              <Layout>
                <Services />
              </Layout>
            }
          />
          <Route
            path="/test-preparation"
            element={
              <Layout>
                <TestPreparation />
              </Layout>
            }
          />
          <Route
            path="/test-preparation/:examId"
            element={
              <Layout>
                <TestPrepDetail />
              </Layout>
            }
          />
          <Route
            path="/immigration"
            element={
              <Layout>
                <Immigration />
              </Layout>
            }
          />
          <Route
            path="/success-stories"
            element={
              <Layout>
                <SuccessStories />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <Contact />
              </Layout>
            }
          />
          <Route
            path="/free-counseling"
            element={
              <Layout>
                <FreeCounseling />
              </Layout>
            }
          />
          <Route
            path="/visa-checker"
            element={
              <Layout>
                <VisaChecker />
              </Layout>
            }
          />
          <Route
            path="/course-finder"
            element={
              <Layout>
                <CourseFinder />
              </Layout>
            }
          />
          <Route
            path="/our-leadership"
            element={
              <Layout>
                <OurLeadership />
              </Layout>
            }
          />
          <Route
            path="/lifevalmiki"
            element={
              <Layout>
                <LifeAtValmiki />
              </Layout>
            }
          />
          <Route
            path="/blog"
            element={
              <Layout>
                <Blog />
              </Layout>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="hero" element={<AdminHero />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="countries" element={<AdminCountries />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="contact-info" element={<AdminContactInfo />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="test-prep" element={<AdminTestPrep />} />
            <Route path="immigration" element={<AdminImmigration />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="study-abroad" element={<AdminStudyAbroad />} />
            <Route
              path="partner-universities"
              element={<AdminPartnerUniversities />}
            />
            <Route path="country-detail" element={<AdminCountryDetail />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="life-valmiki" element={<AdminLifeAtValmiki />} />
            <Route path="free-counseling" element={<AdminFreeCounseling />} />
            <Route path="page-heroes" element={<AdminPageHeroes />} />
            <Route path="home-sections" element={<AdminHomeSections />} />
            <Route path="theme" element={<AdminTheme />} />
            <Route path="service-pages" element={<AdminServicePages />} />
            <Route path="be-our-partner" element={<AdminBeOurPartner />} />
            <Route path="footer" element={<AdminFooter />} />
            <Route path="accommodation" element={<AdminAccommodation />} />
          </Route>
          <Route
            path="/gallery"
            element={
              <Layout>
                <Gallery />
              </Layout>
            }
          />
          <Route
            path="/careers"
            element={
              <Layout>
                <Careers />
              </Layout>
            }
          />
          <Route
            path="/services/:serviceId"
            element={
              <Layout>
                <ServiceDetail />
              </Layout>
            }
          />
          <Route
            path="/events/:eventSlug"
            element={
              <Layout>
                <EventDetail />
              </Layout>
            }
          />
          <Route
            path="/be-our-partner"
            element={
              <Layout>
                <BeOurPartner />
              </Layout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ContentProvider>
    </BrowserRouter>
  );
}
