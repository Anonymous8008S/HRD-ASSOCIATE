import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Building2, Calendar, MapPin, ArrowRight } from "lucide-react";
import prop1 from "@/assets/property-1.jpg";
import prop2 from "@/assets/property-2.jpg";
import prop4 from "@/assets/property-4.jpg";

const projects = [
  { id: "p1", name: "HRD Riverside Heights", builder: "HRD Associates", location: "Beltola, Guwahati", status: "New Launch", possession: "Dec 2027", priceRange: "₹65L – ₹1.5Cr", units: "2, 3, 4 BHK Apartments", image: prop1 },
  { id: "p2", name: "Green Valley Villas", builder: "HRD Associates", location: "Kahilipara, Guwahati", status: "Under Construction", possession: "Jun 2026", priceRange: "₹2.5Cr – ₹4Cr", units: "4 BHK Villas", image: prop2 },
  { id: "p3", name: "Skyline Business Park", builder: "HRD Associates", location: "GS Road, Guwahati", status: "Ready to Move", possession: "Immediate", priceRange: "₹35L – ₹1.2Cr", units: "Office Spaces", image: prop4 },
];

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-20 bg-navy-gradient">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-4xl font-bold text-gold mb-4" style={{ lineHeight: "1.1" }}>New Projects & Developments</h1>
          <p className="text-gold-light/60 max-w-lg mx-auto">Explore upcoming and ongoing projects by HRD Associates and partner developers.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-8 max-w-5xl mx-auto">
            {projects.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 100}>
                <div className="bg-card rounded-lg shadow-sm border border-border/50 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                  <img src={project.image} alt={project.name} className="w-full md:w-80 h-56 md:h-auto object-cover" loading="lazy" />
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                        project.status === "New Launch" ? "bg-gold/10 text-gold-dark" :
                        project.status === "Ready to Move" ? "bg-green-50 text-green-700" :
                        "bg-blue-50 text-blue-700"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <h2 className="font-heading text-xl font-bold text-foreground mb-1">{project.name}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3"><MapPin className="w-3.5 h-3.5" /> {project.location}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Price Range</p>
                        <p className="font-semibold text-foreground">{project.priceRange}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Possession</p>
                        <p className="font-semibold text-foreground flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {project.possession}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Units</p>
                        <p className="font-semibold text-foreground">{project.units}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Builder</p>
                        <p className="font-semibold text-foreground">{project.builder}</p>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <Link to="/contact" className="inline-flex items-center gap-1 text-sm font-medium text-gold-dark hover:text-gold transition-colors">
                        Enquire Now <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
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

export default Projects;
