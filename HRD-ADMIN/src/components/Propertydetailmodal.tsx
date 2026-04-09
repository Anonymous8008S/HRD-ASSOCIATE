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

// ── Helpers ──────────────────────────────────────────────────────────────────

const FieldItem = ({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string | number | undefined | null;
  capitalize?: boolean;
}) => {
  if (value === undefined || value === null || value === "" || value === "—") return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`text-base font-semibold text-foreground ${capitalize ? "capitalize" : ""}`}>
        {String(value)}
      </p>
    </div>
  );
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-semibold text-foreground mb-2 mt-4 first:mt-0">{children}</h3>
);

const InfoCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">{children}</div>
);

// ── PG Detail Tab ─────────────────────────────────────────────────────────────

const PGDetailsTab = ({ property }: { property: Property }) => {
  const pgRooms = (property as any).pgRooms ?? [];
  const pgAmenities: string[] = property.pgAmenities ?? [];

  const typeLabel: Record<string, string> = {
    single: "Single (1 bed)",
    double: "Double (2 beds)",
    triple: "Triple (3 beds)",
  };

  const utilityLabel = (val: string | undefined) =>
    val === "included" ? "Included in rent" : "Tenant pays separately";

  return (
    <div className="space-y-4 mt-4">
      {/* Description */}
      <div>
        <SectionHeading>Description</SectionHeading>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {property.description || "No description available"}
        </p>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-2 gap-4">
        <FieldItem label="Location" value={property.location} />
        <FieldItem
          label="PG For"
          value={
            property.gender === "male"
              ? "Male"
              : property.gender === "female"
              ? "Female"
              : "Any"
          }
          capitalize
        />
        {property.postedBy && <FieldItem label="Posted By" value={property.postedBy} />}
        {property.role && <FieldItem label="Posted As" value={property.role} capitalize />}
        {property.status && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
            <Badge variant="outline">{property.status}</Badge>
          </div>
        )}
        {property.contactNumber && (
          <FieldItem label="Contact" value={property.contactNumber} />
        )}
      </div>

      {/* Room Types */}
      {pgRooms.length > 0 && (
        <div>
          <SectionHeading>Room Types</SectionHeading>
          <div className="space-y-3">
            {pgRooms.map((room: any, idx: number) => (
              <InfoCard key={idx}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {typeLabel[room.type] ?? room.type}
                  </p>
                  {room.attachedBathroom !== undefined && (
                    <Badge variant="outline" className="text-xs">
                      {room.attachedBathroom ? "Attached bathroom" : "Common bathroom"}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3 mt-1">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Price / person
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      ₹{room.pricePerPerson?.toLocaleString("en-IN") ?? "—"}/mo
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Total rooms
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {room.totalRooms ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Available
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        room.availableRooms > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {room.availableRooms ?? "—"}
                    </p>
                  </div>
                </div>
              </InfoCard>
            ))}
          </div>
        </div>
      )}

      {/* Food */}
      <div>
        <SectionHeading>Food</SectionHeading>
        <InfoCard>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Food Available
              </p>
              <p className="text-sm font-semibold text-foreground">
                {property.foodIncluded ? "Yes (mess / tiffin)" : "Not available"}
              </p>
            </div>
            {property.foodIncluded && property.foodPrice && property.foodPrice > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Food charge
                </p>
                <p className="text-sm font-semibold text-foreground">
                  ₹{property.foodPrice.toLocaleString("en-IN")}/person/mo
                </p>
              </div>
            )}
          </div>
        </InfoCard>
      </div>

      {/* Utility Bills */}
      {(property.waterBill || property.electricityBill) && (
        <div>
          <SectionHeading>Utility Bills</SectionHeading>
          <InfoCard>
            <div className="grid grid-cols-2 gap-3">
              {property.waterBill && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Water bill
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {utilityLabel(property.waterBill)}
                  </p>
                </div>
              )}
              {property.electricityBill && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Electricity bill
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {utilityLabel(property.electricityBill)}
                  </p>
                </div>
              )}
            </div>
          </InfoCard>
        </div>
      )}

      {/* Timestamps */}
      <div className="border-t border-border pt-4 text-xs text-muted-foreground space-y-1">
        {property.createdAt && (
          <p>Created: {new Date(property.createdAt).toLocaleDateString()}</p>
        )}
        {property.updatedAt && (
          <p>Updated: {new Date(property.updatedAt).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

// ── Rent Detail Tab ───────────────────────────────────────────────────────────

const RentDetailsTab = ({ property }: { property: Property }) => {
  const isRoomOnly = property.rentType === "room-only";
  const occupancyPricing = property.occupancyPricing ?? [];

  const utilityLabel = (val: string | undefined) =>
    val === "included" ? "Included in rent" : "Tenant pays separately";

  return (
    <div className="space-y-4 mt-4">
      {/* Description */}
      <div>
        <SectionHeading>Description</SectionHeading>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {property.description || "No description available"}
        </p>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Rent Type</p>
          <p className="text-sm font-semibold text-foreground capitalize">
            {isRoomOnly ? "Room Only" : "Full Property"}
          </p>
        </div>

        {/* Price: flat for full, pricing tiers for room-only */}
        {!isRoomOnly ? (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Monthly Rent</p>
            <p className="text-base font-semibold text-foreground">
              ₹{property.price?.toLocaleString("en-IN")}
            </p>
          </div>
        ) : (
          occupancyPricing.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Rent starts from
              </p>
              <p className="text-base font-semibold text-foreground">
                ₹
                {Math.min(...occupancyPricing.map((t) => t.price || Infinity)).toLocaleString(
                  "en-IN"
                )}
                /mo
              </p>
            </div>
          )
        )}

        <FieldItem label="Location" value={property.location} />
        <FieldItem
          label="Area"
          value={property.area ? `${property.area} sq ft` : undefined}
        />
        {property.furnishing && (
          <FieldItem label="Furnishing" value={property.furnishing} capitalize />
        )}
        {!isRoomOnly && property.type && (
          <FieldItem label="Building Type" value={property.type} capitalize />
        )}
        {property.constructionDate && (
          <FieldItem label="Construction Date" value={property.constructionDate} />
        )}
        {property.postedBy && <FieldItem label="Posted By" value={property.postedBy} />}
        {property.role && <FieldItem label="Posted As" value={property.role} capitalize />}
        {property.contactNumber && (
          <FieldItem label="Contact" value={property.contactNumber} />
        )}
        {property.status && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
            <Badge variant="outline">{property.status}</Badge>
          </div>
        )}
      </div>

      {/* Occupancy Pricing — room-only */}
      {isRoomOnly && occupancyPricing.length > 0 && (
        <div>
          <SectionHeading>Rent by Occupancy</SectionHeading>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-3 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">
              <span>Persons</span>
              <span>Total rent / mo</span>
              <span>Per person</span>
            </div>
            {occupancyPricing.map((tier: any, idx: number) => {
              const perPerson =
                tier.occupants > 0 && tier.price > 0
                  ? Math.round(tier.price / tier.occupants)
                  : null;
              return (
                <div
                  key={tier.id ?? idx}
                  className={`grid grid-cols-3 px-3 py-2 text-sm ${
                    idx % 2 === 0 ? "bg-muted/10" : ""
                  }`}
                >
                  <span className="text-foreground font-medium">{tier.occupants}</span>
                  <span className="text-foreground font-medium">
                    ₹{tier.price?.toLocaleString("en-IN")}
                  </span>
                  <span className="text-muted-foreground">
                    {perPerson
                      ? `₹${perPerson.toLocaleString("en-IN")}`
                      : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Room Details — full property */}
      {!isRoomOnly &&
        (property as any).rooms?.length > 0 && (
          <div>
            <SectionHeading>Room Details</SectionHeading>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="grid grid-cols-2 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                <span>Room</span>
                <span>Units</span>
              </div>
              {(property as any).rooms.map((room: any, idx: number) => (
                <div
                  key={idx}
                  className={`grid grid-cols-2 px-3 py-2 text-sm ${
                    idx % 2 === 0 ? "bg-muted/10" : ""
                  }`}
                >
                  <span className="text-foreground font-medium">{room.name || "—"}</span>
                  <span className="text-muted-foreground">{room.count ?? "—"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Utility Bills */}
      {(property.waterBill || property.electricityBill) && (
        <div>
          <SectionHeading>Utility Bills</SectionHeading>
          <InfoCard>
            <div className="grid grid-cols-2 gap-3">
              {property.waterBill && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Water bill
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {utilityLabel(property.waterBill)}
                  </p>
                </div>
              )}
              {property.electricityBill && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Electricity bill
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {utilityLabel(property.electricityBill)}
                  </p>
                </div>
              )}
            </div>
          </InfoCard>
        </div>
      )}

      {/* Timestamps */}
      <div className="border-t border-border pt-4 text-xs text-muted-foreground space-y-1">
        {property.createdAt && (
          <p>Created: {new Date(property.createdAt).toLocaleDateString()}</p>
        )}
        {property.updatedAt && (
          <p>Updated: {new Date(property.updatedAt).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

// ── Buy Detail Tab ────────────────────────────────────────────────────────────

const BuyDetailsTab = ({ property }: { property: Property | CommercialProperty }) => (
  <div className="space-y-4 mt-4">
    <div>
      <SectionHeading>Description</SectionHeading>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {property.description || "No description available"}
      </p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      {[
        { label: "Price", value: `₹${property.price?.toLocaleString("en-IN")}` },
        { label: "Property Type", value: property.type, capitalize: true },
        { label: "Location", value: property.location },
        { label: "Area", value: property.area ? `${property.area} sq ft` : undefined },
        (property as any).constructionDate && {
          label: "Construction Date",
          value: (property as any).constructionDate,
        },
        (property as any).constructionStatus && {
          label: "Construction Status",
          value: (property as any).constructionStatus,
          capitalize: true,
        },
        (property as any).completionDate && {
          label: "Completion Date",
          value: (property as any).completionDate,
        },
        (property as any).furnishing && {
          label: "Furnishing",
          value: (property as any).furnishing,
          capitalize: true,
        },
        property.postedBy && { label: "Posted By", value: property.postedBy },
        property.role && { label: "Posted As", value: property.role, capitalize: true },
        (property as any).contactNumber && {
          label: "Contact",
          value: (property as any).contactNumber,
        },
      ]
        .filter(Boolean)
        .map((item: any) => (
          <FieldItem
            key={item.label}
            label={item.label}
            value={item.value}
            capitalize={item.capitalize}
          />
        ))}

      {property.status && (
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
          <Badge variant="outline">{property.status}</Badge>
        </div>
      )}
    </div>

    {/* Room Details */}
    {"rooms" in property && (property as any).rooms?.length > 0 && (
      <div>
        <SectionHeading>Room Details</SectionHeading>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-2 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">
            <span>Room</span>
            <span>Units</span>
          </div>
          {(property as any).rooms.map((room: any, idx: number) => (
            <div
              key={idx}
              className={`grid grid-cols-2 px-3 py-2 text-sm ${
                idx % 2 === 0 ? "bg-muted/10" : ""
              }`}
            >
              <span className="text-foreground font-medium">{room.name || "—"}</span>
              <span className="text-muted-foreground">{room.count ?? "—"}</span>
            </div>
          ))}
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
  </div>
);

// ── PG Gallery Tab ────────────────────────────────────────────────────────────

const PGGalleryTab = ({
  property,
  currentImageIndex,
  setCurrentImageIndex,
  openLightbox,
}: {
  property: Property;
  currentImageIndex: number;
  setCurrentImageIndex: (i: number) => void;
  openLightbox: (i: number) => void;
}) => {
  const pgRooms = (property as any).pgRooms ?? [];

  type ImageSection = { label: string; images: string[] };
  const sections: ImageSection[] = [];

  // Per-room image sections
  pgRooms.forEach((room: any) => {
    if (room.images?.length > 0) {
      const label =
        room.type === "single"
          ? "Single Room"
          : room.type === "double"
          ? "Double Room"
          : "Triple Room";
      sections.push({ label, images: room.images });
    }
  });

  // Building / common area photos
  if ((property.images ?? []).length > 0) {
    sections.push({ label: "Building / Common Areas", images: property.images as string[] });
  }

  const allImages = sections.flatMap((s) => s.images);

  if (allImages.length === 0) {
    return (
      <div className="text-center py-12 mt-4">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const currentImage = allImages[currentImageIndex] ?? null;

  return (
    <div className="space-y-4 mt-4">
      {/* Main image viewer */}
      <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
        {currentImage ? (
          <img
            src={currentImage}
            alt={`Image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain cursor-zoom-in"
            onClick={() => openLightbox(currentImageIndex)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Image not available</span>
          </div>
        )}
        {allImages.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentImageIndex(
                  (currentImageIndex - 1 + allImages.length) % allImages.length
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-1.5 rounded-full transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex((currentImageIndex + 1) % allImages.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-1.5 rounded-full transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded text-xs">
          {currentImageIndex + 1} / {allImages.length}
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-xs">
          Click to enlarge
        </div>
      </div>

      {/* Section thumbnails */}
      {sections.map((section, sIdx) => (
        <div key={sIdx}>
          <p className="text-xs text-muted-foreground mb-2 font-medium">{section.label}</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {section.images.map((img, iIdx) => {
              const globalIdx = sections
                .slice(0, sIdx)
                .reduce((acc, s) => acc + s.images.length, 0) + iIdx;
              return (
                <button
                  key={iIdx}
                  onClick={() => setCurrentImageIndex(globalIdx)}
                  className={`relative rounded overflow-hidden border-2 transition-all ${
                    currentImageIndex === globalIdx
                      ? "border-primary ring-1 ring-primary"
                      : "border-transparent hover:border-muted-foreground/40"
                  }`}
                >
                  <div className="aspect-square bg-muted">
                    <img
                      src={img}
                      alt={`${section.label} ${iIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {currentImageIndex === globalIdx && (
                    <div className="absolute inset-0 bg-primary/10" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Main Modal ────────────────────────────────────────────────────────────────

const PropertyDetailModal = ({ open, onClose, property }: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const listingType = (property as Property).listingType ?? "buy";
  const isPG   = listingType === "pg";
  const isRent = listingType === "rent";

  // For non-PG listings the gallery images come from property.images
  const images = isPG
    ? [] // PG gallery handled separately in PGGalleryTab
    : property.images ?? [];

  // Total image count for the gallery badge
  const pgAllImages = isPG
    ? [
        ...((property as any).pgRooms ?? []).flatMap((r: any) => r.images ?? []),
        ...(property.images ?? []),
      ]
    : [];
  const galleryCount = isPG ? pgAllImages.length : images.length;

  const currentImage = images[currentImageIndex] ?? null;
  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);
  const openLightbox = (idx: number) => {
    setCurrentImageIndex(idx);
    setLightboxOpen(true);
  };

  // Lightbox image: PG uses pgAllImages, others use images
  const lightboxImages = isPG ? pgAllImages : images;
  const lightboxImage  = lightboxImages[currentImageIndex] ?? null;

  const lightboxNext = () => setCurrentImageIndex((p) => (p + 1) % lightboxImages.length);
  const lightboxPrev = () =>
    setCurrentImageIndex((p) => (p - 1 + lightboxImages.length) % lightboxImages.length);

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
                {galleryCount > 0 && (
                  <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                    {galleryCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* ── DETAILS TAB — branched by listing type ── */}
            <TabsContent value="details">
              {isPG ? (
                <PGDetailsTab property={property as Property} />
              ) : isRent ? (
                <RentDetailsTab property={property as Property} />
              ) : (
                <BuyDetailsTab property={property} />
              )}
            </TabsContent>

            {/* ── AMENITIES TAB ── */}
            <TabsContent value="amenities" className="mt-4">
              {isPG ? (
                // PG amenities are shown inside the Details tab; here show a note or repeat
                (property as Property).pgAmenities?.length ? (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">PG Amenities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(property as Property).pgAmenities!.map((a, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                          <span className="text-green-400 text-sm">✓</span>
                          <span className="text-sm text-foreground">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No amenities listed</p>
                  </div>
                )
              ) : property.amenities?.length ? (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Available Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {property.amenities.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                        <span className="text-green-400 text-sm">✓</span>
                        <span className="text-sm text-foreground">{a}</span>
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

            {/* ── GALLERY TAB ── */}
            <TabsContent value="gallery" className="mt-4">
              {isPG ? (
                <PGGalleryTab
                  property={property as Property}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                  openLightbox={openLightbox}
                />
              ) : images.length > 0 ? (
                <div className="space-y-3">
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
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded text-xs">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-xs">
                      Click to enlarge
                    </div>
                  </div>

                  {images.length > 1 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        All Images ({images.length})
                      </p>
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
                            <div className="aspect-square bg-muted">
                              <img
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
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

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>

          {lightboxImages.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
              onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <img
            src={lightboxImage}
            alt="Lightbox"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {lightboxImages.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
              onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {lightboxImages.length}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyDetailModal;