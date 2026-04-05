// ── Individual room inside a property ──
export interface RoomDetail {
  name: string;      // e.g. "Master Bedroom", "Kitchen"
  length?: number;   // in feet
  width?: number;    // in feet
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
  facing?: "north" | "south" | "east" | "west";
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