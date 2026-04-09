// ─────────────────────────────────────────────
// LISTING / PROPERTY TYPES
// ─────────────────────────────────────────────

/** Top-level intent of the listing */
export type ListingType = "buy" | "rent" | "pg";

/** Only relevant when listingType === "rent" */
export type RentType = "full" | "room-only";

// ── Individual room inside a Buy / Rent property ──
export interface RoomDetail {
  id: string;
  name: string;   // e.g. "Master Bedroom", "Kitchen"
  count: number;  // number of rooms of this type
}

// ── Dynamic rent tier for room-only listings ──
// Allows the owner to price differently based on how many people share the room.
// e.g. { occupants: 1, price: 7000 }  → 1 person pays ₹7,000 total
//      { occupants: 2, price: 9000 }  → 2 people share, each pays ₹4,500
export interface OccupancyPrice {
  id: string;
  occupants: number;  // number of people sharing the room (1, 2, 3…)
  price: number;      // total monthly rent for this occupancy count
}

// ── A single room-type entry inside a PG listing ──
export interface PGRoom {
  id: string;
  type: "single" | "double" | "triple";

  /**
   * What each individual resident pays per month.
   * Replaces the old ambiguous `price` field.
   */
  pricePerPerson: number;

  /**
   * Derived from type and stored for display convenience only.
   *   single → 1 | double → 2 | triple → 3
   * Never entered by the owner — set automatically on submit.
   */
  beds: 1 | 2 | 3;

  /** How many physical rooms of this type exist in the PG. */
  totalRooms: number;

  /** How many rooms of this type are currently unoccupied. */
  availableRooms: number;

  attachedBathroom: boolean;

  /** Photos specific to this room category (uploaded per room card). */
  images: string[];
}

export interface Property {
  id?: string;

  // ── Listing classification ──
  listingType: ListingType;
  rentType?: RentType;          // only when listingType === "rent"

  // ── Common fields (all listing types) ──
  title: string;
  description: string;

  /**
   * • buy         → sale price entered by owner
   * • rent full   → monthly rent entered by owner
   * • rent room   → auto-derived as Math.min(...occupancyPricing.map(t => t.price))
   * • pg          → auto-derived as Math.min(...pgRooms.map(r => r.pricePerPerson))
   * Stored for search / filter convenience in all cases.
   */
  price: number;

  location: string;             // "State, City"
  images: string[];             // common area / building photos
  contactNumber?: string;
  status?: "approved" | "pending" | "rejected";
  role?: "admin" | "agent";
  postedBy?: string;
  createdAt?: string;
  updatedAt?: string;

  // ── Property fields (buy + full-rent only) ──

  /**
   * For room-only rent this is the area of the individual room.
   * For all other types it is the total property area.
   */
  area?: string;                // sq ft

  /** Omitted for room-only rent listings. */
  bedrooms?: number;
  bathrooms?: number;
  rooms?: RoomDetail[];

  /**
   * Renamed in the UI to "Building Type".
   * Clearer option labels: "House / Independent Floor", "Plot / Land".
   */
  type?: "apartment" | "house" | "villa" | "plot";

  /** Omitted for room-only rent listings. */
  facing?: "north" | "south" | "east" | "west";

  /**
   * Shown for apartment, house, and villa.
   * Hidden (undefined) for plot.
   * Shown for ALL non-PG listing types including room-only rent.
   */
  furnishing?: "non-furnished" | "semi-furnished" | "fully-furnished";

  /** All three construction fields are omitted for room-only rent. */
  constructionDate?: string;
  constructionStatus?: "ongoing" | "completed";
  completionDate?: string;

  amenities?: string[];

  // ── Rent and PG utility bill fields ──

  /** Only present when listingType === "rent" or "pg". */
  waterBill?: "included" | "separate";

  /** Only present when listingType === "rent" or "pg". */
  electricityBill?: "included" | "separate";

  // ── Room-only rent: dynamic occupancy pricing ──

  /**
   * Only present when listingType === "rent" AND rentType === "room-only".
   *
   * Each tier defines the total rent for a given number of occupants sharing
   * the room. The per-person cost is derived as price / occupants for display.
   *
   * Example:
   *   [{ occupants: 1, price: 7000 }, { occupants: 2, price: 9000 }]
   *   → 1 person: ₹7,000 / month
   *   → 2 people: ₹9,000 / month total (₹4,500 each)
   */
  occupancyPricing?: OccupancyPrice[];

  // ── PG-only fields ──
  pgRooms?: PGRoom[];
  pgAmenities?: string[];
  gender?: "male" | "female" | "any";

  /**
   * foodIncluded : whether a mess / tiffin service is offered.
   * foodPrice    : what each resident pays per month for food only.
   * Shown separately from room price on the listing card.
   */
  foodIncluded?: boolean;
  foodPrice?: number;
}

// ─────────────────────────────────────────────
// COMMERCIAL PROPERTY
// ─────────────────────────────────────────────

export interface CommercialProperty {
  id?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area: string;
  type: "office" | "shop" | "warehouse" | "plot";
  images: string[];
  status?: "approved" | "pending" | "rejected";
  role?: "admin" | "agent";
  postedBy?: string;
  constructionDate?: string;
  facing?: "north" | "south" | "east" | "west";
  amenities?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────
// PACKERS & MOVERS
// ─────────────────────────────────────────────

export interface PackersMoversForm {
  name: string;
  phone: string;
  email: string;
  from: string;
  destination: string;
  date: string;
  time: string;
  floors: string;
  weight: string;
}

export interface PackersBooking extends PackersMoversForm {
  id?: string;
  status: "pending" | "confirmed" | "in_transit" | "delivered" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────

export interface Project {
  id?: string;
  name: string;
  description: string;
  location: string;
  totalUnits: number;
  startDate: string;
  expectedCompletion: string;
  status: "upcoming" | "ongoing" | "completed";
  images: string[];
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────
// INQUIRIES
// ─────────────────────────────────────────────

export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
  status: "new" | "contacted" | "closed";
  createdAt?: string;
}