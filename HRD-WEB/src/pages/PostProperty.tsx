import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const PostProperty = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-20 bg-navy-gradient">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-heading text-4xl font-bold text-gold mb-4" style={{ lineHeight: "1.1" }}>Post Your Property</h1>
          <p className="text-gold-light/60 max-w-md mx-auto">List your property and reach thousands of potential buyers and tenants.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Steps */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {["Details", "Features", "Images", "Review"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step > i + 1 ? "bg-gold text-navy" : step === i + 1 ? "bg-gold-gradient text-navy" : "bg-secondary text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm hidden sm:inline ${step === i + 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
                {i < 3 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          <ScrollReveal>
            <div className="bg-card rounded-lg shadow-md border border-border/50 p-8">
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Property Details</h2>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">I am a</label>
                    <div className="flex gap-3">
                      {["Owner", "Broker", "Builder"].map(r => (
                        <button key={r} className="flex-1 border border-border rounded-md py-2.5 text-sm font-medium hover:border-gold/50 focus:border-gold focus:bg-gold/5 transition-colors">{r}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Property Type</label>
                    <select className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 bg-background">
                      <option>Apartment</option><option>Villa</option><option>Plot</option><option>Commercial Office</option><option>Shop</option><option>Warehouse</option>
                    </select>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">City</label>
                      <input type="text" placeholder="e.g. Guwahati" className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 bg-background" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Locality</label>
                      <input type="text" placeholder="e.g. Beltola" className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 bg-background" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Price (₹)</label>
                      <input type="text" placeholder="e.g. 12000000" className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 bg-background" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Area (sqft)</label>
                      <input type="text" placeholder="e.g. 1850" className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 bg-background" />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Features & Amenities</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Bedrooms</label>
                      <select className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 bg-background">
                        {["1", "2", "3", "4", "5+"].map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Bathrooms</label>
                      <select className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 bg-background">
                        {["1", "2", "3", "4+"].map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Facing</label>
                      <select className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 bg-background">
                        {["North", "South", "East", "West", "North-East", "South-West"].map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Furnishing</label>
                      <select className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 bg-background">
                        {["Unfurnished", "Semi-Furnished", "Fully Furnished"].map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Amenities</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {["Parking", "Lift", "Gym", "Swimming Pool", "Power Backup", "Security", "Garden", "Clubhouse"].map(a => (
                        <label key={a} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                          <input type="checkbox" className="rounded border-border accent-gold-dark" /> {a}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
                    <textarea rows={4} placeholder="Describe your property..." className="w-full border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-gold/50 resize-none bg-background" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Upload Images</h2>
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-gold/40 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">Drag and drop images here, or click to browse</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB each. Maximum 10 images.</p>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gold-dark" />
                  </div>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Ready to Post!</h2>
                  <p className="text-sm text-muted-foreground mb-6">Review your listing details and submit when ready.</p>
                  <button className="bg-gold-gradient text-navy font-semibold px-8 py-3 rounded-md hover:opacity-90 active:scale-[0.97] transition-all">
                    Submit Property
                  </button>
                </div>
              )}

              {step < 4 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <button
                    onClick={() => setStep(Math.max(1, step - 1))}
                    className={`text-sm font-medium px-6 py-2.5 rounded-md border border-border hover:bg-secondary transition-colors ${step === 1 ? "invisible" : ""}`}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(Math.min(4, step + 1))}
                    className="bg-gold-gradient text-navy font-semibold text-sm px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.97] transition-all"
                  >
                    Next Step
                  </button>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PostProperty;
