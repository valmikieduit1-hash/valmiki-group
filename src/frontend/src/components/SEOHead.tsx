import type { SEOMeta } from "@/types";
import { useEffect } from "react";

interface SEOHeadProps {
  meta: SEOMeta;
}

export function SEOHead({ meta }: SEOHeadProps) {
  useEffect(() => {
    document.title = meta.title;

    const setMeta = (name: string, content: string, property = false) => {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        if (property) {
          el.setAttribute("property", name);
        } else {
          el.setAttribute("name", name);
        }
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", meta.description);
    setMeta("keywords", meta.keywords.join(", "));
    setMeta("og:title", meta.title, true);
    setMeta("og:description", meta.description, true);
    setMeta("og:type", "website", true);
    if (meta.ogImage) {
      setMeta("og:image", meta.ogImage, true);
    }
    setMeta("twitter:card", "summary_large_image");

    return () => {
      // Cleanup is optional; new pages will overwrite
    };
  }, [meta]);

  return null;
}
