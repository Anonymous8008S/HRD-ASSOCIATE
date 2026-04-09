import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, BedDouble, Bath, Maximize, Phone, ArrowLeft,
  Check, Calendar, MessageCircle, Share2,
  Ruler, ChevronLeft, ChevronRight, X, Users, Utensils,
  Zap, Droplets, Home, Building2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import PropertyImageGallery from "../components/PropertyImageGallery";
import usePropertyStore from "../stores/usePropertyStore";
import type { Property } from "@/types";

// ─── Agent contact map ──────────────────────────────────────────────────────
const agentContacts: Record<string, { name: string; phone: string; whatsapp: string }> = {
  default: { name: "Sales Agent", phone: "+91 98765 43210", whatsapp: "919876543210" },
};

const formatPrice = (price: number) => {
  const p = Number(price);
  if (p >= 10_000_000) return `₹${(p / 10_000_000).toFixed(2)} Cr`;
  if (p >= 100_000) return `₹${(p / 100_000).toFixed(2)} L`;
  return `₹${p.toLocaleString("en-IN")}`;
};

const utilityLabel = (val: string | undefined) =>
  val === "included" ? "Included in rent" : "Tenant pays separately";

// ─── Shared UI primitives ────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">{children}</h2>
);

const InfoCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">{children}</div>
);

