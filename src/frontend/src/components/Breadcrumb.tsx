import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const routeLabels: Record<string, string> = {
  "": "Home",
  about: "About Us",
  "study-abroad": "Study Abroad",
  countries: "Countries",
  services: "Services",
  "test-preparation": "Test Preparation",
  immigration: "Immigration",
  "success-stories": "Success Stories",
  contact: "Contact Us",
  "free-counseling": "Free Counseling",
  "visa-checker": "Visa Eligibility Checker",
  "course-finder": "Course Finder",
  usa: "USA",
  canada: "Canada",
  uk: "UK",
  australia: "Australia",
  germany: "Germany",
  ireland: "Ireland",
  "new-zealand": "New Zealand",
  dubai: "Dubai",
  singapore: "Singapore",
  europe: "Europe",
};

export function Breadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full border-b border-border/50 bg-muted/30 py-3"
      data-ocid="breadcrumb"
    >
      <div className="container mx-auto px-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link
              to="/"
              className="flex items-center gap-1 transition-colors hover:text-primary"
              data-ocid="breadcrumb.home_link"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const label = routeLabels[segment] ?? segment;
            const href = `/${segments.slice(0, index + 1).join("/")}`;

            return (
              <li key={segment} className="flex items-center gap-1.5">
                <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                {isLast ? (
                  <span
                    className="font-medium text-foreground"
                    aria-current="page"
                    data-ocid={`breadcrumb.item.${index}`}
                  >
                    {label}
                  </span>
                ) : (
                  <Link
                    to={href}
                    className="transition-colors hover:text-primary"
                    data-ocid={`breadcrumb.link.${index}`}
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
