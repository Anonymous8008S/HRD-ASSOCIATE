import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useState } from "react";
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  Building2,
  Package,
  Phone,
  Mail,
  User,
  CheckCircle2,
  ArrowRight,
  Shield,
  Star,
  Boxes,
} from "lucide-react";
import usePackersStore from "@/stores/usePackersStore";
import type { PackersMoversForm } from "@/types";

const features = [
  {
    icon: Shield,
    title: "Insured Moves",
    desc: "All your belongings are fully insured during transit for complete peace of mind.",
  },
  {
    icon: Truck,
    title: "Modern Fleet",
    desc: "GPS-tracked vehicles of all sizes to suit apartment moves or full house relocations.",
  },
  {
    icon: Star,
    title: "Trained Crew",
    desc: "Professional packers skilled in handling fragile, heavy, and high-value items.",
  },
  {
    icon: Boxes,
    title: "Premium Packing",
    desc: "High-quality packing materials to keep every item safe from door to door.",
  },
];

const steps = [
  { num: "01", title: "Fill the Form", desc: "Share your move details including locations, date, and load estimate." },
  { num: "02", title: "Get a Quote", desc: "Our team reviews your request and calls you with a transparent quote." },
  { num: "03", title: "Confirm & Pack", desc: "Schedule confirmed — our crew arrives and packs everything carefully." },
  { num: "04", title: "Safe Delivery", desc: "Items delivered and placed exactly where you want them at the destination." },
];

const emptyForm: PackersMoversForm = {
  name: "",
  phone: "",
  email: "",
  from: "",
  destination: "",
  date: "",
  time: "",
  floors: "",
  weight: "",
};

