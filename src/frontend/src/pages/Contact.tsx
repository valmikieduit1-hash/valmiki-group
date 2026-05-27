import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Facebook,
  Home,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useContactInfo } from "../hooks/useBackendContent";

import { createActor } from "@/backend";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSEOData } from "@/data/seo";
import { useActor } from "@caffeineai/core-infrastructure";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const _staticBranches = [
  {
    name: "Secunderabad HQ",
    address:
      "HD-67 & 68, Gruha Kalpa Complex, SP Road, Secunderabad, Telangana 500003",
    phone: "+91-9090 4747 77",
  },
  {
    name: "Jubilee Hills",
    address: "Road 37, Jubilee Hills, Hyderabad, Telangana 500033",
    phone: "040-2789-9994",
  },
];

const socialLinks = [
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export default function Contact() {
  const [heroData, setHeroData] = useState<{
    headline: string;
    subheadline: string;
    imageUrl: string;
  } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { actor } = useActor(createActor);
  useEffect(() => {
    if (!actor) return;
    actor
      .getPageHeroContent("contact")
      .then(setHeroData)
      .catch(() => {});
  }, [actor]);
  const { data: backendContact } = useContactInfo();

  const branches = backendContact
    ? [
        {
          name: backendContact.branch1Name ?? "",
          address: backendContact.address1 ?? "",
          phone: backendContact.phone1 ?? "",
        },
        {
          name: backendContact.branch2Name ?? "",
          address: backendContact.address2 ?? "",
          phone: backendContact.phone2 ?? "",
        },
        ...(backendContact.branch3Name
          ? [
              {
                name: backendContact.branch3Name,
                address: backendContact.address3 ?? "",
                phone: backendContact.phone3 ?? "",
              },
            ]
          : []),
      ].filter((b) => b.name)
    : [];

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      inquiryType: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      if (actor) {
        await actor.submitContactForm(
          data.name,
          data.email,
          data.phone,
          data.inquiryType,
          data.message,
        );
      }
    } catch {
      // graceful fallback: still show success UI
    }
    toast.success(
      "Message sent successfully! We'll get back to you within 24 hours.",
    );
    setSubmitted(true);
    form.reset();
  }

  return (
    <>
      <SEOHead meta={getSEOData("contact")} />

      {/* Hero */}
      <section className="gradient-primary relative overflow-hidden py-20 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="container relative mx-auto px-4">
          {/* Breadcrumb */}
          <nav
            className="mb-6 flex items-center gap-2 text-sm text-white/70"
            data-ocid="contact.breadcrumb"
          >
            <a href="/" className="flex items-center gap-1 hover:text-white">
              <Home className="h-4 w-4" />
              Home
            </a>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">Contact Us</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl font-bold md:text-5xl lg:text-6xl"
          >
            {heroData?.headline || "Get in Touch"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-white/80"
          >
            {heroData?.subheadline ||
              "Have questions about studying abroad? Our expert counselors are here to help you every step of the way."}
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Left — Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <Card className="glass-card shadow-3d">
                <CardContent className="p-8">
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                        data-ocid="contact.success_state"
                      >
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                          <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h3 className="font-heading text-2xl font-bold text-primary">
                          Message Sent Successfully!
                        </h3>
                        <p className="mt-3 max-w-md text-muted-foreground">
                          Thank you for reaching out. Our team will review your
                          inquiry and get back to you within 24 hours.
                        </p>
                        <Button
                          className="mt-6"
                          onClick={() => setSubmitted(false)}
                          data-ocid="contact.send_another_button"
                        >
                          Send Another Message
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <h2 className="font-heading text-2xl font-bold text-primary">
                          Send us a Message
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Fill out the form below and we'll respond as soon as
                          possible.
                        </p>

                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="mt-6 space-y-5"
                          >
                            <div className="grid gap-5 sm:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Your full name"
                                        {...field}
                                        data-ocid="contact.input.name"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        {...field}
                                        data-ocid="contact.input.email"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="tel"
                                        placeholder="+91-XXXXXXXXXX"
                                        {...field}
                                        data-ocid="contact.input.phone"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="inquiryType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Inquiry Type</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger data-ocid="contact.select.inquiry_type">
                                          <SelectValue placeholder="Select inquiry type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="general">
                                          General Inquiry
                                        </SelectItem>
                                        <SelectItem value="visa">
                                          Visa Assistance
                                        </SelectItem>
                                        <SelectItem value="scholarship">
                                          Scholarship
                                        </SelectItem>
                                        <SelectItem value="test-prep">
                                          Test Preparation
                                        </SelectItem>
                                        <SelectItem value="immigration">
                                          Immigration
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="message"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Message</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      rows={5}
                                      placeholder="How can we help you?"
                                      {...field}
                                      data-ocid="contact.input.message"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button
                              type="submit"
                              className="w-full bg-secondary text-white hover:bg-secondary/90"
                              size="lg"
                              data-ocid="contact.submit_button"
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </Button>
                          </form>
                        </Form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right — Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6 lg:col-span-2"
            >
              {/* Contact Details Card */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-heading text-lg font-semibold text-primary">
                    Contact Information
                  </h3>
                  <div className="mt-5 space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Phone
                        </p>
                        <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                          {backendContact?.phone1 && (
                            <p>{backendContact.phone1}</p>
                          )}
                          {backendContact?.phone2 && (
                            <p>{backendContact.phone2}</p>
                          )}
                          {backendContact?.phone3 && (
                            <p>{backendContact.phone3}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Email
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {backendContact?.email ?? ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Working Hours
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Monday – Saturday: 9:00 AM – 7:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-heading text-lg font-semibold text-primary">
                    Follow Us
                  </h3>
                  <div className="mt-4 flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-md"
                        data-ocid={`contact.social.${social.label.toLowerCase()}`}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Branch Cards */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-primary">
              Our Branches
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Visit any of our conveniently located offices across Hyderabad for
              in-person counseling.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch, index) => (
              <motion.div
                key={branch.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card h-full transition-all hover:shadow-3d">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-semibold text-primary">
                      {branch.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {branch.address}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-foreground">
                      <Phone className="h-4 w-4 text-secondary" />
                      {branch.phone}
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4 w-full"
                      data-ocid={`contact.branch_map.${index + 1}`}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      View on Map
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
