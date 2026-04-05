import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Award, Users, Target, Eye, Shield, Clock } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const team = [
  { name: "Hemanta R. Deka", role: "Founder & CEO", initials: "HD" },
  { name: "Ankita Bora", role: "Head of Sales", initials: "AB" },
  { name: "Rajiv Sharma", role: "Chief Operations", initials: "RS" },
  { name: "Manisha Kalita", role: "Marketing Director", initials: "MK" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-20 bg-navy-gradient">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-4xl font-bold text-gold mb-4" style={{ lineHeight: "1.1" }}>About HRD Associates</h1>
          <p className="text-gold-light/60 max-w-lg mx-auto">Building trust in real estate since 2010. Your partner for property buying, selling, and renting in Northeast India.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <img src={logo} alt="HRD Associates" className="w-full max-w-sm mx-auto rounded-lg shadow-lg" />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 2010, HRD Associates has grown from a small consultancy to one of the most trusted real estate firms in Northeast India. With over 15 years of experience, we've helped thousands of families find their dream homes and guided investors toward profitable property decisions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our deep understanding of the local market, combined with a commitment to transparency and client satisfaction, sets us apart in the industry.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="bg-card p-8 rounded-lg shadow-sm border border-border/50">
                <Target className="w-10 h-10 text-gold-dark mb-4" />
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">To simplify real estate transactions and provide transparent, reliable property solutions that create lasting value for our clients.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="bg-card p-8 rounded-lg shadow-sm border border-border/50">
                <Eye className="w-10 h-10 text-gold-dark mb-4" />
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">To be Northeast India's most trusted real estate platform, connecting people with the right properties through technology and personalized service.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-4">Why Choose Us</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">Values that drive every property transaction</p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: "Trust & Transparency", desc: "Verified listings, honest pricing, and complete documentation support." },
              { icon: Clock, title: "Quick Turnaround", desc: "Efficient processes to close deals faster without compromising quality." },
              { icon: Users, title: "Expert Team", desc: "Experienced professionals who understand local markets deeply." },
              { icon: Award, title: "Proven Track Record", desc: "800+ successful deals and 1,200+ satisfied clients." },
              { icon: Target, title: "Personalized Service", desc: "Tailored property recommendations based on your unique needs." },
              { icon: Eye, title: "Market Insights", desc: "Data-driven analysis to help you make informed decisions." },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="text-center p-6">
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-gold-dark" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold text-gold text-center mb-12">Our Leadership</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {team.map((m, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-navy-light border-2 border-gold/30 flex items-center justify-center mx-auto mb-3">
                    <span className="font-heading text-lg font-bold text-gold">{m.initials}</span>
                  </div>
                  <p className="font-semibold text-gold text-sm">{m.name}</p>
                  <p className="text-xs text-gold-light/50">{m.role}</p>
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

export default About;
