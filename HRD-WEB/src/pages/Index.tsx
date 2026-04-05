import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Building2,
  Home as HomeIcon,
  MapPin,
  TrendingUp,
  ChevronRight,
  Star,
  ArrowRight,
  Users,
  Award,
  Handshake,
  User,
  Phone,
  Mail,
  MapPinIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import ScrollReveal from "@/components/ScrollReveal";
import heroBg from "@/assets/hero-bg.jpg";
import prop1 from "@/assets/property-1.jpg";
import prop2 from "@/assets/property-2.jpg";
import prop3 from "@/assets/property-3.jpg";
import prop4 from "@/assets/property-4.jpg";
import useStatisticStore from "@/stores/useStatisticStore";
import useTestimonialStore from "@/stores/useTestimonialStore";
const searchTabs = ["Buy", "Rent", "Commercial", "PG"];

const featuredProperties = [
  {
    id: "1",
    title: "Luxury 3BHK Apartment",
    price: "₹1.2 Cr",
    location: "Beltola, Guwahati",
    image: prop1,
    beds: 3,
    baths: 2,
    area: "1,850 sqft",
    type: "Apartment",
    tag: "Featured",
  },
  {
    id: "2",
    title: "Premium Villa with Pool",
    price: "₹3.5 Cr",
    location: "Kahilipara, Guwahati",
    image: prop2,
    beds: 4,
    baths: 3,
    area: "3,200 sqft",
    type: "Villa",
    tag: "New",
  },
  {
    id: "3",
    title: "Modern Office Space",
    price: "₹45 L",
    location: "GS Road, Guwahati",
    image: prop3,
    beds: 0,
    baths: 2,
    area: "2,100 sqft",
    type: "Commercial",
  },
  {
    id: "4",
    title: "Penthouse with City View",
    price: "₹2.8 Cr",
    location: "Zoo Road, Guwahati",
    image: prop4,
    beds: 4,
    baths: 4,
    area: "4,500 sqft",
    type: "Apartment",
    tag: "Premium",
  },
];

const categories = [
  { icon: Building2, label: "Apartments", count: "240+" },
  { icon: HomeIcon, label: "Villas", count: "85+" },
  { icon: MapPin, label: "Plots", count: "120+" },
  { icon: TrendingUp, label: "Commercial", count: "60+" },
];


const Index = () => {
  const { statistics, fetchAll } = useStatisticStore();
  const { testimonials, fetchAll: fetchTestimonials } = useTestimonialStore();
console.log("Testimonials in Index:", testimonials);
  useEffect(() => {
    fetchAll();
    fetchTestimonials();
  }, []);


  const iconMap = {
    Home: HomeIcon,
    Handshake: Handshake,
    Users: Users,
    Award: Award,
  };

  const [activeTab, setActiveTab] = useState("Buy");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    landAddress: "",
    landArea: "",
    additionalDetails: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({
      name: "",
      phone: "",
      email: "",
      landAddress: "",
      landArea: "",
      additionalDetails: "",
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-dark/80" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gold mb-4 animate-fade-up"
            style={{ lineHeight: "1.1" }}
          >
            Find Your Perfect Property
          </h1>
          <p
            className="text-gold-light/70 text-lg max-w-xl mx-auto mb-10 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            Premium real estate solutions in Guwahati & beyond — buy, rent, or
            invest with confidence.
          </p>

          <div
            className="max-w-3xl mx-auto animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex gap-1 mb-0 bg-navy/60 backdrop-blur-sm rounded-t-lg p-1 w-fit mx-auto">
              {searchTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-gold-gradient text-navy"
                      : "text-gold-light/60 hover:text-gold"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="bg-card rounded-b-lg rounded-tr-lg shadow-2xl p-4 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 border border-border rounded-md px-3 py-2">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search by location, project, or builder..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Link
                to="/properties"
                className="bg-gold-gradient text-navy font-semibold text-sm px-6 py-2.5 rounded-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all shrink-0"
              >
                <Search className="w-4 h-4" /> Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Co-Development Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:items-stretch">
            {/* Left Side - Image */}
            <ScrollReveal>
              <div className="relative h-full">
                <div className="rounded-2xl overflow-hidden shadow-2xl h-full">
                  <img
                    src={prop1}
                    alt="Land Development"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-gold-dark to-gold rounded-xl shadow-xl p-6 max-w-xs">
                  <h3 className="font-heading text-2xl font-bold text-white mb-2">
                    We Are Looking For Land
                  </h3>
                  <p className="text-gold-light/90 text-sm leading-relaxed">
                    Share your land details and let us build something
                    extraordinary together.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Side - Form */}
            <ScrollReveal direction="left">
              <div className="flex flex-col justify-start h-full">
                <h2
                  className="font-heading text-lg lg:text-2xl font-bold text-navy mb-3"
                  style={{ lineHeight: "1.2" }}
                >
                  Maximize Your Property's Value Through Co-Development
                  Partnerships
                </h2>
                <p className="text-muted-foreground text-sm lg:text-md mb-8 leading-relaxed">
                  Partner with us to transform your land into a premium
                  residential or commercial project. We handle everything from
                  planning to completion.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 flex flex-col flex-1"
                >
                  {/* Name & Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-white focus:ring-2 focus:ring-gold/50 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-white focus:ring-2 focus:ring-gold/50 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-white focus:ring-2 focus:ring-gold/50 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Land Address & Area */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        name="landAddress"
                        placeholder="Land Address/Location"
                        value={formData.landAddress}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-white focus:ring-2 focus:ring-gold/50 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      name="landArea"
                      placeholder="Land Area (sq.ft)"
                      value={formData.landArea}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-white focus:ring-2 focus:ring-gold/50 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Additional Details */}
                  <textarea
                    name="additionalDetails"
                    placeholder="Additional Details (Optional)"
                    rows={3}
                    value={formData.additionalDetails}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-white focus:ring-2 focus:ring-gold/50 focus:border-transparent outline-none transition-all resize-none"
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gold-dark to-gold text-white font-semibold py-3 rounded-lg hover:shadow-lg active:scale-[0.98] transition-all duration-200 font-heading text-lg mt-auto"
                  >
                    Submit Your Land Details
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats */}

      <section className="bg-navy py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((s, i) => {
              const Icon = iconMap[s.icon];
              return (
                <ScrollReveal key={s.id} delay={i * 80} className="text-center">
                  {Icon && <Icon className="w-8 h-8 text-gold mx-auto mb-2" />}
                  <p className="text-2xl lg:text-3xl font-heading font-bold text-gold">
                    {s.value}
                  </p>
                  <p className="text-sm text-gold-light/50">{s.label}</p>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-2">
              Explore Property Types
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
              Browse through our diverse range of properties across Guwahati and
              Northeast India.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <Link
                  to="/properties"
                  className="group block bg-card p-8 rounded-lg shadow-sm hover:shadow-lg border border-border/50 text-center transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                    <cat.icon className="w-6 h-6 text-gold-dark" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">
                    {cat.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {cat.count} Properties
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                  Featured Properties
                </h2>
                <p className="text-muted-foreground">
                  Handpicked properties for you
                </p>
              </div>
              <Link
                to="/properties"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 100}>
                <PropertyCard {...p} />
              </ScrollReveal>
            ))}
          </div>

          <Link
            to="/properties"
            className="sm:hidden flex items-center justify-center gap-1 mt-8 text-sm font-medium text-gold-dark hover:text-gold transition-colors"
          >
            View All Properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-gradient py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <h2
                className="font-heading text-3xl lg:text-4xl font-bold text-gold mb-4"
                style={{ lineHeight: "1.15" }}
              >
                Ready to List Your Property?
              </h2>
              <p className="text-gold-light/60 mb-8 max-w-md mx-auto">
                Reach thousands of potential buyers and tenants. Post your
                property in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/post-property"
                  className="bg-gold-gradient text-navy font-semibold px-8 py-3 rounded-md hover:opacity-90 active:scale-[0.97] transition-all"
                >
                  Post Your Property
                </Link>
                <Link
                  to="/contact"
                  className="border border-gold/40 text-gold font-medium px-8 py-3 rounded-md hover:bg-gold/10 active:scale-[0.97] transition-all"
                >
                  Contact an Agent
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-2">
              What Our Clients Say
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Real stories from real clients
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-card p-8 rounded-lg shadow-sm border border-border/50">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    "{t.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
