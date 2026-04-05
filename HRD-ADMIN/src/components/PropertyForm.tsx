import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import cityjson from "@/lib/state_city.json";
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
import { uploadFiles } from "@/lib/uploadFiles";

import { Loader2, Plus, Trash2 } from "lucide-react";
export interface RoomDetail {
  name: string;
  length?: number; 
  width?: number; 
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
  contactNumber?: string;
  amenities?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Property) => void;
  initial?: Property | null;
}

const AMENITIES_OPTIONS = [
  "Swimming Pool",
  "Gym / Fitness Center",
  "Parking",
  "24/7 Security",
  "Power Backup",
  "Lift / Elevator",
  "Garden / Park",
  "Club House",
  "Children's Play Area",
  "CCTV Surveillance",
  "Intercom",
  "Water Supply 24/7",
  "Rainwater Harvesting",
  "Solar Panels",
  "Jogging Track",
];

const ROOM_PRESETS = [
  "Master Bedroom",
  "Bedroom",
  "Kitchen",
  "Hall",
  "Living Room",
  "Dining Room",
  "Bathroom",
  "Balcony",
  "Study Room",
  "Pooja Room",
  "Store Room",
  "Servant Room",
  "Garage",
  "Terrace",
  "Custom",
];

const emptyRoom = (): RoomDetail => ({
  name: "",
  length: undefined,
  width: undefined,
});

const defaultForm = (): Partial<Property> => ({
  title: "",
  description: "",
  price: 0,
  location: "",
  area: "",
  bedrooms: 0,
  bathrooms: 0,
  rooms: [],
  type: "apartment",
  facing: "north",
  constructionDate: "",
  postedBy: "",
  amenities: [],
  images: [],
  role: "admin",
  contactNumber: "",
});

