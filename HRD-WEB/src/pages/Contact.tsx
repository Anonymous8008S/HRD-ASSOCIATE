import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import useInquiryStore from "@/stores/useInquiryStore";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Property Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addInquiry } = useInquiryStore();

  const subjectOptions = [
    "Property Inquiry",
    "Selling a Property",
    "Rental Inquiry",
    "Land on Condition",
    "Packers and Movers Service",
    "Housing Loans",
    "Legal Services",
    "Other",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await addInquiry({
        id: "",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        subject: formData.subject,
    
        status: "new",
        createdAt: new Date().toISOString(),
      });

      toast.success("Your inquiry has been submitted successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Property Inquiry",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-20 bg-navy-gradient">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-4xl font-bold text-gold mb-4" style={{ lineHeight: "1.1" }}>Get in Touch</h1>
          <p className="text-gold-light/60 max-w-md mx-auto">We'd love to hear from you. Reach out for property inquiries, consultations, or partnerships.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
            <div className="lg:col-span-2 space-y-8">
              <ScrollReveal>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                {[
                  { icon: MapPin, title: "Office", text: "123 Business Tower, GS Road\nGuwahati, Assam 781001" },
                  { icon: Phone, title: "Phone", text: "+91 98765 43210\n+91 98765 43211" },
                  { icon: Mail, title: "Email", text: "info@hrdassociates.com\nsales@hrdassociates.com" },
                  { icon: Clock, title: "Hours", text: "Mon – Sat: 9:00 AM – 7:00 PM\nSun: By appointment" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-gold-dark" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-0.5">{item.title}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{item.text}</p>
                    </div>
                  </div>
                ))}
              </ScrollReveal>
            </div>

            <div className="lg:col-span-3">
              <ScrollReveal delay={100}>
                <div className="bg-card rounded-lg shadow-md border border-border/50 p-8">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-6">Send Us a Message</h3>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 transition-colors bg-background"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 transition-colors bg-background"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 transition-colors bg-background"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Subject *</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 transition-colors bg-background text-foreground"
                        required
                      >
                        {subjectOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Tell us about your requirements..."
                        className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 transition-colors resize-none bg-background"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gold-gradient text-navy font-semibold py-3 rounded-md hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="rounded-lg overflow-hidden shadow-md h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d229024.6734089155!2d91.58364569453123!3d26.14427239999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5a287f9135ff%3A0x2bbd1332436b5aa1!2sGuwahati%2C%20Assam!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HRD Associates Office Location"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;