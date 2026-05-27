import { createActor } from "@/backend";
import { useEvents } from "@/hooks/useBackendContent";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function getTimeLeft(dateStr: string) {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-[#0b1f3a] text-white shadow-lg">
        <span className="font-[Poppins] text-2xl sm:text-3xl font-bold">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export default function EventDetail() {
  const { eventSlug = "" } = useParams<{ eventSlug: string }>();
  const { data: events = [] } = useEvents();
  const { actor } = useActor(createActor);
  const [countdown, setCountdown] = useState(getTimeLeft(""));
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const event = events.find(
    (e) => e.id.toString() === eventSlug || toSlug(e.title) === eventSlug,
  );

  const otherEvents = events.filter((e) => e.id !== event?.id).slice(0, 3);

  useEffect(() => {
    if (!event?.date) return;
    setCountdown(getTimeLeft(event.date));
    intervalRef.current = setInterval(() => {
      setCountdown(getTimeLeft(event.date));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [event?.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSubmitting(true);
    try {
      await actor.submitContactForm(
        formData.name,
        formData.email,
        formData.phone,
        "event-registration",
        `Event Registration: ${event?.title ?? eventSlug}`,
      );
      toast.success("Registration submitted! We'll confirm your spot shortly.");
      setFormData({ name: "", email: "", phone: "" });
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!event && events.length > 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-[Poppins] text-3xl font-bold text-[#0b1f3a]">
          Event Not Found
        </h1>
        <p className="text-muted-foreground">
          This event doesn't exist or may have ended.
        </p>
        <Link
          to="/"
          className="rounded-full bg-[#ff8a00] px-6 py-3 font-[Poppins] font-bold text-white shadow-lg hover:bg-orange-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const displayEvent = event ?? {
    id: 0n,
    title: "Loading Event...",
    date: "",
    description: "",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop",
    location: "",
    registrationLink: "",
    isActive: true,
  };

  return (
    <div data-ocid="event_detail.page">
      {/* Hero */}
      <section
        className="relative min-h-[400px] flex items-end overflow-hidden"
        style={{
          backgroundImage: `url(${displayEvent.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a] via-[#0b1f3a]/60 to-transparent" />
        <div className="relative container mx-auto px-4 pb-14 pt-24">
          <nav className="mb-4 flex items-center gap-2 text-sm text-white/60">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/" className="hover:text-white transition-colors">
              Events
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/90">{displayEvent.title}</span>
          </nav>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-[Poppins] text-4xl font-bold text-white sm:text-5xl max-w-3xl"
          >
            {displayEvent.title}
          </motion.h1>
          <div className="mt-4 flex flex-wrap gap-3">
            {displayEvent.date && (
              <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm text-white text-sm">
                <Calendar className="h-4 w-4 text-[#ffc247]" />
                {displayEvent.date}
              </div>
            )}
            {displayEvent.location && (
              <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm text-white text-sm">
                <MapPin className="h-4 w-4 text-[#ff8a00]" />
                {displayEvent.location}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Countdown */}
      {event?.date && (
        <section
          className="bg-[#0b1f3a] py-10"
          data-ocid="event_detail.countdown.section"
        >
          <div className="container mx-auto px-4 text-center">
            <p className="font-[Poppins] text-white/60 mb-6 text-sm uppercase tracking-wider">
              Event Starts In
            </p>
            <div className="flex items-center justify-center gap-4 sm:gap-8">
              <CountdownUnit value={countdown.days} label="Days" />
              <span className="font-bold text-2xl text-white/40 mb-4">:</span>
              <CountdownUnit value={countdown.hours} label="Hours" />
              <span className="font-bold text-2xl text-white/40 mb-4">:</span>
              <CountdownUnit value={countdown.minutes} label="Minutes" />
              <span className="font-bold text-2xl text-white/40 mb-4">:</span>
              <CountdownUnit value={countdown.seconds} label="Seconds" />
            </div>
          </div>
        </section>
      )}

      {/* Details + Registration */}
      <section className="bg-background py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
            {/* Left: Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-[Poppins] text-2xl font-bold text-[#0b1f3a] mb-5">
                About This Event
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-wrap">
                {displayEvent.description}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {displayEvent.date && (
                  <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4">
                    <Calendar className="h-6 w-6 text-[#ff8a00]" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Date
                      </p>
                      <p className="font-semibold text-[#0b1f3a]">
                        {displayEvent.date}
                      </p>
                    </div>
                  </div>
                )}
                {displayEvent.location && (
                  <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4">
                    <MapPin className="h-6 w-6 text-[#ff8a00]" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Location
                      </p>
                      <p className="font-semibold text-[#0b1f3a]">
                        {displayEvent.location}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right: Registration Card */}
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-7 shadow-lg"
              >
                <h3 className="font-[Poppins] text-xl font-bold text-[#0b1f3a] mb-2">
                  Register Now
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Secure your spot for this event
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="evt-name"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="evt-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
                        placeholder="Your full name"
                        data-ocid="event_detail.register.name_input"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="evt-email"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="evt-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
                      placeholder="your@email.com"
                      data-ocid="event_detail.register.email_input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="evt-phone"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="evt-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
                        placeholder="+91 XXXXX XXXXX"
                        data-ocid="event_detail.register.phone_input"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-[#ff8a00] py-3.5 font-[Poppins] font-bold text-white shadow-lg hover:bg-orange-600 transition-all disabled:opacity-60"
                    data-ocid="event_detail.register.submit_button"
                  >
                    {submitting ? "Registering..." : "Register for This Event"}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      {otherEvents.length > 0 && (
        <section
          className="bg-muted/30 py-16"
          data-ocid="event_detail.related.section"
        >
          <div className="container mx-auto px-4">
            <h2 className="font-[Poppins] text-2xl font-bold text-[#0b1f3a] mb-8">
              Other Upcoming Events
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherEvents.map((e, i) => (
                <motion.div
                  key={String(e.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm hover:-translate-y-1 transition-all"
                  data-ocid={`event_detail.related.item.${i + 1}`}
                >
                  {e.imageUrl && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={e.imageUrl}
                        alt={e.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-[Poppins] font-semibold text-[#0b1f3a] mb-2 line-clamp-2">
                      {e.title}
                    </h3>
                    {e.date && (
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                        <Calendar className="h-3.5 w-3.5" />
                        {e.date}
                      </p>
                    )}
                    <Link
                      to={`/events/${toSlug(e.title)}`}
                      className="text-sm font-semibold text-[#ff8a00] hover:text-orange-700 transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
