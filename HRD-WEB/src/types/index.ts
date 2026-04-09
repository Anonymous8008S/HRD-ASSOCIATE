// ── Individual room inside a property ──
export interface RoomDetail {
  name: string;      // e.g. "Master Bedroom", "Kitchen"
  length?: number;   // in feet
  width?: number;    // in feet
  count?: number;    // number of rooms of this type
}

export interface Property {
  id?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  rooms?: RoomDetail[];
  type: "apartment" | "house" | "villa" | "plot";
  images: string[];
  status?: "approved" | "pending" | "rejected";
  role?: "admin" | "agent";
  postedBy?: string;
  constructionDate?: string;
  constructionStatus?: "ongoing" | "completed";
  completionDate?: string;
  facing?: "north" | "south" | "east" | "west";
  furnishing?: "fully-furnished" | "semi-furnished" | "unfurnished";
  amenities?: string[];
  createdAt?: string;
  updatedAt?: string;
}

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
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;       // admin-only internal notes
  createdAt: string;
  updatedAt: string;
}

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