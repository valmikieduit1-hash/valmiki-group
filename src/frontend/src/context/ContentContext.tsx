import type { HeroContent, HomeSectionsContent, WebsiteTheme } from "@/backend";
import type { FooterContent } from "@/hooks/useBackendContent";
import { useGlobalContent } from "@/hooks/useBackendContent";
import { createContext, useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface ContentContextValue {
  isLoading: boolean;
  heroContent: HeroContent | undefined;
  countriesMap: Record<
    string,
    {
      slug: string;
      flagImage: string;
      heroImage: string;
      visaSuccessRate: string;
    }
  >;
  footerContent: FooterContent | undefined;
  websiteTheme: WebsiteTheme | undefined;
  homeSections: HomeSectionsContent | undefined;
  invalidateAll: () => void;
}

const ContentContext = createContext<ContentContextValue>({
  isLoading: false,
  heroContent: undefined,
  countriesMap: {},
  footerContent: undefined,
  websiteTheme: undefined,
  homeSections: undefined,
  invalidateAll: () => {},
});

interface ContentProviderProps {
  children: ReactNode;
}

export function ContentProvider({ children }: ContentProviderProps) {
  const {
    isLoading,
    heroContent,
    countriesMap,
    footerContent,
    websiteTheme,
    homeSections,
    refetchAll,
  } = useGlobalContent();

  // Apply website theme CSS variables whenever theme changes
  useEffect(() => {
    if (!websiteTheme) return;
    const root = document.documentElement;
    if (websiteTheme.primaryColor) {
      root.style.setProperty("--theme-primary", websiteTheme.primaryColor);
    }
    if (websiteTheme.secondaryColor) {
      root.style.setProperty("--theme-secondary", websiteTheme.secondaryColor);
    }
    if (websiteTheme.accentColor) {
      root.style.setProperty("--theme-accent", websiteTheme.accentColor);
    }
    if (websiteTheme.buttonColor) {
      root.style.setProperty("--theme-button", websiteTheme.buttonColor);
    }
    if (websiteTheme.buttonTextColor) {
      root.style.setProperty(
        "--theme-button-text",
        websiteTheme.buttonTextColor,
      );
    }
    if (websiteTheme.headingTextColor) {
      root.style.setProperty("--theme-heading", websiteTheme.headingTextColor);
    }
    if (websiteTheme.bodyTextColor) {
      root.style.setProperty("--theme-body", websiteTheme.bodyTextColor);
    }
    if (websiteTheme.backgroundColor) {
      root.style.setProperty("--theme-bg", websiteTheme.backgroundColor);
    }
    if (websiteTheme.footerBgColor) {
      root.style.setProperty("--theme-footer-bg", websiteTheme.footerBgColor);
    }
    if (websiteTheme.footerTextColor) {
      root.style.setProperty(
        "--theme-footer-text",
        websiteTheme.footerTextColor,
      );
    }
  }, [websiteTheme]);

  return (
    <ContentContext.Provider
      value={{
        isLoading,
        heroContent,
        countriesMap,
        footerContent,
        websiteTheme,
        homeSections,
        invalidateAll: refetchAll,
      }}
    >
      {/* 2px top progress bar shown while backend data is loading */}
      {isLoading && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            zIndex: 9999,
            background:
              "linear-gradient(90deg, var(--theme-primary, #1e3a5f) 0%, var(--theme-accent, #f97316) 60%, var(--theme-primary, #1e3a5f) 100%)",
            backgroundSize: "200% 100%",
            animation: "content-progress 1.4s linear infinite",
          }}
        />
      )}
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentContextValue {
  return useContext(ContentContext);
}
