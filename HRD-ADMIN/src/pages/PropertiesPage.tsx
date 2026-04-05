import { useEffect, useState } from "react";
import usePropertyStore from "@/stores/usePropertyStore";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, X, Pencil, Trash2, Info } from "lucide-react";
import PropertyForm from "@/components/PropertyForm";
import PropertyDetailModal from "@/components/Propertydetailmodal";
import DeleteConfirmDialog from "@/components/Deleteconfirmdialog";
import type { Property } from "@/types";
import { toast } from "sonner";
import cityjson from "@/lib/state_city.json";

const PropertiesPage = () => {
  const { properties, loading, fetchAll, addProperty, updateProperty, approveProperty, rejectProperty, deleteProperty } = usePropertyStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  useEffect(() => { fetchAll(); }, []);

  const filtered = filter === "all" ? properties : properties.filter((p) => p.status === filter);

  const handleSubmit = async (data: Property) => {
    console.log("Submitting property:", data);
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

  const statusColor = (s?: string) => {
    if (s === "approved") return "bg-green-500/10 text-green-400 border-green-500/20";
    if (s === "pending") return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    return "bg-red-500/10 text-red-400 border-red-500/20";
  };

  const handleOpenDetails = (property: Property) => {
    setSelectedProperty(property);
    setDetailOpen(true);
  };

  // ── Trigger delete confirmation ──
  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  // ── Confirmed delete ──
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
          <p className="text-sm text-muted-foreground">Manage residential properties</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Add Property
        </Button>
      </div>

      {/* ── FILTERS ── */}
      <div className="flex gap-2">
        {(["all", "approved", "pending", "rejected"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {/* ── TABLE ── */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Image</TableHead>
              <TableHead className="text-muted-foreground">Title</TableHead>
              <TableHead className="text-muted-foreground">Location</TableHead>
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
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No properties found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id} className="border-border hover:bg-muted/50 transition-colors">
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

                  <TableCell className="font-medium text-foreground max-w-xs truncate">{p.title}</TableCell>
                  <TableCell className="text-muted-foreground">{p.location}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">{p.type}</TableCell>
                  <TableCell className="text-foreground font-semibold">₹{p.price?.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{p.area} sq ft</TableCell>

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

                      {/* Approve / Reject (pending only) */}
                      {p.status === "pending" && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-green-400 hover:text-green-300"
                            onClick={() => { approveProperty(p.id!); fetchAll(); toast.success("Approved"); }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-400 hover:text-red-300"
                            onClick={() => { rejectProperty(p.id!); fetchAll(); toast.success("Rejected"); }}
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
                        onClick={() => { setEditing(p); setFormOpen(true); }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      {/* Delete — now opens confirmation dialog */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive/80"
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

      {/* ── DELETE CONFIRM DIALOG ── */}
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