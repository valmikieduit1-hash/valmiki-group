import { useLocation } from "react-router-dom";

export function WhatsAppWidget() {
  const location = useLocation();
  // Don't show in admin paths
  if (location.pathname.startsWith("/admin")) return null;

  const message = encodeURIComponent(
    "Hi Valmiki Group, I need counseling for overseas education.",
  );
  const waUrl = `https://wa.me/919090474777?text=${message}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-float fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      data-ocid="whatsapp.float_button"
    >
      {/* WhatsApp SVG icon */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path
          d="M16 3C8.82 3 3 8.82 3 16c0 2.36.63 4.57 1.72 6.49L3 29l6.71-1.69A12.93 12.93 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm6.86 17.61c-.29.81-1.69 1.59-2.31 1.64-.59.05-1.16.27-3.9-.82-3.29-1.29-5.4-4.64-5.56-4.85-.16-.21-1.31-1.74-1.31-3.32 0-1.58.83-2.36 1.13-2.68.29-.32.63-.4.84-.4.21 0 .42.01.6.02.19.01.45-.07.71.54.26.62.88 2.16.96 2.31.08.16.13.34.03.55-.1.21-.16.34-.32.52-.16.18-.34.41-.49.55-.16.14-.32.3-.14.6.18.3.81 1.33 1.74 2.15 1.19 1.06 2.19 1.39 2.5 1.54.31.16.49.13.67-.08.18-.21.77-.9.98-1.21.21-.31.42-.26.71-.16.29.1 1.84.87 2.15 1.03.31.16.52.24.6.37.08.14.08.79-.21 1.6z"
          fill="white"
        />
      </svg>
      {/* Pulse ring */}
      <span
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping"
        aria-hidden="true"
      />
    </a>
  );
}
