import { useEffect, useState } from "react";
import usePropertyStore from "@/stores/usePropertyStore";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, X, Pencil, Trash2, Info } from "lucide-react";
import PropertyForm from "@/components/PropertyForm";
import PropertyDetailModal from "@/components/Propertydetailmodal";
import DeleteConfirmDialog from "@/components/Deleteconfirmdialog";
import type { Property, ListingType } from "@/types";
import { toast } from "sonner";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const statusColor = (s?: string) => {
  if (s === "approved") return "bg-green-500/10 text-green-400 border-green-500/20";
  if (s === "pending")  return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  return "bg-red-500/10 text-red-400 border-red-500/20";
};

const listingTypeColor = (t?: string) => {
  if (t === "buy")  return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (t === "rent") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
  if (t === "pg")   return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  return "bg-muted text-muted-foreground border-border";
};

/**
 * FIX — correct price labels per listing type:
 *   buy          → ₹X (one-time sale price)
 *   rent full    → ₹X/mo
 *   rent room    → Starting ₹X/mo  (min of occupancy tiers)
 *   pg           → ₹X/person/mo    (min pricePerPerson across room types)
 */
const formatPrice = (p: Property): string => {
  const fmt = (n?: number) =>
    n != null && n > 0 ? `₹${n.toLocaleString("en-IN")}` : "—";

  if (p.listingType === "pg") {
    // p.price is already the derived minimum pricePerPerson (set on submit)
    return p.price ? `${fmt(p.price)}/person/mo` : "—";
  }

  if (p.listingType === "rent") {
    if (p.rentType === "room-only") {
      // p.price is the derived minimum from occupancyPricing tiers
      return p.price ? `From ${fmt(p.price)}/mo` : "—";
    }
    return p.price ? `${fmt(p.price)}/mo` : "—";
  }

  // buy
  return fmt(p.price);
};

/**
 * Human-readable listing label including rent sub-type.
 *   buy          → "Buy"
 *   rent full    → "Rent"
 *   rent room    → "Rent · Room"
 *   pg           → "PG"
 */
