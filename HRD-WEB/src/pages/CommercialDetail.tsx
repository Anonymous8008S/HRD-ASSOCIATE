import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, Maximize, Phone, ArrowLeft,
  Check, Calendar, TrendingUp, MessageCircle, Share2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import PropertyImageGallery from "@/components/PropertyImageGallery";
import useCommercialStore from "@/stores/useCommercialStore";
import type { CommercialProperty } from "@/types";

const agentContacts: Record<string, { name: string; phone: string; whatsapp: string }> = {
  default: { name: "Sales Agent", phone: "+91 98765 43210", whatsapp: "919876543210" },
};

const facingLabel = (f?: string) =>
  f ? f.charAt(0).toUpperCase() + f.slice(1) : "—";

const formatPrice = (price: number) => {
  const p = Number(price); // add this coercion
  if (p >= 10_000_000) return `₹${(p / 10_000_000).toFixed(2)} Cr`;
  if (p >= 100_000) return `₹${(p / 100_000).toFixed(2)} L`;
  return `₹${p.toLocaleString("en-IN")}`;
};

const CommercialDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { properties, fetchApproved, loading } = useCommercialStore();
  const [property, setProperty] = useState<CommercialProperty | null>(null);

  useEffect(() => {
    if (properties.length === 0) fetchApproved();
  }, []);

  useEffect(() => {
    if (properties.length > 0 && id) {
      const found = properties.find((p) => p.id === id) ?? null;
      setProperty(found);
    }
  }, [properties, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-gold-dark border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Loading property…</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
          <p className="text-2xl font-heading font-bold text-foreground">Property not found</p>
          <Link to="/commercial" className="text-sm text-gold-dark underline underline-offset-4">
            ← Back to Commercial
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const agent = agentContacts[property.postedBy ?? "default"] ?? agentContacts["default"];
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in "${property.title}" listed at ${formatPrice(property.price)} in ${property.location}. Could you please share more details?`
  );
  const whatsappUrl = `https://wa.me/${agent.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">

          {/* Back + Actions */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/commercial"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Commercial
            </Link>
            <button
              onClick={() => navigator.share?.({ title: property.title, url: window.location.href })}
              className="p-2 rounded-full border border-border hover:bg-secondary transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Image Gallery */}
          <PropertyImageGallery images={property.images} title={property.title} />

          <div className="grid lg:grid-cols-3 gap-10 mt-8">

            {/* ─── Left Column ─── */}
            <div className="lg:col-span-2">

              <ScrollReveal>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-gold/10 text-gold-dark text-xs font-semibold px-3 py-1 rounded-full capitalize">
                      {property.type}
                    </span>
                    {property.constructionDate && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Built {new Date(property.constructionDate).getFullYear()}
                      </span>
                    )}
                    {property.status && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                        property.status === "approved" ? "bg-green-100 text-green-700"
                        : property.status === "pending" ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}>
                        {property.status}
                      </span>
                    )}
                  </div>
                  <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-2" style={{ lineHeight: "1.25" }}>
                    {property.title}
                  </h1>
                  <p className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4 shrink-0" /> {property.location}
                  </p>
                </div>
              </ScrollReveal>

              {/* Stats Bar — no beds/baths */}
              <ScrollReveal delay={100}>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: <Maximize className="w-5 h-5" />, value: property.area, label: "Area" },
                    { icon: <TrendingUp className="w-5 h-5" />, value: facingLabel(property.facing), label: "Facing" },
                  ].map(({ icon, value, label }) => (
                    <div key={label} className="flex flex-col items-center justify-center gap-1.5 bg-secondary/50 rounded-xl p-4 text-center">
                      <span className="text-gold-dark">{icon}</span>
                      <p className="text-sm font-semibold text-foreground leading-tight">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Description */}
              <ScrollReveal delay={150}>
                <div className="mb-8">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-3">Description</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">{property.description}</p>
                </div>
              </ScrollReveal>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <ScrollReveal delay={200}>
                  <div className="mb-8">
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((a: string) => (
                        <div key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-gold-dark" />
                          </span>
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* ─── Right Sidebar ─── */}
            <div>
              <ScrollReveal direction="left">
                <div className="sticky top-24 space-y-5">

                  <div className="bg-card rounded-2xl shadow-md border border-border/50 p-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Listed Price</p>
                    <p className="text-4xl font-heading font-bold text-gold-dark mb-6">
                      {formatPrice(property.price)}
                    </p>

                    <div className="flex items-center gap-3 mb-5 p-3 bg-secondary/40 rounded-xl">
                      <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center shrink-0 text-gold-dark font-bold text-sm">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">Listed Agent</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <a
                        href={`tel:${agent.phone}`}
                        className="w-full bg-gold-gradient text-navy font-semibold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all shadow-sm"
                      >
                        <Phone className="w-4 h-4" /> Call Agent
                      </a>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-navy text-gold border border-gold/30 font-semibold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp Agent
                      </a>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-3">
                    <h3 className="font-heading text-sm font-semibold text-foreground">Quick Facts</h3>
                    {[
                      { label: "Type", value: property.type },
                      { label: "Area", value: property.area },
                      { label: "Facing", value: facingLabel(property.facing) },
                      ...(property.constructionDate
                        ? [{ label: "Built", value: new Date(property.constructionDate).getFullYear().toString() }]
                        : []),
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-foreground capitalize">{value}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommercialDetail;