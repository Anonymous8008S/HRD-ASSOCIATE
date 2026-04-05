import { useState , useEffect} from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal, X, BedDouble, Bath, Maximize, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import ScrollReveal from "@/components/ScrollReveal";
import prop1 from "@/assets/property-1.jpg";
import prop2 from "@/assets/property-2.jpg";
import prop3 from "@/assets/property-3.jpg";
import prop4 from "@/assets/property-4.jpg";
import usePropertyStore from "@/stores/usePropertyStore";

const allProperties = [
  { id: "1", title: "Luxury 3BHK Apartment in Beltola", price: "₹1.2 Cr", location: "Beltola, Guwahati", image: prop1, beds: 3, baths: 2, area: "1,850 sqft", type: "Apartment", tag: "Featured" },
  { id: "2", title: "Premium Villa with Swimming Pool", price: "₹3.5 Cr", location: "Kahilipara, Guwahati", image: prop2, beds: 4, baths: 3, area: "3,200 sqft", type: "Villa", tag: "New" },
  { id: "3", title: "Modern Office Space on GS Road", price: "₹45 L", location: "GS Road, Guwahati", image: prop3, beds: 0, baths: 2, area: "2,100 sqft", type: "Commercial" },
  { id: "4", title: "Penthouse with Panoramic City View", price: "₹2.8 Cr", location: "Zoo Road, Guwahati", image: prop4, beds: 4, baths: 4, area: "4,500 sqft", type: "Apartment", tag: "Premium" },
  { id: "5", title: "2BHK Flat Near Airport", price: "₹65 L", location: "Borjhar, Guwahati", image: prop1, beds: 2, baths: 1, area: "1,100 sqft", type: "Apartment" },
  { id: "6", title: "Commercial Plot in Paltan Bazaar", price: "₹1.8 Cr", location: "Paltan Bazaar, Guwahati", image: prop3, beds: 0, baths: 0, area: "5,000 sqft", type: "Plot" },
];

const Properties = () => {
  const {fetchApproved , properties} = usePropertyStore();
  
  useEffect(() => {
    fetchApproved();
  }, []);  

  console.log("Fetched properties:", properties);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-8 bg-navy-gradient">
        <div className="container mx-auto px-4 pt-8">
          <h1 className="font-heading text-3xl font-bold text-gold mb-6" style={{ lineHeight: "1.15" }}>
            Search Properties
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-navy-light/50 border border-navy-light rounded-md px-4 py-3">
              <Search className="w-4 h-4 text-gold/60" />
              <input type="text" placeholder="Location, project, or keyword..." className="w-full bg-transparent text-sm text-gold-light outline-none placeholder:text-gold-light/40" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 bg-navy-light/50 border border-navy-light text-gold text-sm px-5 py-3 rounded-md hover:bg-navy-light/70 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <button className="bg-gold-gradient text-navy font-semibold text-sm px-6 py-3 rounded-md hover:opacity-90 active:scale-[0.97] transition-all">
              Search
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-5 bg-navy-light/30 border border-navy-light/50 rounded-lg grid grid-cols-2 md:grid-cols-2 gap-4 animate-fade-in">
              {[
                { label: "Property Type", options: ["Apartment", "Villa", "Plot", "Commercial"] },
                { label: "Sort By", options: ["Relevance", "Price: Low–High", "Price: High–Low", "Newest"] },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-xs text-gold-light/50 block mb-1.5">{f.label}</label>
                  <select className="w-full bg-navy-light/50 border border-navy-light text-gold-light text-sm rounded-md px-3 py-2 outline-none">
                    <option>All</option>
                    {f.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground">Showing <span className="font-semibold text-foreground">{allProperties.length}</span> properties</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 80}>
              <PropertyCard {...p} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Properties;