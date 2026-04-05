import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import CommercialCard from "@/components/CommercialCard";
import { Building2, Landmark, Warehouse, TrendingUp } from "lucide-react";
import prop3 from "@/assets/property-3.jpg";
import prop4 from "@/assets/property-4.jpg";

const types = [
  { icon: Building2, label: "Offices", desc: "Modern office spaces for startups and enterprises", count: "35+" },
  { icon: Landmark, label: "Retail Shops", desc: "Prime locations in commercial hubs", count: "28+" },
  { icon: Warehouse, label: "Warehouses", desc: "Storage and logistics spaces", count: "12+" },
  { icon: TrendingUp, label: "Investment", desc: "High-yield commercial investments", count: "20+" },
];

const commercialListings = [
  { id: "3", title: "Modern Office on GS Road", price: "₹45 L", location: "GS Road, Guwahati", image: prop3, beds: 0, baths: 2, area: "2,100 sqft", type: "Office" },
  { id: "c2", title: "Retail Space in Paltan Bazaar", price: "₹1.2 Cr", location: "Paltan Bazaar, Guwahati", image: prop4, beds: 0, baths: 1, area: "1,500 sqft", type: "Shop" },
  { id: "c3", title: "Warehouse Near NH-37", price: "₹85 L", location: "Jorabat, Guwahati", image: prop3, beds: 0, baths: 1, area: "5,000 sqft", type: "Warehouse" },
];

const Commercial = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-20 bg-navy-gradient">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-4xl font-bold text-gold mb-4" style={{ lineHeight: "1.1" }}>Commercial Properties</h1>
          <p className="text-gold-light/60 max-w-lg mx-auto">Offices, shops, warehouses, and investment properties in prime commercial locations.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 auto-rows-fr">
            {types.map((t, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border/50 text-center hover:shadow-md hover:-translate-y-1 transition-all h-full flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                    <t.icon className="w-5 h-5 text-gold-dark" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">{t.label}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{t.desc}</p>
                  <span className="text-xs font-semibold text-gold-dark">{t.count} listings</span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-8">Available Commercial Properties</h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commercialListings.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 80}>
                <CommercialCard {...p} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Commercial;