const PropertyForm = ({ open, onClose, onSubmit, initial }: Props) => {
  const [form, setForm] = useState<Partial<Property>>(initial || defaultForm());
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(initial || defaultForm());
      setImageFiles([]);
      setError(null);
    }
  }, [open, initial]);

  const rooms: RoomDetail[] = form.rooms || [];

  const addRoom = () => setForm({ ...form, rooms: [...rooms, emptyRoom()] });

  const removeRoom = (idx: number) =>
    setForm({ ...form, rooms: rooms.filter((_, i) => i !== idx) });

  const updateRoom = (
    idx: number,
    field: keyof RoomDetail,
    value: string | number,
  ) => {
    const updated = rooms.map((r, i) =>
      i === idx ? { ...r, [field]: value } : r,
    );
    setForm({ ...form, rooms: updated });
  };

  const pickRoomPreset = (idx: number, preset: string) => {
    updateRoom(idx, "name", preset === "Custom" ? "" : preset);
  };

  const toggleAmenity = (amenity: string) => {
    const current = form.amenities || [];
    setForm({
      ...form,
      amenities: current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity],
    });
  };

  const selectedState = form.location?.split(", ")[0] || "";
  const selectedCity = form.location?.split(", ")[1] || "";

  const handleCancel = () => {
    setForm(initial || defaultForm());
    setImageFiles([]);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setUploading(true);
      let imageUrls: string[] = ((form.images || []) as string[]).filter(
        (img) => typeof img === "string",
      );
      if (imageFiles.length > 0) {
        const uploaded = await uploadFiles(imageFiles, "properties");
        imageUrls = [...imageUrls, ...uploaded];
      }
      onSubmit({ ...(form as Property), images: imageUrls });
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
            {initial ? "Edit Property" : "Add Property"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter property title"
              required
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe the property"
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={form.price === 0 ? "" : form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value === "" ? 0 : +e.target.value,
                  })
                }
                placeholder="Enter price"
                required
              />
            </div>
            <div>
              <Label>State</Label>
              <Select
                value={selectedState}
                onValueChange={(state) => {
                  setForm({ ...form, location: state ? `${state}, ` : "" });
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(cityjson).map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>City</Label>
              <Select
                value={selectedCity}
                onValueChange={(city) => {
                  setForm({
                    ...form,
                    location:
                      selectedState && city
                        ? `${selectedState}, ${city}`
                        : selectedState,
                  });
                }}
                required
                disabled={!selectedState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {(cityjson[selectedState] || []).map((city: string) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Contact Number</Label>
              <Input
                type="tel"
                value={form.contactNumber || ""}
                onChange={(e) =>
                  setForm({ ...form, contactNumber: e.target.value })
                }
                placeholder="Enter contact number"
                required
              />
            </div>
          </div>

          <div>
            <Label>Total Area (sq ft)</Label>
            <Input
              value={form.area || ""}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              placeholder="1000"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Property Type</Label>
              <Select
                value={form.type || "apartment"}
                onValueChange={(v) =>
                  setForm({ ...form, type: v as Property["type"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="plot">Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Facing</Label>
              <Select
                value={form.facing || "north"}
                onValueChange={(v) =>
                  setForm({ ...form, facing: v as Property["facing"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Construction Date</Label>
              <Input
                type="date"
                value={form.constructionDate || ""}
                onChange={(e) =>
                  setForm({ ...form, constructionDate: e.target.value })
                }
                className="text-white [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <Label className="text-sm font-medium">Room Details</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add each room with optional dimensions (length × width in ft)
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addRoom}
                className="flex items-center gap-1 h-7 text-xs"
              >
                <Plus className="w-3 h-3" />
                Add Room
              </Button>
            </div>

            {rooms.length === 0 && (
              <div className="text-center py-4 border border-dashed border-border rounded-lg">
                <p className="text-xs text-muted-foreground">
                  No rooms added yet. Click "Add Room" to start.
                </p>
              </div>
            )}

            <div className="space-y-2">
              {rooms.map((room, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_1fr_80px_80px_32px] gap-2 items-end bg-muted/20 border border-border rounded-lg px-3 py-2"
                >
                  <div>
                    {idx === 0 && (
                      <p className="text-xs text-muted-foreground mb-1">
                        Room Name
                      </p>
                    )}
                    <Select
                      value={
                        ROOM_PRESETS.includes(room.name) ? room.name : "Custom"
                      }
                      onValueChange={(v) => pickRoomPreset(idx, v)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROOM_PRESETS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    {idx === 0 && (
                      <p className="text-xs text-muted-foreground mb-1">
                        Custom Name
                      </p>
                    )}
                    <Input
                      className="h-8 text-sm"
                      value={room.name}
                      onChange={(e) => updateRoom(idx, "name", e.target.value)}
                      placeholder={
                        ROOM_PRESETS.slice(0, -1).includes(room.name)
                          ? room.name
                          : "Type room name"
                      }
                    />
                  </div>

                  <div>
                    {idx === 0 && (
                      <p className="text-xs text-muted-foreground mb-1">
                        L (ft)
                      </p>
                    )}
                    <Input
                      type="number"
                      className="h-8 text-sm"
                      value={room.length ?? ""}
                      onChange={(e) =>
                        updateRoom(
                          idx,
                          "length",
                          e.target.value === "" ? 0 : +e.target.value,
                        )
                      }
                      placeholder="14"
                    />
                  </div>

                  <div>
                    {idx === 0 && (
                      <p className="text-xs text-muted-foreground mb-1">
                        W (ft)
                      </p>
                    )}
                    <Input
                      type="number"
                      className="h-8 text-sm"
                      value={room.width ?? ""}
                      onChange={(e) =>
                        updateRoom(
                          idx,
                          "width",
                          e.target.value === "" ? 0 : +e.target.value,
                        )
                      }
                      placeholder="12"
                    />
                  </div>

                  <div className={idx === 0 ? "mt-5" : ""}>
                    <button
                      type="button"
                      onClick={() => removeRoom(idx)}
                      className="text-destructive hover:text-destructive/70 transition p-1"
                      title="Remove room"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {rooms.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {rooms.length} room{rooms.length !== 1 ? "s" : ""} added
              </p>
            )}
          </div>

          <div>
            <Label className="mb-2 block">Amenities</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-3 p-3 border border-border rounded-md bg-muted/20">
              {AMENITIES_OPTIONS.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:text-primary transition-colors select-none"
                >
                  <Checkbox
                    checked={(form.amenities || []).includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
            {(form.amenities || []).length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {form.amenities!.length} amenit
                {form.amenities!.length === 1 ? "y" : "ies"} selected
              </p>
            )}
          </div>

          <div>
            <Label>Images</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
            />
            {initial?.images && initial.images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {initial.images.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`img-${i}`}
                    className="w-16 h-16 object-cover rounded border border-border"
                  />
                ))}
                <p className="text-xs text-muted-foreground w-full mt-1">
                  Existing images shown above. Upload new ones to add more.
                </p>
              </div>
            )}
            {imageFiles.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {imageFiles.length} new image(s) selected
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : initial ? (
                "Update Property"
              ) : (
                "Add Property"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyForm;
