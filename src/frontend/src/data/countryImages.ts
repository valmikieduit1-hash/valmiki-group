/**
 * Local cinematic country images — uploaded by admin.
 * Keyed by both the page slug (e.g. "new-zealand") and the admin short-code (e.g. "nz")
 * so any lookup by either key resolves the same image.
 */
const USA_IMG =
  "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1280&q=85";
const UK_IMG =
  "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1280&q=85";
const CANADA_IMG =
  "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1280&q=85";
const AUSTRALIA_IMG =
  "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1280&q=85";
const GERMANY_IMG =
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1280&q=85";
const IRELAND_IMG =
  "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1280&q=85";
const DUBAI_IMG =
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1280&q=85";
const SINGAPORE_IMG =
  "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1280&q=85";
const FRANCE_IMG =
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1280&q=85";
const NZ_IMG =
  "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1280&q=85";

export const COUNTRY_IMAGES: Record<string, string> = {
  // Full page slugs
  usa: USA_IMG,
  uk: UK_IMG,
  canada: CANADA_IMG,
  australia: AUSTRALIA_IMG,
  germany: GERMANY_IMG,
  ireland: IRELAND_IMG,
  dubai: DUBAI_IMG,
  singapore: SINGAPORE_IMG,
  europe: FRANCE_IMG,
  france: FRANCE_IMG,
  "new-zealand": NZ_IMG,
  newzealand: NZ_IMG,
  // Admin short-code aliases
  us: USA_IMG,
  gb: UK_IMG,
  ca: CANADA_IMG,
  au: AUSTRALIA_IMG,
  de: GERMANY_IMG,
  ie: IRELAND_IMG,
  ae: DUBAI_IMG,
  sg: SINGAPORE_IMG,
  eu: FRANCE_IMG,
  fr: FRANCE_IMG,
  nz: NZ_IMG,
};