const FieldPair = ({
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
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-sm font-semibold text-foreground ${capitalize ? "capitalize" : ""}`}>
        {String(value)}
      </p>
    </div>
  );
};

// ─── PG Section ──────────────────────────────────────────────────────────────

const PGSection = ({ property }: { property: Property }) => {
  const pgRooms = (property as any).pgRooms ?? [];
  const pgAmenities: string[] = property.pgAmenities ?? [];

  const typeLabel: Record<string, string> = {
    single: "Single (1 bed)",
    double: "Double (2 beds)",
    triple: "Triple (3 beds)",
  };

  return (
    <div className="space-y-8">
      {/* Description */}
      <ScrollReveal delay={100}>
        <div>
          <SectionTitle>Description</SectionTitle>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {property.description || "No description available"}
          </p>
        </div>
      </ScrollReveal>

      {/* Basic Info */}
      <ScrollReveal delay={150}>
        <div>
          <SectionTitle>PG Details</SectionTitle>
          <InfoCard>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <FieldPair label="Location" value={property.location} />
              <FieldPair
                label="PG For"
                value={
                  property.gender === "male"
                    ? "Male"
                    : property.gender === "female"
                    ? "Female"
                    : "Any Gender"
                }
              />
              {property.postedBy && <FieldPair label="Posted By" value={property.postedBy} />}
              {property.role && <FieldPair label="Posted As" value={property.role} capitalize />}
              {property.contactNumber && (
                <FieldPair label="Contact" value={property.contactNumber} />
              )}
            </div>
          </InfoCard>
        </div>
      </ScrollReveal>

      {/* Room Types */}
      {pgRooms.length > 0 && (
        <ScrollReveal delay={200}>
          <div>
            <SectionTitle>Room Types & Availability</SectionTitle>
            <div className="space-y-3">
              {pgRooms.map((room: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-secondary/30 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-gold-dark" />
                      <p className="text-sm font-semibold text-foreground">
                        {typeLabel[room.type] ?? room.type}
                      </p>
                    </div>
                    {room.attachedBathroom !== undefined && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground border border-border">
                        {room.attachedBathroom ? "Attached bathroom" : "Common bathroom"}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                        Price / person
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        ₹{room.pricePerPerson?.toLocaleString("en-IN") ?? "—"}/mo
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                        Total rooms
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {room.totalRooms ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                        Available
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          room.availableRooms > 0 ? "text-green-500" : "text-red-400"
                        }`}
                      >
                        {room.availableRooms ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Food */}
      <ScrollReveal delay={225}>
        <div>
          <SectionTitle>Food</SectionTitle>
          <InfoCard>
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="w-4 h-4 text-gold-dark" />
              <p className="text-sm font-semibold text-foreground">
                {property.foodIncluded ? "Mess / tiffin available" : "Food not provided"}
              </p>
            </div>
            {property.foodIncluded && property.foodPrice && property.foodPrice > 0 && (
              <p className="text-sm text-muted-foreground">
                ₹{property.foodPrice.toLocaleString("en-IN")} / person / month
              </p>
            )}
          </InfoCard>
        </div>
      </ScrollReveal>

      {/* Utility Bills */}
      {(property.waterBill || property.electricityBill) && (
        <ScrollReveal delay={250}>
          <div>
            <SectionTitle>Utility Bills</SectionTitle>
            <InfoCard>
              <div className="grid grid-cols-2 gap-4">
                {property.waterBill && (
                  <div className="flex items-start gap-2">
                    <Droplets className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Water</p>
                      <p className="text-sm font-semibold text-foreground">
                        {utilityLabel(property.waterBill)}
                      </p>
                    </div>
                  </div>
                )}
                {property.electricityBill && (
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Electricity</p>
                      <p className="text-sm font-semibold text-foreground">
                        {utilityLabel(property.electricityBill)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </InfoCard>
          </div>
        </ScrollReveal>
      )}

      {/* Amenities */}
      {pgAmenities.length > 0 && (
        <ScrollReveal delay={275}>
          <div>
            <SectionTitle>PG Amenities</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {pgAmenities.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-gold-dark" />
                  </span>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
};

// ─── PG Gallery ──────────────────────────────────────────────────────────────

const PGGallery = ({
  property,
  onLightbox,
}: {
  property: Property;
  onLightbox: (images: string[], idx: number) => void;
}) => {
  const pgRooms = (property as any).pgRooms ?? [];
  const [currentIdx, setCurrentIdx] = useState(0);

  type ImageSection = { label: string; images: string[] };
  const sections: ImageSection[] = [];

  pgRooms.forEach((room: any) => {
    if (room.images?.length > 0) {
      const label =
        room.type === "single" ? "Single Room" : room.type === "double" ? "Double Room" : "Triple Room";
      sections.push({ label, images: room.images });
    }
  });

  if ((property.images ?? []).length > 0) {
    sections.push({ label: "Building / Common Areas", images: property.images as string[] });
  }

  const allImages = sections.flatMap((s) => s.images);

  if (allImages.length === 0) return (
    <div className="flex items-center justify-center h-64 bg-secondary/30 rounded-2xl">
      <p className="text-muted-foreground text-sm">No images available</p>
    </div>
  );

  const currentImage = allImages[currentIdx];

  return (
    <div className="space-y-3">
      <div className="relative w-full aspect-video bg-muted rounded-2xl overflow-hidden">
        <img
          src={currentImage}
          alt={`Image ${currentIdx + 1}`}
          className="w-full h-full object-contain cursor-zoom-in"
          onClick={() => onLightbox(allImages, currentIdx)}
        />
        {allImages.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIdx((p) => (p - 1 + allImages.length) % allImages.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentIdx((p) => (p + 1) % allImages.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-0.5 rounded text-xs">
          {currentIdx + 1} / {allImages.length}
        </div>
        <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-0.5 rounded text-xs">
          Click to enlarge
        </div>
      </div>

      {sections.map((section, sIdx) => (
        <div key={sIdx}>
          <p className="text-xs text-muted-foreground mb-2 font-medium">{section.label}</p>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {section.images.map((img, iIdx) => {
              const globalIdx = sections.slice(0, sIdx).reduce((a, s) => a + s.images.length, 0) + iIdx;
              return (
                <button
                  key={iIdx}
                  onClick={() => setCurrentIdx(globalIdx)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    currentIdx === globalIdx ? "border-gold-dark ring-1 ring-gold-dark" : "border-transparent hover:border-muted-foreground/40"
                  }`}
                >
                  <div className="aspect-square bg-muted">
                    <img src={img} alt={`${section.label} ${iIdx + 1}`} className="w-full h-full object-cover" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Rent Section ────────────────────────────────────────────────────────────

const RentSection = ({ property }: { property: Property }) => {
  const isRoomOnly = property.rentType === "room-only";
  const occupancyPricing = property.occupancyPricing ?? [];

  return (
    <div className="space-y-8">
      {/* Description */}
      <ScrollReveal delay={100}>
        <div>
          <SectionTitle>Description</SectionTitle>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {property.description || "No description available"}
          </p>
        </div>
      </ScrollReveal>

      {/* Basic Info */}
      <ScrollReveal delay={150}>
        <div>
          <SectionTitle>Rental Details</SectionTitle>
          <InfoCard>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <FieldPair
                label="Rent Type"
                value={isRoomOnly ? "Room Only" : "Full Property"}
              />
              {!isRoomOnly && (
                <FieldPair
                  label="Monthly Rent"
                  value={`₹${property.price?.toLocaleString("en-IN")}`}
                />
              )}
              {isRoomOnly && occupancyPricing.length > 0 && (
                <FieldPair
                  label="Rent Starts From"
                  value={`₹${Math.min(...occupancyPricing.map((t: any) => t.price || Infinity)).toLocaleString("en-IN")}/mo`}
                />
              )}
              <FieldPair label="Location" value={property.location} />
              {property.area && <FieldPair label="Area" value={`${property.area} sq ft`} />}
              {property.furnishing && <FieldPair label="Furnishing" value={property.furnishing} capitalize />}
              {!isRoomOnly && property.type && <FieldPair label="Building Type" value={property.type} capitalize />}
              {property.constructionDate && <FieldPair label="Construction Date" value={property.constructionDate} />}
              {property.postedBy && <FieldPair label="Posted By" value={property.postedBy} />}
              {property.role && <FieldPair label="Posted As" value={property.role} capitalize />}
              {property.contactNumber && <FieldPair label="Contact" value={property.contactNumber} />}
            </div>
          </InfoCard>
        </div>
      </ScrollReveal>

      {/* Occupancy Pricing (room-only) */}
      {isRoomOnly && occupancyPricing.length > 0 && (
        <ScrollReveal delay={200}>
          <div>
            <SectionTitle>Rent by Occupancy</SectionTitle>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-3 bg-secondary/60 px-4 py-2.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">
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
                    className={`grid grid-cols-3 px-4 py-3 text-sm border-t border-border ${
                      idx % 2 === 0 ? "bg-secondary/20" : ""
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-foreground font-medium">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      {tier.occupants}
                    </span>
                    <span className="text-foreground font-semibold">
                      ₹{tier.price?.toLocaleString("en-IN")}
                    </span>
                    <span className="text-muted-foreground">
                      {perPerson ? `₹${perPerson.toLocaleString("en-IN")}` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Room Details (full property) */}
      {!isRoomOnly && (property as any).rooms?.length > 0 && (
        <ScrollReveal delay={200}>
          <div>
            <SectionTitle>Room Details</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(property as any).rooms.map((room: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-secondary/40 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                    <Ruler className="w-4 h-4 text-gold-dark shrink-0" />
                    {room.name}
                  </div>
                  {room.count && room.count > 1 && (
                    <span className="text-xs text-muted-foreground font-medium">× {room.count}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Utility Bills */}
      {(property.waterBill || property.electricityBill) && (
        <ScrollReveal delay={225}>
          <div>
            <SectionTitle>Utility Bills</SectionTitle>
            <InfoCard>
              <div className="grid grid-cols-2 gap-4">
                {property.waterBill && (
                  <div className="flex items-start gap-2">
                    <Droplets className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Water</p>
                      <p className="text-sm font-semibold text-foreground">{utilityLabel(property.waterBill)}</p>
                    </div>
                  </div>
                )}
                {property.electricityBill && (
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Electricity</p>
                      <p className="text-sm font-semibold text-foreground">{utilityLabel(property.electricityBill)}</p>
                    </div>
                  </div>
                )}
              </div>
            </InfoCard>
          </div>
        </ScrollReveal>
      )}

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <ScrollReveal delay={250}>
          <div>
            <SectionTitle>Amenities</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((a: string) => (
                <div key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-gold-dark" />
                  </span>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
};

// ─── Buy Section (existing logic, kept intact) ───────────────────────────────

const BuySection = ({ property }: { property: Property }) => {
  const getBedroomCount = () => {
    if (!property?.rooms) return property?.bedrooms || 0;
    const bedrooms = property.rooms.filter((r: any) => r.name?.toLowerCase() === "bedroom");
    return bedrooms.reduce((sum: number, r: any) => sum + (r.count || 1), 0);
  };

  const getBathroomCount = () => {
    if (!property?.rooms) return property?.bathrooms || 0;
    const bathrooms = property.rooms.filter((r: any) => r.name?.toLowerCase() === "bathroom");
    return bathrooms.reduce((sum: number, r: any) => sum + (r.count || 1), 0);
  };

  return (
    <div className="space-y-8">
      {/* Stats Bar */}
      <ScrollReveal delay={100}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: <BedDouble className="w-5 h-5" />, value: getBedroomCount(), label: "Bedrooms" },
            { icon: <Bath className="w-5 h-5" />, value: getBathroomCount(), label: "Bathrooms" },
            { icon: <Maximize className="w-5 h-5" />, value: property.area ? `${property.area} sq ft` : "—", label: "Area" },
          ].map(({ icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-1.5 bg-secondary/50 rounded-xl p-4 text-center"
            >
              <span className="text-gold-dark">{icon}</span>
              <p className="text-sm font-semibold text-foreground leading-tight">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Description */}
      <ScrollReveal delay={150}>
        <div>
          <SectionTitle>Description</SectionTitle>
          <p className="text-muted-foreground leading-relaxed text-sm">{property.description}</p>
        </div>
      </ScrollReveal>

      {/* Room Details */}
      {property.rooms && property.rooms.length > 0 && (
        <ScrollReveal delay={175}>
          <div>
            <SectionTitle>Room Details</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.rooms.map((room: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-secondary/40 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                    <Ruler className="w-4 h-4 text-gold-dark shrink-0" />
                    {room.name}
                  </div>
                  {room.count && room.count > 1 && (
                    <span className="text-xs text-muted-foreground font-medium">× {room.count}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <ScrollReveal delay={200}>
          <div>
            <SectionTitle>Amenities</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((a: string) => (
                <div key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-gold-dark" />
                  </span>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
};

// ─── Sidebar: PG pricing summary ─────────────────────────────────────────────

const PGSidebarPricing = ({ property }: { property: Property }) => {
  const pgRooms = (property as any).pgRooms ?? [];
  if (pgRooms.length === 0) return null;

  const minPrice = Math.min(...pgRooms.map((r: any) => r.pricePerPerson ?? Infinity));

  return (
    <>
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Starts From</p>
      <p className="text-4xl font-heading font-bold text-gold-dark mb-1">
        ₹{minPrice.toLocaleString("en-IN")}
        <span className="text-base font-normal text-muted-foreground ml-1">/person/mo</span>
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {pgRooms.map((room: any, i: number) => (
          <span
            key={i}
            className="text-xs bg-muted border border-border rounded-full px-2.5 py-1 text-muted-foreground"
          >
            {room.type === "single" ? "Single" : room.type === "double" ? "Double" : "Triple"} —{" "}
            <span className={room.availableRooms > 0 ? "text-green-500" : "text-red-400"}>
              {room.availableRooms > 0 ? `${room.availableRooms} available` : "Full"}
            </span>
          </span>
        ))}
      </div>
    </>
  );
};

// ─── Sidebar: Rent pricing summary ───────────────────────────────────────────

const RentSidebarPricing = ({ property }: { property: Property }) => {
  const isRoomOnly = property.rentType === "room-only";
  const occupancyPricing = property.occupancyPricing ?? [];

  if (isRoomOnly && occupancyPricing.length > 0) {
    const minPrice = Math.min(...occupancyPricing.map((t: any) => t.price || Infinity));
    return (
      <>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Starts From</p>
        <p className="text-4xl font-heading font-bold text-gold-dark mb-1">
          ₹{minPrice.toLocaleString("en-IN")}
          <span className="text-base font-normal text-muted-foreground ml-1">/mo</span>
        </p>
        <p className="text-xs text-muted-foreground mb-6">Room only · price varies by occupancy</p>
      </>
    );
  }

  return (
    <>
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Monthly Rent</p>
      <p className="text-4xl font-heading font-bold text-gold-dark mb-6">
        ₹{property.price?.toLocaleString("en-IN")}
        <span className="text-base font-normal text-muted-foreground ml-1">/mo</span>
      </p>
    </>
  );
};

// ─── Lightbox ────────────────────────────────────────────────────────────────

const Lightbox = ({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) => {
  const [idx, setIdx] = useState(startIndex);
  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>
      {images.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          onClick={(e) => { e.stopPropagation(); setIdx((p) => (p - 1 + images.length) % images.length); }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      <img
        src={images[idx]}
        alt="Lightbox"
        className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      {images.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          onClick={(e) => { e.stopPropagation(); setIdx((p) => (p + 1) % images.length); }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
        {idx + 1} / {images.length}
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { properties, fetchApproved, loading } = usePropertyStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [lightbox, setLightbox] = useState<{ images: string[]; idx: number } | null>(null);

  useEffect(() => {
    if (properties.length === 0) fetchApproved();
  }, []);

  useEffect(() => {
    if (properties.length > 0 && id) {
      setProperty(properties.find((p) => p.id === id) ?? null);
    }
  }, [properties, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-gold-dark border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Loading property…</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
          <p className="text-2xl font-heading font-bold text-foreground">Property not found</p>
          <Link to="/properties" className="text-sm text-gold-dark underline underline-offset-4">
            ← Back to Properties
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const listingType = (property as any).listingType ?? "buy";
  const isPG   = listingType === "pg";
  const isRent = listingType === "rent";
  const isBuy  = !isPG && !isRent;

  const agent = agentContacts[property.postedBy ?? "default"] ?? agentContacts["default"];
  // For PG/Rent, prefer property.contactNumber if available
  const contactPhone = property.contactNumber || agent.phone;
  const whatsappNum  = property.contactNumber
    ? property.contactNumber.replace(/\D/g, "")
    : agent.whatsapp;

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in "${property.title}" in ${property.location}. Could you please share more details?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${whatsappMessage}`;

  // Gallery images for non-PG
  const images = property.images ?? [];
  // PG all images (for lightbox from standard gallery)
  const pgAllImages = isPG
    ? [
        ...((property as any).pgRooms ?? []).flatMap((r: any) => r.images ?? []),
        ...(property.images ?? []),
      ]
    : [];

  // Sidebar quick facts differ per listing type
  const quickFacts = isPG
    ? [
        { label: "PG For", value: property.gender === "male" ? "Male" : property.gender === "female" ? "Female" : "Any Gender" },
        { label: "Food", value: property.foodIncluded ? "Available" : "Not provided" },
        { label: "Location", value: property.location },
        ...(property.postedBy ? [{ label: "Posted By", value: property.postedBy }] : []),
      ]
    : isRent
    ? [
        { label: "Rent Type", value: property.rentType === "room-only" ? "Room Only" : "Full Property" },
        { label: "Property Type", value: property.type },
        { label: "Area", value: property.area ? `${property.area} sq ft` : undefined },
        { label: "Furnishing", value: property.furnishing },
      ].filter((f) => f.value)
    : [
        { label: "Property Type", value: property.type },
        { label: "Area", value: property.area ? `${property.area} sq ft` : undefined },
        { label: "Status", value: property.constructionStatus === "ongoing" ? "Under Construction" : "Completed" },
        ...(property.constructionStatus === "completed" && property.completionDate
          ? [{ label: "Completed", value: new Date(property.completionDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) }]
          : []),
        ...(property.type === "apartment" && property.furnishing
          ? [{ label: "Furnishing", value: property.furnishing.replace(/-/g, " ") }]
          : []),
        ...(property.constructionDate
          ? [{ label: "Built", value: new Date(property.constructionDate).getFullYear().toString() }]
          : []),
      ].filter((f) => f.value);

  // Listing type badge config
  const listingBadge = isPG
    ? { label: "PG / Hostel", icon: <Home className="w-3 h-3" /> }
    : isRent
    ? { label: "For Rent", icon: <Building2 className="w-3 h-3" /> }
    : { label: property.type, icon: <Building2 className="w-3 h-3" /> };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">

          {/* Back + Actions */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Properties
            </Link>
            <button
              onClick={() => navigator.share?.({ title: property.title, url: window.location.href })}
              className="p-2 rounded-full border border-border hover:bg-secondary transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Gallery */}
          {isPG ? (
            <PGGallery
              property={property}
              onLightbox={(imgs, idx) => setLightbox({ images: imgs, idx })}
            />
          ) : (
            <PropertyImageGallery images={images} title={property.title} />
          )}

          <div className="grid lg:grid-cols-3 gap-10 mt-8">

            {/* ─── Left Column ─── */}
            <div className="lg:col-span-2">

              {/* Title + Meta */}
              <ScrollReveal>
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="bg-gold/10 text-gold-dark text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 capitalize">
                      {listingBadge.icon}
                      {listingBadge.label}
                    </span>
                    {!isPG && property.constructionStatus && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {property.constructionStatus === "completed"
                          ? property.completionDate
                            ? `Completed ${new Date(property.completionDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`
                            : "Completed"
                          : "Under Construction"}
                      </span>
                    )}
                    {property.status && (
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                          property.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : property.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {property.status}
                      </span>
                    )}
                  </div>
                  <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-2" style={{ lineHeight: "1.25" }}>
                    {property.title}
                  </h1>
                  <p className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4 shrink-0" /> {property.location}
                  </p>
                </div>
              </ScrollReveal>

              {/* Listing-type specific content */}
              {isPG   && <PGSection   property={property} />}
              {isRent && <RentSection property={property} />}
              {isBuy  && <BuySection  property={property} />}
            </div>

            {/* ─── Right Sidebar ─── */}
            <div>
              <ScrollReveal direction="left">
                <div className="sticky top-24 space-y-5">

                  {/* Price + CTA Card */}
                  <div className="bg-card rounded-2xl shadow-md border border-border/50 p-6">
                    {/* Pricing — differs per type */}
                    {isPG   && <PGSidebarPricing   property={property} />}
                    {isRent && <RentSidebarPricing property={property} />}
                    {isBuy  && (
                      <>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Listed Price</p>
                        <p className="text-4xl font-heading font-bold text-gold-dark mb-6">
                          {formatPrice(property.price)}
                        </p>
                      </>
                    )}

                    {/* Agent / Owner Info */}
                    <div className="flex items-center gap-3 mb-5 p-3 bg-secondary/40 rounded-xl">
                      <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center shrink-0 text-gold-dark font-bold text-sm">
                        {(property.postedBy ?? agent.name).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {property.postedBy ?? agent.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {property.role ?? "Listed Agent"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <a
                        href={`tel:${contactPhone}`}
                        className="w-full bg-gold-gradient text-navy font-semibold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all shadow-sm"
                      >
                        <Phone className="w-4 h-4" /> Call {isPG ? "Owner" : isRent ? "Landlord" : "Agent"}
                      </a>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-navy text-gold border border-gold/30 font-semibold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Quick Facts */}
                  {quickFacts.length > 0 && (
                    <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-3">
                      <h3 className="font-heading text-sm font-semibold text-foreground">Quick Facts</h3>
                      {quickFacts.map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium text-foreground capitalize">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </div>

      <Footer />

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.idx}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
};

export default PropertyDetail;