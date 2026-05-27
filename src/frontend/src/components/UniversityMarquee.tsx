import { useEffect, useRef } from "react";

const universities = [
  "Harvard University",
  "MIT",
  "Stanford University",
  "University of Toronto",
  "University of Oxford",
  "University of Cambridge",
  "University of Melbourne",
  "Technical University of Munich",
  "Trinity College Dublin",
  "University of Auckland",
  "National University of Singapore",
  "University of Birmingham",
  "Imperial College London",
  "University of British Columbia",
  "ETH Zurich",
  "University of Edinburgh",
  "Monash University",
  "University of Waterloo",
];

export default function UniversityMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let animationId: number;
    let position = 0;
    const speed = 0.5;

    const animate = () => {
      position -= speed;
      const firstChild = marquee.firstElementChild as HTMLElement;
      if (firstChild && Math.abs(position) >= firstChild.offsetWidth / 2) {
        position = 0;
      }
      marquee.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative overflow-hidden py-8">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      <div ref={marqueeRef} className="flex gap-6 whitespace-nowrap">
        {universities.map((uni) => (
          <div
            key={`first-${uni}`}
            className="inline-flex items-center rounded-full border border-border/50 bg-card px-6 py-3 text-sm font-medium text-muted-foreground shadow-subtle transition-all hover:border-primary/30 hover:text-primary"
          >
            <span className="mr-2 text-accent">★</span>
            {uni}
          </div>
        ))}
        {universities.map((uni) => (
          <div
            key={`second-${uni}`}
            className="inline-flex items-center rounded-full border border-border/50 bg-card px-6 py-3 text-sm font-medium text-muted-foreground shadow-subtle transition-all hover:border-primary/30 hover:text-primary"
          >
            <span className="mr-2 text-accent">★</span>
            {uni}
          </div>
        ))}
      </div>
    </div>
  );
}
