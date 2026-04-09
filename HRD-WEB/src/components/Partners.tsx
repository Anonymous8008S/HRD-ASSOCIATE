import { useEffect } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import DOMPurify from "dompurify";

// Swiper
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Store
import useTestimonialStore from "@/stores/useTestimonialStore";

const TestimonialsSection = () => {
  const { testimonials, fetchTestimonials, loading } = useTestimonialStore();

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-4xl font-bold text-[#334BE5] text-center mb-12">
          Our Projects and Testimonials
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-52 bg-muted animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No testimonials yet.
          </p>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop
            speed={800}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 1.1 },
              768: { slidesPerView: 2 },
            }}
            className="max-w-4xl mx-auto"
          >
            {testimonials.slice(0, 6).map((t, i) => (
              <SwiperSlide key={t.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative gradient-bg-light rounded-xl p-6 flex gap-4 h-full"
                >
          
                  {t.image && (
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={t.image}
                        alt="Testimonial"
                        className="w-full h-full object-cover"
                      />

                      {(t.video || t.youtubeLink) && (
                        <a
                          href={t.youtubeLink || t.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-foreground/20 hover:bg-foreground/30 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary-foreground/90 flex items-center justify-center">
                            <Play className="w-5 h-5 text-secondary fill-secondary" />
                          </div>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <span className="text-4xl text-secondary/30 font-serif leading-none">
                      "
                    </span>

                    <div
                      className="text-sm italic text-foreground/80 -mt-4"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(t.description),
                      }}
                    />
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;