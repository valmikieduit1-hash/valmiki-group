import { type GalleryEntry, createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, GraduationCap, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const COUNTRIES = [
  "All",
  "USA",
  "Canada",
  "UK",
  "Australia",
  "Germany",
  "Ireland",
  "New Zealand",
  "Dubai",
  "Singapore",
  "Europe",
];

function useVisibleGallery() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<GalleryEntry[]>({
    queryKey: ["visibleGallery"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVisibleGalleryEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

function GalleryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="h-52 w-full" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

function GalleryCard({ entry }: { entry: GalleryEntry }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      data-ocid="gallery.card"
    >
      {/* Photo */}
      <div className="relative h-52 overflow-hidden bg-muted">
        {entry.imageUrl && !imgError ? (
          <img
            src={entry.imageUrl}
            alt={`${entry.studentName} visa approval`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <GraduationCap className="h-16 w-16 text-muted-foreground/20" />
          </div>
        )}
        {/* Gold badge */}
        <div className="absolute right-3 top-3">
          <Badge className="flex items-center gap-1 bg-[#FFC247] text-[#0B1F3A] font-semibold shadow-sm">
            <CheckCircle2 className="h-3 w-3" />
            {entry.visaStatus || "Approved"}
          </Badge>
        </div>
      </div>
      {/* Info */}
      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-foreground line-clamp-1">
          {entry.studentName}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-[#FF8A00]" />
          <span className="truncate">{entry.destinationCountry}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <GraduationCap className="h-3.5 w-3.5 text-[#0B1F3A]" />
          <span className="line-clamp-1">{entry.universityAdmitted}</span>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCountry = searchParams.get("country") ?? "All";
  const { data: entries = [], isLoading } = useVisibleGallery();

  const filtered =
    activeCountry === "All"
      ? entries
      : entries.filter((e) => e.destinationCountry === activeCountry);

  const sortedFiltered = [...filtered].sort(
    (a, b) => Number(a.order) - Number(b.order),
  );

  const handleCountryFilter = (country: string) => {
    if (country === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ country });
    }
  };

  useEffect(() => {
    document.title = "Visa Success Gallery | Valmiki Group";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[#0B1F3A] py-16 text-center">
        <div className="container mx-auto px-4">
          <Badge className="mb-4 bg-[#FFC247]/20 text-[#FFC247] border-[#FFC247]/30">
            Student Success
          </Badge>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            Visa Success Gallery
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Celebrating our students who made their international education
            dreams a reality with Valmiki Group's guidance.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/60">
            <span className="font-semibold text-[#FFC247] text-2xl">
              {entries.length}+
            </span>
            <span>Successful Visa Approvals</span>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-[72px] z-20 border-b border-border bg-card/80 backdrop-blur-xl lg:top-[88px]">
        <div className="container mx-auto overflow-x-auto px-4 py-3">
          <div className="flex gap-2" data-ocid="gallery.country_filter">
            {COUNTRIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleCountryFilter(c)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeCountry === c
                    ? "bg-[#0B1F3A] text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
                data-ocid={`gallery.filter.${c.toLowerCase().replace(/\s+/g, "_")}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => i).map((i) => (
              <GalleryCardSkeleton key={`skel-${i}`} />
            ))}
          </div>
        ) : sortedFiltered.length === 0 ? (
          <div
            className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center"
            data-ocid="gallery.empty_state"
          >
            <GraduationCap className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">
              {activeCountry === "All"
                ? "No success stories yet — check back soon!"
                : `No entries found for ${activeCountry} yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {sortedFiltered.map((entry, i) => (
              <div key={String(entry.id)} data-ocid={`gallery.item.${i + 1}`}>
                <GalleryCard entry={entry} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
