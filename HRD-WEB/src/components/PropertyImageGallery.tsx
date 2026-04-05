import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
}

const PropertyImageGallery = ({ images, title }: PropertyImageGalleryProps) => {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const goToPrevious = () => {
    if (fullscreenIndex === null) return;
    setFullscreenIndex(fullscreenIndex === 0 ? displayImages.length - 1 : fullscreenIndex - 1);
  };

  const goToNext = () => {
    if (fullscreenIndex === null) return;
    setFullscreenIndex(fullscreenIndex === displayImages.length - 1 ? 0 : fullscreenIndex + 1);
  };

  // Ensure we have at least 5 images (repeat if needed for demo)
  const displayImages = images.length >= 5 ? images.slice(0, 5) : [...images, ...images].slice(0, 5);

  return (
    <>
      {/* Desktop: 5-image grid layout */}
      <div className="hidden md:grid w-full h-[500px] grid-cols-4 grid-rows-2 gap-3 mb-8">
        {/* Large main image - spans 2x2 */}
        <div
          onClick={() => setFullscreenIndex(0)}
          className="col-span-2 row-span-2 relative rounded-lg overflow-hidden bg-gray-200 cursor-pointer group"
        >
          <img
            src={displayImages[0]}
            alt={`${title} - Main view`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>

        {/* 4 smaller images - each 1x1 */}
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

      {/* Mobile: Horizontal scrollable gallery */}
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

      {/* Fullscreen Modal */}
      {fullscreenIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setFullscreenIndex(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center max-w-4xl max-h-[85vh]">
            <img
              src={displayImages[fullscreenIndex]}
              alt={`${title} - Full view ${fullscreenIndex + 1}`}
              className="w-full h-full object-contain"
            />

            {/* Navigation Arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
            {fullscreenIndex + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyImageGallery;