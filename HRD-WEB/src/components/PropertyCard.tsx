import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Maximize, Clock, Home } from "lucide-react";

export type ListingType = "buy" | "rent" | "pg";
export type RentType = "full" | "room-only";

export interface PGRoom {
  id: string;
  type: "single" | "double" | "triple";
  pricePerPerson: number;
  beds: 1 | 2 | 3;
  totalRooms: number;
  availableRooms: number;
  attachedBathroom: boolean;
  images: string[];
}

export interface OccupancyPrice {
  id: string;
  occupants: number;
  price: number;
}

export interface RoomDetail {
  id?: string;
  name: string;
  count?: number;
}

export interface PropertyCardProps {
  id?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area?: string;
  bedrooms?: number;
  bathrooms?: number;
  rooms?: RoomDetail[];
  type?: "apartment" | "house" | "villa" | "plot";
  images: string[];
  status?: "approved" | "pending" | "rejected";
  role?: "admin" | "agent";
  postedBy?: string;
  constructionDate?: string;
  facing?: "north" | "south" | "east" | "west";
  furnishing?: "fully-furnished" | "semi-furnished" | "non-furnished";
  amenities?: string[];
  createdAt?: string;
  updatedAt?: string;
  listingType?: ListingType;
  rentType?: RentType;
  pgRooms?: PGRoom[];
  occupancyPricing?: OccupancyPrice[];
  gender?: "male" | "female" | "any";
  foodIncluded?: boolean;
  foodPrice?: number;
}

const TYPE_LABELS: Record<Exclude<PropertyCardProps["type"], undefined>, string> = {
  apartment: "Apartment",
  house: "House",
  villa: "Villa",
  plot: "Plot",
};

const STATUS_STYLES: Record<
  NonNullable<PropertyCardProps["status"]>,
  { bg: string; text: string; label: string }
> = {
  approved: { bg: "bg-emerald-500/90", text: "text-white", label: "Approved" },
  pending: { bg: "bg-amber-500/90", text: "text-white", label: "Pending" },
  rejected: { bg: "bg-red-500/90", text: "text-white", label: "Rejected" },
};

function formatPrice(price: number): string {
  if (price >= 10_000_000) {
    return `₹${(price / 10_000_000).toFixed(2)} Cr`;
  }
  if (price >= 100_000) {
    return `₹${(price / 100_000).toFixed(2)} L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

function getPriceDisplay(
  listingType: ListingType | undefined,
  price: number,
  occupancyPricing?: OccupancyPrice[],
  pgRooms?: PGRoom[],
  rentType?: RentType
): React.ReactNode {
  if (!listingType) {
    return formatPrice(price);
  }

  // BUY: Fixed price
  if (listingType === "buy") {
    return (
      <div className="flex flex-col">
        <span className="text-lg font-bold text-gold-dark">{formatPrice(price)}</span>
      </div>
    );
  }

  // RENT: Either fixed monthly or price range
  if (listingType === "rent") {
    if (rentType === "room-only" && occupancyPricing && occupancyPricing.length > 0) {
      const prices = occupancyPricing.map((t) => t.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gold-dark">
            {formatPrice(min)} — {formatPrice(max)}
          </span>
          <span className="text-xs font-normal text-muted-foreground">/ month</span>
        </div>
      );
    }
    // Full rent
    return (
      <div className="flex flex-col">
        <span className="text-lg font-bold text-gold-dark">{formatPrice(price)}</span>
        <span className="text-xs font-normal text-muted-foreground">/month</span>
      </div>
    );
  }

  // PG: Show minimum price
  if (listingType === "pg" && pgRooms && pgRooms.length > 0) {
    const prices = pgRooms.map((r) => r.pricePerPerson).filter((p) => p > 0);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gold-dark">
            ₹{minPrice.toLocaleString("en-IN")} — ₹{maxPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-xs font-normal text-muted-foreground">/month/person</span>
        </div>
      );
    }
  }

  return formatPrice(price);
}

function formatDate(dateStr?: string): string | null {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const PropertyCard = ({
  id,
  title,
  price,
  location,
  area,
  type = "apartment",
  images,
  bedrooms = 0,
  bathrooms = 0,
  status,
  role,
  createdAt,
  furnishing,
  listingType = "buy",
  rentType,
  pgRooms,
  occupancyPricing,
  gender,
  foodIncluded,
}: PropertyCardProps) => {
  // Pick first image, fall back to a placeholder
  const coverImage =
    images && images.length > 0
      ? images[0]
      : `https://placehold.co/800x600/1a2744/c9a84c?text=No+Image`;

  const statusStyle = status ? STATUS_STYLES[status] : null;
  const postedDate = formatDate(createdAt);
  const isPG = listingType === "pg";
  const isRent = listingType === "rent";

  return (
    <Link
      to={`/properties/${id}`}
      className="group flex flex-col h-full bg-card rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-border"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] flex-shrink-0">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Status badge — only shown to admin/agent */}
        {statusStyle && role && (
          <span
            className={`absolute top-3 left-3 ${statusStyle.bg} ${statusStyle.text} text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm`}
          >
            {statusStyle.label}
          </span>
        )}

        {/* Type badge */}
        <span className="absolute top-3 right-3 bg-navy/80 text-gold text-xs font-medium px-3 py-1 rounded backdrop-blur-sm">
          {isPG ? "PG" : type ? TYPE_LABELS[type] : "Property"}
        </span>
      </div>

      {/* Content - Flex grow to fill available space */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <p className="text-sm font-heading font-semibold text-foreground leading-snug mb-2 line-clamp-1">
          {title}
        </p>

        {/* Location */}
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </p>

        {/* Key Details Grid - 2 columns for better space usage */}
        <div className="space-y-2.5 mb-4">
          {/* Row 1: Main specs (Bed/Bath/Area) */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            {!isPG && type !== "plot" && (
              <>
                {bedrooms !== undefined && bedrooms > 0 && (
                  <div className="flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5 shrink-0 text-gold-dark" />
                    <span className="text-muted-foreground">
                      {bedrooms} {bedrooms === 1 ? "Bed" : "Beds"}
                    </span>
                  </div>
                )}
                {bathrooms !== undefined && bathrooms > 0 && (
                  <div className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 shrink-0 text-gold-dark" />
                    <span className="text-muted-foreground">
                      {bathrooms} {bathrooms === 1 ? "Bath" : "Baths"}
                    </span>
                  </div>
                )}
              </>
            )}

            {area && (
              <div className="flex items-center gap-1">
                <Maximize className="w-3.5 h-3.5 shrink-0 text-gold-dark" />
                <span className="text-muted-foreground line-clamp-1">{area}</span>
              </div>
            )}

            {isRent && (
              <div className="flex items-center gap-1">
                <Home className="w-3.5 h-3.5 shrink-0 text-gold-dark" />
                <span className="text-muted-foreground capitalize">
                  {rentType === "room-only" ? "Room Only" : "Full"}
                </span>
              </div>
            )}
          </div>

          {/* Row 2: Property specific details */}
          {isPG && (
            <div className="bg-muted/30 rounded p-2 space-y-1">
              <div className="text-gold-dark font-semibold text-xs">
                For{" "}
                {gender === "male"
                  ? "Male"
                  : gender === "female"
                  ? "Female"
                  : "Any"}
              </div>
              <div className="text-xs text-muted-foreground">
                Food: {foodIncluded ? "✓ Included" : "Not available"}
              </div>
              {pgRooms && pgRooms.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {pgRooms.length} room type{pgRooms.length > 1 ? "s" : ""} available
                </div>
              )}
            </div>
          )}

          {isRent && !isPG && (
            <div className="bg-muted/30 rounded p-2 space-y-1">
              {furnishing && (
                <div className="text-xs text-muted-foreground capitalize">
                  Furnishing: <span className="text-foreground font-medium">{furnishing.replace("-", " ")}</span>
                </div>
              )}
              {type && (
                <div className="text-xs text-muted-foreground capitalize">
                  Type: <span className="text-foreground font-medium">{TYPE_LABELS[type]}</span>
                </div>
              )}
            </div>
          )}

          {!isPG && !isRent && type && (
            <div className="bg-muted/30 rounded p-2 space-y-1">
              <div className="text-xs text-muted-foreground capitalize">
                Type: <span className="text-foreground font-medium">{TYPE_LABELS[type]}</span>
              </div>
              {furnishing && (
                <div className="text-xs text-muted-foreground capitalize">
                  Furnishing: <span className="text-foreground font-medium">{furnishing.replace("-", " ")}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price section - sticky to content */}
        <div className="mb-3 pt-2 border-t border-border/40">
          {getPriceDisplay(listingType, price, occupancyPricing, pgRooms, rentType)}
        </div>

        {/* Footer - Sticky to bottom with mt-auto */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-auto pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3 shrink-0" />
            <span className="truncate">{postedDate || "Recently posted"}</span>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap group-hover:text-foreground transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;