const PackersMovers = () => {
  const { addBooking, loading, error } = usePackersStore();

  const [form, setForm] = useState<PackersMoversForm>(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBooking(form);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm(emptyForm);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 bg-navy-gradient">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-6">
            <Truck className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm font-medium">Reliable Relocation Services</span>
          </div>
          <h1
            className="font-heading text-4xl md:text-5xl font-bold text-gold mb-4"
            style={{ lineHeight: "1.1" }}
          >
            Packers &amp; Movers
          </h1>
          <p className="text-gold-light/60 max-w-lg mx-auto">
            Stress-free home and office relocation across Northeast India. Trusted by 500+ families
            to move what matters most.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-4">
              Why Move With Us
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
              End-to-end relocation handled with care and professionalism
            </p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="text-center p-6">
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <f.icon className="w-6 h-6 text-gold-dark" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-4">
              How It Works
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
              Four simple steps to a seamless move
            </p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((s, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="bg-card p-6 rounded-lg border border-border/50 shadow-sm relative">
                  <span className="font-heading text-4xl font-bold text-gold/20 absolute top-4 right-4">
                    {s.num}
                  </span>
                  <p className="font-heading text-xs font-bold text-gold uppercase tracking-widest mb-2">
                    Step {s.num}
                  </p>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                  {i < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block w-5 h-5 text-gold/30 absolute -right-3 top-1/2 -translate-y-1/2 z-10" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-4">
              Book Your Move
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
              Fill in the details below and our team will get back to you shortly
            </p>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto">
            <ScrollReveal delay={80}>
              {submitted ? (
                <div className="bg-card border border-gold/30 rounded-xl p-12 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-gold-dark" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-3">
                    Request Received!
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Thank you, <span className="text-foreground font-medium">{form.name}</span>. Our
                    team will call you at{" "}
                    <span className="text-foreground font-medium">{form.phone}</span> to confirm
                    your booking and share a quote.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-8 inline-flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold-dark border border-gold/30 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-card border border-border/50 rounded-xl shadow-sm p-8 space-y-8"
                >
                  {/* Error banner */}
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg px-4 py-3">
                      Something went wrong: {error}. Please try again.
                    </div>
                  )}

                  {/* Contact Info */}
                  <div>
                    <p className="font-heading text-xs font-bold text-gold uppercase tracking-widest mb-4">
                      Contact Information
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <FormField icon={<User className="w-4 h-4" />} label="Full Name *">
                        <input
                          required
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className="form-input"
                        />
                      </FormField>
                      <FormField icon={<Phone className="w-4 h-4" />} label="Phone Number *">
                        <input
                          required
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="form-input"
                        />
                      </FormField>
                      <FormField icon={<Mail className="w-4 h-4" />} label="Email (optional)">
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@email.com"
                          className="form-input"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Move Details */}
                  <div>
                    <p className="font-heading text-xs font-bold text-gold uppercase tracking-widest mb-4">
                      Move Details
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField icon={<MapPin className="w-4 h-4" />} label="From (Origin) *">
                        <input
                          required
                          name="from"
                          value={form.from}
                          onChange={handleChange}
                          placeholder="Current address / city"
                          className="form-input"
                        />
                      </FormField>
                      <FormField icon={<MapPin className="w-4 h-4" />} label="Destination *">
                        <input
                          required
                          name="destination"
                          value={form.destination}
                          onChange={handleChange}
                          placeholder="Destination address / city"
                          className="form-input"
                        />
                      </FormField>
                      <FormField icon={<Calendar className="w-4 h-4" />} label="Preferred Date *">
                        <input
                          required
                          name="date"
                          type="date"
                          value={form.date}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </FormField>
                      <FormField icon={<Clock className="w-4 h-4" />} label="Preferred Time *">
                        <input
                          required
                          name="time"
                          type="time"
                          value={form.time}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Load Details */}
                  <div>
                    <p className="font-heading text-xs font-bold text-gold uppercase tracking-widest mb-4">
                      Load Details
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField icon={<Building2 className="w-4 h-4" />} label="Number of Floors *">
                        <select
                          required
                          name="floors"
                          value={form.floors}
                          onChange={handleChange}
                          className="form-input"
                        >
                          <option value="">Select floor count</option>
                          <option value="ground">Ground Floor</option>
                          <option value="1">1st Floor</option>
                          <option value="2">2nd Floor</option>
                          <option value="3">3rd Floor</option>
                          <option value="4+">4th Floor or higher</option>
                        </select>
                      </FormField>
                      <FormField icon={<Package className="w-4 h-4" />} label="Estimated Weight / Volume *">
                        <select
                          required
                          name="weight"
                          value={form.weight}
                          onChange={handleChange}
                          className="form-input"
                        >
                          <option value="">Select estimate</option>
                          <option value="light">Light — 1 BHK / Studio (&lt;500 kg)</option>
                          <option value="medium">Medium — 2 BHK (500–1000 kg)</option>
                          <option value="heavy">Heavy — 3 BHK (1000–2000 kg)</option>
                          <option value="extra">Extra Heavy — 4+ BHK / Office (&gt;2000 kg)</option>
                        </select>
                      </FormField>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gold-dark hover:bg-gold text-white font-semibold py-3.5 rounded-lg transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Truck className="w-5 h-5" />
                        Submit Booking Request
                      </>
                    )}
                  </button>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-navy-gradient">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-gold mb-3">
              Need to talk to someone right away?
            </h2>
            <p className="text-gold-light/60 mb-6">
              Call our relocation helpline — available Mon–Sat, 9 AM to 7 PM
            </p>
            <a
              href="tel:+919999999999"
              className="inline-flex items-center gap-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold rounded-lg px-6 py-3 font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      <style>{`
        .form-input {
          width: 100%;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: hsl(var(--foreground));
          outline: none;
          transition: border-color 0.15s;
        }
        .form-input::placeholder { color: hsl(var(--muted-foreground)); }
        .form-input:focus { border-color: hsl(var(--gold, 45 80% 55%)); }
        select.form-input { appearance: none; cursor: pointer; }
      `}</style>
    </div>
  );
};

const FormField = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <span className="text-gold-dark">{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

export default PackersMovers;