# Design Brief: Valmiki Group

**Brand**: Education consultancy delivering premium, global opportunities with trust and professional expertise.

| Category | Value |
|---|---|
| Tone | Premium, professional, trustworthy, globally minded |
| Differentiation | Clean modern UI, smooth animations, glassmorphism, 3D interactivity |

## Color Palette

| Color | Hex | Usage |
|---|---|---|
| Primary (Navy) | #0B1F3A | Headlines, CTAs, primary buttons, sidebar active states |
| Secondary (Orange) | #FF8A00 | Accent highlights, hover states, secondary CTAs |
| Tertiary (Gold) | #FFC247 | Badges, highlights, success states, accents |
| Text (Charcoal) | #333333 | Body text, default text color |
| Background (Light Gray) | #F5F5F5 | Page background, card backgrounds |
| White | #FFFFFF | Card surfaces, overlay backgrounds |

## Typography

| Element | Font | Weight | Usage |
|---|---|---|---|
| Headings (h1–h6) | Poppins | 600, 700, 800 | Page titles, section headers |
| Hero/Display | Sora | 600, 700, 800 | Hero section, large display text |
| Body Text | Inter | 300, 400, 500, 600 | Paragraphs, labels, form fields |
| Mono | System | 400 | Code blocks, technical content |

## Elevation & Depth

- **glass-card**: Glassmorphism with 0.7 opacity, 16px backdrop blur, subtle border
- **shadow-3d**: Layered subtle shadows for depth (0–32px range)
- **shadow-subtle**: Light touch shadow for small components
- **gradient-gold**: Navy-to-Orange gradient for premium accents
- **gradient-primary**: Navy gradient for backgrounds

## Structural Zones

| Zone | Description |
|---|---|
| Hero | Full-width hero with 3D globe, animated counters, twin CTAs |
| Content | Card-based grid layout with 1–3 columns (mobile-first) |
| Forms | Glassmorphic input fields with Navy focus states, Orange accents |
| Navigation | Sticky mega menu, admin sidebar with glassmorphism |
| Footer | Dark footer with Gold highlights, branch contact cards |

## Spacing & Rhythm

- Base unit: 0.625rem (10px)
- Border radius: 0.75rem (12px) standard, 0.625rem alternate
- Padding: 1rem / 1.5rem / 2rem / 3rem increments
- Gap: 1rem for grids, 0.5rem for inline components

## Component Patterns

- **Buttons**: Navy background, Gold/Orange on hover, white text, rounded corners
- **Cards**: White background with subtle shadow, hover lift effect
- **Forms**: Inter body font, Navy focus borders, Orange validation states
- **Modals**: Glassmorphic backdrop, Navy header, soft shadows
- **Navbars**: Sticky, transparent with blur, Navy text, Orange active links

## Motion

- **Transitions**: 0.3s cubic-bezier(0.4, 0, 0.2, 1) for smooth interactions
- **Hover**: Lift effect on cards (+4px), color shift on buttons
- **Scroll**: Fade-in animations for sections, parallax on hero
- **Load**: Staggered card reveals, counter animations

## Constraints

- No OKLCH color functions — use hex only
- No GeneralSans or Figtree fonts — use Poppins/Sora/Inter exclusively
- Keep glassmorphism subtle (0.7 opacity, 16px blur) to maintain readability
- Mobile-first responsive: sm (640px), md (768px), lg (1024px), xl (1280px)

## Signature Detail

- Animated 3D globe in hero with country click navigation
- Glassmorphic admin panel with Navy sidebar, Gold accents
- Floating WhatsApp button with pulsing animation
- Animated counters and stat cards in hero section
- Smooth page transitions with fade and slide effects
