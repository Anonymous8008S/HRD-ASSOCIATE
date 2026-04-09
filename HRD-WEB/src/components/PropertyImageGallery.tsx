import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
}

const PropertyImageGallery = ({ images, title }: PropertyImageGalleryProps) => {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  // Ensure safe images (max 5, fallback if empty)
  const displayImages =
    images && images.length > 0
      ? images.slice(0, 5)
      : ["/placeholder.jpg"];

  const goToPrevious = () => {
    if (fullscreenIndex === null) return;
    setFullscreenIndex(
      fullscreenIndex === 0
        ? displayImages.length - 1
        : fullscreenIndex - 1
    );
  };

  const goToNext = () => {
    if (fullscreenIndex === null) return;
    setFullscreenIndex(
      fullscreenIndex === displayImages.length - 1
        ? 0
        : fullscreenIndex + 1
    );
  };

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div
        className={`hidden md:grid w-full h-[500px] gap-3 mb-8 ${
          displayImages.length === 1
            ? "grid-cols-1"
            : displayImages.length === 2
            ? "grid-cols-2"
            : "grid-cols-4 grid-rows-2"
        }`}
      >
        {/* Main Image */}
        <div
          onClick={() => setFullscreenIndex(0)}
          className={`relative rounded-lg overflow-hidden bg-gray-200 cursor-pointer group ${
            displayImages.length >= 3 ? "col-span-2 row-span-2" : ""
          }`}
        >
          <img
            src={displayImages[0]}
            alt={`${title} - Main view`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>

        {/* Remaining Images */}
        {displayImages.slice(1, 5).map((img, i) => (
          <div
            key={i}
            onClick={() => setFullscreenIndex(i + 1)}
            className="relative rounded-lg overflow-hidden bg-gray-200 cursor-pointer group"
          >
            <img
              src={img}
              alt={`${title} - View ${i + 2}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden w-full mb-8">
        <div className="flex overflow-x-auto gap-3 pb-2 snap-x snap-mandatory">
          {displayImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setFullscreenIndex(i)}
              className="flex-shrink-0 w-full h-[300px] rounded-lg overflow-hidden bg-gray-200 cursor-pointer group snap-start"
            >
              <img
                src={img}
                alt={`${title} - View ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-2">
          Swipe to see more images • {displayImages.length} photos
        </p>
      </div>

      {/* ================= FULLSCREEN ================= */}
      {fullscreenIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Close */}
          <button
            onClick={() => setFullscreenIndex(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center max-w-4xl max-h-[85vh]">
            <img
              src={displayImages[fullscreenIndex]}
              alt={`${title} - Full view ${fullscreenIndex + 1}`}
              className="w-full h-full object-contain"
            />

            {/* Arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 px-4 py-2 rounded-full text-white text-sm">
            {fullscreenIndex + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyImageGallery;