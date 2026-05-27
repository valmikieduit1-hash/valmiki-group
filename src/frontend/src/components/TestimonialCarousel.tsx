import { BadgeCheck, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Testimonial {
  id: string;
  studentName: string;
  country: string;
  university: string;
  course: string;
  quote: string;
  visaSuccess: boolean;
  rating: number;
  youtubeUrl?: string;
}

interface BackendTestimonial {
  id: bigint;
  country: string;
  name: string;
  text: string;
  university: string;
  imageUrl: string;
  isVisible: boolean;
  rating: bigint;
  course: string;
  youtubeUrl?: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    studentName: "Rahul Sharma",
    country: "USA",
    university: "Northeastern University",
    course: "MS in Computer Science",
    quote:
      "Valmiki Group made my dream of studying in the USA a reality. Their counselors guided me through every step — from university shortlisting to visa approval. I couldn't have done it without them!",
    visaSuccess: true,
    rating: 5,
  },
  {
    id: "2",
    studentName: "Priya Patel",
    country: "Canada",
    university: "University of Toronto",
    course: "MBA",
    quote:
      "The team at Valmiki was incredibly supportive. They helped me secure a scholarship and prepared me thoroughly for my visa interview. I'm now pursuing my MBA at one of Canada's top universities.",
    visaSuccess: true,
    rating: 5,
  },
  {
    id: "3",
    studentName: "Arjun Reddy",
    country: "UK",
    university: "University of Manchester",
    course: "MSc Data Science",
    quote:
      "From IELTS coaching to application submission, Valmiki provided end-to-end support. Their expertise in UK admissions helped me get into my dream university with a partial scholarship.",
    visaSuccess: true,
    rating: 5,
  },
  {
    id: "4",
    studentName: "Sneha Gupta",
    country: "Australia",
    university: "University of Melbourne",
    course: "Master of Public Health",
    quote:
      "I was confused about which country to choose, but Valmiki's career counseling session cleared everything. They matched my profile perfectly with the University of Melbourne. Highly recommended!",
    visaSuccess: true,
    rating: 5,
  },
];

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

interface TestimonialCarouselProps {
  items?: BackendTestimonial[];
}

export default function TestimonialCarousel({
  items,
}: TestimonialCarouselProps) {
  const mappedItems = useMemo<Testimonial[]>(() => {
    return items && items.length > 0
      ? items.map((t) => ({
          id: String(t.id),
          studentName: t.name,
          country: t.country,
          university: t.university,
          course: t.course,
          quote: t.text,
          visaSuccess: true,
          rating: Number(t.rating),
          youtubeUrl: t.youtubeUrl,
        }))
      : testimonials;
  }, [items]);

  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(1);
  const [activeTab, setActiveTab] = useState<"text" | "video">("text");

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1024) setVisibleCount(3);
      else if (window.innerWidth >= 768) setVisibleCount(2);
      else setVisibleCount(1);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const pages = useMemo(
    () => chunk(mappedItems, visibleCount),
    [mappedItems, visibleCount],
  );
  const totalPages = pages.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset page when grid size or data changes
  useEffect(() => {
    setCurrentPage(0);
  }, [visibleCount, mappedItems.length]);

  const goToPage = useCallback(
    (page: number) => {
      setDirection(page > currentPage ? 1 : -1);
      setCurrentPage(page);
    },
    [currentPage],
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (!isAutoPlaying || totalPages <= 1) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next, totalPages]);

  const currentItems = pages[currentPage] ?? [];
  const hasVideoTestimonials = mappedItems.some((t) => t.youtubeUrl);

  useEffect(() => {
    if (activeTab === "video" && !hasVideoTestimonials) {
      setActiveTab("text");
    }
  }, [activeTab, hasVideoTestimonials]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full">
      {hasVideoTestimonials && (
        <div className="mb-6 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              activeTab === "text"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            data-ocid="testimonial.tab.text"
          >
            Text Reviews
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              activeTab === "video"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            data-ocid="testimonial.tab.video"
          >
            Video Testimonials
          </button>
        </div>
      )}

      {activeTab === "text" && (
        <div
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentPage}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch"
              >
                {currentItems.map((t, idx) => (
                  <div
                    key={t.id}
                    className="flex h-full flex-col rounded-2xl border border-white/20 bg-white p-6 shadow-lg"
                    data-ocid={`testimonial.item.${currentPage * visibleCount + idx + 1}`}
                  >
                    <Quote className="mb-3 h-7 w-7 flex-shrink-0 text-[#FFC247]" />
                    <p className="mb-5 flex-1 text-sm leading-relaxed text-foreground/80">
                      "{t.quote}"
                    </p>
                    <div className="mb-4 flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={`star-${n}`}
                          className={
                            n <= t.rating ? "text-[#FFC247]" : "text-border"
                          }
                          aria-hidden="true"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#0B1F3A] text-base font-bold text-white">
                        {t.studentName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-semibold text-[#0B1F3A]">
                            {t.studentName}
                          </span>
                          {t.visaSuccess && (
                            <BadgeCheck
                              className="h-4 w-4 flex-shrink-0 text-green-500"
                              aria-label="Visa approved"
                            />
                          )}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {t.course}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {t.university}
                        </div>
                      </div>
                      <span className="ml-auto flex-shrink-0 rounded-full bg-[#FF8A00] px-2.5 py-0.5 text-xs font-semibold text-white">
                        {t.country}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={prev}
                disabled={currentPage === 0}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-primary hover:text-white disabled:opacity-40"
                aria-label="Previous testimonials"
                data-ocid="testimonial.prev_button"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i).map((i) => (
                  <button
                    type="button"
                    key={`page-${i}`}
                    onClick={() => goToPage(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === currentPage
                        ? "w-8 bg-primary"
                        : "w-2.5 bg-border hover:bg-muted-foreground"
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                    data-ocid={`testimonial.dot.${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                disabled={currentPage >= totalPages - 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-primary hover:text-white disabled:opacity-40"
                aria-label="Next testimonials"
                data-ocid="testimonial.next_button"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "video" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mappedItems
            .filter((t) => t.youtubeUrl)
            .map((t, idx) => {
              const videoId = extractYouTubeId(t.youtubeUrl!);
              return (
                <div
                  key={`video-${t.id}`}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
                  data-ocid={`testimonial.video.item.${idx + 1}`}
                >
                  <div className="aspect-video w-full bg-black">
                    {videoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={`${t.studentName} testimonial`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        Invalid YouTube URL
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0B1F3A] text-sm font-bold text-white">
                        {t.studentName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-foreground">
                          {t.studentName}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {t.course}
                        </div>
                      </div>
                      <span className="flex-shrink-0 rounded-full bg-[#FF8A00] px-2.5 py-0.5 text-xs font-semibold text-white">
                        {t.country}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          {mappedItems.filter((t) => t.youtubeUrl).length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
              <p className="text-lg font-semibold text-foreground">
                No video testimonials yet
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Video testimonials will appear here once added from the admin
                panel.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
