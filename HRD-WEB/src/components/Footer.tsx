import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-navy-dark text-gold-light/70">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="HRD Associates" className="h-10 w-10 rounded object-cover" />
              <div>
                <span className="font-heading text-lg font-bold text-gold">HRD Associates</span>
                <span className="block text-[10px] tracking-[0.25em] uppercase text-gold-light/50">Build | Rent | Sale</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Your trusted partner in real estate. We help you find the perfect property for your needs — whether buying, selling, or renting.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold/10 hover:border-gold/60 transition-all active:scale-95">
                  <Icon className="w-4 h-4 text-gold" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-gold font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["Properties", "Projects", "Commercial", "Post Property", "Blog", "About", "Contact"].map(link => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(" ", "-")}`} className="hover:text-gold transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-gold font-semibold mb-4">Property Types</h4>
            <ul className="space-y-2 text-sm">
              {["Apartments", "Villas", "Plots", "Commercial Spaces", "Offices", "Warehouses", "PG / Co-living"].map(t => (
                <li key={t}>
                  <Link to="/properties" className="hover:text-gold transition-colors">{t}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-gold font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                <span>123 Business Tower, Guwahati, Assam 781001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href="tel:+919876543210" className="hover:text-gold transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href="mailto:info@hrdassociates.com" className="hover:text-gold transition-colors">info@hrdassociates.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-light/20">
        <div className="container mx-auto px-4 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between text-xs text-gold-light/40">
          <span>© 2026 HRD Associates. All rights reserved.</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