const listingLabel = (p: Property): string => {
  if (p.listingType === "pg")   return "PG";
  if (p.listingType === "buy")  return "Buy";
  if (p.listingType === "rent") {
    return p.rentType === "room-only" ? "Rent · Room" : "Rent";
  }
  return p.listingType ?? "—";
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const PropertiesPage = () => {
  const {
    properties,
    loading,
    fetchAll,
    addProperty,
    updateProperty,
    approveProperty,
    rejectProperty,
    deleteProperty,
  } = usePropertyStore();

  const [formOpen, setFormOpen]   = useState(false);
  const [editing, setEditing]     = useState<Property | null>(null);

  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [typeFilter, setTypeFilter]     = useState<ListingType | "all">("all");

  const [detailOpen, setDetailOpen]               = useState(false);
  const [selectedProperty, setSelectedProperty]   = useState<Property | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen]   = useState(false);
  const [propertyToDelete, setPropertyToDelete]   = useState<Property | null>(null);

  useEffect(() => { fetchAll(); }, []);

  // ── Filter counts ──

  // FIX — statusCounts includes "all" key so the map never hits undefined
  const statusCounts: Record<"all" | "approved" | "pending" | "rejected", number> = {
    all:      properties.length,
    approved: properties.filter(p => p.status === "approved").length,
    pending:  properties.filter(p => p.status === "pending").length,
    rejected: properties.filter(p => p.status === "rejected").length,
  };

  // FIX — typeCounts now includes "all" so the "All" button can show total count
  const typeCounts: Record<ListingType | "all", number> = {
    all:  properties.length,
    buy:  properties.filter(p => p.listingType === "buy").length,
    rent: properties.filter(p => p.listingType === "rent").length,
    pg:   properties.filter(p => p.listingType === "pg").length,
  };

  const filtered = properties.filter((p) => {
    const statusMatch = statusFilter === "all" || p.status === statusFilter;
    const typeMatch   = typeFilter   === "all" || p.listingType === typeFilter;
    return statusMatch && typeMatch;
  });

  const handleSubmit = async (data: Property) => {
    if (editing?.id) {
      await updateProperty(editing.id, data);
      toast.success("Property updated");
    } else {
      await addProperty(data);
      toast.success("Property added");
    }
    setEditing(null);
    fetchAll();
  };

  const handleOpenDetails = (property: Property) => {
    setSelectedProperty(property);
    setDetailOpen(true);
  };

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete?.id) return;
    await deleteProperty(propertyToDelete.id);
    toast.success("Property deleted");
    fetchAll();
    setPropertyToDelete(null);
  };

  return (
    <div className="p-6 space-y-4">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif gold-text">Properties</h1>
          <p className="text-sm text-muted-foreground">
            Manage buy, rent, and PG listings
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Add Property
        </Button>
      </div>

      {/* ── FILTERS ── */}
      <div className="flex flex-wrap gap-4">

        {/* Status filters */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "approved", "pending", "rejected"] as const).map((f) => (
            <Button
              key={f}
              variant={statusFilter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(f)}
            >
              {f === "all" ? "All Statuses" : f.charAt(0).toUpperCase() + f.slice(1)} ({statusCounts[f]})
            </Button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {(["buy", "rent", "pg"] as const).map((f) => (
            <Button
              key={f}
              variant={typeFilter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter(f)}
            >
              {f === "pg" ? "PG" : f.charAt(0).toUpperCase() + f.slice(1)}
              {" "}({typeCounts[f]})
            </Button>
          ))}
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Image</TableHead>
              <TableHead className="text-muted-foreground">Title</TableHead>
              <TableHead className="text-muted-foreground">Location</TableHead>
              <TableHead className="text-muted-foreground">Listing</TableHead>
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground">Price</TableHead>
              <TableHead className="text-muted-foreground">Area</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No properties found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow
                  key={p.id}
                  className="border-border hover:bg-muted/50 transition-colors"
                >
                  {/* IMAGE */}
                  <TableCell>
                    {p.images && p.images.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No img</span>
                      </div>
                    )}
                  </TableCell>

                  {/* TITLE */}
                  <TableCell className="font-medium text-foreground max-w-xs truncate">
                    {p.title}
                  </TableCell>

                  {/* LOCATION */}
                  <TableCell className="text-muted-foreground">{p.location}</TableCell>

                  {/* LISTING TYPE — FIX: shows "Rent · Room" for room-only */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={listingTypeColor(p.listingType)}
                    >
                      {listingLabel(p)}
                    </Badge>
                  </TableCell>

                  {/* BUILDING TYPE (buy + rent only; N/A for PG) */}
                  <TableCell className="capitalize text-muted-foreground">
                    {p.listingType === "pg" ? (
                      <span className="text-xs text-muted-foreground/50">N/A</span>
                    ) : (
                      // "house" → "House / Independent Floor" is too long for table;
                      // keep short label here, full label visible in detail modal
                      p.type
                        ? p.type.charAt(0).toUpperCase() + p.type.slice(1)
                        : "—"
                    )}
                  </TableCell>

                  {/* PRICE — FIX: correct suffix per listing/rent type */}
                  <TableCell className="text-foreground font-semibold whitespace-nowrap">
                    {formatPrice(p)}
                  </TableCell>

                  {/* AREA */}
                  <TableCell className="text-muted-foreground">
                    {p.area ? `${p.area} sq ft` : (
                      <span className="text-xs text-muted-foreground/50">N/A</span>
                    )}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <Badge variant="outline" className={statusColor(p.status)}>
                      {p.status}
                    </Badge>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">

                      {/* Info */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-blue-400 hover:text-blue-300"
                        title="View details"
                        onClick={() => handleOpenDetails(p)}
                      >
                        <Info className="w-4 h-4" />
                      </Button>

                      {/* Approve / Reject — pending only */}
                      {p.status === "pending" && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-green-400 hover:text-green-300"
                            title="Approve"
                            onClick={() => {
                              approveProperty(p.id!);
                              fetchAll();
                              toast.success("Approved");
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-400 hover:text-red-300"
                            title="Reject"
                            onClick={() => {
                              rejectProperty(p.id!);
                              fetchAll();
                              toast.success("Rejected");
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}

                      {/* Edit */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title="Edit"
                        onClick={() => { setEditing(p); setFormOpen(true); }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      {/* Delete */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive/80"
                        title="Delete"
                        onClick={() => handleDeleteClick(p)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── PROPERTY FORM ── */}
      <PropertyForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        initial={editing}
      />

      {/* ── DETAIL MODAL ── */}
      {selectedProperty && (
        <PropertyDetailModal
          open={detailOpen}
          onClose={() => { setDetailOpen(false); setSelectedProperty(null); }}
          property={selectedProperty}
        />
      )}

      {/* ── DELETE CONFIRM ── */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setPropertyToDelete(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Property"
        description={`Are you sure you want to delete "${propertyToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default PropertiesPage;