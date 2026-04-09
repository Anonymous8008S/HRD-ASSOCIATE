import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Properties", path: "/properties" },
  { label: "Projects", path: "/projects" },
  { label: "Commercial", path: "/commercial" },
  // { label: "Blog", path: "/blog" },
  { label: "Packers & Movers", path: "/packers-movers" },
   { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/95 backdrop-blur-md border-b border-navy-light/30">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="HRD Associates" className="h-16 w-20 rounded object-cover" />
          <div className="hidden sm:block">
            <span className="font-heading text-lg font-bold text-gold">HRD Associates</span>
            <span className="block text-[10px] tracking-[0.25em] uppercase text-gold-light/70">Build | Rent | Sale</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                location.pathname === link.path
                  ? "text-gold bg-navy-light/50"
                  : "text-gold-light/70 hover:text-gold hover:bg-navy-light/30"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-gold-light/80 hover:text-gold transition-colors">
            <Phone className="w-4 h-4" />
            +91 98765 43210
          </a>
          <Link
            to="/post-property"
            className="bg-gold-gradient text-navy font-semibold text-sm px-5 py-2 rounded-md hover:opacity-90 active:scale-[0.97] transition-all"
          >
            Post Property
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-gold p-2"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-navy-dark border-t border-navy-light/20 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-gold bg-navy-light/50"
                    : "text-gold-light/70 hover:text-gold hover:bg-navy-light/30"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/post-property"
              onClick={() => setOpen(false)}
              className="bg-gold-gradient text-navy font-semibold text-sm px-5 py-3 rounded-md text-center mt-2"
            >
              Post Property
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
