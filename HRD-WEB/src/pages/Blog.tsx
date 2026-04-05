import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const posts = [
  { slug: "buying-first-home", title: "10 Essential Tips for First-Time Home Buyers in Guwahati", excerpt: "Navigate the real estate market with confidence. From budgeting to documentation, here's everything you need to know.", date: "Mar 15, 2026", readTime: "6 min", category: "Buying Guide" },
  { slug: "real-estate-trends-2026", title: "Northeast India Real Estate Trends to Watch in 2026", excerpt: "From infrastructure growth to emerging hotspots, discover where the smart money is heading in the Northeast.", date: "Mar 10, 2026", readTime: "8 min", category: "Market Trends" },
  { slug: "property-investment", title: "Commercial vs Residential: Which Property Investment Yields Better Returns?", excerpt: "A detailed comparison of both investment types with real data from the Northeast India market.", date: "Mar 5, 2026", readTime: "7 min", category: "Investment" },
  { slug: "rental-income", title: "Maximizing Rental Income: A Landlord's Complete Guide", excerpt: "Practical strategies to increase your rental yield while maintaining quality tenants and property value.", date: "Feb 28, 2026", readTime: "5 min", category: "Rental" },
  { slug: "legal-checklist", title: "Legal Checklist Before Buying Property in Assam", excerpt: "Don't skip these crucial legal verifications. From land records to NOC, a comprehensive guide.", date: "Feb 20, 2026", readTime: "9 min", category: "Legal" },
  { slug: "home-loan", title: "Home Loan Guide: Interest Rates, Eligibility & Tips for 2026", excerpt: "Compare major bank offerings and learn how to get the best deal on your home loan.", date: "Feb 15, 2026", readTime: "6 min", category: "Finance" },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-20 bg-navy-gradient">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-4xl font-bold text-gold mb-4" style={{ lineHeight: "1.1" }}>Insights & Blog</h1>
          <p className="text-gold-light/60 max-w-lg mx-auto">Market trends, buying guides, investment tips, and expert advice on real estate in Northeast India.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 80}>
                <article className="bg-card rounded-lg shadow-sm border border-border/50 overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="h-48 bg-navy-gradient flex items-center justify-center">
                    <span className="text-gold/30 font-heading text-5xl font-bold">{post.category.charAt(0)}</span>
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-gold-dark bg-gold/10 px-2.5 py-1 rounded">{post.category}</span>
                    <h2 className="font-heading text-lg font-semibold text-foreground mt-3 mb-2 leading-snug line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      </div>
                      <span className="text-gold-dark font-medium group-hover:underline">Read →</span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
