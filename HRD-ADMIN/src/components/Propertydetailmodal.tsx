import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Property, CommercialProperty } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  property: Property | CommercialProperty;
}

const PropertyDetailModal = ({ open, onClose, property }: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = property.images ?? [];
  const currentImage = images[currentImageIndex] ?? null;

  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);

  const openLightbox = (idx: number) => {
    setCurrentImageIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif gold-text">{property.title}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="gallery">
                Gallery
                {images.length > 0 && (
                  <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                    {images.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* ── TAB 1: DETAILS ── */}
            <TabsContent value="details" className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {property.description || "No description available"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Price", value: `₹${property.price?.toLocaleString()}` },
                  { label: "Property Type", value: property.type, capitalize: true },
                  { label: "Location", value: property.location },
                  { label: "Area", value: `${property.area} sq ft` },
                  { label: "Bedrooms", value: property.bedrooms },
                  { label: "Bathrooms", value: property.bathrooms },
                  property.facing && { label: "Facing", value: property.facing, capitalize: true },
                  property.constructionDate && { label: "Construction Date", value: property.constructionDate },
                  property.postedBy && { label: "Posted By", value: property.postedBy },
                  property.role && { label: "Posted As", value: property.role, capitalize: true },
                ]
                  .filter(Boolean)
                  .map((item: any) => (
                    <div key={item.label}>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {item.label}
                      </p>
                      <p className={`text-base font-semibold text-foreground ${item.capitalize ? "capitalize" : ""}`}>
                        {String(item.value)}
                      </p>
                    </div>
                  ))}

                {property.status && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                    <Badge variant="outline">{property.status}</Badge>
                  </div>
                )}
              </div>

              {/* ── ROOM DETAILS TABLE ── */}
              {'rooms' in property && (property as any).rooms?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Room Details</h3>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <div className="grid grid-cols-3 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      <span>Room</span>
                      <span>Dimensions</span>
                      <span>Area</span>
                    </div>
                    {(property as any).rooms.map((room: any, idx: number) => {
                      const hasSize = room.length && room.width;
                      const sqft = hasSize ? (room.length * room.width).toFixed(0) : null;
                      return (
                        <div
                          key={idx}
                          className={`grid grid-cols-3 px-3 py-2 text-sm ${idx % 2 === 0 ? "bg-muted/10" : ""}`}
                        >
                          <span className="text-foreground font-medium">{room.name || "—"}</span>
                          <span className="text-muted-foreground">
                            {hasSize ? `${room.length} × ${room.width} ft` : "—"}
                          </span>
                          <span className="text-muted-foreground">
                            {sqft ? `${sqft} sq ft` : "—"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-4 text-xs text-muted-foreground space-y-1">
                {property.createdAt && (
                  <p>Created: {new Date(property.createdAt).toLocaleDateString()}</p>
                )}
                {property.updatedAt && (
                  <p>Updated: {new Date(property.updatedAt).toLocaleDateString()}</p>
                )}
              </div>
            </TabsContent>

            {/* ── TAB 2: AMENITIES ── */}
            <TabsContent value="amenities" className="mt-4">
              {property.amenities && property.amenities.length > 0 ? (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Available Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {property.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                        <span className="text-green-400 text-sm">✓</span>
                        <span className="text-sm text-foreground">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No amenities listed</p>
                </div>
              )}
            </TabsContent>

            {/* ── TAB 3: GALLERY ── */}
            <TabsContent value="gallery" className="mt-4">
              {images.length > 0 ? (
                <div className="space-y-3">
                  {/* ── MAIN IMAGE — fixed aspect ratio, no zoom ── */}
                  <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
                    {currentImage ? (
                      <img
                        src={currentImage}
                        alt={`${property.title} – ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain cursor-zoom-in"
                        onClick={() => openLightbox(currentImageIndex)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">Image not available</span>
                      </div>
                    )}

                    {/* Prev / Next */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-1.5 rounded-full transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-1.5 rounded-full transition"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Counter */}
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded text-xs">
                      {currentImageIndex + 1} / {images.length}
                    </div>

                    {/* Zoom hint */}
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-xs">
                      Click to enlarge
                    </div>
                  </div>

                  {/* ── THUMBNAILS — responsive grid ── */}
                  {images.length > 1 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        All Images ({images.length})
                      </p>
                      {/* 
                        Responsive: 
                          4 cols on mobile 
                          6 cols on sm+ 
                          wraps naturally when there are many images 
                      */}
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`relative rounded overflow-hidden border-2 transition-all ${
                              currentImageIndex === idx
                                ? "border-primary ring-1 ring-primary"
                                : "border-transparent hover:border-muted-foreground/40"
                            }`}
                          >
                            {/* aspect-square keeps thumbs uniform regardless of image shape */}
                            <div className="aspect-square bg-muted">
                              <img
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* Active overlay indicator */}
                            {currentImageIndex === idx && (
                              <div className="absolute inset-0 bg-primary/10" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No images available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* ── LIGHTBOX — full-screen image viewer ── */}
      {lightboxOpen && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image */}
          <img
            src={currentImage}
            alt="Lightbox"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {images.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyDetailModal;