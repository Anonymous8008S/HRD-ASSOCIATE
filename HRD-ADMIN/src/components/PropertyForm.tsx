import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import cityjson from "@/lib/state_city.json";
import { uploadFiles } from "@/lib/uploadFiles";
import { Loader2, Plus, Trash2, X, Lock } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import type {
  Property,
  RoomDetail,
  PGRoom,
  OccupancyPrice,
  ListingType,
  RentType,
} from "@/types";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const PROPERTY_AMENITIES = [
  "Swimming Pool", "Gym / Fitness Center", "Parking", "24/7 Security",
  "Power Backup", "Lift / Elevator", "Garden / Park", "Club House",
  "Children's Play Area", "CCTV Surveillance", "Intercom",
  "Water Supply 24/7", "Rainwater Harvesting", "Solar Panels", "Jogging Track",
];

const PG_AMENITIES = [
  "WiFi", "Laundry", "Daily Cleaning", "AC", "Power Backup",
  "CCTV", "Gated Security", "Hot Water", "Study Table",
  "Two-Wheeler Parking", "Attached Bathroom", "Common Bathroom",
];

const ROOM_PRESETS = [
  "Master Bedroom", "Bedroom", "Kitchen", "Hall", "Living Room",
  "Dining Room", "Bathroom", "Balcony", "Study Room", "Pooja Room",
  "Store Room", "Servant Room", "Garage", "Terrace",
];

const BEDS_BY_TYPE: Record<string, number> = {
  single: 1,
  double: 2,
  triple: 3,
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const emptyRoom = (): RoomDetail => ({ id: crypto.randomUUID(), name: "", count: 1 });

const emptyPGRoom = (): PGRoom => ({
  id: crypto.randomUUID(),
  type: "single",
  pricePerPerson: 0,
  beds: 1,
  totalRooms: 0,
  availableRooms: 0,
  attachedBathroom: false,
  images: [],
});

const emptyOccupancyTier = (): OccupancyPrice => ({
  id: crypto.randomUUID(),
  occupants: 1,
  price: 0,
});

const defaultForm = (): Partial<Property> => ({
  listingType: "buy",
  rentType: "full",
  title: "",
  description: "",
  price: 0,
  location: "",
  area: "",
  rooms: [],
  pgRooms: [],
  occupancyPricing: [],
  type: "apartment",
  constructionDate: "",
  constructionStatus: "ongoing",
  completionDate: "",
  furnishing: undefined,
  postedBy: "",
  amenities: [],
  pgAmenities: [],
  gender: "any",
  foodIncluded: false,
  foodPrice: 0,
  waterBill: "separate",
  electricityBill: "separate",
  images: [],
  role: "admin",
  contactNumber: "",
});

// ─────────────────────────────────────────────
// Sub: Utility Bills — used for Rent AND PG
// ─────────────────────────────────────────────

interface UtilityBillsProps {
  waterBill: string;
  electricityBill: string;
  onChange: (field: "waterBill" | "electricityBill", val: string) => void;
}

const UtilityBillsSection = ({ waterBill, electricityBill, onChange }: UtilityBillsProps) => (
  <div className="border border-border rounded-lg p-3 bg-muted/20 space-y-3">
    <Label className="text-sm font-medium">Utility Bills</Label>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <p className="text-xs text-muted-foreground mb-1">Water bill</p>
        <Select value={waterBill} onValueChange={(v) => onChange("waterBill", v)}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="included">Included in rent</SelectItem>
            <SelectItem value="separate">Tenant pays separately</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">Electricity bill</p>
        <Select value={electricityBill} onValueChange={(v) => onChange("electricityBill", v)}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="included">Included in rent</SelectItem>
            <SelectItem value="separate">Tenant pays separately</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Sub: Occupancy Pricing — rent room-only
// ─────────────────────────────────────────────

interface OccupancyPricingSectionProps {
  tiers: OccupancyPrice[];
  onChange: (tiers: OccupancyPrice[]) => void;
}

const OccupancyPricingSection = ({ tiers, onChange }: OccupancyPricingSectionProps) => {
  const usedOccupants = tiers.map((t) => t.occupants);

  const add = () => {
    let next = 1;
    while (usedOccupants.includes(next)) next++;
    onChange([...tiers, { ...emptyOccupancyTier(), occupants: next }]);
  };
  const remove = (id: string) => onChange(tiers.filter((t) => t.id !== id));
  const update = (id: string, patch: Partial<OccupancyPrice>) =>
    onChange(tiers.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  return (
    <div className="border border-border rounded-lg p-3 bg-muted/20 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Room Rent by Occupancy</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Set total monthly rent by number of people sharing. Per-person cost auto-calculated.
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={add}
          className="flex items-center gap-1 h-7 text-xs">
          <Plus className="w-3 h-3" /> Add Tier
        </Button>
      </div>

      {tiers.length === 0 && (
        <div className="text-center py-3 border border-dashed border-border rounded-lg">
          <p className="text-xs text-muted-foreground">E.g. 1 person = ₹7,000 · 2 people = ₹9,000</p>
        </div>
      )}

      <div className="space-y-2">
        {tiers.map((tier) => {
          const perPerson = tier.occupants > 0 && tier.price > 0
            ? Math.round(tier.price / tier.occupants) : null;
          return (
            <div key={tier.id}
              className="grid grid-cols-[110px_1fr_32px] gap-2 items-end bg-background border border-border rounded-lg px-3 py-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">No. of persons</p>
                <Input type="number" min={1} className="h-8 text-sm" value={tier.occupants || ""}
                  onChange={(e) => update(tier.id, { occupants: e.target.value === "" ? 1 : +e.target.value })} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Total rent / month (₹)
                  {perPerson !== null && (
                    <span className="ml-2 text-primary font-medium">
                      → ₹{perPerson.toLocaleString("en-IN")} per person
                    </span>
                  )}
                </p>
                <Input type="number" min={0} className="h-8 text-sm" placeholder="e.g. 7000"
                  value={tier.price || ""}
                  onChange={(e) => update(tier.id, { price: e.target.value === "" ? 0 : +e.target.value })} />
              </div>
              <button type="button" onClick={() => remove(tier.id)}
                className="text-destructive hover:text-destructive/70 transition p-1 mb-0.5">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {tiers.length > 0 && (
        <p className="text-xs text-muted-foreground bg-muted/40 border border-border rounded px-3 py-2">
          Listing will show starting from{" "}
          <span className="font-medium text-foreground">
            ₹{Math.min(...tiers.map((t) => t.price || Infinity)).toLocaleString("en-IN")}/month
          </span>
        </p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Sub: PG Rooms Section
// ─────────────────────────────────────────────

interface PGRoomsSectionProps {
  pgRooms: PGRoom[];
  onChange: (rooms: PGRoom[]) => void;
}

const PGRoomsSection = ({ pgRooms, onChange }: PGRoomsSectionProps) => {
  const usedTypes = pgRooms.map((r) => r.type);
  const availableTypes = (["single", "double", "triple"] as const).filter(
    (t) => !usedTypes.includes(t)
  );

  const add = () => {
    if (availableTypes.length === 0) return;
    onChange([...pgRooms, { ...emptyPGRoom(), type: availableTypes[0] }]);
  };
  const remove = (id: string) => onChange(pgRooms.filter((r) => r.id !== id));
  const update = (id: string, patch: Partial<PGRoom>) =>
    onChange(pgRooms.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const handleRoomImages = (id: string, files: FileList | null) => {
    if (!files) return;
    const room = pgRooms.find((r) => r.id === id);
    if (!room) return;
    const fileArray = Array.from(files);
    const previews = fileArray.map((f) => URL.createObjectURL(f));
    update(id, {
      images: [...(room.images || []), ...previews],
      _imageFiles: [...((room as any)._imageFiles || []), ...fileArray],
    } as any);
  };

  const removeRoomImage = (roomId: string, imgIdx: number) => {
    const room = pgRooms.find((r) => r.id === roomId);
    if (!room) return;
    update(roomId, {
      images: (room.images || []).filter((_, i) => i !== imgIdx),
      _imageFiles: ((room as any)._imageFiles || []).filter((_: any, i: number) => i !== imgIdx),
    } as any);
  };

  const typeLabel: Record<string, string> = {
    single: "Single (1 bed)",
    double: "Double (2 beds)",
    triple: "Triple (3 beds)",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <Label className="text-sm font-medium">PG Room Types</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Add one entry per room category (up to 3).</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={add}
          disabled={availableTypes.length === 0}
          className="flex items-center gap-1 h-7 text-xs">
          <Plus className="w-3 h-3" /> Add Room Type
        </Button>
      </div>

      {pgRooms.length === 0 && (
        <div className="text-center py-4 border border-dashed border-border rounded-lg">
          <p className="text-xs text-muted-foreground">No room types added yet. Click "Add Room Type" to start.</p>
        </div>
      )}

      <div className="space-y-3">
        {pgRooms.map((room) => {
          const beds = BEDS_BY_TYPE[room.type];
          return (
            <div key={room.id}
              className="border border-border rounded-lg px-3 py-3 bg-muted/20 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Select value={room.type}
                    onValueChange={(v) => update(room.id, { type: v as PGRoom["type"] })}>
                    <SelectTrigger className="h-8 text-sm w-44"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["single", "double", "triple"] as const).map((t) => (
                        <SelectItem key={t} value={t}
                          disabled={usedTypes.includes(t) && t !== room.type}>
                          {typeLabel[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {beds} bed{beds > 1 ? "s" : ""} per room
                  </span>
                </div>
                <button type="button" onClick={() => remove(room.id)}
                  className="text-destructive hover:text-destructive/70 transition p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Price + counts */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Price per person / month (₹)</p>
                  <Input type="number" className="h-8 text-sm" placeholder="e.g. 5000"
                    value={room.pricePerPerson || ""}
                    onChange={(e) => update(room.id, {
                      pricePerPerson: e.target.value === "" ? 0 : +e.target.value,
                    })} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total rooms</p>
                  <Input type="number" className="h-8 text-sm" min={1} placeholder="e.g. 5"
                    value={room.totalRooms || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : +e.target.value;
                      update(room.id, {
                        totalRooms: val,
                        availableRooms: Math.min(room.availableRooms ?? 0, val),
                      });
                    }} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Available rooms</p>
                  <Input type="number" className="h-8 text-sm" min={0} max={room.totalRooms}
                    placeholder="e.g. 3" value={room.availableRooms ?? ""}
                    onChange={(e) => update(room.id, {
                      availableRooms: e.target.value === "" ? 0 : +e.target.value,
                    })} />
                </div>
              </div>

              {/* Attached bathroom */}
              <div className="flex items-center gap-2">
                <Checkbox id={`bath-${room.id}`} checked={room.attachedBathroom}
                  onCheckedChange={(v) => update(room.id, { attachedBathroom: !!v })} />
                <label htmlFor={`bath-${room.id}`} className="text-xs cursor-pointer select-none">
                  Attached bathroom
                </label>
              </div>

              {/* Per-room images */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Photos of this room type</p>
                <Input type="file" multiple accept="image/*" className="text-xs h-8"
                  onChange={(e) => handleRoomImages(room.id, e.target.files)} />
                {(room.images || []).length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {room.images.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt={`room-img-${i}`}
                          className="w-14 h-14 object-cover rounded border border-border" />
                        <button type="button" onClick={() => removeRoomImage(room.id, i)}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {pgRooms.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          {pgRooms.length} room type{pgRooms.length !== 1 ? "s" : ""} added
        </p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Sub: Amenities Grid
// ─────────────────────────────────────────────

interface AmenitiesGridProps {
  options: string[];
  selected: string[];
  onChange: (updated: string[]) => void;
  label?: string;
}

const AmenitiesGrid = ({ options, selected, onChange, label = "Amenities" }: AmenitiesGridProps) => {
  const toggle = (a: string) =>
    onChange(selected.includes(a) ? selected.filter((x) => x !== a) : [...selected, a]);
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-3 p-3 border border-border rounded-md bg-muted/20">
        {options.map((a) => (
          <label key={a}
            className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:text-primary transition-colors select-none">
            <Checkbox checked={selected.includes(a)} onCheckedChange={() => toggle(a)} />
            {a}
          </label>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          {selected.length} amenit{selected.length === 1 ? "y" : "ies"} selected
        </p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Sub: Property Rooms Section
// ─────────────────────────────────────────────

interface PropertyRoomsSectionProps {
  rooms: RoomDetail[];
  onChange: (rooms: RoomDetail[]) => void;
}

const PropertyRoomsSection = ({ rooms, onChange }: PropertyRoomsSectionProps) => {
  const add = () => onChange([...rooms, emptyRoom()]);
  const remove = (id: string) => onChange(rooms.filter((r) => r.id !== id));
  const updateName = (id: string, name: string) =>
    onChange(rooms.map((r) => (r.id === id ? { ...r, name } : r)));
  const updateCount = (id: string, count: number) =>
    onChange(rooms.map((r) => (r.id === id ? { ...r, count } : r)));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <Label className="text-sm font-medium">Room Details</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Select each room type and how many</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={add}
          className="flex items-center gap-1 h-7 text-xs">
          <Plus className="w-3 h-3" /> Add Room
        </Button>
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-4 border border-dashed border-border rounded-lg">
          <p className="text-xs text-muted-foreground">No rooms added yet.</p>
        </div>
      )}

      <div className="space-y-2">
        {rooms.map((room, idx) => (
          <div key={room.id}
            className="grid grid-cols-[1fr_100px_32px] gap-2 items-end bg-muted/20 border border-border rounded-lg px-3 py-2">
            <div>
              {idx === 0 && <p className="text-xs text-muted-foreground mb-1">Room Type</p>}
              <Select value={ROOM_PRESETS.includes(room.name) ? room.name : ""}
                onValueChange={(v) => updateName(room.id, v)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_PRESETS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              {idx === 0 && <p className="text-xs text-muted-foreground mb-1">Count</p>}
              <Input type="number" className="h-8 text-sm" min={1} value={room.count || ""}
                onChange={(e) => updateCount(room.id, e.target.value === "" ? 0 : +e.target.value)} />
            </div>
            <div className={idx === 0 ? "mt-5" : ""}>
              <button type="button" onClick={() => remove(room.id)}
                className="text-destructive hover:text-destructive/70 transition p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {rooms.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          {rooms.length} room type{rooms.length !== 1 ? "s" : ""} added
        </p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Main: PropertyForm
// ─────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Property) => void;
  initial?: Property | null;
}

const PropertyForm = ({ open, onClose, onSubmit, initial }: Props) => {
  const [form, setForm] = useState<Partial<Property>>(initial || defaultForm());
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adminPhone = useAuthStore(
    (s) => s.user?.phone ?? s.user?.contactNumber ?? ""
  );

  // Listing type is LOCKED when editing an existing record.
  // Changing it would invalidate the entire form payload.
  const isEditing = !!initial?.id;

  useEffect(() => {
    if (open) {
      setForm({
        ...(initial || defaultForm()),
        contactNumber: initial?.contactNumber ?? adminPhone,
      });
      setImageFiles([]);
      setError(null);
    }
  }, [open, initial, adminPhone]);

  const listingType = form.listingType ?? "buy";
  const isPG        = listingType === "pg";
  const isRent      = listingType === "rent";
  const isRoomOnly  = isRent && form.rentType === "room-only";

  // Furnishing: apartment / house / villa only (not plot, not PG)
  const showFurnishing = !isPG && ["apartment", "house", "villa"].includes(form.type || "");

  const selectedState = form.location?.split(", ")[0] || "";
  const selectedCity  = form.location?.split(", ")[1] || "";

  // Only allowed when adding new — not when editing
  const handleListingTypeChange = (type: ListingType) => {
    if (isEditing) return;
    setForm({ ...defaultForm(), listingType: type, contactNumber: form.contactNumber });
  };

  const handleCancel = () => {
    setForm(initial || defaultForm());
    setImageFiles([]);
    setError(null);
    onClose();
  };

  const setUtilityBill = (field: "waterBill" | "electricityBill", val: string) =>
    setForm({ ...form, [field]: val });

  const validate = (): string | null => {
    if (isPG) {
      if (!form.pgRooms || form.pgRooms.length === 0)
        return "Add at least one PG room type.";
      for (const r of form.pgRooms) {
        if (!r.pricePerPerson || r.pricePerPerson < 1)
          return "All PG room prices must be at least ₹1 per person.";
        if (!r.totalRooms || r.totalRooms < 1)
          return "Total rooms must be at least 1.";
        if ((r.availableRooms ?? 0) > r.totalRooms)
          return "Available rooms cannot exceed total rooms.";
      }
      if (form.foodIncluded && (!form.foodPrice || form.foodPrice < 1))
        return "Please enter the food charge per month.";
    } else if (isRoomOnly) {
      const tiers = form.occupancyPricing || [];
      if (tiers.length === 0) return "Add at least one occupancy pricing tier.";
      for (const t of tiers) {
        if (!t.occupants || t.occupants < 1) return "Occupant count must be at least 1.";
        if (!t.price || t.price < 1)          return "Room rent must be at least ₹1.";
      }
      const counts = tiers.map((t) => t.occupants);
      if (new Set(counts).size !== counts.length)
        return "Each occupancy tier must have a unique number of persons.";
    } else {
      const rooms = form.rooms || [];
      if (rooms.some((r) => !r.count || r.count < 1)) return "All room counts must be at least 1.";
      if (rooms.some((r) => !r.name))                 return "All rooms must have a type selected.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    try {
      setUploading(true);

      const existingUrls = ((form.images || []) as string[]).filter(
        (img) => typeof img === "string" && !img.startsWith("blob:")
      );
      const newUrls = imageFiles.length > 0 ? await uploadFiles(imageFiles, "properties") : [];
      const imageUrls = [...existingUrls, ...newUrls];

      let cleanedPgRooms = form.pgRooms;
      if (isPG && form.pgRooms) {
        cleanedPgRooms = await Promise.all(
          form.pgRooms.map(async (room) => {
            const roomFiles: File[] = (room as any)._imageFiles || [];
            const existingRoomUrls = (room.images || []).filter((u) => !u.startsWith("blob:"));
            const newRoomUrls = roomFiles.length > 0 ? await uploadFiles(roomFiles, "pg-rooms") : [];
            const { _imageFiles, ...cleanRoom } = room as any;
            return {
              ...cleanRoom,
              images: [...existingRoomUrls, ...newRoomUrls],
              beds: BEDS_BY_TYPE[room.type],
            };
          })
        );
      }

      const roomOnlyMinPrice = isRoomOnly
        ? Math.min(...(form.occupancyPricing || []).map((t) => t.price || Infinity))
        : form.price;

      const payload: Property = {
        ...(form as Property),
        images: imageUrls,

        // PG-only
        pgRooms:      isPG ? cleanedPgRooms : undefined,
        pgAmenities:  isPG ? form.pgAmenities : undefined,
        gender:       isPG ? form.gender : undefined,
        foodIncluded: isPG ? form.foodIncluded : undefined,
        foodPrice:    isPG && form.foodIncluded ? form.foodPrice : undefined,

        // Utility bills — rent AND pg
        waterBill:       (isRent || isPG) ? form.waterBill       : undefined,
        electricityBill: (isRent || isPG) ? form.electricityBill : undefined,

        // Occupancy pricing — room-only rent
        occupancyPricing: isRoomOnly ? form.occupancyPricing : undefined,

        // Price
        price: isPG
          ? Math.min(...(cleanedPgRooms || []).map((r) => r.pricePerPerson || 0))
          : isRoomOnly ? roomOnlyMinPrice
          : form.price,

        // Property-only
        area:               !isPG ? form.area : undefined,
        rooms:              !isPG ? form.rooms : undefined,
        type:               !isPG ? form.type : undefined,
        amenities:          !isPG ? form.amenities : undefined,
        constructionDate:   !isPG && !isRoomOnly ? form.constructionDate : undefined,
        constructionStatus: !isPG && !isRoomOnly ? form.constructionStatus : undefined,
        completionDate:
          !isPG && !isRoomOnly && form.constructionStatus === "completed"
            ? form.completionDate : undefined,
        furnishing: showFurnishing ? form.furnishing : undefined,
        rentType:   isRent ? form.rentType : undefined,

        // Removed fields — always undefined now
        bedrooms:  undefined,
        bathrooms: undefined,
        facing:    undefined,
      };

      onSubmit(payload);
      setForm(defaultForm());
      setImageFiles([]);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save property. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <style>{`
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
          input[type="number"] { -moz-appearance: textfield; }
        `}</style>

        <DialogHeader>
          <DialogTitle className="font-serif gold-text">
            {isEditing ? "Edit Property" : "Add Property"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── LISTING TYPE ──
              • Adding  → clickable buttons, switching resets the form
              • Editing → read-only display with lock badge, cannot switch type ── */}
          <div>
            <Label className="mb-2 block">Listing Type</Label>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-2">
                {(["buy", "rent", "pg"] as ListingType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleListingTypeChange(t)}
                    disabled={isEditing}
                    className={[
                      "px-5 py-2 rounded-md border text-sm font-medium transition capitalize",
                      listingType === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : isEditing
                          ? "border-border text-muted-foreground/30 bg-transparent cursor-not-allowed"
                          : "border-border hover:bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {t === "pg" ? "PG" : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              {/* Lock indicator shown only when editing */}
              {isEditing && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  Locked while editing
                </span>
              )}
            </div>
          </div>

          {/* ── RENT TYPE ── */}
          {isRent && (
            <div>
              <Label>Rent Type</Label>
              <Select value={form.rentType || "full"}
                onValueChange={(v) => setForm({ ...form, rentType: v as RentType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Property</SelectItem>
                  <SelectItem value="room-only">Room Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* ── PG GENDER ── */}
          {isPG && (
            <div>
              <Label>PG For</Label>
              <Select value={form.gender || "any"}
                onValueChange={(v) => setForm({ ...form, gender: v as Property["gender"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="any">Any</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* ── TITLE ── */}
          <div>
            <Label>Title</Label>
            <Input value={form.title || ""} placeholder="Enter property title" required
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          {/* ── DESCRIPTION ── */}
          <div>
            <Label>Description</Label>
            <Textarea value={form.description || ""} placeholder="Describe the property"
              required rows={3}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          {/* ── PRICE — hidden for PG and room-only ── */}
          {!isPG && !isRoomOnly && (
            <div>
              <Label>{isRent ? "Monthly Rent (₹)" : "Price (₹)"}</Label>
              <Input type="number" placeholder="Enter price" required
                value={form.price === 0 ? "" : form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value === "" ? 0 : +e.target.value })} />
            </div>
          )}

          {/* ── STATE / CITY ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>State</Label>
              <Select value={selectedState} required
                onValueChange={(state) => setForm({ ...form, location: state ? `${state}, ` : "" })}>
                <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {Object.keys(cityjson).map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>City</Label>
              <Select value={selectedCity} required disabled={!selectedState}
                onValueChange={(city) => setForm({
                  ...form,
                  location: selectedState && city ? `${selectedState}, ${city}` : selectedState,
                })}>
                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>
                  {(cityjson[selectedState] || []).map((city: string) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── CONTACT ── */}
          <div>
            <Label>Contact Number</Label>
            <Input type="tel" placeholder="Enter contact number" required
              value={form.contactNumber || ""}
              onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
          </div>

          {/* ══════════════════════════════════════
              PG SECTION
          ══════════════════════════════════════ */}
          {isPG && (
            <>
              <PGRoomsSection
                pgRooms={form.pgRooms || []}
                onChange={(pgRooms) => setForm({ ...form, pgRooms })}
              />

              {(form.pgRooms || []).length > 0 && (
                <div className="text-xs text-muted-foreground bg-muted/40 border border-border rounded px-3 py-2">
                  Listing will show starting from{" "}
                  <span className="font-medium text-foreground">
                    ₹{Math.min(...(form.pgRooms || []).map((r) => r.pricePerPerson || Infinity))
                      .toLocaleString("en-IN")}/person/month
                  </span>
                </div>
              )}

              {/* Food */}
              <div className="border border-border rounded-lg p-3 bg-muted/20 space-y-3">
                <Label className="text-sm font-medium">Food</Label>
                <div className="flex items-center gap-2">
                  <Checkbox id="food-included" checked={form.foodIncluded || false}
                    onCheckedChange={(v) => setForm({
                      ...form, foodIncluded: !!v, foodPrice: v ? form.foodPrice : 0,
                    })} />
                  <label htmlFor="food-included" className="text-sm cursor-pointer select-none">
                    Food available (mess / tiffin)
                  </label>
                </div>
                {form.foodIncluded && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Food charge per person / month (₹)</p>
                    <Input type="number" placeholder="e.g. 2500" className="max-w-xs"
                      value={form.foodPrice === 0 ? "" : form.foodPrice}
                      onChange={(e) => setForm({
                        ...form, foodPrice: e.target.value === "" ? 0 : +e.target.value,
                      })} />
                    <p className="text-xs text-muted-foreground mt-1">
                      Shown separately from room price so tenants see both costs clearly.
                    </p>
                  </div>
                )}
              </div>

              {/* Utility Bills — PG */}
              <UtilityBillsSection
                waterBill={form.waterBill || "separate"}
                electricityBill={form.electricityBill || "separate"}
                onChange={setUtilityBill}
              />

              <AmenitiesGrid label="PG Amenities" options={PG_AMENITIES}
                selected={form.pgAmenities || []}
                onChange={(pgAmenities) => setForm({ ...form, pgAmenities })} />
            </>
          )}

          {/* ══════════════════════════════════════
              BUY / RENT SECTION
              Removed: Bedrooms, Bathrooms (use Room Details instead)
              Removed: Facing (not needed)
          ══════════════════════════════════════ */}
          {!isPG && (
            <>
              {/* Area — only for buy and full rent, not for room-only */}
              {!isRoomOnly && (
                <div>
                  <Label>Total Area (sq ft)</Label>
                  <Input placeholder="e.g. 1000" required value={form.area || ""}
                    onChange={(e) => setForm({ ...form, area: e.target.value })} />
                </div>
              )}

              {!isRoomOnly && (
                <>
                  {/* Building Type only — Facing removed */}
                  <div>
                    <Label>Building Type</Label>
                    <Select value={form.type || "apartment"}
                      onValueChange={(v) => setForm({
                        ...form,
                        type: v as Property["type"],
                        furnishing: v === "plot" ? undefined : form.furnishing,
                      })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House / Independent Floor</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="plot">Plot / Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Construction */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Construction Date</Label>
                      <Input type="date" value={form.constructionDate || ""}
                        className="text-white [&::-webkit-calendar-picker-indicator]:invert"
                        onChange={(e) => setForm({ ...form, constructionDate: e.target.value })} />
                    </div>
                    <div>
                      <Label>Construction Status</Label>
                      <Select value={form.constructionStatus || "ongoing"}
                        onValueChange={(v) => setForm({
                          ...form,
                          constructionStatus: v as Property["constructionStatus"],
                          completionDate: v === "ongoing" ? "" : form.completionDate,
                        })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {form.constructionStatus === "completed" && (
                    <div>
                      <Label>Completion Date</Label>
                      <Input type="date" value={form.completionDate || ""}
                        className="text-white [&::-webkit-calendar-picker-indicator]:invert"
                        onChange={(e) => setForm({ ...form, completionDate: e.target.value })} />
                    </div>
                  )}

                  {/* Room Details — covers bedrooms, bathrooms, and any other rooms */}
                  <PropertyRoomsSection
                    rooms={form.rooms || []}
                    onChange={(rooms) => setForm({ ...form, rooms })}
                  />
                </>
              )}

              {/* Occupancy pricing — room-only */}
              {isRoomOnly && (
                <OccupancyPricingSection
                  tiers={form.occupancyPricing || []}
                  onChange={(occupancyPricing) => setForm({ ...form, occupancyPricing })}
                />
              )}

              {/* Furnishing — apartment / house / villa */}
              {showFurnishing && (
                <div>
                  <Label>Furnishing</Label>
                  <Select value={form.furnishing || ""}
                    onValueChange={(v) => setForm({ ...form, furnishing: v as Property["furnishing"] })}>
                    <SelectTrigger><SelectValue placeholder="Select furnishing status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="non-furnished">Non Furnished</SelectItem>
                      <SelectItem value="semi-furnished">Semi Furnished</SelectItem>
                      <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Utility Bills — Rent only */}
              {isRent && (
                <UtilityBillsSection
                  waterBill={form.waterBill || "separate"}
                  electricityBill={form.electricityBill || "separate"}
                  onChange={setUtilityBill}
                />
              )}

              <AmenitiesGrid options={PROPERTY_AMENITIES}
                selected={form.amenities || []}
                onChange={(amenities) => setForm({ ...form, amenities })} />
            </>
          )}

          {/* ── IMAGES ── */}
          <div>
            <Label>{isPG ? "Common Area / Building Photos" : "Property Photos"}</Label>
            {isPG && (
              <p className="text-xs text-muted-foreground mb-1">
                For individual room photos, use the upload inside each room type card above.
              </p>
            )}
            <Input type="file" multiple accept="image/*"
              onChange={(e) => setImageFiles(Array.from(e.target.files || []))} />
            {(form.images || []).length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {(form.images as string[]).map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt={`img-${i}`}
                      className="w-16 h-16 object-cover rounded border border-border" />
                    <button type="button"
                      onClick={() => setForm({
                        ...form,
                        images: (form.images as string[]).filter((_, idx) => idx !== i),
                      })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {imageFiles.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {imageFiles.length} new image(s) selected
              </p>
            )}
          </div>

          {/* ── ERROR ── */}
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
              {error}
            </p>
          )}

          {/* ── ACTIONS ── */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</>
                : isEditing ? "Update Property" : "Add Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyForm;